"use client"

// import { Button } from "@/components/ui/button"
// import { Calendar, MoreHorizontal } from "lucide-react"

import { DASHBOARD_TIME_RANGES } from "@/utils";

export function Header({
  timeRange,
  setTimeRange,
}: { timeRange: string; setTimeRange: (range: string) => void }) {
  return (
    <div className="modern-page-header">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="page-title truncate">Dashboard</h1>
          <p className="page-subtitle">Real-time monitoring of your applications</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div>
            <p className="field-label">Time Range</p>
            <div className="flex gap-2 flex-wrap justify-end sm:justify-start">
              {DASHBOARD_TIME_RANGES.map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`filter-chip ${timeRange === range
                    ? "filter-chip-active"
                    : ""
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
