import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge, RiskBadge } from "@/components/status-badge";
import type { Initiative } from "@/lib/types";
import { AlertTriangle } from "lucide-react";

interface AtRiskTableProps {
  initiatives: Initiative[];
}

export function AtRiskTable({ initiatives }: AtRiskTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <CardTitle className="text-base font-medium">At-Risk Initiatives</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Initiative</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initiatives.slice(0, 5).map((init) => (
              <TableRow key={init.id}>
                <TableCell>
                  <Link 
                    href={`/initiatives/${init.id}`}
                    className="font-medium text-foreground hover:text-primary hover:underline"
                  >
                    {init.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">{init.workstream}</p>
                </TableCell>
                <TableCell className="text-sm">{init.owner.name}</TableCell>
                <TableCell>
                  <StatusBadge status={init.status} />
                </TableCell>
                <TableCell>
                  <RiskBadge risk={init.risk} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
