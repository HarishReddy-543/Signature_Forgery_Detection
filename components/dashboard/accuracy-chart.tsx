"use client";

import { getApiUrl } from "@/lib/api-config";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function AccuracyChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(getApiUrl("/api/analytics/accuracy"));
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5s for real-time updates
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-card-foreground">Model Confidence Trend</h3>
          <p className="text-sm text-muted-foreground">
            Real-time verification confidence (Live)
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Confidence %</span>
          </div>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.length > 0 ? data : [{ date: "Now", accuracy: 0 }]}>
            <defs>
              <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.65 0.24 270)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.65 0.24 270)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.22 0 0)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="oklch(0.65 0 0)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis
              stroke="oklch(0.65 0 0)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.12 0 0)",
                border: "1px solid oklch(0.22 0 0)",
                borderRadius: "8px",
                color: "oklch(0.98 0 0)",
              }}
              formatter={(value: number) => [`${value}%`, "Confidence"]}
            />
            <Area
              type="monotone"
              dataKey="accuracy"
              stroke="oklch(0.65 0.24 270)"
              strokeWidth={2}
              fill="url(#accuracyGradient)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
