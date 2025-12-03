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

export function QueriesChart({ queryVolumeByHours, avgQueryTimeByHour }: { queryVolumeByHours: QueriesVolumeByHours[]; avgQueryTimeByHour: IMetrics[] }) {
  const formatterAvgQueryTimeByHour = (avgQueryTimeByHour: IMetrics[]) => {
    return avgQueryTimeByHour.map(item => {
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
    })
  }

  const formatterQueryVolumeByHours = (queryVolumeByHours: QueriesVolumeByHours[]) => {
    return queryVolumeByHours.map(item => {
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
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Query Volume by Type</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formatterQueryVolumeByHours(queryVolumeByHours)}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="interval" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid rgba(255,255,255,0.1)" }} />
            <Legend />
            <Bar dataKey="selects" stackId="a" fill="#8b5cf6" />
            <Bar dataKey="inserts" stackId="a" fill="#3b82f6" />
            <Bar dataKey="updates" stackId="a" fill="#ec4899" />
            <Bar dataKey="deletes" stackId="a" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Response Time Percentiles</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formatterAvgQueryTimeByHour(avgQueryTimeByHour)}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="intervalHour" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid rgba(255,255,255,0.1)" }} />
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
