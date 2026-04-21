import Link from "next/link";
import { getSession } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApprovalDecisionButtons } from "@/components/approvals/decision-buttons";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const session = await getSession();
  const userId = session?.user?.id;

  const approvals = await prisma.approvalTask.findMany({
    where: {
      status: "PENDING",
      ...(userId ? { OR: [{ assignedToUserId: userId }, { assignedRoleKey: { not: null } }] } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { initiative: true },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Approval inbox</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Pending decisions (role-aware enforcement next).</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending</CardTitle>
        </CardHeader>
        <CardContent>
          {approvals.length === 0 ? (
            <div className="text-sm text-zinc-600 dark:text-zinc-400">No pending approvals.</div>
          ) : (
            <div className="divide-y divide-zinc-200 rounded-md border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
              {approvals.map((a) => (
                <div key={a.id} className="flex flex-col gap-2 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="truncate text-sm font-medium">{a.title}</div>
                      <Badge variant="warning">PENDING</Badge>
                      {a.assignedRoleKey ? <Badge variant="default">{a.assignedRoleKey}</Badge> : null}
                    </div>
                    <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {a.initiative.key} • {a.initiative.title} • Stage: {a.stageKey}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/initiatives/${a.initiativeId}`}
                      className="rounded-md border border-zinc-200 px-2.5 py-1 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-950"
                    >
                      Open
                    </Link>
                    <ApprovalDecisionButtons taskId={a.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

