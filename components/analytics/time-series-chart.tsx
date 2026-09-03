"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface HourlyData {
  hour: string;
  count: number;
}

interface TimeSeriesChartProps {
  hourlyData?: HourlyData[];
}

const defaultData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, '0')}:00`,
  count: 0,
}));

export function TimeSeriesChart({ hourlyData }: TimeSeriesChartProps) {
  const data = hourlyData && hourlyData.length > 0
    ? hourlyData.map(d => ({ time: d.hour, verifications: d.count }))
    : defaultData.map(d => ({ time: d.hour, verifications: d.count }));

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="font-semibold text-card-foreground">
          Verification Activity
        </h3>
        <p className="text-sm text-muted-foreground">
          Hourly verification volume today (Real-time)
        </p>
      </div>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="verificationGradient" x1="0" y1="0" x2="0" y2="1">
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
              dataKey="time"
              stroke="oklch(0.65 0 0)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="oklch(0.65 0 0)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.12 0 0)",
                border: "1px solid oklch(0.22 0 0)",
                borderRadius: "8px",
                color: "oklch(0.98 0 0)",
              }}
              formatter={(value: number) => [`${value} verifications`, ""]}
            />
            <Area
              type="monotone"
              dataKey="verifications"
              stroke="oklch(0.65 0.24 270)"
              strokeWidth={2}
              fill="url(#verificationGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
