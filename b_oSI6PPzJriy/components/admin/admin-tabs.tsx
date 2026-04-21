"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WorkflowStage, NotificationRule, ApprovalMatrix, JiraMapping } from "@/lib/types";
import { 
  Workflow, 
  CheckSquare, 
  Users, 
  GitBranch, 
  Bell,
  Plus,
  Edit,
  Trash2,
  GripVertical,
  ArrowRight
} from "lucide-react";

interface AdminTabsProps {
  workflowStages: WorkflowStage[];
  notificationRules: NotificationRule[];
  approvalMatrix: ApprovalMatrix[];
  jiraMappings: JiraMapping[];
  checklistTemplates: Array<{ id: string; name: string; items: string[] }>;
}

export function AdminTabs({
  workflowStages,
  notificationRules,
  approvalMatrix,
  jiraMappings,
  checklistTemplates,
}: AdminTabsProps) {
  return (
    <Tabs defaultValue="workflow" className="space-y-6">
      <TabsList className="bg-muted/50">
        <TabsTrigger value="workflow" className="gap-2">
          <Workflow className="h-4 w-4" />
          Workflow Stages
        </TabsTrigger>
        <TabsTrigger value="checklists" className="gap-2">
          <CheckSquare className="h-4 w-4" />
          Checklists
        </TabsTrigger>
        <TabsTrigger value="approvals" className="gap-2">
          <Users className="h-4 w-4" />
          Approval Matrix
        </TabsTrigger>
        <TabsTrigger value="jira" className="gap-2">
          <GitBranch className="h-4 w-4" />
          Jira Mappings
        </TabsTrigger>
        <TabsTrigger value="notifications" className="gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </TabsTrigger>
      </TabsList>

      <TabsContent value="workflow" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Workflow Stages</CardTitle>
              <CardDescription>Configure the stages in your initiative lifecycle</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Stage
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {workflowStages.map((stage) => (
                <div
                  key={stage.id}
                  className="flex items-center gap-4 p-4 border border-border rounded-lg bg-card hover:bg-muted/30 transition-colors"
                >
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{stage.name}</p>
                    <p className="text-xs text-muted-foreground">Order: {stage.order}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {stage.requiredApprovals.length > 0 ? (
                      stage.requiredApprovals.map((approval, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {approval}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No approvals required</span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="checklists" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Checklist Templates</CardTitle>
              <CardDescription>Define reusable checklists for approvals</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Template
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-2">
              {checklistTemplates.map((template) => (
                <Card key={template.id} className="bg-muted/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-1">
                      {template.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="approvals" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Approval Matrix</CardTitle>
              <CardDescription>Define who can approve at each stage</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stage</TableHead>
                  <TableHead>Approver Roles</TableHead>
                  <TableHead>Required Approvals</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvalMatrix.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.stage}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {rule.approverRoles.map((role, i) => (
                          <Badge key={i} variant="outline">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{rule.requiredCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="jira" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Jira Field Mappings</CardTitle>
              <CardDescription>Configure how initiative fields sync with Jira</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Mapping
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Initiative Field</TableHead>
                  <TableHead></TableHead>
                  <TableHead>Jira Field</TableHead>
                  <TableHead>Sync Direction</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jiraMappings.map((mapping) => (
                  <TableRow key={mapping.id}>
                    <TableCell>
                      <code className="px-2 py-1 bg-muted rounded text-sm">{mapping.initiativeField}</code>
                    </TableCell>
                    <TableCell>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell>
                      <code className="px-2 py-1 bg-muted rounded text-sm">{mapping.jiraField}</code>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue={mapping.syncDirection}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="push">Push</SelectItem>
                          <SelectItem value="pull">Pull</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Jira Connection Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Jira URL</label>
                <Input placeholder="https://your-company.atlassian.net" defaultValue="https://company.atlassian.net" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Default Project</label>
                <Input placeholder="PROJECT" defaultValue="PLAT" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Connection Status</p>
                <p className="text-xs text-muted-foreground">Last synced 5 minutes ago</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800">Connected</Badge>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Notification Rules</CardTitle>
              <CardDescription>Configure when and who receives notifications</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notificationRules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Bell className={`h-5 w-5 ${rule.enabled ? "text-blue-600" : "text-muted-foreground"}`} />
                      <div>
                        <p className="font-medium">{rule.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Trigger: <code className="bg-muted px-1 rounded">{rule.trigger}</code>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-wrap gap-1">
                      {rule.recipients.map((recipient, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {recipient}
                        </Badge>
                      ))}
                    </div>
                    <Switch checked={rule.enabled} />
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
