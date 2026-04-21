"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

type GateCheck = {
  key: string;
  label: string;
  status: "PASS" | "FAIL";
  details?: string;
};

type GateSummary = {
  stageKey: string;
  checks: GateCheck[];
  canAdvance: boolean;
};

export function GatesPanel({ initiativeId }: { initiativeId: string }) {
  const [data, setData] = React.useState<GateSummary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/initiatives/${initiativeId}/gates`, { cache: "no-store" });
    const json = await res.json();
    setLoading(false);
    if (!json.ok) {
      setError(json.error?.message ?? "Failed to load gates.");
      return;
    }
    setData(json.data);
  }

  React.useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initiativeId]);

  if (loading) return <div className="text-sm text-zinc-600 dark:text-zinc-400">Loading gates…</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (!data) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Current stage gates</div>
        <Badge variant={data.canAdvance ? "success" : "warning"}>{data.canAdvance ? "Clear" : "Blocked"}</Badge>
      </div>
      <div className="space-y-2">
        {data.checks.map((c) => (
          <div
            key={c.key}
            className={cn(
              "rounded-md border px-3 py-2 text-sm",
              c.status === "PASS"
                ? "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950 dark:text-emerald-50"
                : "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950 dark:text-amber-50",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 truncate font-medium">{c.label}</div>
              <div className="shrink-0 text-xs">{c.status}</div>
            </div>
            {c.details ? <div className="mt-1 text-xs opacity-90">{c.details}</div> : null}
          </div>
        ))}
      </div>
      <button
        className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:hover:bg-zinc-950"
        onClick={() => void load()}
      >
        Refresh
      </button>
    </div>
  );
}

