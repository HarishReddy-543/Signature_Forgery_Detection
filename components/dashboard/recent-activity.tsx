"use client";

import { getApiUrl } from "@/lib/api-config";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  result: "Genuine" | "Forged";
  confidence: number;
  timestamp: string;
}

const resultConfig = {
  Genuine: {
    icon: CheckCircle2,
    label: "Genuine",
    className: "text-success bg-success/10",
  },
  Forged: {
    icon: XCircle,
    label: "Forged",
    className: "text-destructive bg-destructive/10",
  },
};

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(getApiUrl("/api/history"));
        if (!res.ok) {
          // Keep silent on error to avoid cluttering console in prod, or just return empty
          return;
        }
        const data = await res.json();
        setActivities(data);
      } catch (e) {
        // Silently fail if backend is unreachable
        console.warn("Could not fetch history:", e);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  if (activities.length === 0) return (
    <div className="rounded-lg border border-border bg-card p-6 text-center text-muted-foreground">
      No recent verifications.
    </div>
  );

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="font-semibold text-card-foreground">Recent Verifications</h3>
        <button className="text-sm text-primary hover:underline">View All</button>
      </div>
      <div className="divide-y divide-border">
        {activities.map((activity) => {
          const config = resultConfig[activity.result as keyof typeof resultConfig] || resultConfig.Genuine;
          const Icon = config.icon;
          return (
            <div key={activity.id} className="flex items-center gap-4 p-4">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  config.className
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-card-foreground">
                  Signature Verification
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>AI Model</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    config.className
                  )}
                >
                  {config.label}
                </span>
                <p className="mt-1 text-sm text-muted-foreground">
                  {activity.confidence}% confidence
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
