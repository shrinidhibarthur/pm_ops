import { getSession } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { ApprovalInbox } from "@/components/approvals/approval-inbox";

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
    include: {
      initiative: { select: { id: true, key: true, title: true } },
    },
  });

  type ApprovalRow = typeof approvals[number];
  const approvalsData = approvals.map((a: ApprovalRow) => ({
    id: a.id,
    title: a.title,
    stageKey: a.stageKey,
    assignedRoleKey: a.assignedRoleKey,
    createdAt: a.createdAt,
    initiativeId: a.initiativeId,
    initiative: {
      id: a.initiative.id,
      key: a.initiative.key,
      title: a.initiative.title,
    },
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Approval Inbox</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pending decisions awaiting your review
        </p>
      </div>

      <ApprovalInbox approvals={approvalsData} />
    </div>
  );
}
