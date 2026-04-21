import type { StageType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const stages: StageType[] = [
  "Discovery",
  "Definition",
  "Design",
  "Development",
  "Testing",
  "Release",
  "Post-Release",
];

const stageColors: Record<StageType, string> = {
  "Discovery": "bg-slate-500",
  "Definition": "bg-blue-500",
  "Design": "bg-violet-500",
  "Development": "bg-amber-500",
  "Testing": "bg-orange-500",
  "Release": "bg-emerald-500",
  "Post-Release": "bg-teal-500",
};

interface WorkflowTimelineProps {
  currentStage: StageType;
}

export function WorkflowTimeline({ currentStage }: WorkflowTimelineProps) {
  const currentIndex = stages.indexOf(currentStage);

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={stage} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors",
                    isCompleted
                      ? `${stageColors[stage]} text-white`
                      : isCurrent
                      ? `${stageColors[stage]} text-white ring-4 ring-offset-2 ring-offset-card`
                      : "bg-muted text-muted-foreground"
                  )}
                  style={isCurrent ? { 
                    boxShadow: `0 0 0 4px var(--card), 0 0 0 6px ${stageColors[stage].replace('bg-', 'rgb(var(--')})` 
                  } : undefined}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium",
                    isCurrent ? "text-foreground" : isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {stage}
                </span>
              </div>
              {index < stages.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-2 transition-colors",
                    index < currentIndex ? stageColors[stages[index + 1]] : "bg-muted"
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
