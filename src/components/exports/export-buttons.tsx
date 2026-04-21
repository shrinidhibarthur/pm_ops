"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export function ExportButtons({ initiativeId }: { initiativeId: string }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function exportCsv() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/exports", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reportType: "INITIATIVE_SUMMARY", format: "CSV", initiativeId }),
    });
    const json = await res.json();
    setLoading(false);
    if (!json.ok) {
      setError(json.error?.message ?? "Export failed.");
      return;
    }
    const url = json.data.resultUrl as string | null;
    if (url) window.open(url, "_blank");
  }

  return (
    <div className="space-y-2">
      <Button size="sm" variant="outline" onClick={() => void exportCsv()} disabled={loading}>
        {loading ? "Exporting…" : "Export initiative CSV"}
      </Button>
      {error ? <div className="text-xs text-red-600">{error}</div> : null}
      <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
        PDF/DOCX export is scaffolded via templates/jobs next.
      </div>
    </div>
  );
}

