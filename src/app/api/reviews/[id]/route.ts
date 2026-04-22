import { requireActor } from "@/server/authz/actor";
import { jsonError, jsonOk } from "@/server/http/route";
import { notFound } from "@/server/http/errors";
import { prisma } from "@/server/db/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireActor();
    const { id } = await params;

    const review = await prisma.businessReview.findUnique({
      where: { id },
      include: { requestedBy: { select: { name: true, email: true } } },
    });

    if (!review) throw notFound();

    const isAdmin = actor.roleKeys.has("ADMIN");
    if (!isAdmin && review.requestedByUserId !== actor.userId) throw notFound();

    return jsonOk({ review });
  } catch (e) {
    return jsonError(e);
  }
}
