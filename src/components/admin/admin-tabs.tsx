"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface WorkflowConfig {
  id: string;
  key: string;
  name: string;
  version: number;
  status: string;
  team: { name: string } | null;
  stages: unknown;
}

interface StageTemplate {
  id: string;
  key: string;
  name: string;
  description: string | null;
}

interface ApprovalMatrix {
  id: string;
  key: string;
  name: string;
  team: { name: string } | null;
}

interface JiraMapping {
  id: string;
  projectKey: string;
  provider: string;
  epicIssueType: string;
  storyIssueType: string;
  team: { name: string };
}

interface ReportTemplate {
  id: string;
  key: string;
  name: string;
  type: string;
}

interface AdminTabsProps {
  workflows: WorkflowConfig[];
  stages: StageTemplate[];
  approvalMatrices: ApprovalMatrix[];
  jiraMappings: JiraMapping[];
  reportTemplates: ReportTemplate[];
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  ACTIVE: "bg-emerald-100 text-emerald-800",
  ARCHIVED: "bg-zinc-100 text-zinc-600",
};

export function AdminTabs({
  workflows,
  stages,
  approvalMatrices,
  jiraMappings,
  reportTemplates,
}: AdminTabsProps) {
  return (
    <Tabs defaultValue="workflows">
      <TabsList className="mb-4">
        <TabsTrigger value="workflows">Workflows</TabsTrigger>
        <TabsTrigger value="stages">Stage Templates</TabsTrigger>
        <TabsTrigger value="approvals">Approval Matrix</TabsTrigger>
        <TabsTrigger value="jira">Jira Mappings</TabsTrigger>
        <TabsTrigger value="templates">Report Templates</TabsTrigger>
      </TabsList>

      <TabsContent value="workflows">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Workflow Configs ({workflows.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {workflows.length === 0 ? (
              <p className="px-6 py-8 text-sm text-muted-foreground">No workflow configs yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Key</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workflows.map((w) => (
                    <TableRow key={w.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{w.key}</TableCell>
                      <TableCell className="font-medium">{w.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{w.team?.name ?? "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">v{w.version}</TableCell>
                      <TableCell>
                        <Badge className={STATUS_COLORS[w.status] ?? ""}>{w.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="stages">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Stage Templates ({stages.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {stages.length === 0 ? (
              <p className="px-6 py-8 text-sm text-muted-foreground">No stage templates yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Key</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stages.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{s.key}</TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{s.description ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="approvals">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Approval Matrix ({approvalMatrices.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {approvalMatrices.length === 0 ? (
              <p className="px-6 py-8 text-sm text-muted-foreground">No approval matrices configured.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Key</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Team</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvalMatrices.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{a.key}</TableCell>
                      <TableCell className="font-medium">{a.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{a.team?.name ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="jira">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Jira Mappings ({jiraMappings.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {jiraMappings.length === 0 ? (
              <p className="px-6 py-8 text-sm text-muted-foreground">No Jira mappings configured.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Team</TableHead>
                    <TableHead>Project Key</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Epic Type</TableHead>
                    <TableHead>Story Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jiraMappings.map((j) => (
                    <TableRow key={j.id}>
                      <TableCell className="font-medium">{j.team.name}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{j.projectKey}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{j.provider}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{j.epicIssueType}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{j.storyIssueType}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="templates">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Report Templates ({reportTemplates.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {reportTemplates.length === 0 ? (
              <p className="px-6 py-8 text-sm text-muted-foreground">No report templates yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Key</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportTemplates.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{t.key}</TableCell>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{t.type}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
