import { initiatives } from "@/lib/mock-data";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { WorkstreamChart } from "@/components/dashboard/workstream-chart";
import { StageChart } from "@/components/dashboard/stage-chart";
import { OwnerChart } from "@/components/dashboard/owner-chart";
import { AtRiskTable } from "@/components/dashboard/at-risk-table";
import { PendingApprovals } from "@/components/dashboard/pending-approvals";
import { KpiSection } from "@/components/dashboard/kpi-section";

export default function DashboardPage() {
  const metrics = {
    total: initiatives.length,
    inProgress: initiatives.filter((i) => i.status === "In Progress").length,
    blocked: initiatives.filter((i) => i.status === "Blocked").length,
    pendingApproval: initiatives.filter((i) => i.status === "Pending Approval").length,
    inDevelopment: initiatives.filter((i) => i.stage === "Development").length,
    released: initiatives.filter((i) => i.stage === "Release" || i.stage === "Post-Release").length,
  };

  const atRiskInitiatives = initiatives.filter(
    (i) => i.risk === "High" || i.risk === "Critical" || i.status === "Blocked"
  );

  const pendingApprovals = initiatives.filter((i) => i.status === "Pending Approval");

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader />
      <MetricCards metrics={metrics} />
      
      <div className="grid gap-6 lg:grid-cols-3">
        <WorkstreamChart initiatives={initiatives} />
        <StageChart initiatives={initiatives} />
        <OwnerChart initiatives={initiatives} />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <AtRiskTable initiatives={atRiskInitiatives} />
        <PendingApprovals initiatives={pendingApprovals} />
      </div>
      
      <KpiSection initiatives={initiatives} />
    </div>
  );
}
