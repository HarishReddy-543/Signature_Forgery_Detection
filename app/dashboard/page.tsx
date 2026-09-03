"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { AccuracyChart } from "@/components/dashboard/accuracy-chart";
import { getApiUrl } from "@/lib/api-config";
import { useEffect, useState } from "react";
import {
    FileCheck,
    ShieldCheck,
    AlertTriangle,
    Clock,
} from "lucide-react";

export default function DashboardPage() {
    const [stats, setStats] = useState<any>({
        verifications: 0,
        dataset_genuine: 0,
        dataset_forged: 0,
        total_dataset: 0,
        avg_time: "1.2s"
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(getApiUrl("/api/stats"));
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (err) {
                console.warn("Failed to fetch dashboard stats:", err);
            }
        };
        fetchStats();
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
        <div className="pl-0 lg:pl-64">
                <Header
                    title="Dashboard"
                    description="Overview of signature verification activity"
                />
                <main className="p-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <StatsCard
                            title="Total Signatures"
                            value={stats.total_dataset.toLocaleString()}
                            change="+100%"
                            changeType="positive"
                            icon={FileCheck}
                            description="Dataset size"
                            hoverColor="emerald"
                        />
                        <StatsCard
                            title="Genuine Signatures"
                            value={stats.dataset_genuine.toLocaleString()}
                            icon={ShieldCheck}
                            description="Stored in dataset"
                            hoverColor="blue"
                        />
                        <StatsCard
                            title="Forged Signatures"
                            value={stats.dataset_forged.toLocaleString()}
                            icon={AlertTriangle}
                            description="Stored in dataset"
                            hoverColor="red"
                        />
                        <StatsCard
                            title="Avg. Processing Time"
                            value={stats.avg_time}
                            change="-0.2s"
                            changeType="positive"
                            icon={Clock}
                            description="Per signature"
                            hoverColor="amber"
                        />
                    </div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                        <AccuracyChart />
                        <RecentActivity />
                    </div>
                </main>
            </div>
        </div>
    );
}
