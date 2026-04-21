"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { Initiative, Activity } from "@/lib/types";
import { 
  FileText, 
  CheckSquare, 
  GitBranch, 
  Code, 
  BarChart3, 
  MessageSquare,
  ExternalLink,
  Send,
  Target,
  AlertTriangle,
  Link2
} from "lucide-react";

interface InitiativeDetailTabsProps {
  initiative: Initiative;
  activities: Activity[];
}

export function InitiativeDetailTabs({ initiative, activities }: InitiativeDetailTabsProps) {
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
        </TabsTrigger>
        <TabsTrigger value="jira" className="gap-2">
          <GitBranch className="h-4 w-4" />
          Jira
        </TabsTrigger>
        <TabsTrigger value="dev-status" className="gap-2">
          <Code className="h-4 w-4" />
          Dev Status
        </TabsTrigger>
        <TabsTrigger value="metrics" className="gap-2">
          <BarChart3 className="h-4 w-4" />
          Metrics
        </TabsTrigger>
        <TabsTrigger value="activity" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Activity
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4" />
                Problem Statement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {initiative.problemStatement || "No problem statement defined yet."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4" />
                Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              {initiative.goals && initiative.goals.length > 0 ? (
                <ul className="space-y-2">
                  {initiative.goals.map((goal, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-medium shrink-0">
                        {i + 1}
                      </span>
                      {goal}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No goals defined yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                Dependencies
              </CardTitle>
            </CardHeader>
            <CardContent>
              {initiative.dependencies && initiative.dependencies.length > 0 ? (
                <div className="space-y-3">
                  {initiative.dependencies.map((dep) => (
                    <div key={dep.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div>
                        <p className="text-sm font-medium">{dep.title}</p>
                        <p className="text-xs text-muted-foreground">{dep.type}</p>
                      </div>
                      <Badge variant={dep.status === "Resolved" ? "default" : dep.status === "Blocked" ? "destructive" : "secondary"}>
                        {dep.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No dependencies identified.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Risks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {initiative.risks && initiative.risks.length > 0 ? (
                <div className="space-y-3">
                  {initiative.risks.map((risk) => (
                    <div key={risk.id} className="p-3 border border-border rounded-lg">
                      <p className="text-sm mb-2">{risk.description}</p>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          Likelihood: {risk.likelihood}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Impact: {risk.impact}
                        </Badge>
                      </div>
                      {risk.mitigation && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Mitigation: {risk.mitigation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No risks identified.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="artifacts" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Documents & Attachments</CardTitle>
            <Button size="sm">Upload File</Button>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No attachments yet</p>
              <p className="text-xs mt-1">Upload documents, designs, or other supporting files</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="approvals" className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          {initiative.approvals && initiative.approvals.length > 0 ? (
            initiative.approvals.map((approval) => (
              <Card key={approval.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">{approval.type}</CardTitle>
                  <Badge 
                    variant={
                      approval.status === "Approved" ? "default" : 
                      approval.status === "Rejected" ? "destructive" : 
                      "secondary"
                    }
                  >
                    {approval.status}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {approval.approver.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{approval.approver.name}</p>
                      <p className="text-xs text-muted-foreground">{approval.approver.role}</p>
                    </div>
                  </div>
                  
                  {approval.checklist && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Checklist</p>
                      {approval.checklist.map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                          <Checkbox checked={item.completed} disabled />
                          <span className={`text-sm ${item.completed ? "text-muted-foreground line-through" : ""}`}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {approval.status === "Pending" && (
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Send Back
                      </Button>
                      <Button size="sm" variant="destructive" className="flex-1">
                        Reject
                      </Button>
                    </div>
                  )}

                  {approval.reviewedAt && (
                    <p className="text-xs text-muted-foreground">
                      Reviewed on {new Date(approval.reviewedAt).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="lg:col-span-2">
              <CardContent className="text-center py-8 text-muted-foreground">
                <CheckSquare className="h-10 w-10 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No approvals required at this stage</p>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="jira" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Jira Integration</CardTitle>
            {initiative.jiraKey && (
              <Button size="sm" variant="outline" asChild>
                <a href={`https://jira.example.com/browse/${initiative.jiraKey}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in Jira
                </a>
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {initiative.jiraKey ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-3 bg-muted/50 rounded">
                    <p className="text-xs text-muted-foreground">Jira Key</p>
                    <p className="font-mono font-medium">{initiative.jiraKey}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded">
                    <p className="text-xs text-muted-foreground">Sync Status</p>
                    <p className="font-medium text-emerald-600">Connected</p>
                  </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <h4 className="text-sm font-medium mb-3">Linked Issues</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <span className="text-sm font-mono">{initiative.jiraKey}-1</span>
                      <Badge variant="outline">In Progress</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <span className="text-sm font-mono">{initiative.jiraKey}-2</span>
                      <Badge variant="outline">Done</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <span className="text-sm font-mono">{initiative.jiraKey}-3</span>
                      <Badge variant="outline">To Do</Badge>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <GitBranch className="h-10 w-10 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">Not linked to Jira</p>
                <Button size="sm" className="mt-4">Link to Jira</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="dev-status" className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sprint Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Sprint 14 Progress</span>
                  <span className="font-medium">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-muted/50 rounded">
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-xs text-muted-foreground">To Do</p>
                </div>
                <div className="p-3 bg-muted/50 rounded">
                  <p className="text-2xl font-bold text-blue-600">5</p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
                <div className="p-3 bg-muted/50 rounded">
                  <p className="text-2xl font-bold text-emerald-600">12</p>
                  <p className="text-xs text-muted-foreground">Done</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Deployment Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                <div>
                  <p className="text-sm font-medium">Production</p>
                  <p className="text-xs text-muted-foreground">v1.2.3</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800">Stable</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                <div>
                  <p className="text-sm font-medium">Staging</p>
                  <p className="text-xs text-muted-foreground">v1.3.0-beta</p>
                </div>
                <Badge className="bg-amber-100 text-amber-800">Testing</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                <div>
                  <p className="text-sm font-medium">Development</p>
                  <p className="text-xs text-muted-foreground">v1.3.0-dev</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="metrics" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Key Performance Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            {initiative.kpis && initiative.kpis.length > 0 ? (
              <div className="space-y-6">
                {initiative.kpis.map((kpi) => {
                  const baseline = parseFloat(kpi.baseline) || 0;
                  const target = parseFloat(kpi.target) || 100;
                  const current = parseFloat(kpi.current || "0") || 0;
                  const progress = Math.min(100, Math.max(0, ((current - baseline) / (target - baseline)) * 100));
                  
                  return (
                    <div key={kpi.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{kpi.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {kpi.current || kpi.baseline} / {kpi.target} {kpi.unit}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Baseline: {kpi.baseline} {kpi.unit}</span>
                        <span>Target: {kpi.target} {kpi.unit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-10 w-10 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No KPIs defined yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">{initiative.impactScore || "—"}</p>
                <p className="text-sm text-muted-foreground mt-1">Impact Score</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-amber-600">{initiative.effortScore || "—"}</p>
                <p className="text-sm text-muted-foreground mt-1">Effort Score</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

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
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <span className="text-xs font-medium">
                        {activity.user.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{activity.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground py-4">
                  No activity yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
