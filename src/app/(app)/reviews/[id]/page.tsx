"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReviewDocument } from "@/components/reviews/review-document";
import { ChevronLeft, Loader2, XCircle, RefreshCw } from "lucide-react";
import type { JiraReviewData, AnalyticsReviewData, ReviewNarrative, ReviewAction } from "@/server/reviews/types";

interface Review {
  id: string;
  type: string;
  dateStart: string;
  dateEnd: string;
  status: "PENDING" | "RUNNING" | "COMPLETE" | "FAILED";
  generatedAt: string | null;
  error: string | null;
  jiraData: JiraReviewData | null;
  analyticsData: AnalyticsReviewData | null;
  narrative: ReviewNarrative | null;
  actions: { items: ReviewAction[] } | null;
}

function StatusMessage({ status, error }: { status: string; error: string | null }) {
  if (status === "COMPLETE") return null;

  const isRunning = status === "PENDING" || status === "RUNNING";

  return (
    <div
      className={`flex flex-col items-center gap-4 py-20 ${
        isRunning ? "text-muted-foreground" : "text-red-600"
      }`}
    >
      {isRunning ? (
        <>
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="text-center">
            <p className="font-medium text-foreground">Generating your business review…</p>
            <p className="text-sm text-muted-foreground mt-1">
              Fetching data from Jira and Adobe Analytics, then drafting narrative with Claude.
              This takes 15–30 seconds.
            </p>
          </div>
        </>
      ) : (
        <>
          <XCircle className="h-10 w-10 text-red-500" />
          <div className="text-center">
            <p className="font-medium text-foreground">Review generation failed</p>
            {error && (
              <p className="text-sm text-muted-foreground mt-1 max-w-md">{error}</p>
            )}
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/reviews/new">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}

export default function ReviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [review, setReview] = useState<Review | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const fetch_ = async () => {
      const res = await fetch(`/api/reviews/${id}`);
      if (res.status === 404) { setNotFound(true); return; }
      if (!res.ok) return;
      const json = await res.json();
      const r = json.data.review as Review;
      setReview(r);
      // Stop polling once terminal
      if (r.status === "COMPLETE" || r.status === "FAILED") {
        clearInterval(interval);
      }
    };

    void fetch_();
    // Poll every 3 seconds while pending/running
    interval = setInterval(() => {
      if (review?.status === "COMPLETE" || review?.status === "FAILED") {
        clearInterval(interval);
        return;
      }
      void fetch_();
    }, 3000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (notFound) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-muted-foreground">Review not found.</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href="/reviews">Back to reviews</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/reviews"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Reviews
        </Link>
        {review && (
          <>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">
              {review.type} · {new Date(review.dateStart).toLocaleDateString()}
            </span>
          </>
        )}
      </div>

      {!review ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : review.status !== "COMPLETE" ? (
        <StatusMessage status={review.status} error={review.error} />
      ) : (
        <ReviewDocument
          review={{
            ...review,
            dateStart: new Date(review.dateStart),
            dateEnd: new Date(review.dateEnd),
            generatedAt: review.generatedAt ? new Date(review.generatedAt) : null,
          }}
        />
      )}
    </div>
  );
}
