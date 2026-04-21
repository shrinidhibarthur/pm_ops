"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { Initiative, WorkstreamType } from "@/lib/types";

interface WorkstreamChartProps {
  initiatives: Initiative[];
}

const colors: Record<WorkstreamType, string> = {
  "Platform": "#3b82f6",
  "Growth": "#22c55e",
  "Enterprise": "#8b5cf6",
  "Mobile": "#f59e0b",
  "Infrastructure": "#64748b",
  "Data & Analytics": "#06b6d4",
};

export function WorkstreamChart({ initiatives }: WorkstreamChartProps) {
  const data = Object.entries(
    initiatives.reduce((acc, init) => {
      acc[init.workstream] = (acc[init.workstream] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, count]) => ({ name, count, color: colors[name as WorkstreamType] }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">By Workstream</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16 }}>
              <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis 
                type="category" 
                dataKey="name" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                width={90}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  fontSize: "12px"
                }} 
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
