import { prisma } from "@/server/db/prisma";
import { AdminTabs } from "@/components/admin/admin-tabs";

export const dynamic = "force-dynamic";

export default async function AdminWorkflowsPage() {
  const [workflows, stages, approvalMatrices, jiraMappings, reportTemplates] = await Promise.all([
    prisma.workflowConfig.findMany({
      orderBy: { updatedAt: "desc" },
      take: 50,
      include: { team: { select: { name: true } } },
    }),
    prisma.stageTemplate.findMany({ orderBy: { key: "asc" } }),
    prisma.approvalMatrix.findMany({
      orderBy: { key: "asc" },
      include: { team: { select: { name: true } } },
    }),
    prisma.jiraMapping.findMany({
      orderBy: { createdAt: "desc" },
      include: { team: { select: { name: true } } },
    }),
    prisma.reportTemplate.findMany({ orderBy: { key: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage workflow configs, stage templates, approval matrices, Jira mappings, and report templates.
        </p>
      </div>
      <AdminTabs
        workflows={workflows}
        stages={stages}
        approvalMatrices={approvalMatrices}
        jiraMappings={jiraMappings}
        reportTemplates={reportTemplates}
      />
    </div>
  );
}
