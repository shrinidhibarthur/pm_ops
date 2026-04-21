import { requireActor } from "@/server/authz/actor";
import { prisma } from "@/server/db/prisma";
import { jsonError, jsonOk } from "@/server/http/route";
import { badRequest, forbidden, notFound } from "@/server/http/errors";
import { advanceStage } from "@/server/workflow/engine";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireActor();
    const { id } = await params;

    const initiative = await prisma.initiative.findUnique({ where: { id } });
    if (!initiative) throw notFound();

    const teamOk = actor.teamIds.has(initiative.teamId);
    if (!teamOk && actor.userId !== initiative.ownerId && !actor.roleKeys.has("ADMIN")) {
      throw forbidden();
    }

    const res = await advanceStage(id, actor.userId);
    return jsonOk(res);
  } catch (e: any) {
    if (e?.message === "STAGE_BLOCKED") {
      return jsonError(badRequest("Stage is blocked by requirements.", e.details));
    }
    if (e?.message === "NOT_FOUND") return jsonError(notFound());
    if (e?.message === "FORBIDDEN") return jsonError(forbidden());
    return jsonError(e);
  }
}

