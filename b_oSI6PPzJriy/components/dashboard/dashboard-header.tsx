"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Download } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Executive Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of all product initiatives</p>
      </div>
      <div className="flex items-center gap-3">
        <Select defaultValue="Q2-2024">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Quarter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Q1-2024">Q1 2024</SelectItem>
            <SelectItem value="Q2-2024">Q2 2024</SelectItem>
            <SelectItem value="Q3-2024">Q3 2024</SelectItem>
            <SelectItem value="Q4-2024">Q4 2024</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
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
