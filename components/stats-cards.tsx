"use client";

import { Card } from "@/components/ui/card";
import { formatValueToK } from "@/lib/utils";
import { TrendingUp, AlertTriangle, Zap, Activity } from "lucide-react";
import { useEffect, useState } from "react";

const DEFAULT_STATS = [
  {
    label: "Requests/sec",
    value: "0",
    change: "",
    icon: Activity,
    color: "text-blue-400",
  },
  {
    label: "Errors",
    value: "0",
    change: "",
    icon: AlertTriangle,
    color: "text-red-400",
  },
  {
    label: "Avg Response",
    value: "0ms",
    change: "",
    icon: Zap,
    color: "text-yellow-400",
  },
  {
    label: "Uptime",
    value: "0%",
    change: "",
    icon: TrendingUp,
    color: "text-green-400",
  },
];

export function StatsCards({
  totalRequests,
  totalErrors,
  avgResponse,
  totalQueries,
}: {
  totalRequests: number;
  totalErrors: number;
  avgResponse: number;
  totalQueries: number;
}) {
  const [stats, setStats] = useState(DEFAULT_STATS);

  useEffect(() => {
    setStats([
      {
        label: "Requests",
        value: formatValueToK(totalRequests?.toString()),
        change: "",
        icon: Activity,
        color: "text-blue-400",
      },
      {
        label: "Errors",
        value: formatValueToK(totalErrors?.toString()),
        change: "",
        icon: AlertTriangle,
        color: "text-red-400",
      },
      {
        label: "Avg Response",
        value: avgResponse?.toFixed(2) ?? "0",
        change: "",
        icon: Zap,
        color: "text-yellow-400",
      },
      {
        label: "Queries",
        value: formatValueToK(totalQueries?.toString()),
        change: "",
        icon: Activity,
        color: "text-green-400",
      },
    ]);
  }, [totalRequests, totalErrors, avgResponse]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="bg-card/95 border-border p-3 sm:p-4 md:p-6"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-1 sm:gap-2">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold truncate">
                  {stat.value}
                </span>
                <span className="text-xs text-green-400 shrink-0">
                  {stat.change}
                </span>
              </div>
            </div>
            <div className={`${stat.color} shrink-0 rounded-lg border border-border bg-secondary/50 p-2 shadow-none`}>
              <stat.icon size={18} className="sm:size-6" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
