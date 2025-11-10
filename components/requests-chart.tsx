"use client"

import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export function RequestsChart() {
  const requestData = [
    { time: "00:00", requests: 450, avgTime: 145 },
    { time: "04:00", requests: 520, avgTime: 152 },
    { time: "08:00", requests: 890, avgTime: 180 },
    { time: "12:00", requests: 1200, avgTime: 220 },
    { time: "16:00", requests: 950, avgTime: 195 },
    { time: "20:00", requests: 750, avgTime: 160 },
    { time: "23:59", requests: 580, avgTime: 150 },
  ]

  const statusData = [
    { status: "200", count: 4500, percentage: 85 },
    { status: "201", count: 450, percentage: 8 },
    { status: "304", count: 250, percentage: 5 },
    { status: "400", count: 80, percentage: 1.5 },
    { status: "500", count: 20, percentage: 0.5 },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Requests Timeline</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={requestData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" yAxisId="left" />
            <YAxis stroke="rgba(255,255,255,0.5)" yAxisId="right" orientation="right" />
            <Tooltip contentStyle={{ backgroundColor: "#1e1e2e", border: "1px solid rgba(255,255,255,0.1)" }} />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="requests"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
              name="Requests"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgTime"
              stroke="#fbbf24"
              strokeWidth={2}
              dot={false}
              name="Avg Time (ms)"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Response Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="status" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip contentStyle={{ backgroundColor: "#1e1e2e", border: "1px solid rgba(255,255,255,0.1)" }} />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
