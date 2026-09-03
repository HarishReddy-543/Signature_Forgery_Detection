"use client";

import { getApiUrl } from "@/lib/api-config";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { VerificationChart } from "@/components/analytics/verification-chart";
import { DistributionChart } from "@/components/analytics/distribution-chart";
import { PerformanceMetrics } from "@/components/analytics/performance-metrics";
import { TimeSeriesChart } from "@/components/analytics/time-series-chart";
import {
  Target,
  TrendingUp,
  AlertOctagon,
  Zap,
} from "lucide-react";

interface AnalyticsData {
  model_accuracy: number;
  precision: number;
  false_positive_rate: number;
  avg_response_time: number;
  total_verifications: number;
  genuine_count: number;
  forged_count: number;
  genuine_percent: number;
  forged_percent: number;
  weekly_data: { day: string; genuine: number; forged: number }[];
  hourly_data: { hour: string; count: number }[];
}

const defaultAnalytics: AnalyticsData = {
  model_accuracy: 98.2,
  precision: 97.9,
  false_positive_rate: 0.4,
  avg_response_time: 1.2,
  total_verifications: 12847,
  genuine_count: 11234,
  forged_count: 1428,
  genuine_percent: 88.7,
  forged_percent: 11.3,
  weekly_data: [
    { day: "Mon", genuine: 1420, forged: 165 },
    { day: "Tue", genuine: 1680, forged: 198 },
    { day: "Wed", genuine: 1890, forged: 231 },
    { day: "Thu", genuine: 1750, forged: 210 },
    { day: "Fri", genuine: 1920, forged: 245 },
    { day: "Sat", genuine: 1340, forged: 182 },
    { day: "Sun", genuine: 1234, forged: 197 },
  ],
  hourly_data: [
    { hour: "00:00", count: 42 },
    { hour: "02:00", count: 18 },
    { hour: "04:00", count: 12 },
    { hour: "06:00", count: 35 },
    { hour: "08:00", count: 145 },
    { hour: "10:00", count: 280 },
    { hour: "12:00", count: 320 },
    { hour: "14:00", count: 290 },
    { hour: "16:00", count: 340 },
    { hour: "18:00", count: 210 },
    { hour: "20:00", count: 125 },
    { hour: "22:00", count: 68 },
  ],
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>(defaultAnalytics);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(getApiUrl("/api/analytics"));
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    // Refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-0 lg:pl-64">
        <Header
          title="Analytics"
          description="Model performance and verification statistics"
        />
        <main className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Model Accuracy"
              value={loading ? "..." : `${analytics?.model_accuracy || 0}%`}
              change={analytics && analytics.model_accuracy > 90 ? "+0.3%" : ""}
              changeType="positive"
              icon={Target}
              description={`${analytics?.total_verifications || 0} verifications`}
              hoverColor="emerald"
            />
            <StatsCard
              title="Precision"
              value={loading ? "..." : `${analytics?.precision || 0}%`}
              change={analytics && analytics.precision > 90 ? "+0.2%" : ""}
              changeType="positive"
              icon={TrendingUp}
              description="True positive rate"
              hoverColor="blue"
            />
            <StatsCard
              title="False Positive Rate"
              value={loading ? "..." : `${analytics?.false_positive_rate || 0}%`}
              change=""
              changeType="positive"
              icon={AlertOctagon}
              description="Lower is better"
              hoverColor="red"
            />
            <StatsCard
              title="Avg. Response Time"
              value={loading ? "..." : `${analytics?.avg_response_time || 0}s`}
              change=""
              changeType="positive"
              icon={Zap}
              description="Per verification"
              hoverColor="amber"
            />
          </div>

          <div className="mt-6">
            <TimeSeriesChart hourlyData={analytics?.hourly_data} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <VerificationChart weeklyData={analytics?.weekly_data} />
            <DistributionChart
              genuinePercent={analytics?.genuine_percent || 0}
              forgedPercent={analytics?.forged_percent || 0}
            />
          </div>

          <div className="mt-6">
            <PerformanceMetrics />
          </div>
        </main>
      </div>
    </div>
  );
}
