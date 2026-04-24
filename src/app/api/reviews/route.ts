import { z } from "zod";
import { after } from "next/server";
import { requireActor } from "@/server/authz/actor";
import { jsonError, jsonOk } from "@/server/http/route";
import { badRequest } from "@/server/http/errors";
import { createReview, runReview } from "@/server/reviews/service";
import { prisma } from "@/server/db/prisma";

const CreateSchema = z.object({
  type: z.enum(["WBR", "MBR", "QBR"]),
  dateStart: z.string().datetime(),
  dateEnd: z.string().datetime(),
});

export async function POST(req: Request) {
  try {
    const actor = await requireActor();
    const body = CreateSchema.parse(await req.json());

    const start = new Date(body.dateStart);
    const end = new Date(body.dateEnd);
    if (end <= start) throw badRequest("dateEnd must be after dateStart.");

    const review = await createReview({
      type: body.type,
      dateStart: start,
      dateEnd: end,
      requestedByUserId: actor.userId,
    });

    // Run review generation after response is sent (non-blocking)
    after(async () => {
      try {
        await runReview(review.id);
      } catch {
        // runReview handles its own error state in DB; nothing to do here
      }
    });

    return jsonOk({ id: review.id, status: review.status });
  } catch (e) {
    return jsonError(e);
  }
}

export async function GET() {
  try {
    const actor = await requireActor();
    const isAdmin = actor.roleKeys.has("ADMIN");

    const reviews = await prisma.businessReview.findMany({
      where: isAdmin ? undefined : { requestedByUserId: actor.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        type: true,
        dateStart: true,
        dateEnd: true,
        status: true,
        generatedAt: true,
        error: true,
        createdAt: true,
        requestedBy: { select: { name: true, email: true } },
      },
    });

    return jsonOk({ reviews });
  } catch (e) {
    return jsonError(e);
  }
}
