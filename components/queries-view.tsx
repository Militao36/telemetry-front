"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QueriesChart } from "./queries-chart"
import { QueriesTable } from "./queries-table"
import { RefreshCw } from "lucide-react"

export function QueriesView() {
  const [queryType, setQueryType] = useState("all")
  const [timeRange, setTimeRange] = useState("24h")

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Query Performance</h1>
            <p className="text-sm text-muted-foreground mt-1">Monitor SELECT and INSERT query performance</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <RefreshCw size={18} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Filters */}
          <Card className="bg-card border-border p-4">
            <div className="flex gap-4 items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Query Type</p>
                <div className="flex gap-2">
                  {["all", "select", "insert", "update", "delete"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setQueryType(type)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors capitalize ${
                        queryType === type
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Time Range</p>
                <div className="flex gap-2">
                  {["1h", "24h", "7d", "30d"].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        timeRange === range
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Queries</p>
              <p className="text-3xl font-bold">284,567</p>
              <p className="text-xs text-green-400 mt-2">+12.5% from yesterday</p>
            </Card>
            <Card className="bg-card border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">Avg Query Time</p>
              <p className="text-3xl font-bold">245ms</p>
              <p className="text-xs text-yellow-400 mt-2">+8% slower than last week</p>
            </Card>
            <Card className="bg-card border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">Slowest Query</p>
              <p className="text-3xl font-bold">12.5s</p>
              <p className="text-xs text-red-400 mt-2">Unindexed join detected</p>
            </Card>
          </div>

          {/* Charts */}
          <QueriesChart queryType={queryType} timeRange={timeRange} />

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <QueriesTable title="Slowest SELECT Queries" type="select" />
            <QueriesTable title="Slowest INSERT Queries" type="insert" />
          </div>
        </div>
      </div>
    </div>
  )
}
