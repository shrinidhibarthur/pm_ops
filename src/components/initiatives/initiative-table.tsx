"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge, StageBadge } from "@/components/status-badge";
import { MoreHorizontal, ArrowUpDown, ExternalLink } from "lucide-react";

interface InitiativeRow {
  id: string;
  key: string;
  title: string;
  summary: string | null;
  status: string;
  currentStageKey: string;
  updatedAt: Date;
  team: { name: string };
  owner: { name: string | null; email: string };
}

interface InitiativeTableProps {
  initiatives: InitiativeRow[];
}

export function InitiativeTable({ initiatives }: InitiativeTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.length === initiatives.length ? [] : initiatives.map((i) => i.id)
    );
  };

  const ownerInitials = (owner: { name: string | null; email: string }) => {
    if (owner.name) return owner.name.split(" ").map((n) => n[0]).join("").toUpperCase();
    return owner.email[0].toUpperCase();
  };

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">{selectedIds.length} selected</span>
          <Button variant="outline" size="sm">Change Status</Button>
          <Button variant="outline" size="sm">Assign Owner</Button>
        </div>
      )}

      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={selectedIds.length === initiatives.length && initiatives.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="min-w-[200px]">
                <Button variant="ghost" size="sm" className="-ml-3 h-8">
                  Initiative
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" className="-ml-3 h-8">
                  Owner
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initiatives.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                  No initiatives found
                </TableCell>
              </TableRow>
            ) : (
              initiatives.map((init) => (
                <TableRow key={init.id} className="hover:bg-muted/30">
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(init.id)}
                      onCheckedChange={() => toggleSelect(init.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/initiatives/${init.id}`}
                      className="font-medium text-foreground hover:text-primary hover:underline"
                    >
                      {init.key}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {init.title}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{init.team.name}</span>
                  </TableCell>
                  <TableCell>
                    <StageBadge stage={init.currentStageKey} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={init.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-medium">{ownerInitials(init.owner)}</span>
                      </div>
                      <span className="text-sm">{init.owner.name ?? init.owner.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {init.updatedAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/initiatives/${init.id}`}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing {initiatives.length} initiative{initiatives.length !== 1 ? "s" : ""}</span>
      </div>
    </div>
  );
}
