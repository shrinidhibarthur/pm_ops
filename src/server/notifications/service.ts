import { NotificationChannel, NotificationStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { StubNotificationProvider } from "@/server/notifications/provider";

export type DomainEventType =
  | "STAGE_ADVANCED"
  | "APPROVAL_DECIDED"
  | "ARTIFACT_ADDED"
  | "CHECKLIST_COMPLETED";

type NotificationRule = {
  event: DomainEventType;
  channel: NotificationChannel;
  // simple target scheme for now; later can be role/team/dynamic selectors
  to: string;
};

function parseRules(notificationRules: unknown): NotificationRule[] {
  if (!Array.isArray(notificationRules)) return [];
  return notificationRules
    .map((r) => {
      if (!r || typeof r !== "object") return null;
      const rr = r as any;
      if (!rr.event || !rr.channel || !rr.to) return null;
      return { event: rr.event, channel: rr.channel, to: rr.to } as NotificationRule;
    })
    .filter(Boolean) as NotificationRule[];
}

export async function emitDomainEvent(input: {
  event: DomainEventType;
  initiativeId: string;
  actorUserId: string;
  payload: Record<string, unknown>;
}) {
  const initiative = await prisma.initiative.findUnique({
    where: { id: input.initiativeId },
    include: { workflowConfig: true, owner: true },
  });
  if (!initiative) return;

  const configuredRules = parseRules(initiative.workflowConfig.notificationRules);

  // Safe default rules when config is absent: notify owner via EMAIL for key events.
  const rules: NotificationRule[] =
    configuredRules.length > 0
      ? configuredRules.filter((r) => r.event === input.event)
      : [
          { event: input.event, channel: "EMAIL", to: initiative.owner.email },
        ];

  if (rules.length === 0) return;

  await prisma.notification.createMany({
    data: rules.map((r) => ({
      channel: r.channel,
      type: input.event,
      to: r.to,
      payload: { ...input.payload, initiativeId: input.initiativeId, actorUserId: input.actorUserId },
      status: "PENDING",
    })),
  });
}

export async function runNotificationDispatcher(limit = 50) {
  const provider = new StubNotificationProvider();
  const pending = await prisma.notification.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  for (const n of pending) {
    try {
      await prisma.notification.update({
        where: { id: n.id },
        data: { attempts: n.attempts + 1 },
      });
      await provider.send({
        channel: n.channel,
        to: n.to,
        type: n.type,
        payload: (n.payload as any) ?? {},
      });
      await prisma.notification.update({
        where: { id: n.id },
        data: { status: "SENT", sentAt: new Date(), lastError: null },
      });
    } catch (e: any) {
      await prisma.notification.update({
        where: { id: n.id },
        data: { status: "FAILED", lastError: e?.message ?? "Send failed." },
      });
    }
  }

  return { processed: pending.length };
}

