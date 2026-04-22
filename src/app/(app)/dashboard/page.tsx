import { getSession } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { StageChart } from "@/components/dashboard/stage-chart";
import { OwnerChart } from "@/components/dashboard/owner-chart";
import { KpiSection } from "@/components/dashboard/kpi-section";
import { PendingApprovals } from "@/components/dashboard/pending-approvals";
import { AtRiskTable } from "@/components/dashboard/at-risk-table";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  const userId = session?.user?.id;

  const [initiativeCounts, stageGroups, allInitiatives, pendingApprovals] = await Promise.all([
    prisma.initiative.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.initiative.groupBy({ by: ["currentStageKey"], _count: { _all: true } }),
    prisma.initiative.findMany({
      select: {
        id: true,
        key: true,
        title: true,
        status: true,
        currentStageKey: true,
        owner: { select: { name: true, email: true } },
        team: { select: { name: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 200,
    }),
    prisma.approvalTask.findMany({
      where: {
        status: "PENDING",
        ...(userId
          ? { OR: [{ assignedToUserId: userId }, { assignedRoleKey: { not: null } }] }
          : { id: "none" }),
      },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { initiative: { select: { key: true, title: true } } },
    }),
  ]);

  const total = initiativeCounts.reduce((sum: number, c: typeof initiativeCounts[0]) => sum + c._count._all, 0);
  const active = initiativeCounts.find((c: typeof initiativeCounts[0]) => c.status === "ACTIVE")?._count._all ?? 0;
  const onHold = initiativeCounts.find((c: typeof initiativeCounts[0]) => c.status === "ON_HOLD")?._count._all ?? 0;
  const completed = initiativeCounts.find((c: typeof initiativeCounts[0]) => c.status === "COMPLETED")?._count._all ?? 0;
  const cancelled = initiativeCounts.find((c: typeof initiativeCounts[0]) => c.status === "CANCELLED")?._count._all ?? 0;
  const pendingApprovalCount = pendingApprovals.length;

  const stageChartData = stageGroups
    .filter((g: typeof stageGroups[0]) => g._count._all > 0)
    .map((g: typeof stageGroups[0]) => ({ name: g.currentStageKey, value: g._count._all }));

  const ownerCounts: Record<string, number> = {};
  for (const init of allInitiatives) {
    const name = init.owner.name ?? init.owner.email;
    ownerCounts[name] = (ownerCounts[name] ?? 0) + 1;
  }
  const ownerChartData = Object.entries(ownerCounts)
    .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]: [string, number]) => ({ name, count }));

  type InitiativeRow = typeof allInitiatives[number];
  const atRisk = allInitiatives
    .filter((i: InitiativeRow) => i.status === "ON_HOLD" || i.status === "CANCELLED")
    .slice(0, 5);

  type ApprovalRow = typeof pendingApprovals[number];
  const pendingApprovalsForWidget = pendingApprovals.map((a: ApprovalRow) => ({
    id: a.id,
    title: a.title,
    stageKey: a.stageKey,
    initiativeId: a.initiativeId,
    initiative: { key: a.initiative.key, title: a.initiative.title },
  }));

  return (
    <div className="space-y-6">
      <DashboardHeader />

      <MetricCards
        metrics={{ total, active, pendingApproval: pendingApprovalCount, onHold, completed, cancelled }}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <StageChart data={stageChartData} />
        <OwnerChart data={ownerChartData} />
      </div>

      <KpiSection
        total={total}
        active={active}
        completed={completed}
        pendingApproval={pendingApprovalCount}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <PendingApprovals approvals={pendingApprovalsForWidget} />
        <AtRiskTable initiatives={atRisk} />
      </div>
    </div>
  );
}
