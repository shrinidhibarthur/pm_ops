import { ExportFormat, ReportType } from "@prisma/client";

export type ReportRenderInput = {
  type: ReportType;
  format: ExportFormat;
  initiativeId?: string;
  params?: Record<string, unknown>;
};

export type ReportRenderResult = {
  contentType: string;
  filename: string;
  bytes: Uint8Array;
};

export interface ReportProvider {
  render(input: ReportRenderInput): Promise<ReportRenderResult>;
}

