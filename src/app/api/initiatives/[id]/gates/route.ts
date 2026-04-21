import { z } from "zod";
import { requireActor } from "@/server/authz/actor";
import { prisma } from "@/server/db/prisma";
import { jsonError, jsonOk } from "@/server/http/route";
import { notFound } from "@/server/http/errors";
import { getInitiativeGateSummary } from "@/server/workflow/engine";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireActor();
    const { id } = await params;

    const initiative = await prisma.initiative.findUnique({ where: { id } });
    if (!initiative) throw notFound();

    // Basic access rule: member of team OR owner OR admin.
    const teamOk = actor.teamIds.has(initiative.teamId);
    if (!teamOk && actor.userId !== initiative.ownerId && !actor.roleKeys.has("ADMIN")) {
      throw new Error("FORBIDDEN");
    }

    const gates = await getInitiativeGateSummary(id);
    return jsonOk(gates);
  } catch (e) {
    return jsonError(e);
  }
}

