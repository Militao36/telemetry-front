"use client"

import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { IMetrics, QueriesVolumeByHours } from "./queries-view";
import { DateTime } from "luxon";
import { useMemo } from "react";
import {
  downsampleSeries,
  formatChartTick,
  formatChartTooltipLabel,
} from "@/lib/utils";

export function QueriesChart({ queryVolumeByHours, avgQueryTimeByHour }: { queryVolumeByHours: QueriesVolumeByHours[]; avgQueryTimeByHour: IMetrics[] }) {
  const formattedAvgQueryTimeByHour = useMemo(() => {
    return downsampleSeries(avgQueryTimeByHour.map(item => {
      return {
        avgMs: +item.avgMs.toFixed(2),
        p50Ms: +item.p50Ms.toFixed(2),
        p90Ms: +item.p90Ms.toFixed(2),
        p95Ms: +item.p95Ms.toFixed(2),
        p99Ms: +item.p99Ms.toFixed(2),
        intervalHour: DateTime.fromSQL(item.intervalHour, { zone: "utc" })
          .toLocal()
          .toFormat("yyyy-MM-dd HH:mm:ss"),
      }
    }));
  }, [avgQueryTimeByHour]);

  const formattedQueryVolumeByHours = useMemo(() => {
    return downsampleSeries(queryVolumeByHours.map(item => {
      return {
        ...item,
        inserts: +item.inserts,
        selects: +item.selects,
        updates: +item.updates,
        deletes: +item.deletes,
        interval: DateTime.fromSQL(item.interval, { zone: "utc" })
          .toLocal()
          .toFormat("yyyy-MM-dd HH:mm:ss"),
      }
    }));
  }, [queryVolumeByHours]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="soft-card p-6">
        <h3 className="text-lg font-semibold mb-4">Query Volume by Type</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedQueryVolumeByHours}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey="interval" stroke="var(--chart-axis)" tickFormatter={formatChartTick} minTickGap={36} />
            <YAxis stroke="var(--chart-axis)" />
            <Tooltip labelFormatter={formatChartTooltipLabel} contentStyle={{ backgroundColor: "var(--chart-tooltip-bg)", border: "1px solid var(--chart-tooltip-border)", color: "var(--chart-tooltip-text)" }} />
            <Legend />
            <Bar dataKey="selects" stackId="a" fill="#8b5cf6" />
            <Bar dataKey="inserts" stackId="a" fill="#3b82f6" />
            <Bar dataKey="updates" stackId="a" fill="#ec4899" />
            <Bar dataKey="deletes" stackId="a" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="soft-card p-6">
        <h3 className="text-lg font-semibold mb-4">Response Time Percentiles</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedAvgQueryTimeByHour}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey="intervalHour" stroke="var(--chart-axis)" tickFormatter={formatChartTick} minTickGap={36} />
            <YAxis stroke="var(--chart-axis)" />
            <Tooltip labelFormatter={formatChartTooltipLabel} contentStyle={{ backgroundColor: "var(--chart-tooltip-bg)", border: "1px solid var(--chart-tooltip-border)", color: "var(--chart-tooltip-text)" }} />
            <Legend />
            <Line type="monotone" dataKey="avgMs" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Average" />
            <Line type="monotone" dataKey="p95Ms" stroke="#fbbf24" strokeWidth={2} dot={false} name="P95" />
            <Line type="monotone" dataKey="p99Ms" stroke="#ef4444" strokeWidth={2} dot={false} name="P99" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
