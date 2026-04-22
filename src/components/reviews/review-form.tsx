"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FileText, Loader2 } from "lucide-react";

type ReviewType = "WBR" | "MBR" | "QBR";

const TYPE_CONFIG: Record<ReviewType, { label: string; description: string; days: number }> = {
  WBR: { label: "Weekly Business Review", description: "Last 7 days", days: 7 },
  MBR: { label: "Monthly Business Review", description: "Last 30 days", days: 30 },
  QBR: { label: "Quarterly Business Review", description: "Last 90 days", days: 90 },
};

function defaultRange(days: number): { start: string; end: string } {
  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  return { start: fmt(start), end: fmt(end) };
}

export function ReviewForm() {
  const router = useRouter();
  const [type, setType] = useState<ReviewType>("WBR");
  const [dateStart, setDateStart] = useState(defaultRange(7).start);
  const [dateEnd, setDateEnd] = useState(defaultRange(7).end);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTypeChange = (t: ReviewType) => {
    setType(t);
    const range = defaultRange(TYPE_CONFIG[t].days);
    setDateStart(range.start);
    setDateEnd(range.end);
  };

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type,
          dateStart: new Date(dateStart + "T00:00:00Z").toISOString(),
          dateEnd: new Date(dateEnd + "T23:59:59Z").toISOString(),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.message ?? "Failed to create review.");
        return;
      }
      router.push(`/reviews/${json.data.id}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Review Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {(Object.keys(TYPE_CONFIG) as ReviewType[]).map((t) => (
              <button
                key={t}
                onClick={() => handleTypeChange(t)}
                className={cn(
                  "flex flex-col items-center gap-1 p-4 rounded-lg border-2 text-center transition-colors",
                  type === t
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                )}
              >
                <FileText className="h-5 w-5" />
                <span className="text-sm font-semibold">{t}</span>
                <span className="text-xs">{TYPE_CONFIG[t].description}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dateStart">Start Date</Label>
              <Input
                id="dateStart"
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                max={dateEnd}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateEnd">End Date</Label>
              <Input
                id="dateEnd"
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                min={dateStart}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Prior period (for delta calculations) will be the same-length window immediately before this range.
          </p>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 p-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={submitting || !dateStart || !dateEnd}
        className="w-full sm:w-auto"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating review...
          </>
        ) : (
          <>
            <FileText className="h-4 w-4 mr-2" />
            Generate {TYPE_CONFIG[type].label}
          </>
        )}
      </Button>

      {submitting && (
        <p className="text-xs text-muted-foreground">
          Fetching live data from Jira and Adobe Analytics, then drafting narrative with Claude. This takes 15–30 seconds.
        </p>
      )}
    </div>
  );
}
