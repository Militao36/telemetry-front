"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LogsTable } from "./logs-table"
import { LogsFilter } from "./logs-filter"
import { CalendarDays, Filter, RotateCcw, Search } from "lucide-react"

export type LogsFilters = {
  message: string
  traceId: string
  startTime: string
  endTime: string
}

export function LogsView() {
  const [selectedLevel, setSelectedLevel] = useState("ALL")
  const [filters, setFilters] = useState<LogsFilters>({
    message: "",
    traceId: "",
    startTime: "",
    endTime: "",
  })

  function updateFilter(field: keyof LogsFilters, value: string) {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  function clearFilters() {
    setSelectedLevel("ALL")
    setFilters({
      message: "",
      traceId: "",
      startTime: "",
      endTime: "",
    })
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <h1 className="text-2xl font-bold">Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time application logs and events
        </p>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-4">
          {/* Filters */}
          <Card className="bg-card border-border p-4 space-y-4">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <label className="mb-1 block text-sm font-medium text-muted-foreground">Mensagem</label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Ex: timeout, nota fiscal, erro de banco"
                    value={filters.message}
                    onChange={(e) => updateFilter("message", e.target.value)}
                    className="border-border bg-input pl-9"
                  />
                </div>
              </div>

              <div className="lg:col-span-3">
                <label className="mb-1 block text-sm font-medium text-muted-foreground">Trace ID</label>
                <Input
                  type="text"
                  placeholder="Cole o trace completo"
                  value={filters.traceId}
                  onChange={(e) => updateFilter("traceId", e.target.value)}
                  className="border-border bg-input"
                />
              </div>

              <div className="lg:col-span-3">
                <label className="mb-1 block text-sm font-medium text-muted-foreground">Data inicial</label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="date"
                    value={filters.startTime}
                    onChange={(e) => updateFilter("startTime", e.target.value)}
                    className="border-border bg-input pl-9"
                  />
                </div>
              </div>

              <div className="lg:col-span-3">
                <label className="mb-1 block text-sm font-medium text-muted-foreground">Data final</label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="date"
                    value={filters.endTime}
                    onChange={(e) => updateFilter("endTime", e.target.value)}
                    className="border-border bg-input pl-9"
                  />
                </div>
              </div>

              <div className="flex items-end lg:col-span-3 lg:justify-end">
                <Button size="sm" variant="ghost" onClick={clearFilters} className="w-full gap-2 lg:w-auto">
                  <RotateCcw className="h-4 w-4" />
                  Limpar filtros
                </Button>
              </div>
            </div>

            {/* Filtro de nível */}
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Filter className="h-3.5 w-3.5" />
                Nível do log
              </p>
              <LogsFilter selectedLevel={selectedLevel} onChange={setSelectedLevel} />
            </div>
          </Card>

          <LogsTable filters={filters} selectedLevel={selectedLevel} />
        </div>
      </div>
    </div>
  )
}
