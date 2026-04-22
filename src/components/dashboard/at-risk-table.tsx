import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge, StageBadge } from "@/components/status-badge";
import { AlertTriangle } from "lucide-react";

interface AtRiskItem {
  id: string;
  key: string;
  title: string;
  status: string;
  currentStageKey: string;
  owner: { name: string | null; email: string };
  team: { name: string };
}

interface AtRiskTableProps {
  initiatives: AtRiskItem[];
}

export function AtRiskTable({ initiatives }: AtRiskTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <CardTitle className="text-base font-medium">At-Risk Initiatives</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Initiative</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initiatives.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                  No at-risk initiatives
                </TableCell>
              </TableRow>
            ) : (
              initiatives.slice(0, 5).map((init) => (
                <TableRow key={init.id}>
                  <TableCell>
                    <Link
                      href={`/initiatives/${init.id}`}
                      className="font-medium text-foreground hover:text-primary hover:underline"
                    >
                      {init.key}
                    </Link>
                    <p className="text-xs text-muted-foreground line-clamp-1">{init.title}</p>
                  </TableCell>
                  <TableCell className="text-sm">{init.team.name}</TableCell>
                  <TableCell>
                    <StageBadge stage={init.currentStageKey} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={init.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
