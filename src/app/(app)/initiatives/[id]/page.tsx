import { notFound } from "next/navigation";
import { prisma } from "@/server/db/prisma";
import { StageRequirementsSchema } from "@/server/workflow/types";
import { WorkflowTimeline } from "@/components/initiatives/detail/workflow-timeline";
import { InitiativeDetailHeader } from "@/components/initiatives/detail/initiative-detail-header";
import { InitiativeDetailTabs } from "@/components/initiatives/detail/initiative-detail-tabs";
import { GatesPanel } from "@/components/workflow/gates-panel";
import { AdvanceStageButton } from "@/components/workflow/advance-stage-button";
import { ArtifactAddDialog } from "@/components/workflow/artifact-add-dialog";
import { JiraActions } from "@/components/jira/jira-actions";
import { ExportButtons } from "@/components/exports/export-buttons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function InitiativeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const initiative = await prisma.initiative.findUnique({
    where: { id },
    include: {
      team: true,
      owner: true,
      stageStates: { orderBy: { ordinal: "asc" } },
      approvals: { orderBy: { createdAt: "desc" }, take: 20 },
      artifacts: { orderBy: { createdAt: "desc" }, take: 20 },
      jiraLinks: { orderBy: { createdAt: "desc" } },
      checklistCompletions: true,
      comments: { orderBy: { createdAt: "desc" }, take: 20, include: { author: true } },
    },
  });

  if (!initiative) notFound();

  const stageTemplate = await prisma.stageTemplate.findUnique({ where: { key: initiative.currentStageKey } });
  const requirements = StageRequirementsSchema.parse(stageTemplate?.requirements ?? {});
  const requiredChecklistKeys = requirements.checklists.filter((c) => c.required).map((c) => c.checklistKey);
  const requiredChecklists = requiredChecklistKeys.length
    ? await prisma.checklistTemplate.findMany({ where: { key: { in: requiredChecklistKeys } } })
    : [];

  const checklistModels = requiredChecklists.map((c) => ({
    key: c.key,
    name: c.name,
    items: (Array.isArray(c.items) ? (c.items as any[]) : []).map((it) => ({
      key: String(it.key),
      label: String(it.label ?? it.key),
      required: Boolean(it.required),
    })),
  }));

  const completedItemKeys = initiative.checklistCompletions
    .filter((cc) => cc.stageKey === initiative.currentStageKey)
    .map((cc) => `${cc.checklistKey}:${cc.itemKey}`);

  return (
    <div className="space-y-6">
      <InitiativeDetailHeader
        initiative={{
          id: initiative.id,
          key: initiative.key,
          title: initiative.title,
          status: initiative.status,
          currentStageKey: initiative.currentStageKey,
          team: { name: initiative.team.name },
          owner: { name: initiative.owner.name, email: initiative.owner.email },
        }}
      />

      <WorkflowTimeline
        stageStates={initiative.stageStates}
        currentStageKey={initiative.currentStageKey}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <InitiativeDetailTabs
            initiative={{
              id: initiative.id,
              key: initiative.key,
              title: initiative.title,
              summary: initiative.summary,
              status: initiative.status,
              currentStageKey: initiative.currentStageKey,
              approvals: initiative.approvals.map((a) => ({
                id: a.id,
                title: a.title,
                stageKey: a.stageKey,
                status: a.status,
                assignedRoleKey: a.assignedRoleKey,
                createdAt: a.createdAt,
              })),
              artifacts: initiative.artifacts.map((a) => ({
                id: a.id,
                name: a.name,
                type: String(a.type),
                url: a.url,
                stageKey: a.stageKey ?? "",
                createdAt: a.createdAt,
              })),
              jiraLinks: initiative.jiraLinks.map((l) => ({
                id: l.id,
                issueKey: l.issueKey,
                url: l.url,
                issueType: l.issueType,
                status: l.status,
              })),
              comments: initiative.comments.map((c) => ({
                id: c.id,
                body: c.body,
                createdAt: c.createdAt,
                author: { name: c.author.name, email: c.author.email },
              })),
            }}
            checklists={checklistModels}
            completedItemKeys={completedItemKeys}
          />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stage Gates</CardTitle>
              <CardDescription>What&apos;s blocking progression</CardDescription>
            </CardHeader>
            <CardContent>
              <GatesPanel initiativeId={initiative.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advance Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <AdvanceStageButton initiativeId={initiative.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Artifacts</CardTitle>
              <CardDescription>Documents required by stage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <ArtifactAddDialog initiativeId={initiative.id} defaultStageKey={initiative.currentStageKey} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Jira</CardTitle>
            </CardHeader>
            <CardContent>
              <JiraActions initiativeId={initiative.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exports</CardTitle>
            </CardHeader>
            <CardContent>
              <ExportButtons initiativeId={initiative.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
