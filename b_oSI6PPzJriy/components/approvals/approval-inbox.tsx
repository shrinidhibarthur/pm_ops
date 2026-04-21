"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StageBadge, RiskBadge } from "@/components/status-badge";
import type { Initiative, Approval } from "@/lib/types";
import { Eye, CheckCircle, XCircle, RotateCcw, Inbox } from "lucide-react";

interface ApprovalInboxProps {
  initiatives: Initiative[];
}

export function ApprovalInbox({ initiatives }: ApprovalInboxProps) {
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState("");

  const openReviewModal = (initiative: Initiative) => {
    setSelectedInitiative(initiative);
    const pendingApproval = initiative.approvals?.find((a) => a.status === "Pending");
    if (pendingApproval?.checklist) {
      const initialChecklist: Record<string, boolean> = {};
      pendingApproval.checklist.forEach((item) => {
        initialChecklist[item.id] = item.completed;
      });
      setChecklist(initialChecklist);
    }
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setSelectedInitiative(null);
    setIsReviewModalOpen(false);
    setChecklist({});
    setComments("");
  };

  const pendingApproval = selectedInitiative?.approvals?.find((a) => a.status === "Pending");

  if (initiatives.length === 0) {
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
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Pending Approvals ({initiatives.length})</CardTitle>
            <Badge variant="secondary">{initiatives.length} items</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="min-w-[250px]">Initiative</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Requested On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initiatives.map((init) => {
                const approval = init.approvals?.find((a) => a.status === "Pending");
                return (
                  <TableRow key={init.id}>
                    <TableCell>
                      <Link
                        href={`/initiatives/${init.id}`}
                        className="font-medium text-foreground hover:text-primary hover:underline"
                      >
                        {init.title}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">{init.workstream}</p>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{approval?.type || "Review"}</span>
                    </TableCell>
                    <TableCell>
                      <StageBadge stage={init.stage} />
                    </TableCell>
                    <TableCell>
                      <RiskBadge risk={init.risk} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs font-medium">
                            {init.owner.name.split(" ").map((n) => n[0]).join("")}
                          </span>
                        </div>
                        <span className="text-sm">{init.owner.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(init.updatedAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openReviewModal(init)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isReviewModalOpen} onOpenChange={closeReviewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review: {selectedInitiative?.title}</DialogTitle>
            <DialogDescription>
              {pendingApproval?.type} requested by {selectedInitiative?.owner.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Workstream</span>
                <p className="text-sm font-medium">{selectedInitiative?.workstream}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Stage</span>
                <p className="text-sm">
                  {selectedInitiative && <StageBadge stage={selectedInitiative.stage} />}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Target Quarter</span>
                <p className="text-sm font-medium">
                  {selectedInitiative?.quarter} {selectedInitiative?.year}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Risk Level</span>
                <p className="text-sm">
                  {selectedInitiative && <RiskBadge risk={selectedInitiative.risk} />}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Description</span>
              <p className="text-sm">{selectedInitiative?.description}</p>
            </div>

            {pendingApproval?.checklist && pendingApproval.checklist.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Approval Checklist</Label>
                <div className="space-y-2 p-4 border border-border rounded-lg bg-muted/30">
                  {pendingApproval.checklist.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <Checkbox
                        id={item.id}
                        checked={checklist[item.id] || false}
                        onCheckedChange={(checked) =>
                          setChecklist((prev) => ({ ...prev, [item.id]: !!checked }))
                        }
                      />
                      <label
                        htmlFor={item.id}
                        className={`text-sm cursor-pointer ${
                          checklist[item.id] ? "text-muted-foreground line-through" : ""
                        }`}
                      >
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="comments">Comments (optional)</Label>
              <Textarea
                id="comments"
                placeholder="Add any comments or feedback..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={closeReviewModal}
              className="sm:mr-auto"
            >
              Cancel
            </Button>
            <Button variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Send Back
            </Button>
            <Button variant="destructive" className="gap-2">
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle className="h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
