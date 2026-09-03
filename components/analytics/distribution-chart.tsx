"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface DistributionChartProps {
  genuinePercent?: number;
  forgedPercent?: number;
}

export function DistributionChart({ genuinePercent = 0, forgedPercent = 0 }: DistributionChartProps) {
  const data = [
    { name: "Genuine", value: genuinePercent, color: "oklch(0.70 0.18 145)" },
    { name: "Forged", value: forgedPercent, color: "oklch(0.55 0.22 27)" },
  ];

  const total = genuinePercent + forgedPercent;

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="font-semibold text-card-foreground">
          Result Distribution
        </h3>
        <p className="text-sm text-muted-foreground">
          Overall verification outcomes (Real-time)
        </p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.12 0 0)",
                border: "1px solid oklch(0.22 0 0)",
                borderRadius: "8px",
                color: "oklch(0.98 0 0)",
              }}
              formatter={(value: number) => [
                `${value.toFixed(1)}%`,
                "",
              ]}
            />
            <Legend
              formatter={(value) => (
                <span style={{ color: "oklch(0.65 0 0)" }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {data.map((item) => (
          <div key={item.name} className="text-center">
            <p className="text-2xl font-bold text-card-foreground">
              {item.value.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
