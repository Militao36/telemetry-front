"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"

interface Log {
  id: number
  timestamp: string
  level: "info" | "warning" | "error" | "critical" | "debug"
  project: string
  endpoint: string
  message: string
  userId: string
  statusCode?: number
  duration?: string
  details?: string
}

export function LogsTable({ searchQuery, selectedLevel }: { searchQuery: string; selectedLevel: string }) {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const logs: Log[] = [
    {
      id: 1,
      timestamp: "2024-11-10 14:32:15.245",
      level: "info",
      project: "E-Commerce API",
      endpoint: "POST /api/orders",
      message: "Order created successfully",
      userId: "user_123",
      statusCode: 201,
      duration: "145ms",
      details: "Order ID: 89234 | Items: 3 | Total: $250.00",
    },
    {
      id: 2,
      timestamp: "2024-11-10 14:32:08.892",
      level: "error",
      project: "Payment Service",
      endpoint: "POST /api/charge",
      message: "Payment gateway timeout",
      userId: "user_456",
      statusCode: 504,
      duration: "30000ms",
      details: "Gateway: Stripe | Attempt: 3/3 | Retry queue added",
    },
    {
      id: 3,
      timestamp: "2024-11-10 14:31:45.123",
      level: "warning",
      project: "Mobile App API",
      endpoint: "GET /api/users/profile",
      message: "Slow query detected",
      userId: "user_789",
      statusCode: 200,
      duration: "2850ms",
      details: "Query time: 2.8s | Index scan | Cache: MISS",
    },
    {
      id: 4,
      timestamp: "2024-11-10 14:31:23.456",
      level: "info",
      project: "Analytics Dashboard",
      endpoint: "GET /api/metrics",
      message: "Metrics aggregation completed",
      userId: "system",
      statusCode: 200,
      duration: "1250ms",
      details: "Records processed: 50000 | Cache: HIT",
    },
    {
      id: 5,
      timestamp: "2024-11-10 14:30:12.789",
      level: "critical",
      project: "Real-Time Chat",
      endpoint: "WS /chat/connect",
      message: "WebSocket connection pool exhausted",
      userId: "N/A",
      statusCode: 503,
      duration: "N/A",
      details: "Active connections: 10000/10000 | Scaling triggered",
    },
    {
      id: 6,
      timestamp: "2024-11-10 14:29:45.234",
      level: "debug",
      project: "E-Commerce API",
      endpoint: "GET /api/products/search",
      message: "Search query parameters validated",
      userId: "user_321",
      statusCode: 200,
      duration: "45ms",
      details: 'Query: "laptop" | Filters: category,price | Results: 342',
    },
  ]

  const getLevelColor = (level: Log["level"]) => {
    const colors = {
      info: "bg-blue-500/20 text-blue-400",
      warning: "bg-yellow-500/20 text-yellow-400",
      error: "bg-red-500/20 text-red-400",
      critical: "bg-purple-500/20 text-purple-400",
      debug: "bg-gray-500/20 text-gray-400",
    }
    return colors[level]
  }

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userId.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesLevel = selectedLevel === "all" || log.level === selectedLevel

    return matchesSearch && matchesLevel
  })

  return (
    <div className="space-y-2">
      {filteredLogs.map((log) => (
        <Card
          key={log.id}
          className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer overflow-hidden"
          onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
        >
          <div className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={`${getLevelColor(log.level)} flex-shrink-0 text-xs uppercase`}>{log.level}</Badge>
                  <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                  <span className="text-xs text-muted-foreground">{log.project}</span>
                </div>
                <p className="font-mono text-sm text-muted-foreground mb-2">{log.endpoint}</p>
                <p className="text-sm text-foreground">{log.message}</p>
              </div>
              <ChevronRight size={20} className="flex-shrink-0 text-muted-foreground" />
            </div>

            {expandedId === log.id && (
              <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">User ID:</span>
                    <p className="font-mono text-foreground mt-1">{log.userId}</p>
                  </div>
                  {log.statusCode && (
                    <div>
                      <span className="text-muted-foreground">Status Code:</span>
                      <p className="font-mono text-foreground mt-1">{log.statusCode}</p>
                    </div>
                  )}
                  {log.duration && (
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <p className="font-mono text-foreground mt-1">{log.duration}</p>
                    </div>
                  )}
                </div>
                {log.details && (
                  <div>
                    <span className="text-xs text-muted-foreground">Details:</span>
                    <p className="font-mono text-xs text-foreground mt-2 bg-background/50 p-3 rounded border border-border/50">
                      {log.details}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      ))}

      {filteredLogs.length === 0 && (
        <Card className="bg-card border-border p-12 text-center">
          <p className="text-muted-foreground">No logs found matching your filters</p>
        </Card>
      )}
    </div>
  )
}
