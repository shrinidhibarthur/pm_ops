import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800",
  ON_HOLD: "bg-orange-100 text-orange-800",
  CANCELLED: "bg-muted text-muted-foreground line-through",
  COMPLETED: "bg-green-100 text-green-800",
  "In Progress": "bg-emerald-100 text-emerald-800",
  Blocked: "bg-red-100 text-red-800",
  "On Hold": "bg-orange-100 text-orange-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-muted text-muted-foreground line-through",
};

const stageStateStyles: Record<string, string> = {
  NOT_STARTED: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  BLOCKED: "bg-red-100 text-red-800",
  COMPLETE: "bg-emerald-100 text-emerald-800",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = statusStyles[status] ?? "bg-muted text-muted-foreground";
  return (
    <Badge variant="secondary" className={cn(style, "font-medium", className)}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function StageStateBadge({ status, className }: StatusBadgeProps) {
  const style = stageStateStyles[status] ?? "bg-muted text-muted-foreground";
  return (
    <Badge variant="secondary" className={cn(style, "font-medium", className)}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function StageBadge({ stage, className }: { stage: string; className?: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium capitalize", className)}>
      {stage.replace(/-/g, " ")}
    </Badge>
  );
}
