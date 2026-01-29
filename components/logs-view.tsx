"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LogsTable } from "./logs-table"
import { LogsFilter } from "./logs-filter"
import { X } from "lucide-react"

type FilterField = "message" | "traceId" | "startDate" | "endDate"

type LogFilter = {
  field: FilterField
  value: string
}

export function LogsView() {
  const [selectedLevel, setSelectedLevel] = useState("all")

  // Filtros dinâmicos (message sempre existe)
  const [filters, setFilters] = useState<LogFilter[]>([
    { field: "message", value: "" },
  ])

  function addFilter(field: FilterField) {
    setFilters((prev) =>
      prev.find((f) => f.field === field)
        ? prev
        : [...prev, { field, value: "" }]
    )
  }

  function updateFilter(field: FilterField, value: string) {
    setFilters((prev) =>
      prev.map((f) => (f.field === field ? { ...f, value } : f))
    )
  }

  function removeFilter(field: FilterField) {
    if (field === "message") return
    setFilters((prev) => prev.filter((f) => f.field !== field))
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
            {/* Botões para adicionar filtros */}
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline" onClick={() => addFilter("traceId")}>
                + Trace ID
              </Button>
              <Button size="sm" variant="outline" onClick={() => addFilter("startDate")}>
                + Data inicial
              </Button>
              <Button size="sm" variant="outline" onClick={() => addFilter("endDate")}>
                + Data final
              </Button>
            </div>

            {/* Inputs dinâmicos */}
            <div className="space-y-3">
              {filters.map((filter) => (
                <div key={filter.field} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">
                      {filter.field}
                    </label>

                    <Input
                      type={
                        filter.field === "startDate" || filter.field === "endDate"
                          ? "date"
                          : "text"
                      }
                      placeholder={`Filtrar por ${filter.field}`}
                      value={filter.value}
                      onChange={(e) =>
                        updateFilter(filter.field, e.target.value)
                      }
                      className="bg-input border-border"
                    />
                  </div>

                  {filter.field !== "message" && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeFilter(filter.field)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Filtro de nível */}
            <LogsFilter
              selectedLevel={selectedLevel}
              onChange={setSelectedLevel}
            />
          </Card>

          <LogsTable othersFilters={filters} selectedLevel={selectedLevel} />
        </div>
      </div>
    </div>
  )
}
