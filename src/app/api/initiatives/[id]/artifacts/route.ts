import { z } from "zod";
import { requireActor } from "@/server/authz/actor";
import { prisma } from "@/server/db/prisma";
import { jsonError, jsonOk } from "@/server/http/route";
import { forbidden, notFound } from "@/server/http/errors";
import { writeAudit } from "@/server/audit/audit";
import { emitDomainEvent } from "@/server/notifications/service";

const CreateArtifactSchema = z.object({
  stageKey: z.string().optional(),
  type: z.enum(["LINK", "DOCUMENT", "PRD", "UX", "DESIGN", "FINANCE", "ADA", "OTHER"]),
  name: z.string().min(2),
  url: z.string().url(),
  metadata: z.unknown().optional(),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireActor();
    const { id } = await params;
    const body = CreateArtifactSchema.parse(await req.json());

    const initiative = await prisma.initiative.findUnique({ where: { id } });
    if (!initiative) throw notFound();
    const teamOk = actor.teamIds.has(initiative.teamId);
    if (!teamOk && actor.userId !== initiative.ownerId && !actor.roleKeys.has("ADMIN")) throw forbidden();

    const created = await prisma.artifact.create({
      data: {
        initiativeId: id,
        stageKey: body.stageKey ?? initiative.currentStageKey,
        type: body.type,
        name: body.name,
        url: body.url,
        metadata: body.metadata as any,
        createdByUserId: actor.userId,
      },
    });

    await writeAudit({
      actorUserId: actor.userId,
      action: "ARTIFACT_CREATE",
      entityType: "artifact",
      entityId: created.id,
      after: body,
      meta: { initiativeId: id },
    });

    await emitDomainEvent({
      event: "ARTIFACT_ADDED",
      initiativeId: id,
      actorUserId: actor.userId,
      payload: { artifactId: created.id, type: body.type, name: body.name, url: body.url },
    });

    return jsonOk({ id: created.id });
  } catch (e) {
    return jsonError(e);
  }
}

