import { z } from "zod";
import { requireActor } from "@/server/authz/actor";
import { prisma } from "@/server/db/prisma";
import { jsonError, jsonOk } from "@/server/http/route";
import { forbidden, notFound } from "@/server/http/errors";
import { linkEpicToInitiative } from "@/server/integrations/jira/service";

const BodySchema = z.object({
  issueKey: z.string().min(3),
  url: z.string().url(),
  status: z.string().optional(),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireActor();
    const { id } = await params;
    const initiative = await prisma.initiative.findUnique({ where: { id } });
    if (!initiative) throw notFound();

    const teamOk = actor.teamIds.has(initiative.teamId);
    if (!teamOk && actor.userId !== initiative.ownerId && !actor.roleKeys.has("ADMIN")) throw forbidden();

    const body = BodySchema.parse(await req.json());
    return jsonOk(await linkEpicToInitiative(id, actor.userId, body));
  } catch (e) {
    return jsonError(e);
  }
}

