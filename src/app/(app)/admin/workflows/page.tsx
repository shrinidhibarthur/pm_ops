import { prisma } from "@/server/db/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminWorkflowsPage() {
  const workflows = await prisma.workflowConfig.findMany({ orderBy: { updatedAt: "desc" }, take: 25 });
  const stages = await prisma.stageTemplate.findMany({ orderBy: { key: "asc" } });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Admin • Workflow configuration</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Stage templates and workflow configs are DB-backed and editable here (UI/editor next).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Workflow configs</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="space-y-2">
              {workflows.map((w) => (
                <li key={w.id} className="rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800">
                  <div className="font-medium">{w.name}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    key={w.key} • status={w.status} • version={w.version}
                  </div>
                </li>
              ))}
              {workflows.length === 0 ? (
                <li className="text-zinc-600 dark:text-zinc-400">No workflow configs.</li>
              ) : null}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stage templates</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="space-y-2">
              {stages.map((s) => (
                <li key={s.id} className="rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">key={s.key}</div>
                </li>
              ))}
              {stages.length === 0 ? <li className="text-zinc-600 dark:text-zinc-400">No stage templates.</li> : null}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

