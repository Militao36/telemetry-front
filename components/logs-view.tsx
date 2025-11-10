"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LogsTable } from "./logs-table"
import { LogsFilter } from "./logs-filter"
import { Search, Download, RefreshCw } from "lucide-react"

export function LogsView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [autoRefresh, setAutoRefresh] = useState(true)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b border-border bg-card px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold">Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time application logs and events</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-4">
          {/* Search and Filters */}
          <Card className="bg-card border-border p-4">
            <div className="space-y-4">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Search Logs</label>
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      placeholder="Search by message, user, endpoint..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-input border-border"
                    />
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Download size={16} />
                  Export
                </Button>
                <Button
                  variant={autoRefresh ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className="gap-2"
                >
                  <RefreshCw size={16} className={autoRefresh ? "animate-spin" : ""} />
                  Auto
                </Button>
              </div>

              <LogsFilter selectedLevel={selectedLevel} onChange={setSelectedLevel} />
            </div>
          </Card>

          {/* Logs Table */}
          <LogsTable searchQuery={searchQuery} selectedLevel={selectedLevel} />
        </div>
      </div>
    </div>
  )
}
