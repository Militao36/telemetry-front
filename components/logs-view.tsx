"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LogsTable } from "./logs-table"
import { LogsFilter } from "./logs-filter"
import { CalendarDays, Filter, RotateCcw, Search } from "lucide-react"

export type LogsFilters = {
  message: string
  searchMode: "all" | "any" | "substring"
  traceId: string
  startTime: string
  endTime: string
}

export function LogsView() {
  const [selectedLevel, setSelectedLevel] = useState("ALL")
  const [filters, setFilters] = useState<LogsFilters>({
    message: "",
    searchMode: "all",
    traceId: getTraceIdFromUrl(),
    startTime: "",
    endTime: "",
  })

  function updateFilter(field: keyof LogsFilters, value: string) {
    setFilters((prev) => ({ ...prev, [field]: value }))

    if (field === "traceId") {
      updateTraceIdInUrl(value)
    }
  }

  function viewTrace(traceId: string) {
    setFilters((prev) => ({ ...prev, traceId }))
    updateTraceIdInUrl(traceId, true)
  }

  function clearFilters() {
    setSelectedLevel("ALL")
    setFilters({
      message: "",
      searchMode: "all",
      traceId: "",
      startTime: "",
      endTime: "",
    })
    updateTraceIdInUrl("")
  }

  useEffect(() => {
    const handlePopState = () => {
      setFilters((prev) => ({ ...prev, traceId: getTraceIdFromUrl() }))
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

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
                    placeholder="Ex: timeout, erro de banco"
                    value={filters.message}
                    onChange={(e) => updateFilter("message", e.target.value)}
                    className="border-border bg-input pl-9"
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={filters.searchMode === "all" ? "default" : "outline"}
                    onClick={() => updateFilter("searchMode", "all")}
                  >
                    Todos os termos
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={filters.searchMode === "any" ? "default" : "outline"}
                    onClick={() => updateFilter("searchMode", "any")}
                  >
                    Qualquer termo
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={filters.searchMode === "substring" ? "default" : "outline"}
                    onClick={() => updateFilter("searchMode", "substring")}
                  >
                    Texto exato
                  </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Todos os termos: mais preciso. Qualquer termo: mais abrangente. Texto exato: busca literal.
                </p>
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

          <LogsTable filters={filters} selectedLevel={selectedLevel} onViewTrace={viewTrace} />
        </div>
      </div>
    </div>
  )
}

function getTraceIdFromUrl() {
  if (typeof window === "undefined") return ""
  return new URLSearchParams(window.location.search).get("traceId") || ""
}

function updateTraceIdInUrl(traceId: string, push = false) {
  if (typeof window === "undefined") return

  const url = new URL(window.location.href)
  if (traceId.trim()) {
    url.searchParams.set("traceId", traceId.trim())
  } else {
    url.searchParams.delete("traceId")
  }

  const nextUrl = `${url.pathname}${url.search}`
  if (nextUrl === `${window.location.pathname}${window.location.search}`) return

  if (push) {
    window.history.pushState(null, "", nextUrl)
  } else {
    window.history.replaceState(null, "", nextUrl)
  }
}
