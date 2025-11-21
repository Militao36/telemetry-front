"use client"

import { Button } from "@/components/ui/button"
import { Calendar, MoreHorizontal } from "lucide-react"

export function Header() {
  return (
    <div className="border-b border-border bg-card px-3 sm:px-4 md:px-6 py-3 md:py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold truncate">Dashboard</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Real-time monitoring of your applications</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="gap-1 sm:gap-2 bg-transparent text-xs sm:text-sm">
            <Calendar size={16} className="sm:size-5" />
            <span className="hidden sm:inline">Last 24h</span>
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}
