"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge, RiskBadge, StageBadge } from "@/components/status-badge";
import type { Initiative } from "@/lib/types";
import { ChevronLeft, Edit, MoreHorizontal, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InitiativeDetailHeaderProps {
  initiative: Initiative;
}

export function InitiativeDetailHeader({ initiative }: InitiativeDetailHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm">
        <Link href="/initiatives" className="text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back to Initiatives
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground font-medium">{initiative.id}</span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-foreground">{initiative.title}</h1>
            <StatusBadge status={initiative.status} />
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Owner:</span>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-xs font-medium">
                    {initiative.owner.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <span className="font-medium">{initiative.owner.name}</span>
              </div>
            </div>
            <span className="text-muted-foreground">|</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Workstream:</span>
              <span className="font-medium">{initiative.workstream}</span>
            </div>
            <span className="text-muted-foreground">|</span>
            <StageBadge stage={initiative.stage} />
            <span className="text-muted-foreground">|</span>
            <RiskBadge risk={initiative.risk} />
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Target: {new Date(initiative.targetDate).toLocaleDateString("en-US", { 
              month: "long", 
              day: "numeric",
              year: "numeric"
            })}</span>
            <span>|</span>
            <span>{initiative.quarter} {initiative.year}</span>
            <span>|</span>
            <span>Priority: P{initiative.priority}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {initiative.jiraKey && (
            <Button variant="outline" size="sm" asChild>
              <a href={`https://jira.example.com/browse/${initiative.jiraKey}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                {initiative.jiraKey}
              </a>
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Archive</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
