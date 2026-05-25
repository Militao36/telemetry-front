"use client";

import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { QueriesPerTimeSery, RequestPerTimeSery } from "./dashboard";
import {
  formatChartTick,
  formatChartTooltipLabel,
  formatQueriesData,
  formatQueryTimeData,
  formatRequestsData,
  formatResponseTimeData,
} from "@/lib/utils";

export function MetricsCharts({
  requestsData = [{ time: "00:00", totalRequests: 0, avgMs: 0 }],
  queriesData = [{ time: "00:00", totalQueries: 0, avgMs: 0 }],
}: {
  requestsData?: RequestPerTimeSery[];
  queriesData?: QueriesPerTimeSery[];
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-4">
      <Card className="bg-card/95 border-border p-4 md:p-6 lg:col-span-2">
        <h3 className="text-base sm:text-lg font-semibold mb-3 md:mb-4">
          Requests Over Time
        </h3>

        <ResponsiveContainer width="100%" height={250} minHeight={200}>
          <AreaChart data={formatRequestsData(requestsData)}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148,163,184,0.22)"
            />
            <XAxis
              dataKey="time"
              stroke="rgba(203,213,225,0.78)"
              tick={{ fontSize: 12 }}
              tickFormatter={formatChartTick}
              minTickGap={36}
            />
            <YAxis stroke="rgba(203,213,225,0.78)" tick={{ fontSize: 12 }} />
            <Tooltip
              labelFormatter={formatChartTooltipLabel}
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid rgba(148,163,184,0.22)",
                color: "#e5e7eb",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8b5cf6"
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card className="bg-card/95 border-border p-4 md:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 md:mb-4">
          Response Time
        </h3>
        <ResponsiveContainer width="100%" height={250} minHeight={200}>
          <LineChart data={formatResponseTimeData(requestsData)}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148,163,184,0.22)"
            />
            <XAxis
              dataKey="time"
              stroke="rgba(203,213,225,0.78)"
              tick={{ fontSize: 12 }}
              tickFormatter={formatChartTick}
              minTickGap={36}
            />
            <YAxis stroke="rgba(203,213,225,0.78)" tick={{ fontSize: 12 }} />
            <Tooltip
              labelFormatter={formatChartTooltipLabel}
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid rgba(148,163,184,0.22)",
                color: "#e5e7eb",
              }}
            />
            <Line
              type="monotone"
              dataKey="ms"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="bg-card/95 border-border p-4 md:p-6 lg:col-span-2">
        <h3 className="text-base sm:text-lg font-semibold mb-3 md:mb-4">
          Queries Over Time
        </h3>
        <ResponsiveContainer width="100%" height={250} minHeight={200}>
          <AreaChart data={formatQueriesData(queriesData)}>
            <defs>
              <linearGradient id="colorMs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148,163,184,0.22)"
            />
            <XAxis
              dataKey="time"
              stroke="rgba(203,213,225,0.78)"
              tick={{ fontSize: 12 }}
              tickFormatter={formatChartTick}
              minTickGap={36}
            />
            <YAxis stroke="rgba(203,213,225,0.78)" tick={{ fontSize: 12 }} />
            <Tooltip
              labelFormatter={formatChartTooltipLabel}
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid rgba(148,163,184,0.22)",
                color: "#e5e7eb",
              }}
            />
            <Area
              type="monotone"
              dataKey="ms"
              stroke="#fbbf24"
              fillOpacity={1}
              fill="url(#colorMs)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card className="bg-card/95 border-border p-4 md:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 md:mb-4">
          Query time
        </h3>
        <ResponsiveContainer width="100%" height={250} minHeight={200}>
          <LineChart data={formatQueryTimeData(queriesData)}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148,163,184,0.22)"
            />
            <XAxis
              dataKey="time"
              stroke="rgba(203,213,225,0.78)"
              tick={{ fontSize: 12 }}
              tickFormatter={formatChartTick}
              minTickGap={36}
            />
            <YAxis stroke="rgba(203,213,225,0.78)" tick={{ fontSize: 12 }} />
            <Tooltip
              labelFormatter={formatChartTooltipLabel}
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid rgba(148,163,184,0.22)",
                color: "#e5e7eb",
              }}
            />
            <Line
              type="monotone"
              dataKey="ms"
              stroke="#fbbf24"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
