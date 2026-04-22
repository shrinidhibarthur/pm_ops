import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Bug, Zap } from "lucide-react";
import type { JiraReviewData, JiraProjectData } from "@/server/reviews/types";

interface JiraSnapshotProps {
  data: JiraReviewData;
}

function ProjectCard({ project }: { project: JiraProjectData }) {
  const sprint = project.activeSprint ?? project.recentSprints[0];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <span>{project.projectKey}</span>
          {project.velocity > 0 && (
            <Badge variant="secondary" className="gap-1 text-xs">
              <Zap className="h-3 w-3" />
              {project.velocity} pts/sprint
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sprint && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium truncate max-w-[200px]">{sprint.name}</span>
              <span className="text-muted-foreground text-xs shrink-0 ml-2">
                {sprint.completedIssues}/{sprint.totalIssues} issues
              </span>
            </div>
            <Progress value={sprint.completionPct} className="h-2" />
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-medium ${
                  sprint.state === "active" ? "text-blue-600" : "text-muted-foreground"
                }`}
              >
                {sprint.state === "active" ? "Active" : "Completed"}
              </span>
              <span className="text-xs font-bold">{sprint.completionPct}%</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-muted/50 rounded-md">
            <p className="text-lg font-bold">{project.issueCounts.total}</p>
            <p className="text-xs text-muted-foreground">Open</p>
          </div>
          <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-md">
            <p className="text-lg font-bold text-red-600 flex items-center justify-center gap-1">
              <Bug className="h-4 w-4" />
              {project.issueCounts.bug}
            </p>
            <p className="text-xs text-muted-foreground">Bugs</p>
          </div>
          <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-md">
            <p className="text-lg font-bold text-amber-600">{project.blockers.length}</p>
            <p className="text-xs text-muted-foreground">Blockers</p>
          </div>
        </div>

        {project.blockers.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-amber-500" />
              Blockers
            </p>
            {project.blockers.slice(0, 3).map((b) => (
              <div key={b.key} className="flex items-start gap-2 text-xs p-2 bg-amber-50/50 dark:bg-amber-950/20 rounded">
                <span className="font-mono text-amber-700 dark:text-amber-400 shrink-0">{b.key}</span>
                <span className="text-foreground line-clamp-2">{b.summary}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function JiraSnapshot({ data }: JiraSnapshotProps) {
  if (data.error && data.projects.length === 0) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 p-4 text-sm text-amber-800 dark:text-amber-300">
        <p className="font-medium">Jira data unavailable</p>
        <p className="text-xs mt-1 text-amber-700 dark:text-amber-400">{data.error}</p>
      </div>
    );
  }

  if (data.projects.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">No Jira projects found.</p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {data.projects.map((p) => (
        <ProjectCard key={p.projectKey} project={p} />
      ))}
    </div>
  );
}
