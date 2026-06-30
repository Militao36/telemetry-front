"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LogsTable } from "./logs-table"
import { LogsFilter } from "./logs-filter"
import { Filter, RotateCcw, Search } from "lucide-react"
import { LOG_TIME_PRESETS, TimeRangeFilter, TimeRangePreset, getPresetMinutes, toDateTimeLocalValue } from "./time-range-filter"

export type LogsFilters = {
  message: string
  searchMode: "all" | "any" | "substring"
  traceId: string
  startTime: string
  endTime: string
}

export function LogsView() {
  const [selectedLevel, setSelectedLevel] = useState("ALL")
  const [selectedTimeLabel, setSelectedTimeLabel] = useState("Ultimas 3 horas")
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

  function applyTimePreset(preset: TimeRangePreset) {
    const minutes = getPresetMinutes(preset.value)
    setSelectedTimeLabel(preset.label)

    if (preset.value === "3h") {
      setFilters((prev) => ({ ...prev, startTime: "", endTime: "" }))
      return
    }

    const end = new Date()
    const start = new Date(end.getTime() - minutes * 60_000)
    setFilters((prev) => ({
      ...prev,
      startTime: toDateTimeLocalValue(start),
      endTime: toDateTimeLocalValue(end),
    }))
  }

  function updateCustomTime(field: "startTime" | "endTime", value: string) {
    setSelectedTimeLabel("Intervalo customizado")
    updateFilter(field, value)
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
    setSelectedTimeLabel("Ultimas 3 horas")
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
    <div className="app-shell flex flex-col">
      <div className="modern-page-header">
        <h1 className="page-title">Logs</h1>
        <p className="page-subtitle">
          Logs e eventos em tempo real da sua aplicacao
        </p>
      </div>

      <div className="app-content">
        <div className="app-section">
          {/* Filters */}
          <Card className="filter-card space-y-5">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <label className="field-label">Mensagem</label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Ex: timeout, erro de banco"
                    value={filters.message}
                    onChange={(e) => updateFilter("message", e.target.value)}
                    className="control-surface pl-9 font-medium"
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
                <label className="field-label">Trace ID</label>
                <Input
                  type="text"
                  placeholder="Cole o trace completo"
                  value={filters.traceId}
                  onChange={(e) => updateFilter("traceId", e.target.value)}
                  className="control-surface font-medium"
                />
              </div>

              <div className="lg:col-span-3">
                <TimeRangeFilter
                  label="Período"
                  labelClassName="field-label"
                  triggerClassName="control-surface w-full justify-between px-4"
                  selectedLabel={selectedTimeLabel}
                  presets={LOG_TIME_PRESETS}
                  customStart={filters.startTime}
                  customEnd={filters.endTime}
                  onPresetSelect={applyTimePreset}
                  onCustomStartChange={(value) => updateCustomTime("startTime", value)}
                  onCustomEndChange={(value) => updateCustomTime("endTime", value)}
                />
              </div>

              <div className="flex items-end lg:col-span-3 lg:justify-end">
                <Button size="lg" variant="outline" onClick={clearFilters} className="w-full gap-2 rounded-xl border-slate-200 bg-white px-5 font-semibold text-slate-700 shadow-sm hover:border-primary/50 lg:w-auto dark:bg-secondary/70">
                  <RotateCcw className="h-4 w-4" />
                  Limpar filtros
                </Button>
              </div>
            </div>

            {/* Filtro de nível */}
            <div className="border-t border-border pt-4">
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
