"use client"

// import { Button } from "@/components/ui/button"
// import { Calendar, MoreHorizontal } from "lucide-react"

export function Header({
  timeRange,
  setTimeRange,
}: { timeRange: string; setTimeRange: (range: string) => void }) {
  return (
    <div className="border-b border-border bg-card px-3 sm:px-4 md:px-6 py-3 md:py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold truncate">Dashboard</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Real-time monitoring of your applications</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Time Range</p>
            <div className="flex gap-2">
              {["1h", "24h", "7d", "30d"].map((range) => (
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
      </div>
    </div>
  )
}
