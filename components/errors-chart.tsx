"use client"

import { Card } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export function ErrorsChart({ timeRange }: { timeRange: string }) {
  const errorData = [
    { time: "00:00", critical: 2, high: 8, medium: 15, low: 25 },
    { time: "04:00", critical: 1, high: 5, medium: 12, low: 20 },
    { time: "08:00", critical: 5, high: 18, medium: 32, low: 45 },
    { time: "12:00", critical: 8, high: 28, medium: 52, low: 68 },
    { time: "16:00", critical: 4, high: 15, medium: 35, low: 52 },
    { time: "20:00", critical: 2, high: 10, medium: 22, low: 35 },
    { time: "23:59", critical: 1, high: 6, medium: 14, low: 23 },
  ]

  const resolutionData = [
    { time: "00:00", resolved: 5, unresolved: 20 },
    { time: "04:00", resolved: 8, unresolved: 18 },
    { time: "08:00", resolved: 12, unresolved: 35 },
    { time: "12:00", resolved: 18, unresolved: 45 },
    { time: "16:00", resolved: 22, unresolved: 30 },
    { time: "20:00", resolved: 25, unresolved: 20 },
    { time: "23:59", resolved: 28, unresolved: 15 },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-card/95 border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Errors by Severity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={errorData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey="time" stroke="var(--chart-axis)" />
            <YAxis stroke="var(--chart-axis)" />
            <Tooltip contentStyle={{ backgroundColor: "var(--chart-tooltip-bg)", border: "1px solid var(--chart-tooltip-border)", color: "var(--chart-tooltip-text)" }} />
            <Legend />
            <Area type="monotone" dataKey="critical" stackId="1" fill="#ef4444" />
            <Area type="monotone" dataKey="high" stackId="1" fill="#f97316" />
            <Area type="monotone" dataKey="medium" stackId="1" fill="#fbbf24" />
            <Area type="monotone" dataKey="low" stackId="1" fill="#3b82f6" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card className="bg-card/95 border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Resolution Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={resolutionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey="time" stroke="var(--chart-axis)" />
            <YAxis stroke="var(--chart-axis)" />
            <Tooltip contentStyle={{ backgroundColor: "var(--chart-tooltip-bg)", border: "1px solid var(--chart-tooltip-border)", color: "var(--chart-tooltip-text)" }} />
            <Legend />
            <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="unresolved" stroke="#ef4444" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
