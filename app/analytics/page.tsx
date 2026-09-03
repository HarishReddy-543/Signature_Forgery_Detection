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

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

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
