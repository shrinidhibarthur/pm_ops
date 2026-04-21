import Link from "next/link";
import { getSession } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  const userId = session?.user?.id;

  const [initiativeCounts, pendingApprovals] = await Promise.all([
    prisma.initiative.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    userId
      ? prisma.approvalTask.findMany({
          where: { status: "PENDING", OR: [{ assignedToUserId: userId }, { assignedRoleKey: { not: null } }] },
          orderBy: { createdAt: "desc" },
          take: 8,
          include: { initiative: true },
        })
      : Promise.resolve([]),
  ]);

  const active = initiativeCounts.find((c) => c.status === "ACTIVE")?._count._all ?? 0;
  const onHold = initiativeCounts.find((c) => c.status === "ON_HOLD")?._count._all ?? 0;
  const completed = initiativeCounts.find((c) => c.status === "COMPLETED")?._count._all ?? 0;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Executive dashboard</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Portfolio visibility, approvals, and stage health.
          </p>
        </div>
        <Link
          href="/initiatives/new"
          className="rounded-md bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          New initiative
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Active initiatives</CardTitle>
              <CardDescription>In-flight across workflow stages</CardDescription>
            </div>
            <Badge variant="info">{active}</Badge>
          </CardHeader>
          <CardContent className="text-xs text-zinc-500 dark:text-zinc-400">
            Review stage aging and approval bottlenecks to accelerate delivery.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>On hold</CardTitle>
              <CardDescription>Paused or awaiting decisions</CardDescription>
            </div>
            <Badge variant="warning">{onHold}</Badge>
          </CardHeader>
          <CardContent className="text-xs text-zinc-500 dark:text-zinc-400">
            Track ownership and unblock criteria.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Completed</CardTitle>
              <CardDescription>Shipped and closed</CardDescription>
            </div>
            <Badge variant="success">{completed}</Badge>
          </CardHeader>
          <CardContent className="text-xs text-zinc-500 dark:text-zinc-400">
            Validate impact and capture learnings.
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Approval inbox (preview)</CardTitle>
            <CardDescription>Pending decisions you can act on</CardDescription>
          </div>
          <Link href="/approvals" className="text-sm font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50">
            Open inbox
          </Link>
        </CardHeader>
        <CardContent>
          {pendingApprovals.length === 0 ? (
            <div className="text-sm text-zinc-600 dark:text-zinc-400">No pending approvals.</div>
          ) : (
            <div className="divide-y divide-zinc-200 rounded-md border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
              {pendingApprovals.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-4 px-3 py-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{a.title}</div>
                    <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {a.initiative.key} • {a.initiative.title} • Stage: {a.stageKey}
                    </div>
                  </div>
                  <Link
                    href={`/initiatives/${a.initiativeId}`}
                    className="shrink-0 rounded-md border border-zinc-200 px-2.5 py-1 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-950"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

