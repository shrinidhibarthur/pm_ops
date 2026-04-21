import { requireActor } from "@/server/authz/actor";
import { prisma } from "@/server/db/prisma";
import { jsonError, jsonOk } from "@/server/http/route";
import { forbidden, notFound } from "@/server/http/errors";
import { jiraEligibility } from "@/server/integrations/jira/service";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireActor();
    const { id } = await params;
    const initiative = await prisma.initiative.findUnique({ where: { id } });
    if (!initiative) throw notFound();

    const teamOk = actor.teamIds.has(initiative.teamId);
    if (!teamOk && actor.userId !== initiative.ownerId && !actor.roleKeys.has("ADMIN")) throw forbidden();

    return jsonOk(await jiraEligibility(id));
  } catch (e) {
    return jsonError(e);
  }
}

