import { prisma } from "@/server/db/prisma";

export type AuditWrite = {
  actorUserId?: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
  meta?: unknown;
  requestId?: string;
};

export async function writeAudit(a: AuditWrite) {
  await prisma.auditLog.create({
    data: {
      actorUserId: a.actorUserId ?? null,
      action: a.action,
      entityType: a.entityType,
      entityId: a.entityId,
      before: a.before ?? undefined,
      after: a.after ?? undefined,
      meta: a.meta ?? undefined,
      requestId: a.requestId ?? undefined,
    },
  });
}

