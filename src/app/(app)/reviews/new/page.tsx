import { ReviewForm } from "@/components/reviews/review-form";

export default function NewReviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">New Business Review</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Select a review type and date range. Live data will be pulled from Jira and Adobe Analytics,
          and Claude will draft the narrative sections.
        </p>
      </div>
      <ReviewForm />
    </div>
  );
}
