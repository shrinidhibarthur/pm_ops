import { z } from "zod";
import { requireActor } from "@/server/authz/actor";
import { prisma } from "@/server/db/prisma";
import { jsonError, jsonOk } from "@/server/http/route";
import { badRequest, forbidden, notFound } from "@/server/http/errors";
import { writeAudit } from "@/server/audit/audit";
import { emitDomainEvent } from "@/server/notifications/service";

const BodySchema = z.object({
  decision: z.enum(["APPROVED", "REJECTED"]),
  comment: z.string().max(2000).optional(),
});

export async function POST(req: Request, { params }: { params: Promise<{ taskId: string }> }) {
  try {
    const actor = await requireActor();
    const { taskId } = await params;
    const body = BodySchema.parse(await req.json());

    const task = await prisma.approvalTask.findUnique({ where: { id: taskId }, include: { initiative: true } });
    if (!task) throw notFound();
    if (task.status !== "PENDING") throw badRequest("Task is not pending.");

    const canAct =
      actor.roleKeys.has("ADMIN") ||
      (task.assignedToUserId ? task.assignedToUserId === actor.userId : false) ||
      (task.assignedRoleKey ? actor.roleKeys.has(task.assignedRoleKey) : false) ||
      actor.teamIds.has(task.initiative.teamId);

    if (!canAct) throw forbidden("You are not eligible to decide this approval.");

    const updated = await prisma.approvalTask.update({
      where: { id: taskId },
      data: {
        status: body.decision,
        decisionByUserId: actor.userId,
        decidedAt: new Date(),
        decisionComment: body.comment ?? null,
      },
    });

    await writeAudit({
      actorUserId: actor.userId,
      action: "APPROVAL_DECISION",
      entityType: "approvalTask",
      entityId: taskId,
      before: { status: "PENDING" },
      after: { status: body.decision, comment: body.comment },
      meta: { initiativeId: task.initiativeId, stageKey: task.stageKey },
    });

    await emitDomainEvent({
      event: "APPROVAL_DECIDED",
      initiativeId: task.initiativeId,
      actorUserId: actor.userId,
      payload: { taskId, stageKey: task.stageKey, decision: body.decision },
    });

    return jsonOk({ id: updated.id, status: updated.status });
  } catch (e) {
    return jsonError(e);
  }
}

