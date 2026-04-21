import { requireActor } from "@/server/authz/actor";
import { prisma } from "@/server/db/prisma";
import { jsonError, jsonOk } from "@/server/http/route";
import { forbidden, notFound } from "@/server/http/errors";
import { createEpicForInitiative } from "@/server/integrations/jira/service";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireActor();
    const { id } = await params;
    const initiative = await prisma.initiative.findUnique({ where: { id } });
    if (!initiative) throw notFound();

    const teamOk = actor.teamIds.has(initiative.teamId);
    if (!teamOk && actor.userId !== initiative.ownerId && !actor.roleKeys.has("ADMIN")) throw forbidden();

    return jsonOk(await createEpicForInitiative(id, actor.userId));
  } catch (e) {
    return jsonError(e);
  }
}

