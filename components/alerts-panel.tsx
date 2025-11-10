"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Plus, X } from "lucide-react"

interface Alert {
  id: number
  name: string
  condition: string
  status: "active" | "inactive"
  lastTriggered?: string
}

export function AlertsPanel() {
  const alerts: Alert[] = [
    {
      id: 1,
      name: "Error Rate > 1%",
      condition: "When error rate exceeds 1%",
      status: "active",
      lastTriggered: "2 hours ago",
    },
    {
      id: 2,
      name: "Response Time > 500ms",
      condition: "When P95 response time > 500ms",
      status: "active",
      lastTriggered: "30 minutes ago",
    },
    {
      id: 3,
      name: "Database Connection Pool",
      condition: "When connections > 80% of pool size",
      status: "active",
      lastTriggered: "1 hour ago",
    },
    {
      id: 4,
      name: "Memory Usage > 90%",
      condition: "When memory usage exceeds 90%",
      status: "inactive",
    },
    {
      id: 5,
      name: "API Downtime Detection",
      condition: "When API is unreachable for 5 minutes",
      status: "active",
    },
  ]

  return (
    <Card className="bg-card border-border overflow-hidden h-fit sticky top-6">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Bell size={20} />
          Alerts
        </h3>
        <Button size="sm" variant="ghost" className="gap-1">
          <Plus size={16} />
        </Button>
      </div>
      <div className="overflow-y-auto max-h-96">
        <div className="divide-y divide-border">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-4 hover:bg-card/50 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-semibold text-sm flex-1">{alert.name}</h4>
                <Badge
                  className={
                    alert.status === "active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                  }
                >
                  {alert.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{alert.condition}</p>
              {alert.lastTriggered && <p className="text-xs text-yellow-400">Triggered: {alert.lastTriggered}</p>}
              <div className="flex gap-1 mt-3">
                <Button size="sm" variant="outline" className="text-xs flex-1 bg-transparent">
                  Edit
                </Button>
                <Button size="sm" variant="ghost" className="px-2">
                  <X size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
