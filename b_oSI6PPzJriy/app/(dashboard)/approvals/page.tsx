import { initiatives } from "@/lib/mock-data";
import { ApprovalInbox } from "@/components/approvals/approval-inbox";

export default function ApprovalsPage() {
  const pendingApprovals = initiatives.filter(
    (i) => i.status === "Pending Approval" && i.approvals?.some((a) => a.status === "Pending")
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Approval Inbox</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review and approve pending initiatives
        </p>
      </div>
      <ApprovalInbox initiatives={pendingApprovals} />
    </div>
  );
}
