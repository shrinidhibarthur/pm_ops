import { requireActor } from "@/server/authz/actor";
import { prisma } from "@/server/db/prisma";
import { jsonError, jsonOk } from "@/server/http/route";
import { notFound } from "@/server/http/errors";
import { runExportJob } from "@/server/reporting/service";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireActor();
    const { id } = await params;
    const job = await prisma.exportJob.findUnique({ where: { id } });
    if (!job) throw notFound();
    return jsonOk(job);
  } catch (e) {
    return jsonError(e);
  }
}

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireActor();
    const { id } = await params;
    const job = await runExportJob(id);
    return jsonOk(job);
  } catch (e) {
    return jsonError(e);
  }
}

