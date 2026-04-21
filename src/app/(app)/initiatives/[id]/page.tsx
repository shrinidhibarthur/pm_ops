import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/server/db/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GatesPanel } from "@/components/workflow/gates-panel";
import { AdvanceStageButton } from "@/components/workflow/advance-stage-button";
import { StageRequirementsSchema } from "@/server/workflow/types";
import { ChecklistPanel } from "@/components/workflow/checklist-panel";
import { ArtifactAddDialog } from "@/components/workflow/artifact-add-dialog";
import { JiraActions } from "@/components/jira/jira-actions";
import { ExportButtons } from "@/components/exports/export-buttons";

export const dynamic = "force-dynamic";

function stageBadge(status: string) {
  switch (status) {
    case "COMPLETE":
      return "success";
    case "IN_PROGRESS":
      return "info";
    case "BLOCKED":
      return "danger";
    default:
      return "default";
  }
}

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
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-lg font-semibold tracking-tight">
              {initiative.key} • {initiative.title}
            </h1>
            <Badge variant={initiative.status === "ACTIVE" ? "info" : initiative.status === "COMPLETED" ? "success" : "warning"}>
              {initiative.status}
            </Badge>
          </div>
          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Team: {initiative.team.name} • Owner: {initiative.owner.name ?? initiative.owner.email} • Current stage:{" "}
            <span className="font-medium text-zinc-900 dark:text-zinc-50">{initiative.currentStageKey}</span>
          </div>
          {initiative.summary ? (
            <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{initiative.summary}</div>
          ) : null}
        </div>
        <div className="flex gap-2">
          <Link
            href="/approvals"
            className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:hover:bg-zinc-950"
          >
            Approvals
          </Link>
          <AdvanceStageButton initiativeId={initiative.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Workflow timeline</CardTitle>
              <CardDescription>Config-driven stages with gating and audit logging</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {initiative.stageStates.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-4 rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {String(s.ordinal).padStart(2, "0")} • {s.stageKey}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {s.startedAt ? `Started ${s.startedAt.toISOString().slice(0, 10)}` : "Not started"}{" "}
                      {s.completedAt ? `• Completed ${s.completedAt.toISOString().slice(0, 10)}` : ""}
                    </div>
                  </div>
                  <Badge variant={stageBadge(s.status)}>{s.status}</Badge>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Stage gates</CardTitle>
                <CardDescription>What’s blocking progression right now</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <GatesPanel initiativeId={initiative.id} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Jira integration</CardTitle>
                <CardDescription>Provider-based abstraction (stubbed UI)</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {initiative.jiraLinks.length === 0 ? (
                <div className="text-sm text-zinc-600 dark:text-zinc-400">No linked Jira issues.</div>
              ) : (
                <div className="space-y-2">
                  {initiative.jiraLinks.map((l) => (
                    <a
                      key={l.id}
                      className="block rounded-md border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-950"
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-medium">{l.issueKey}</div>
                        <Badge variant="default">{l.issueType}</Badge>
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">{l.status ?? "Unknown status"}</div>
                    </a>
                  ))}
                </div>
              )}
              <JiraActions initiativeId={initiative.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Exports</CardTitle>
                <CardDescription>WBR/MBR/QBR/six-pager pipeline is template-backed</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ExportButtons initiativeId={initiative.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Checklist</CardTitle>
                <CardDescription>Complete required items to clear gates</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ChecklistPanel
                initiativeId={initiative.id}
                stageKey={initiative.currentStageKey}
                checklists={checklistModels}
                completedItemKeys={completedItemKeys}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Artifacts</CardTitle>
                <CardDescription>Docs and links required by stage</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  Default stage: <span className="font-medium">{initiative.currentStageKey}</span>
                </div>
                <ArtifactAddDialog initiativeId={initiative.id} defaultStageKey={initiative.currentStageKey} />
              </div>
              {initiative.artifacts.length === 0 ? (
                <div className="text-sm text-zinc-600 dark:text-zinc-400">No artifacts.</div>
              ) : (
                <ul className="space-y-2">
                  {initiative.artifacts.map((a) => (
                    <li key={a.id} className="rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800">
                      <div className="flex items-center justify-between gap-2">
                        <div className="truncate text-sm font-medium">{a.name}</div>
                        <Badge variant="default">{a.type}</Badge>
                      </div>
                      <a className="truncate text-xs text-zinc-600 hover:underline dark:text-zinc-400" href={a.url} target="_blank" rel="noreferrer">
                        {a.url}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Approvals</CardTitle>
              <CardDescription>Stage-gated decisions</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {initiative.approvals.length === 0 ? (
              <div className="text-sm text-zinc-600 dark:text-zinc-400">No approvals.</div>
            ) : (
              <div className="divide-y divide-zinc-200 rounded-md border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
                {initiative.approvals.map((a) => (
                  <div key={a.id} className="flex items-center justify-between gap-4 px-3 py-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{a.title}</div>
                      <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                        Stage: {a.stageKey} • Assigned role: {a.assignedRoleKey ?? "—"}
                      </div>
                    </div>
                    <Badge variant={a.status === "APPROVED" ? "success" : a.status === "REJECTED" ? "danger" : "warning"}>
                      {a.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Activity</CardTitle>
              <CardDescription>Comments & audit trail (UI)</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {initiative.comments.length === 0 ? (
              <div className="text-sm text-zinc-600 dark:text-zinc-400">No activity.</div>
            ) : (
              <div className="space-y-2">
                {initiative.comments.map((c) => (
                  <div key={c.id} className="rounded-md border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800">
                    <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                      <div className="truncate">{c.author.name ?? c.author.email}</div>
                      <div className="shrink-0">{c.createdAt.toISOString().slice(0, 10)}</div>
                    </div>
                    <div className="mt-1 text-sm text-zinc-800 dark:text-zinc-200">{c.body}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

