"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { Initiative } from "@/lib/types";

interface OwnerChartProps {
  initiatives: Initiative[];
}

export function OwnerChart({ initiatives }: OwnerChartProps) {
  const data = Object.entries(
    initiatives.reduce((acc, init) => {
      const name = init.owner.name.split(" ")[0];
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">By Owner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: 0, right: 16 }}>
              <XAxis 
                dataKey="name" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                width={30}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  fontSize: "12px"
                }} 
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
