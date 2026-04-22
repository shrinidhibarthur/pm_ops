"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StageBadge } from "@/components/status-badge";
import { ApprovalDecisionButtons } from "@/components/approvals/decision-buttons";
import { Inbox } from "lucide-react";

interface ApprovalTask {
  id: string;
  title: string;
  stageKey: string;
  assignedRoleKey: string | null;
  createdAt: Date;
  initiativeId: string;
  initiative: { id: string; key: string; title: string };
}

interface ApprovalInboxProps {
  approvals: ApprovalTask[];
}

export function ApprovalInbox({ approvals }: ApprovalInboxProps) {
  if (approvals.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Inbox className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
          <h3 className="text-lg font-medium text-foreground">No pending approvals</h3>
          <p className="text-sm text-muted-foreground mt-1">
            You&apos;re all caught up! Check back later for new approval requests.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Pending Approvals ({approvals.length})</CardTitle>
          <Badge variant="secondary">{approvals.length} items</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="min-w-[250px]">Initiative</TableHead>
              <TableHead>Approval</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Requested On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvals.map((approval) => (
              <TableRow key={approval.id}>
                <TableCell>
                  <Link
                    href={`/initiatives/${approval.initiativeId}`}
                    className="font-medium text-foreground hover:text-primary hover:underline"
                  >
                    {approval.initiative.key}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {approval.initiative.title}
                  </p>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{approval.title}</span>
                </TableCell>
                <TableCell>
                  <StageBadge stage={approval.stageKey} />
                </TableCell>
                <TableCell>
                  {approval.assignedRoleKey ? (
                    <Badge variant="outline">{approval.assignedRoleKey}</Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {approval.createdAt.toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/initiatives/${approval.initiativeId}`}>View</Link>
                    </Button>
                    <ApprovalDecisionButtons taskId={approval.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
