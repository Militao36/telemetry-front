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

export function QueriesChart({ queryType, timeRange }: { queryType: string; timeRange: string }) {
  const data = [
    { time: "00:00", select: 45, insert: 12, update: 8, delete: 2 },
    { time: "04:00", select: 52, insert: 18, update: 10, delete: 3 },
    { time: "08:00", select: 78, insert: 25, update: 14, delete: 5 },
    { time: "12:00", select: 92, insert: 35, update: 18, delete: 7 },
    { time: "16:00", select: 68, insert: 28, update: 15, delete: 4 },
    { time: "20:00", select: 55, insert: 20, update: 12, delete: 3 },
    { time: "23:59", select: 48, insert: 15, update: 9, delete: 2 },
  ]

  const performanceData = [
    { time: "00:00", avgTime: 120, p95: 250, p99: 450 },
    { time: "04:00", avgTime: 135, p95: 280, p99: 520 },
    { time: "08:00", avgTime: 180, p95: 380, p99: 720 },
    { time: "12:00", avgTime: 245, p95: 520, p99: 950 },
    { time: "16:00", avgTime: 200, p95: 420, p99: 780 },
    { time: "20:00", avgTime: 160, p95: 320, p99: 600 },
    { time: "23:59", avgTime: 140, p95: 280, p99: 520 },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Query Volume by Type</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip contentStyle={{ backgroundColor: "#1e1e2e", border: "1px solid rgba(255,255,255,0.1)" }} />
            <Legend />
            <Bar dataKey="select" stackId="a" fill="#8b5cf6" />
            <Bar dataKey="insert" stackId="a" fill="#3b82f6" />
            <Bar dataKey="update" stackId="a" fill="#ec4899" />
            <Bar dataKey="delete" stackId="a" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Response Time Percentiles</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip contentStyle={{ backgroundColor: "#1e1e2e", border: "1px solid rgba(255,255,255,0.1)" }} />
            <Legend />
            <Line type="monotone" dataKey="avgTime" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Average" />
            <Line type="monotone" dataKey="p95" stroke="#fbbf24" strokeWidth={2} dot={false} name="P95" />
            <Line type="monotone" dataKey="p99" stroke="#ef4444" strokeWidth={2} dot={false} name="P99" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
