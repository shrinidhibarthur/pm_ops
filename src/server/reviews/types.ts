export type ReviewType = "WBR" | "MBR" | "QBR";

export interface ReviewMetric {
  key: string;
  name: string;
  current: number;
  prior: number;
  delta: number;
  deltaPct: number;
  unit: "number" | "currency" | "percent";
}

export interface SprintSummary {
  id: number;
  name: string;
  state: "active" | "closed" | "future";
  startDate?: string;
  endDate?: string;
  completedIssues: number;
  totalIssues: number;
  completionPct: number;
  storyPointsDone?: number;
}

export interface JiraProjectData {
  projectKey: string;
  activeSprint?: SprintSummary;
  recentSprints: SprintSummary[];
  issueCounts: {
    bug: number;
    story: number;
    task: number;
    total: number;
    inProgress: number;
    done: number;
    toDo: number;
  };
  blockers: Array<{ key: string; summary: string; priority: string }>;
  velocity: number;
}

export interface JiraReviewData {
  fetchedAt: string;
  projects: JiraProjectData[];
  error?: string;
}

export interface AnalyticsReviewData {
  fetchedAt: string;
  dateRange: { start: string; end: string };
  priorDateRange: { start: string; end: string };
  metrics: ReviewMetric[];
  error?: string;
}

export interface ReviewNarrative {
  summary: string;
  highlights: string[];
  lowlights: string[];
  varianceNotes: Record<string, string>;
  suggestedActions: string[];
}

export interface ReviewAction {
  id: string;
  text: string;
  owner?: string;
  dueDate?: string;
  done: boolean;
}

export interface ReviewActions {
  items: ReviewAction[];
}
