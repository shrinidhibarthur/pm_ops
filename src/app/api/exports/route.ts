import { z } from "zod";
import { requireActor } from "@/server/authz/actor";
import { jsonError, jsonOk } from "@/server/http/route";
import { createExportJob, runExportJob } from "@/server/reporting/service";

const BodySchema = z.object({
  reportType: z.enum(["INITIATIVE_SUMMARY", "PORTFOLIO_SUMMARY", "WBR", "MBR", "QBR", "SIX_PAGER"]),
  format: z.enum(["PDF", "DOCX", "CSV"]),
  initiativeId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const actor = await requireActor();
    const body = BodySchema.parse(await req.json());
    const job = await createExportJob({
      reportType: body.reportType as any,
      format: body.format as any,
      initiativeId: body.initiativeId,
      requestedByUserId: actor.userId,
    });

    // For now: run inline for CSV. Later: queue/worker.
    const finalJob = body.format === "CSV" ? await runExportJob(job.id) : job;
    return jsonOk({ id: finalJob.id, status: finalJob.status, resultUrl: finalJob.resultUrl ?? null });
  } catch (e) {
    return jsonError(e);
  }
}

