import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StageBadge } from "@/components/status-badge";
import type { Initiative } from "@/lib/types";
import { Clock, ChevronRight } from "lucide-react";

interface PendingApprovalsProps {
  initiatives: Initiative[];
}

export function PendingApprovals({ initiatives }: PendingApprovalsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-base font-medium">Pending Approvals</CardTitle>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/approvals">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {initiatives.slice(0, 4).map((init) => (
            <div 
              key={init.id} 
              className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
            >
              <div className="flex-1 min-w-0">
                <Link 
                  href={`/initiatives/${init.id}`}
                  className="font-medium text-sm text-foreground hover:text-primary hover:underline"
                >
                  {init.title}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{init.owner.name}</span>
                  <span className="text-muted-foreground">·</span>
                  <StageBadge stage={init.stage} className="text-xs py-0" />
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/initiatives/${init.id}`}>Review</Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
