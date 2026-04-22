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

interface InitiativeFiltersProps {
  teams: { id: string; name: string }[];
}

export function InitiativeFilters({ teams }: InitiativeFiltersProps) {
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
            <SelectValue placeholder="Team" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="ON_HOLD">On Hold</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="discovery">Discovery</SelectItem>
            <SelectItem value="definition">Definition</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="development">Development</SelectItem>
            <SelectItem value="testing">Testing</SelectItem>
            <SelectItem value="release">Release</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
