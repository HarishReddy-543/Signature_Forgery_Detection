"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface WeeklyData {
  day: string;
  genuine: number;
  forged: number;
}

interface VerificationChartProps {
  weeklyData?: WeeklyData[];
}

const defaultData = [
  { day: "Mon", genuine: 0, forged: 0 },
  { day: "Tue", genuine: 0, forged: 0 },
  { day: "Wed", genuine: 0, forged: 0 },
  { day: "Thu", genuine: 0, forged: 0 },
  { day: "Fri", genuine: 0, forged: 0 },
  { day: "Sat", genuine: 0, forged: 0 },
  { day: "Sun", genuine: 0, forged: 0 },
];

export function VerificationChart({ weeklyData }: VerificationChartProps) {
  const data = weeklyData && weeklyData.length > 0 ? weeklyData : defaultData;

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="font-semibold text-card-foreground">
          Weekly Verification Results
        </h3>
        <p className="text-sm text-muted-foreground">
          Breakdown by verification outcome (Real-time data)
        </p>
      </div>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={2}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.22 0 0)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
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
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value) => (
                <span style={{ color: "oklch(0.65 0 0)" }}>{value}</span>
              )}
            />
            <Bar
              dataKey="genuine"
              name="Genuine"
              fill="oklch(0.70 0.18 145)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="forged"
              name="Forged"
              fill="oklch(0.55 0.22 27)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
