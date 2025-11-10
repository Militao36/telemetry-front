"use client"

import { StatsCards } from "./stats-cards"
import { MetricsCharts } from "./metrics-charts"
import { RequestsTable } from "./requests-table"
import { Header } from "./header"

export function Dashboard() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden w-full">
      <Header />
      <div className="flex-1 overflow-auto">
        <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
          <StatsCards />
          <MetricsCharts />
          <RequestsTable />
        </div>
      </div>
    </div>
  )
}
