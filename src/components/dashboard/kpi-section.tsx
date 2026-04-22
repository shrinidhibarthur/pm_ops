import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Zap } from "lucide-react";

interface KpiSectionProps {
  total: number;
  active: number;
  completed: number;
  pendingApproval: number;
}

export function KpiSection({ total, active, completed, pendingApproval }: KpiSectionProps) {
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const activeRate = total > 0 ? Math.round((active / total) * 100) : 0;
  const approvalRate = total > 0 ? Math.round((pendingApproval / total) * 100) : 0;

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
              <span className="text-sm font-medium">Completion Rate</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-600">{completionRate}%</span>
              <span className="text-sm text-muted-foreground">({completed} of {total})</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Active Rate</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-blue-600">{activeRate}%</span>
              <span className="text-sm text-muted-foreground">({active} active)</span>
            </div>
            <Progress value={activeRate} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium">Awaiting Approval</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-amber-600">{approvalRate}%</span>
              <span className="text-sm text-muted-foreground">({pendingApproval} pending)</span>
            </div>
            <Progress value={approvalRate} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
