import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { ReviewMetric } from "@/server/reviews/types";

interface MetricTableProps {
  metrics: ReviewMetric[];
}

function formatValue(value: number, unit: ReviewMetric["unit"]): string {
  if (unit === "currency") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
  }
  if (unit === "percent") {
    return `${value.toFixed(2)}%`;
  }
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}

function TrendArrow({ deltaPct }: { deltaPct: number }) {
  if (Math.abs(deltaPct) < 1) return <span className="text-muted-foreground">→</span>;
  return deltaPct > 0 ? (
    <span className="text-emerald-600">↑</span>
  ) : (
    <span className="text-red-500">↓</span>
  );
}

export function MetricTable({ metrics }: MetricTableProps) {
  if (metrics.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        No analytics data available for this period.
      </p>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Metric</TableHead>
            <TableHead className="text-right">Current Period</TableHead>
            <TableHead className="text-right">Prior Period</TableHead>
            <TableHead className="text-right">Delta</TableHead>
            <TableHead className="text-center w-[60px]">Trend</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics.map((m) => {
            const isVariance = Math.abs(m.deltaPct) > 10;
            const isPositive = m.delta >= 0;
            return (
              <TableRow
                key={m.key}
                className={cn("hover:bg-muted/30", isVariance && "bg-amber-50/50 dark:bg-amber-950/20")}
              >
                <TableCell className="font-medium text-sm">
                  {m.name}
                  {isVariance && (
                    <span className="ml-2 text-xs text-amber-600 font-normal">⚠ variance</span>
                  )}
                </TableCell>
                <TableCell className="text-right text-sm font-semibold">
                  {formatValue(m.current, m.unit)}
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {formatValue(m.prior, m.unit)}
                </TableCell>
                <TableCell className="text-right text-sm">
                  <span className={cn(isPositive ? "text-emerald-600" : "text-red-500")}>
                    {isPositive ? "+" : ""}
                    {m.unit === "currency"
                      ? formatValue(m.delta, "currency")
                      : m.unit === "percent"
                      ? `${m.delta.toFixed(2)}pp`
                      : `${m.deltaPct.toFixed(1)}%`}
                  </span>
                </TableCell>
                <TableCell className="text-center text-lg">
                  <TrendArrow deltaPct={m.deltaPct} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
