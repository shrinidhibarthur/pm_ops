import { cn } from "@/lib/utils";
import { Check, Clock, AlertTriangle } from "lucide-react";

interface StageState {
  id: string;
  stageKey: string;
  ordinal: number;
  status: string;
  startedAt: Date | null;
  completedAt: Date | null;
}

interface WorkflowTimelineProps {
  stageStates: StageState[];
  currentStageKey: string;
}

const statusColors: Record<string, string> = {
  COMPLETE: "bg-emerald-500",
  IN_PROGRESS: "bg-blue-500",
  BLOCKED: "bg-red-500",
  NOT_STARTED: "bg-muted",
};

const statusRingColors: Record<string, string> = {
  COMPLETE: "ring-emerald-500",
  IN_PROGRESS: "ring-blue-500",
  BLOCKED: "ring-red-500",
  NOT_STARTED: "ring-border",
};

export function WorkflowTimeline({ stageStates, currentStageKey }: WorkflowTimelineProps) {
  if (stageStates.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-4 overflow-x-auto">
      <div className="flex items-start min-w-max">
        {stageStates.map((stage, index) => {
          const isCompleted = stage.status === "COMPLETE";
          const isCurrent = stage.stageKey === currentStageKey;
          const isBlocked = stage.status === "BLOCKED";
          const colorClass = statusColors[stage.status] ?? "bg-muted";
          const ringClass = statusRingColors[stage.status] ?? "ring-border";

          return (
            <div key={stage.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors",
                    colorClass,
                    isCompleted || isCurrent || isBlocked ? "text-white" : "text-muted-foreground",
                    isCurrent && `ring-4 ring-offset-2 ring-offset-card ${ringClass}`
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : isBlocked ? (
                    <AlertTriangle className="h-3 w-3" />
                  ) : isCurrent ? (
                    <Clock className="h-3 w-3" />
                  ) : (
                    stage.ordinal
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium max-w-[80px] text-center",
                    isCurrent ? "text-foreground" : isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {stage.stageKey}
                </span>
                {stage.completedAt && (
                  <span className="text-xs text-muted-foreground mt-0.5">
                    {stage.completedAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                )}
              </div>
              {index < stageStates.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-12 mx-2 mt-[-1.5rem] transition-colors",
                    stage.status === "COMPLETE" ? "bg-emerald-500" : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
