"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export function AdvanceStageButton({ initiativeId }: { initiativeId: string }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onAdvance() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/initiatives/${initiativeId}/stage/advance`, { method: "POST" });
    const json = await res.json();
    setLoading(false);
    if (!json.ok) {
      setError(json.error?.message ?? "Advance failed.");
      return;
    }
    window.location.reload();
  }

  return (
    <div className="space-y-2">
      <Button onClick={() => void onAdvance()} disabled={loading}>
        {loading ? "Advancing…" : "Advance stage"}
      </Button>
      {error ? <div className="text-xs text-red-600">{error}</div> : null}
    </div>
  );
}

