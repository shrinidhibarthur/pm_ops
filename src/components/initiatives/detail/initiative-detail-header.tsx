"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge, StageBadge } from "@/components/status-badge";
import { ChevronLeft, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InitiativeDetailHeaderProps {
  initiative: {
    id: string;
    key: string;
    title: string;
    status: string;
    currentStageKey: string;
    team: { name: string };
    owner: { name: string | null; email: string };
  };
}

export function InitiativeDetailHeader({ initiative }: InitiativeDetailHeaderProps) {
  const ownerDisplay = initiative.owner.name ?? initiative.owner.email;
  const ownerInitials = ownerDisplay.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm">
        <Link href="/initiatives" className="text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back to Initiatives
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground font-medium">{initiative.key}</span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold text-foreground">{initiative.title}</h1>
            <StatusBadge status={initiative.status} />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Owner:</span>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-xs font-medium">{ownerInitials}</span>
                </div>
                <span className="font-medium">{ownerDisplay}</span>
              </div>
            </div>
            <span className="text-muted-foreground">|</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Team:</span>
              <span className="font-medium">{initiative.team.name}</span>
            </div>
            <span className="text-muted-foreground">|</span>
            <StageBadge stage={initiative.currentStageKey} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
