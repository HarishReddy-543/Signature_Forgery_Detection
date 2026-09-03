"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { date: "Week 1", accuracy: 97.2, precision: 96.8, recall: 97.5, f1: 97.1 },
  { date: "Week 2", accuracy: 97.5, precision: 97.1, recall: 97.8, f1: 97.4 },
  { date: "Week 3", accuracy: 97.8, precision: 97.4, recall: 98.0, f1: 97.7 },
  { date: "Week 4", accuracy: 98.0, precision: 97.6, recall: 98.2, f1: 97.9 },
  { date: "Week 5", accuracy: 98.1, precision: 97.8, recall: 98.3, f1: 98.0 },
  { date: "Week 6", accuracy: 98.2, precision: 97.9, recall: 98.4, f1: 98.1 },
];

export function PerformanceMetrics() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="font-semibold text-card-foreground">
          Model Performance Metrics
        </h3>
        <p className="text-sm text-muted-foreground">
          Accuracy, Precision, Recall, and F1 Score over time
        </p>
      </div>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
            />
            <YAxis
              stroke="oklch(0.65 0 0)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[95, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.12 0 0)",
                border: "1px solid oklch(0.22 0 0)",
                borderRadius: "8px",
                color: "oklch(0.98 0 0)",
              }}
              formatter={(value: number) => [`${value}%`, ""]}
            />
            <Legend
              formatter={(value) => (
                <span style={{ color: "oklch(0.65 0 0)" }}>{value}</span>
              )}
            />
            <Line
              type="monotone"
              dataKey="accuracy"
              name="Accuracy"
              stroke="oklch(0.65 0.24 270)"
              strokeWidth={2}
              dot={{ fill: "oklch(0.65 0.24 270)", strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="precision"
              name="Precision"
              stroke="oklch(0.70 0.18 162)"
              strokeWidth={2}
              dot={{ fill: "oklch(0.70 0.18 162)", strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="recall"
              name="Recall"
              stroke="oklch(0.75 0.15 80)"
              strokeWidth={2}
              dot={{ fill: "oklch(0.75 0.15 80)", strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="f1"
              name="F1 Score"
              stroke="oklch(0.60 0.20 200)"
              strokeWidth={2}
              dot={{ fill: "oklch(0.60 0.20 200)", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
