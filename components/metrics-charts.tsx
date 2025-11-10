"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function MetricsCharts() {
  const requestsData = [
    { time: "00:00", value: 1200 },
    { time: "04:00", value: 1400 },
    { time: "08:00", value: 1800 },
    { time: "12:00", value: 2200 },
    { time: "16:00", value: 2400 },
    { time: "20:00", value: 2100 },
    { time: "23:59", value: 1900 },
  ]

  const errorData = [
    { time: "00:00", errors: 2 },
    { time: "04:00", errors: 1 },
    { time: "08:00", errors: 3 },
    { time: "12:00", errors: 5 },
    { time: "16:00", errors: 2 },
    { time: "20:00", errors: 1 },
    { time: "23:59", errors: 0 },
  ]

  const responseTimeData = [
    { time: "00:00", ms: 120 },
    { time: "04:00", ms: 140 },
    { time: "08:00", ms: 180 },
    { time: "12:00", ms: 200 },
    { time: "16:00", ms: 150 },
    { time: "20:00", ms: 110 },
    { time: "23:59", ms: 95 },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-4">
      <Card className="bg-card border-border p-4 md:p-6 lg:col-span-2">
        <h3 className="text-base sm:text-lg font-semibold mb-3 md:mb-4">Requests Over Time</h3>
        <ResponsiveContainer width="100%" height={250} minHeight={200}>
          <AreaChart data={requestsData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
            <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: "#1e1e2e", border: "1px solid rgba(255,255,255,0.1)" }} />
            <Area type="monotone" dataKey="value" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card className="bg-card border-border p-4 md:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 md:mb-4">Error Rate</h3>
        <ResponsiveContainer width="100%" height={250} minHeight={200}>
          <LineChart data={errorData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
            <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: "#1e1e2e", border: "1px solid rgba(255,255,255,0.1)" }} />
            <Line type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="bg-card border-border p-4 md:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 md:mb-4">Response Time</h3>
        <ResponsiveContainer width="100%" height={250} minHeight={200}>
          <LineChart data={responseTimeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
            <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: "#1e1e2e", border: "1px solid rgba(255,255,255,0.1)" }} />
            <Line type="monotone" dataKey="ms" stroke="#fbbf24" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="bg-card border-border p-4 md:p-6 lg:col-span-2">
        <h3 className="text-base sm:text-lg font-semibold mb-3 md:mb-4">Response Time Trend</h3>
        <ResponsiveContainer width="100%" height={250} minHeight={200}>
          <AreaChart data={responseTimeData}>
            <defs>
              <linearGradient id="colorMs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
            <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: "#1e1e2e", border: "1px solid rgba(255,255,255,0.1)" }} />
            <Area type="monotone" dataKey="ms" stroke="#fbbf24" fillOpacity={1} fill="url(#colorMs)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
