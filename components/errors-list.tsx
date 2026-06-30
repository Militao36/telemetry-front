"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { useState } from "react"

interface Error {
  id: number
  type: string
  message: string
  severity: "critical" | "high" | "medium" | "low"
  count: number
  lastOccurrence: string
  status: "open" | "acknowledged" | "resolved"
  project: string
}

export function ErrorsList({ severity }: { severity: string }) {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const errors: Error[] = [
    {
      id: 1,
      type: "TimeoutError",
      message: "Payment gateway timeout - max retries exceeded",
      severity: "critical",
      count: 12,
      lastOccurrence: "2 minutes ago",
      status: "open",
      project: "Payment Service",
    },
    {
      id: 2,
      type: "OutOfMemoryError",
      message: "Heap space exhausted during batch processing",
      severity: "critical",
      count: 8,
      lastOccurrence: "5 minutes ago",
      status: "acknowledged",
      project: "Analytics Dashboard",
    },
    {
      id: 3,
      type: "ConnectionError",
      message: "Database connection pool exhausted",
      severity: "high",
      count: 45,
      lastOccurrence: "30 seconds ago",
      status: "open",
      project: "E-Commerce API",
    },
    {
      id: 4,
      type: "ValidationError",
      message: "Invalid email format in user registration",
      severity: "medium",
      count: 156,
      lastOccurrence: "1 minute ago",
      status: "resolved",
      project: "Mobile App API",
    },
    {
      id: 5,
      type: "RateLimitError",
      message: "API rate limit exceeded for IP 192.168.1.1",
      severity: "low",
      count: 234,
      lastOccurrence: "10 seconds ago",
      status: "open",
      project: "Real-Time Chat",
    },
  ]

  const getSeverityColor = (sev: Error["severity"]) => {
    const colors = {
      critical: "bg-red-500/20 text-red-400",
      high: "bg-orange-500/20 text-orange-400",
      medium: "bg-yellow-500/20 text-yellow-400",
      low: "bg-blue-500/20 text-blue-400",
    }
    return colors[sev]
  }

  const getStatusColor = (status: Error["status"]) => {
    const colors = {
      open: "bg-red-500/20 text-red-400",
      acknowledged: "bg-yellow-500/20 text-yellow-400",
      resolved: "bg-green-500/20 text-green-400",
    }
    return colors[status]
  }

  const filteredErrors = errors.filter((error) => severity === "all" || error.severity === severity)

  return (
    <Card className="soft-card overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold">Recent Errors</h3>
      </div>
      <div className="divide-y divide-border">
        {filteredErrors.map((error) => (
          <div
            key={error.id}
            className="p-4 hover:bg-secondary/35 transition-colors cursor-pointer border-b border-border/70"
          >
            <div onClick={() => setExpandedId(expandedId === error.id ? null : error.id)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={`${getSeverityColor(error.severity)} text-xs uppercase flex-shrink-0`}>
                      {error.severity}
                    </Badge>
                    <Badge className={`${getStatusColor(error.status)} text-xs capitalize flex-shrink-0`}>
                      {error.status}
                    </Badge>
                    <span className="text-xs text-foreground">{error.project}</span>
                  </div>
                  <p className="font-mono text-sm text-red-400 mb-1">{error.type}</p>
                  <p className="text-sm text-foreground">{error.message}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-lg font-bold">{error.count}</p>
                    <p className="text-xs text-muted-foreground">{error.lastOccurrence}</p>
                  </div>
                  <ChevronRight size={20} className="text-muted-foreground" />
                </div>
              </div>

              {expandedId === error.id && (
                <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Stack Trace</p>
                    <div className="bg-secondary/45 p-3 rounded border border-border text-xs font-mono text-slate-700 dark:text-emerald-100/90 overflow-x-auto max-h-32">
                      {`at PaymentService.processCharge (payments.ts:125:14)
at ChainablePromiseAll (bluebird.js:1445:32)
at handler.middleware (middleware.ts:45:28)
at Layer.handle [as handle_request] (express/lib/router/layer.js:95:5)
at next (express/lib/router/route.js:137:14)`}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Mark Resolved
                    </Button>
                    <Button size="sm" variant="outline">
                      View Logs
                    </Button>
                    <Button size="sm" variant="outline">
                      Assign
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
