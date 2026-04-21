"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Download, Upload } from "lucide-react";

export function InitiativeHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Initiatives</h1>
        <p className="text-sm text-muted-foreground">
          Manage and track all product initiatives
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button asChild>
          <Link href="/initiatives/create">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Initiative
          </Link>
        </Button>
      </div>
    </div>
  );
}
