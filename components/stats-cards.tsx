"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, AlertTriangle, Zap, Activity } from "lucide-react"

export function StatsCards() {
  const stats = [
    {
      label: "Requests/sec",
      value: "2.4K",
      change: "+12.5%",
      icon: Activity,
      color: "text-blue-400",
    },
    {
      label: "Errors",
      value: "23",
      change: "-8.2%",
      icon: AlertTriangle,
      color: "text-red-400",
    },
    {
      label: "Avg Response",
      value: "142ms",
      change: "+2.1%",
      icon: Zap,
      color: "text-yellow-400",
    },
    {
      label: "Uptime",
      value: "99.98%",
      change: "+0.01%",
      icon: TrendingUp,
      color: "text-green-400",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card border-border p-3 sm:p-4 md:p-6">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">{stat.label}</p>
              <div className="flex items-baseline gap-1 sm:gap-2">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold truncate">{stat.value}</span>
                <span className="text-xs text-green-400 flex-shrink-0">{stat.change}</span>
              </div>
            </div>
            <div className={`${stat.color} opacity-75 flex-shrink-0`}>
              <stat.icon size={18} className="sm:size-6" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
