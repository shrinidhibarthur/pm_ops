import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Initiative } from "@/lib/types";
import { TrendingUp, Target, Zap } from "lucide-react";

interface KpiSectionProps {
  initiatives: Initiative[];
}

export function KpiSection({ initiatives }: KpiSectionProps) {
  const completedCount = initiatives.filter(
    (i) => i.status === "Completed" || i.stage === "Post-Release"
  ).length;
  const completionRate = Math.round((completedCount / initiatives.length) * 100);

  const avgImpactScore = Math.round(
    initiatives
      .filter((i) => i.impactScore)
      .reduce((acc, i) => acc + (i.impactScore || 0), 0) /
      initiatives.filter((i) => i.impactScore).length
  );

  const onTrackCount = initiatives.filter(
    (i) => i.status !== "Blocked" && i.status !== "On Hold" && i.status !== "Cancelled"
  ).length;
  const onTrackRate = Math.round((onTrackCount / initiatives.length) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Key Performance Indicators</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium">Initiative Completion Rate</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-600">{completionRate}%</span>
              <span className="text-sm text-muted-foreground">
                ({completedCount} of {initiatives.length})
              </span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Average Impact Score</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-blue-600">{avgImpactScore}</span>
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
            <Progress value={avgImpactScore} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium">On-Track Rate</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-amber-600">{onTrackRate}%</span>
              <span className="text-sm text-muted-foreground">
                ({onTrackCount} initiatives)
              </span>
            </div>
            <Progress value={onTrackRate} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
