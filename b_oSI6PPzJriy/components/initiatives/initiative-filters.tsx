"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

const workstreams = [
  "Platform",
  "Growth",
  "Enterprise",
  "Mobile",
  "Infrastructure",
  "Data & Analytics",
];

const stages = [
  "Discovery",
  "Definition",
  "Design",
  "Development",
  "Testing",
  "Release",
  "Post-Release",
];

const statuses = [
  "Draft",
  "Pending Approval",
  "Approved",
  "In Progress",
  "Blocked",
  "On Hold",
  "Completed",
  "Cancelled",
];

const risks = ["Low", "Medium", "High", "Critical"];
const quarters = ["Q1", "Q2", "Q3", "Q4"];

export function InitiativeFilters() {
  return (
    <div className="flex flex-col gap-4 p-4 bg-card border border-border rounded-lg">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search initiatives..." className="pl-9" />
        </div>
        <Button variant="ghost" size="sm">
          <X className="h-4 w-4 mr-1" />
          Clear filters
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Workstream" />
          </SelectTrigger>
          <SelectContent>
            {workstreams.map((ws) => (
              <SelectItem key={ws} value={ws}>
                {ws}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            {stages.map((stage) => (
              <SelectItem key={stage} value={stage}>
                {stage}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Risk" />
          </SelectTrigger>
          <SelectContent>
            {risks.map((risk) => (
              <SelectItem key={risk} value={risk}>
                {risk}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Quarter" />
          </SelectTrigger>
          <SelectContent>
            {quarters.map((q) => (
              <SelectItem key={q} value={q}>
                {q} 2024
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Owner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sarah">Sarah Chen</SelectItem>
            <SelectItem value="marcus">Marcus Johnson</SelectItem>
            <SelectItem value="emily">Emily Rodriguez</SelectItem>
            <SelectItem value="david">David Kim</SelectItem>
            <SelectItem value="rachel">Rachel Patel</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
