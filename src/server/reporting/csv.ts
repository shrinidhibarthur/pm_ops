import { prisma } from "@/server/db/prisma";
import { ExportFormat, ReportType } from "@prisma/client";
import { badRequest } from "@/server/http/errors";
import type { ReportProvider, ReportRenderInput, ReportRenderResult } from "@/server/reporting/provider";

function csvEscape(v: unknown) {
  const s = v === null || v === undefined ? "" : String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(rows: Array<Record<string, unknown>>) {
  const headers = Array.from(
    rows.reduce((acc, r) => {
      Object.keys(r).forEach((k) => acc.add(k));
      return acc;
    }, new Set<string>()),
  );
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(headers.map((h) => csvEscape(r[h])).join(","));
  }
  return lines.join("\n");
}

export class CsvReportProvider implements ReportProvider {
  async render(input: ReportRenderInput): Promise<ReportRenderResult> {
    if (input.format !== "CSV") throw badRequest("CSV provider only supports CSV.");

    if (input.type === "INITIATIVE_SUMMARY") {
      if (!input.initiativeId) throw badRequest("initiativeId is required for initiative summary.");
      const i = await prisma.initiative.findUnique({
        where: { id: input.initiativeId },
        include: { team: true, owner: true, jiraLinks: true },
      });
      if (!i) throw badRequest("Initiative not found.");
      const epic = i.jiraLinks.find((l) => l.issueType === "EPIC");
      const csv = toCsv([
        {
          key: i.key,
          title: i.title,
          status: i.status,
          team: i.team.name,
          owner: i.owner.email,
          currentStageKey: i.currentStageKey,
          currentStageOrdinal: i.currentStageOrdinal,
          epicKey: epic?.issueKey ?? "",
          epicUrl: epic?.url ?? "",
          updatedAt: i.updatedAt.toISOString(),
        },
      ]);
      return {
        contentType: "text/csv; charset=utf-8",
        filename: `${i.key}-initiative-summary.csv`,
        bytes: new TextEncoder().encode(csv),
      };
    }

    if (input.type === "PORTFOLIO_SUMMARY") {
      const initiatives = await prisma.initiative.findMany({
        orderBy: { updatedAt: "desc" },
        include: { team: true, owner: true },
        take: 200,
      });
      const csv = toCsv(
        initiatives.map((i) => ({
          key: i.key,
          title: i.title,
          status: i.status,
          team: i.team.name,
          owner: i.owner.email,
          currentStageKey: i.currentStageKey,
          currentStageOrdinal: i.currentStageOrdinal,
          updatedAt: i.updatedAt.toISOString(),
        })),
      );
      return {
        contentType: "text/csv; charset=utf-8",
        filename: `portfolio-summary.csv`,
        bytes: new TextEncoder().encode(csv),
      };
    }

    // Placeholders for WBR/MBR/QBR/Six-pager: will use template-backed providers (DOCX/PDF).
    throw badRequest(`Report type not implemented for CSV: ${input.type}`);
  }
}

