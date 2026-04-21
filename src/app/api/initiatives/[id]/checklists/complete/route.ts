import { z } from "zod";
import { requireActor } from "@/server/authz/actor";
import { prisma } from "@/server/db/prisma";
import { jsonError, jsonOk } from "@/server/http/route";
import { badRequest, forbidden, notFound } from "@/server/http/errors";
import { writeAudit } from "@/server/audit/audit";
import { emitDomainEvent } from "@/server/notifications/service";

const BodySchema = z.object({
  stageKey: z.string(),
  checklistKey: z.string(),
  itemKey: z.string(),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireActor();
    const { id } = await params;
    const body = BodySchema.parse(await req.json());

    const initiative = await prisma.initiative.findUnique({ where: { id } });
    if (!initiative) throw notFound();
    const teamOk = actor.teamIds.has(initiative.teamId);
    if (!teamOk && actor.userId !== initiative.ownerId && !actor.roleKeys.has("ADMIN")) throw forbidden();

    const before = await prisma.checklistCompletion.findUnique({
      where: { initiativeId_stageKey_checklistKey_itemKey: { initiativeId: id, stageKey: body.stageKey, checklistKey: body.checklistKey, itemKey: body.itemKey } },
    });
    if (before) return jsonOk({ id: before.id, already: true });

    const created = await prisma.checklistCompletion.create({
      data: {
        initiativeId: id,
        stageKey: body.stageKey,
        checklistKey: body.checklistKey,
        itemKey: body.itemKey,
        completedByUserId: actor.userId,
      },
    });

    await writeAudit({
      actorUserId: actor.userId,
      action: "CHECKLIST_COMPLETE",
      entityType: "initiative",
      entityId: id,
      after: body,
    });

    await emitDomainEvent({
      event: "CHECKLIST_COMPLETED",
      initiativeId: id,
      actorUserId: actor.userId,
      payload: body,
    });

    return jsonOk({ id: created.id });
  } catch (e) {
    return jsonError(e);
  }
}

