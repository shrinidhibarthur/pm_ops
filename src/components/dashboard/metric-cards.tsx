import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, Play, PauseCircle, CheckCircle2, XCircle, Clock } from "lucide-react";

interface MetricCardsProps {
  metrics: {
    total: number;
    active: number;
    onHold: number;
    completed: number;
    cancelled: number;
    pendingApproval: number;
  };
}

const metricConfig = [
  { key: "total" as const, label: "Total Initiatives", icon: FolderKanban, color: "text-foreground" },
  { key: "active" as const, label: "Active", icon: Play, color: "text-emerald-600" },
  { key: "pendingApproval" as const, label: "Pending Approval", icon: Clock, color: "text-amber-600" },
  { key: "onHold" as const, label: "On Hold", icon: PauseCircle, color: "text-orange-600" },
  { key: "completed" as const, label: "Completed", icon: CheckCircle2, color: "text-blue-600" },
  { key: "cancelled" as const, label: "Cancelled", icon: XCircle, color: "text-red-500" },
];

export function MetricCards({ metrics }: MetricCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {metricConfig.map((config) => {
        const Icon = config.icon;
        return (
          <Card key={config.key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{config.label}</CardTitle>
              <Icon className={`h-4 w-4 ${config.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${config.color}`}>{metrics[config.key]}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
