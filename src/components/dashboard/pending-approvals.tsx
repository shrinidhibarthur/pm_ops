import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ChevronRight } from "lucide-react";

interface PendingApprovalItem {
  id: string;
  title: string;
  stageKey: string;
  initiativeId: string;
  initiative: { key: string; title: string };
}

interface PendingApprovalsProps {
  approvals: PendingApprovalItem[];
}

export function PendingApprovals({ approvals }: PendingApprovalsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-base font-medium">Pending Approvals</CardTitle>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/approvals">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {approvals.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No pending approvals</p>
        ) : (
          <div className="space-y-3">
            {approvals.slice(0, 4).map((approval) => (
              <div
                key={approval.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{approval.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{approval.initiative.key}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">Stage: {approval.stageKey}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/initiatives/${approval.initiativeId}`}>Review</Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
