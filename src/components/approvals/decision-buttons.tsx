"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export function ApprovalDecisionButtons({ taskId }: { taskId: string }) {
  const [loading, setLoading] = React.useState<"APPROVED" | "REJECTED" | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function decide(decision: "APPROVED" | "REJECTED") {
    setLoading(decision);
    setError(null);
    const res = await fetch(`/api/approvals/${taskId}/decision`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ decision }),
    });
    const json = await res.json();
    setLoading(null);
    if (!json.ok) {
      setError(json.error?.message ?? "Decision failed.");
      return;
    }
    window.location.reload();
  }

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" onClick={() => void decide("APPROVED")} disabled={loading !== null}>
        {loading === "APPROVED" ? "Approving…" : "Approve"}
      </Button>
      <Button size="sm" variant="outline" onClick={() => void decide("REJECTED")} disabled={loading !== null}>
        {loading === "REJECTED" ? "Rejecting…" : "Reject"}
      </Button>
      {error ? <div className="ml-2 text-xs text-red-600">{error}</div> : null}
    </div>
  );
}

