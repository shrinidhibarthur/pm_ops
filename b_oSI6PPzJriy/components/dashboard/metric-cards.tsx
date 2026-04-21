import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FolderKanban, 
  Play, 
  AlertOctagon, 
  Clock, 
  Code2, 
  Rocket 
} from "lucide-react";

interface MetricCardsProps {
  metrics: {
    total: number;
    inProgress: number;
    blocked: number;
    pendingApproval: number;
    inDevelopment: number;
    released: number;
  };
}

const metricConfig = [
  { key: "total", label: "Total Initiatives", icon: FolderKanban, color: "text-foreground" },
  { key: "inProgress", label: "In Progress", icon: Play, color: "text-emerald-600" },
  { key: "blocked", label: "Blocked", icon: AlertOctagon, color: "text-red-600" },
  { key: "pendingApproval", label: "Awaiting Approval", icon: Clock, color: "text-amber-600" },
  { key: "inDevelopment", label: "In Development", icon: Code2, color: "text-blue-600" },
  { key: "released", label: "Released", icon: Rocket, color: "text-teal-600" },
] as const;

export function MetricCards({ metrics }: MetricCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {metricConfig.map((config) => {
        const Icon = config.icon;
        return (
          <Card key={config.key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {config.label}
              </CardTitle>
              <Icon className={`h-4 w-4 ${config.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${config.color}`}>
                {metrics[config.key]}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
