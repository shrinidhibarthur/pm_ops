import { z } from "zod";
import { requireActor } from "@/server/authz/actor";
import { jsonError, jsonOk } from "@/server/http/route";
import { notFound, forbidden } from "@/server/http/errors";
import { prisma } from "@/server/db/prisma";

const ActionItemSchema = z.object({
  id: z.string(),
  text: z.string().min(1).max(500),
  owner: z.string().optional(),
  dueDate: z.string().optional(),
  done: z.boolean(),
});

const BodySchema = z.object({ items: z.array(ActionItemSchema) });

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireActor();
    const { id } = await params;
    const body = BodySchema.parse(await req.json());

    const review = await prisma.businessReview.findUnique({ where: { id } });
    if (!review) throw notFound();

    const isAdmin = actor.roleKeys.has("ADMIN");
    if (!isAdmin && review.requestedByUserId !== actor.userId) throw forbidden();

    const updated = await prisma.businessReview.update({
      where: { id },
      data: { actions: { items: body.items } as object },
      select: { id: true, actions: true },
    });

    return jsonOk({ actions: updated.actions });
  } catch (e) {
    return jsonError(e);
  }
}
