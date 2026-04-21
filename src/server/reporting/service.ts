import { ExportFormat, ExportJobStatus, ReportType } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { CsvReportProvider } from "@/server/reporting/csv";
import { badRequest } from "@/server/http/errors";

export async function createExportJob(input: {
  reportTemplateKey?: string;
  reportType: ReportType;
  format: ExportFormat;
  initiativeId?: string;
  requestedByUserId: string;
  params?: Prisma.InputJsonValue;
}) {
  // Minimal template resolution: if a template exists, use it; otherwise allow ad-hoc types.
  const template = input.reportTemplateKey
    ? await prisma.reportTemplate.findUnique({ where: { key: input.reportTemplateKey } })
    : await prisma.reportTemplate.findFirst({ where: { type: input.reportType } });

  if (!template) {
    // Still allow INITIATIVE_SUMMARY/PORTFOLIO_SUMMARY in CSV without template rows.
    if (!["INITIATIVE_SUMMARY", "PORTFOLIO_SUMMARY"].includes(input.reportType)) {
      throw badRequest("No report template configured for this export type.");
    }
  }

  const job = await prisma.exportJob.create({
    data: {
      reportTemplateId: template?.id ?? (await ensureAdhocTemplate(input.reportType)).id,
      initiativeId: input.initiativeId ?? null,
      requestedByUserId: input.requestedByUserId,
      status: "QUEUED",
      format: input.format,
      params: input.params ?? undefined,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: input.requestedByUserId,
      action: "EXPORT_REQUESTED",
      entityType: "exportJob",
      entityId: job.id,
      after: { type: input.reportType, format: input.format, initiativeId: input.initiativeId ?? null },
    },
  });

  return job;
}

async function ensureAdhocTemplate(type: ReportType) {
  const key = `ADHOC_${type}`;
  return prisma.reportTemplate.upsert({
    where: { key },
    update: { type, name: `Ad-hoc ${type}` },
    create: { key, type, name: `Ad-hoc ${type}` },
  });
}

export async function runExportJob(jobId: string) {
  const job = await prisma.exportJob.findUnique({ where: { id: jobId }, include: { reportTemplate: true } });
  if (!job) throw badRequest("Export job not found.");
  if (job.status !== "QUEUED") return job;

  await prisma.exportJob.update({ where: { id: jobId }, data: { status: "RUNNING", startedAt: new Date() } });

  try {
    // Provider selection by format (extensible)
    if (job.format === "CSV") {
      const provider = new CsvReportProvider();
      const result = await provider.render({
        type: job.reportTemplate.type,
        format: job.format,
        initiativeId: job.initiativeId ?? undefined,
        params: (job.params as any) ?? undefined,
      });

      // For now store result in-memory not possible; we store as a data: URL placeholder.
      // Next step: write to blob store (S3/Azure Blob) and store URL.
      const b64 = Buffer.from(result.bytes).toString("base64");
      const dataUrl = `data:${result.contentType};base64,${b64}`;

      return await prisma.exportJob.update({
        where: { id: jobId },
        data: { status: "SUCCEEDED", completedAt: new Date(), resultUrl: dataUrl },
      });
    }

    throw badRequest(`Export format not implemented: ${job.format}`);
  } catch (e: any) {
    return await prisma.exportJob.update({
      where: { id: jobId },
      data: { status: "FAILED", completedAt: new Date(), error: e?.message ?? "Export failed." },
    });
  }
}

