import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MetricTable } from "./metric-table";
import { JiraSnapshot } from "./jira-snapshot";
import { NarrativeSection, VarianceNotes, ActionsEditor } from "./narrative-section";
import type { JiraReviewData, AnalyticsReviewData, ReviewNarrative, ReviewAction } from "@/server/reviews/types";

interface ReviewDocumentProps {
  review: {
    id: string;
    type: string;
    dateStart: Date;
    dateEnd: Date;
    generatedAt: Date | null;
    jiraData: JiraReviewData | null;
    analyticsData: AnalyticsReviewData | null;
    narrative: ReviewNarrative | null;
    actions: { items: ReviewAction[] } | null;
  };
}

const TYPE_LABELS: Record<string, string> = {
  WBR: "Weekly Business Review",
  MBR: "Monthly Business Review",
  QBR: "Quarterly Business Review",
};

const TYPE_COLORS: Record<string, string> = {
  WBR: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  MBR: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  QBR: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
};

function fmt(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function ReviewDocument({ review }: ReviewDocumentProps) {
  const jiraData = review.jiraData;
  const analyticsData = review.analyticsData;
  const narrative = review.narrative;
  const actions = review.actions?.items ?? [];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Badge className={TYPE_COLORS[review.type]}>{review.type}</Badge>
            <h2 className="text-xl font-semibold text-foreground">
              {TYPE_LABELS[review.type] ?? review.type}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {fmt(review.dateStart)} – {fmt(review.dateEnd)}
          </p>
        </div>
        {review.generatedAt && (
          <p className="text-xs text-muted-foreground">
            Generated {review.generatedAt.toLocaleString()}
          </p>
        )}
      </div>

      <Separator />

      {/* Narrative */}
      {narrative && (
        <section>
          <h3 className="text-base font-semibold mb-4 text-foreground">Overview</h3>
          <NarrativeSection narrative={narrative} />
        </section>
      )}

      {/* Metrics */}
      <section>
        <h3 className="text-base font-semibold mb-4 text-foreground">
          Metrics
          {analyticsData?.dateRange && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {analyticsData.dateRange.start} vs {analyticsData.priorDateRange.start}
            </span>
          )}
        </h3>
        {analyticsData?.error && analyticsData.metrics.length === 0 ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 p-4 text-sm text-amber-800 dark:text-amber-300">
            <p className="font-medium">Analytics data unavailable</p>
            <p className="text-xs mt-1 text-amber-700 dark:text-amber-400">{analyticsData.error}</p>
          </div>
        ) : (
          <MetricTable metrics={analyticsData?.metrics ?? []} />
        )}
      </section>

      {/* Variance Notes */}
      {narrative && Object.keys(narrative.varianceNotes).length > 0 && (
        <section>
          <VarianceNotes notes={narrative.varianceNotes} />
        </section>
      )}

      {/* Jira */}
      {jiraData && (
        <section>
          <h3 className="text-base font-semibold mb-4 text-foreground">Engineering Snapshot</h3>
          <JiraSnapshot data={jiraData} />
        </section>
      )}

      <Separator />

      {/* Actions */}
      <section>
        <h3 className="text-base font-semibold mb-4 text-foreground">Action Items</h3>
        <ActionsEditor reviewId={review.id} initialActions={actions} />
      </section>
    </div>
  );
}
