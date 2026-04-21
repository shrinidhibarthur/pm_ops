import { Badge } from "@/components/ui/badge";
import type { StatusType, RiskLevel, StageType } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<StatusType, string> = {
  "Draft": "bg-muted text-muted-foreground",
  "Pending Approval": "bg-amber-100 text-amber-800",
  "Approved": "bg-blue-100 text-blue-800",
  "In Progress": "bg-emerald-100 text-emerald-800",
  "Blocked": "bg-red-100 text-red-800",
  "On Hold": "bg-orange-100 text-orange-800",
  "Completed": "bg-green-100 text-green-800",
  "Cancelled": "bg-muted text-muted-foreground line-through",
};

const riskStyles: Record<RiskLevel, string> = {
  "Low": "bg-green-100 text-green-800",
  "Medium": "bg-yellow-100 text-yellow-800",
  "High": "bg-orange-100 text-orange-800",
  "Critical": "bg-red-100 text-red-800",
};

const stageStyles: Record<StageType, string> = {
  "Discovery": "bg-slate-100 text-slate-800",
  "Definition": "bg-blue-100 text-blue-800",
  "Design": "bg-violet-100 text-violet-800",
  "Development": "bg-amber-100 text-amber-800",
  "Testing": "bg-orange-100 text-orange-800",
  "Release": "bg-emerald-100 text-emerald-800",
  "Post-Release": "bg-teal-100 text-teal-800",
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant="secondary" className={cn(statusStyles[status], "font-medium", className)}>
      {status}
    </Badge>
  );
}

interface RiskBadgeProps {
  risk: RiskLevel;
  className?: string;
}

export function RiskBadge({ risk, className }: RiskBadgeProps) {
  return (
    <Badge variant="secondary" className={cn(riskStyles[risk], "font-medium", className)}>
      {risk}
    </Badge>
  );
}

interface StageBadgeProps {
  stage: StageType;
  className?: string;
}

export function StageBadge({ stage, className }: StageBadgeProps) {
  return (
    <Badge variant="secondary" className={cn(stageStyles[stage], "font-medium", className)}>
      {stage}
    </Badge>
  );
}
