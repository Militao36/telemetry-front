"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RequestsChart } from "./requests-chart"
import { RequestsTable } from "./requests-detailed-table"
import { RequestDetail } from "./request-detail"
import { Search } from "lucide-react"

export function RequestsView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b border-border bg-card px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold">Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">Detailed analysis of HTTP requests and responses</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">
            <div className="p-6 space-y-6">
              {/* Search and Filters */}
              <Card className="bg-card border-border p-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Search Requests</label>
                    <div className="relative">
                      <Search size={18} className="absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        placeholder="Search by endpoint, method, status..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-input border-border"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {["all", "2xx", "3xx", "4xx", "5xx"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          statusFilter === status
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {status === "all" ? "All Status" : `Status ${status}`}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Charts */}
              <RequestsChart />

              {/* Table */}
              <RequestsTable
                searchQuery={searchQuery}
                statusFilter={statusFilter}
                onSelectRequest={setSelectedRequest}
              />
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedRequest && <RequestDetail requestId={selectedRequest} onClose={() => setSelectedRequest(null)} />}
      </div>
    </div>
  )
}
