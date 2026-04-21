"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { Initiative, StageType } from "@/lib/types";

interface StageChartProps {
  initiatives: Initiative[];
}

const stageColors: Record<StageType, string> = {
  "Discovery": "#94a3b8",
  "Definition": "#60a5fa",
  "Design": "#a78bfa",
  "Development": "#fbbf24",
  "Testing": "#f97316",
  "Release": "#22c55e",
  "Post-Release": "#14b8a6",
};

export function StageChart({ initiatives }: StageChartProps) {
  const data = Object.entries(
    initiatives.reduce((acc, init) => {
      acc[init.stage] = (acc[init.stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value, color: stageColors[name as StageType] }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">By Stage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  fontSize: "12px"
                }} 
              />
              <Legend 
                fontSize={11}
                wrapperStyle={{ fontSize: "11px" }}
                formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
