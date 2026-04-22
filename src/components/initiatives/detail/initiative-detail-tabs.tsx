"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import {
  FileText,
  CheckSquare,
  GitBranch,
  MessageSquare,
  ExternalLink,
  Send,
  Target,
} from "lucide-react";

interface Approval {
  id: string;
  title: string;
  stageKey: string;
  status: string;
  assignedRoleKey: string | null;
  createdAt: Date;
}

interface Artifact {
  id: string;
  name: string;
  type: string;
  url: string;
  stageKey: string;
  createdAt: Date;
}

interface JiraLink {
  id: string;
  issueKey: string;
  url: string;
  issueType: string;
  status: string | null;
}

interface Comment {
  id: string;
  body: string;
  createdAt: Date;
  author: { name: string | null; email: string };
}

interface ChecklistItem {
  key: string;
  label: string;
  required: boolean;
}

interface Checklist {
  key: string;
  name: string;
  items: ChecklistItem[];
}

interface InitiativeDetailTabsProps {
  initiative: {
    id: string;
    key: string;
    title: string;
    summary: string | null;
    status: string;
    currentStageKey: string;
    approvals: Approval[];
    artifacts: Artifact[];
    jiraLinks: JiraLink[];
    comments: Comment[];
  };
  checklists: Checklist[];
  completedItemKeys: string[];
  children?: React.ReactNode;
}

export function InitiativeDetailTabs({
  initiative,
  checklists,
  completedItemKeys,
}: InitiativeDetailTabsProps) {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="bg-muted/50">
        <TabsTrigger value="overview" className="gap-2">
          <FileText className="h-4 w-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="artifacts" className="gap-2">
          <FileText className="h-4 w-4" />
          Artifacts
        </TabsTrigger>
        <TabsTrigger value="approvals" className="gap-2">
          <CheckSquare className="h-4 w-4" />
          Approvals
          {initiative.approvals.filter((a) => a.status === "PENDING").length > 0 && (
            <span className="ml-1 rounded-full bg-amber-500 text-white text-xs px-1.5 py-0.5">
              {initiative.approvals.filter((a) => a.status === "PENDING").length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="jira" className="gap-2">
          <GitBranch className="h-4 w-4" />
          Jira
          {initiative.jiraLinks.length > 0 && (
            <span className="ml-1 rounded-full bg-muted-foreground/20 text-foreground text-xs px-1.5 py-0.5">
              {initiative.jiraLinks.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="checklist" className="gap-2">
          <CheckSquare className="h-4 w-4" />
          Checklist
        </TabsTrigger>
        <TabsTrigger value="activity" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Activity
          {initiative.comments.length > 0 && (
            <span className="ml-1 rounded-full bg-muted-foreground/20 text-foreground text-xs px-1.5 py-0.5">
              {initiative.comments.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {initiative.summary || "No summary provided."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Stage Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Stage</span>
                <span className="text-sm font-medium">{initiative.currentStageKey}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <StatusBadge status={initiative.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending Approvals</span>
                <span className="text-sm font-medium">
                  {initiative.approvals.filter((a) => a.status === "PENDING").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Artifacts</span>
                <span className="text-sm font-medium">{initiative.artifacts.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Artifacts Tab */}
      <TabsContent value="artifacts" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Documents & Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            {initiative.artifacts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No artifacts yet</p>
                <p className="text-xs mt-1">Upload documents or link files using the Add Artifact button</p>
              </div>
            ) : (
              <div className="space-y-2">
                {initiative.artifacts.map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{a.name}</p>
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-muted-foreground hover:underline truncate block"
                      >
                        {a.url}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <Badge variant="outline">{a.type}</Badge>
                      <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                        <a href={a.url} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Approvals Tab */}
      <TabsContent value="approvals" className="space-y-4">
        {initiative.approvals.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 text-muted-foreground">
              <CheckSquare className="h-10 w-10 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No approvals required at this stage</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {initiative.approvals.map((approval) => (
              <Card key={approval.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-base">{approval.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      Stage: {approval.stageKey}
                      {approval.assignedRoleKey ? ` · Role: ${approval.assignedRoleKey}` : ""}
                    </p>
                  </div>
                  <Badge
                    variant={
                      approval.status === "APPROVED"
                        ? "default"
                        : approval.status === "REJECTED"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {approval.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Created {approval.createdAt.toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      {/* Jira Tab */}
      <TabsContent value="jira" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Jira Integration</CardTitle>
          </CardHeader>
          <CardContent>
            {initiative.jiraLinks.length === 0 ? (
              <div className="text-center py-8">
                <GitBranch className="h-10 w-10 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">No linked Jira issues</p>
              </div>
            ) : (
              <div className="space-y-2">
                {initiative.jiraLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-mono font-medium">{link.issueKey}</p>
                      <p className="text-xs text-muted-foreground">{link.status ?? "Unknown status"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{link.issueType}</Badge>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Checklist Tab */}
      <TabsContent value="checklist" className="space-y-4">
        {checklists.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 text-muted-foreground">
              <CheckSquare className="h-10 w-10 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No checklist items for this stage</p>
            </CardContent>
          </Card>
        ) : (
          checklists.map((checklist) => (
            <Card key={checklist.key}>
              <CardHeader>
                <CardTitle className="text-base">{checklist.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {checklist.items.map((item) => {
                  const itemKey = `${checklist.key}:${item.key}`;
                  const completed = completedItemKeys.includes(itemKey);
                  return (
                    <div key={item.key} className="flex items-center gap-3 p-2 rounded">
                      <div
                        className={`h-4 w-4 rounded border flex items-center justify-center ${
                          completed ? "bg-emerald-500 border-emerald-500" : "border-border"
                        }`}
                      >
                        {completed && (
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm ${completed ? "line-through text-muted-foreground" : ""}`}>
                        {item.label}
                        {item.required && <span className="ml-1 text-red-500">*</span>}
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>

      {/* Activity Tab */}
      <TabsContent value="activity" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Activity Feed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Textarea placeholder="Add a comment..." className="flex-1" rows={2} />
              <Button size="icon" className="self-end">
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4 pt-4">
              {initiative.comments.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">No activity yet</p>
              ) : (
                initiative.comments.map((comment) => {
                  const authorName = comment.author.name ?? comment.author.email;
                  const initials = authorName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
                  return (
                    <div key={comment.id} className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <span className="text-xs font-medium">{initials}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{authorName}</span>
                          <span className="text-xs text-muted-foreground">
                            {comment.createdAt.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{comment.body}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
