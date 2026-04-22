"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Executive Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of all product initiatives</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}
