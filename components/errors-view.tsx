"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ErrorsChart } from "./errors-chart"
import { ErrorsList } from "./errors-list"
import { AlertsPanel } from "./alerts-panel"
import { AlertTriangle, Bell } from "lucide-react"
import { DASHBOARD_TIME_RANGES } from "@/utils"

export function ErrorsView() {
  const [severity, setSeverity] = useState("all")
  const [timeRange, setTimeRange] = useState("24h")

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <AlertTriangle size={24} className="text-red-400" />
              Errors & Alerts
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Track and manage application errors and system alerts</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Bell size={18} />
            Configure Alerts
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Filters */}
          <Card className="bg-card border-border p-4">
            <div className="flex gap-6 items-center flex-wrap">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Severity</p>
                <div className="flex gap-2">
                  {["all", "critical", "high", "medium", "low"].map((sev) => (
                    <button
                      key={sev}
                      onClick={() => setSeverity(sev)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors capitalize ${severity === sev
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Time Range</p>
                <div className="flex gap-2 flex-wrap">
                  {DASHBOARD_TIME_RANGES.map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${timeRange === range
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Errors</p>
              <p className="text-3xl font-bold">1,256</p>
              <p className="text-xs text-red-400 mt-2">+45% from yesterday</p>
            </Card>
            <Card className="bg-card border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">Critical</p>
              <p className="text-3xl font-bold text-red-400">12</p>
              <p className="text-xs text-orange-400 mt-2">Needs attention</p>
            </Card>
            <Card className="bg-card border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">Resolved Today</p>
              <p className="text-3xl font-bold text-green-400">8</p>
              <p className="text-xs text-green-400 mt-2">Response time: 12m</p>
            </Card>
            <Card className="bg-card border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">Error Rate</p>
              <p className="text-3xl font-bold">0.45%</p>
              <p className="text-xs text-yellow-400 mt-2">+0.12% from 1h ago</p>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ErrorsChart timeRange={timeRange} />
              <ErrorsList severity={severity} />
            </div>
            <AlertsPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
