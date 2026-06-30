"use client"

import { useEffect, useState } from "react"
import { api } from "@/api/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, AlertTriangle, ChevronRight, Clock, Copy, Database, Filter, Loader2, Plus, RotateCcw } from "lucide-react"
import { formatOTelValue } from "@/lib/otel-format"
import { toast } from "react-toastify"
import { LOG_TIME_PRESETS, TimeRangeFilter, TimeRangePreset, getPresetMinutes, toDateTimeLocalValue } from "./time-range-filter"

type DataType = "requests" | "queries"
type SearchWhereOperator = "eq" | "contains" | "startsWith" | "gt" | "gte" | "lt" | "lte" | "in" | "exists" | "notExists"

type SearchWhereCondition = {
  field: string
  op: SearchWhereOperator
  value?: string | number | boolean | Array<string | number | boolean>
}

type AdvancedFilter = {
  id: string
  field: string
  op: SearchWhereOperator
  value: string
}

type RequestItem = {
  traceId: string
  spanId: string
  serviceName: string
  startTime: string
  durationNs: number
  httpMethod: string
  httpTarget: string
  httpStatus: number
}

type QueryItem = {
  traceId: string
  spanId: string
  serviceName: string
  startTime: string
  durationNs: number
  dbOperation: string
  dbTable: string
  dbStatement: string
}

type SearchItem = RequestItem | QueryItem

type LinkedLogItem = {
  id?: string
  timestamp: string
  severityText?: string
  message?: string
  serviceName?: string
  traceId?: string
  spanId?: string
  host?: string
  environment?: string
  loggerName?: string
  appVersion?: string
  attributes?: unknown
  body?: unknown
  exceptionType?: string
  exceptionMessage?: string
  exceptionStacktrace?: string
}

type LogsResponse = {
  data?: LinkedLogItem[]
  nextCursor?: string | null
}

function isRequest(item: SearchItem): item is RequestItem {
  return "httpMethod" in item
}

export function SearchView() {
  const [dataType, setDataType] = useState<DataType>("requests")
  const [advancedField, setAdvancedField] = useState("path")
  const [attributeKey, setAttributeKey] = useState("")
  const [advancedOp, setAdvancedOp] = useState<SearchWhereOperator>("contains")
  const [advancedValue, setAdvancedValue] = useState("")
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilter[]>([])
  const [traceId, setTraceId] = useState("")
  const [startTimeFrom, setStartTimeFrom] = useState("")
  const [startTimeTo, setStartTimeTo] = useState("")
  const [selectedTimeLabel, setSelectedTimeLabel] = useState("Ultimas 3 horas")
  const [selectedId, setSelectedId] = useState("")
  const [items, setItems] = useState<SearchItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [logsByTraceId, setLogsByTraceId] = useState<Record<string, LinkedLogItem[]>>({})
  const [logsErrorByTraceId, setLogsErrorByTraceId] = useState<Record<string, string>>({})
  const [loadingTraceId, setLoadingTraceId] = useState("")
  const [expandedLinkedLogByTraceId, setExpandedLinkedLogByTraceId] = useState<Record<string, string>>({})
  const [loadingLinkedLogDetailKey, setLoadingLinkedLogDetailKey] = useState("")
  const [linkedLogDetailErrors, setLinkedLogDetailErrors] = useState<Record<string, string>>({})

  const debouncedAdvancedFilters = useDebounced(advancedFilters, 350)
  const debouncedTraceId = useDebounced(traceId, 350)

  async function fetchData() {
    setIsLoading(true)
    setError("")
    try {
      const params = new URLSearchParams()
      params.set("type", dataType === "requests" ? "HTTP" : "DATABASE")
      params.set("limit", "40")
      params.set("offset", "0")

      const conditions: SearchWhereCondition[] = []

      if (startTimeFrom) conditions.push({ field: "startTime", op: "gte", value: formatDateTimeParam(startTimeFrom) })
      if (startTimeTo) conditions.push({ field: "startTime", op: "lte", value: formatDateTimeParam(startTimeTo) })
      if (debouncedTraceId.trim()) conditions.push({ field: "traceId", op: "eq", value: debouncedTraceId.trim() })

      debouncedAdvancedFilters.forEach((filter) => {
        if (["exists", "notExists"].includes(filter.op) || filter.value.trim()) {
          conditions.push({
            field: filter.field,
            op: filter.op,
            value: ["exists", "notExists"].includes(filter.op) ? undefined : normalizeFilterValue(filter.value),
          })
        }
      })

      if (conditions.length > 0) {
        params.set("where", JSON.stringify({ and: conditions }))
      }

      const response = await api.get(`/search?${params.toString()}`)
      setItems((response.data || []) as SearchItem[])
    } catch {
      setError("Nao foi possivel carregar os resultados da busca.")
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }

  function clearFilters() {
    setAdvancedField(dataType === "requests" ? "path" : "query")
    setAttributeKey("")
    setAdvancedOp("contains")
    setAdvancedValue("")
    setAdvancedFilters([])
    setTraceId("")
    setStartTimeFrom("")
    setStartTimeTo("")
    setSelectedTimeLabel("Ultimas 3 horas")
  }

  function applyTimePreset(preset: TimeRangePreset) {
    const minutes = getPresetMinutes(preset.value)
    setSelectedTimeLabel(preset.label)

    if (preset.value === "3h") {
      setStartTimeFrom("")
      setStartTimeTo("")
      return
    }

    const end = new Date()
    const start = new Date(end.getTime() - minutes * 60_000)
    setStartTimeFrom(toDateTimeLocalValue(start))
    setStartTimeTo(toDateTimeLocalValue(end))
  }

  function updateCustomTime(field: "start" | "end", value: string) {
    setSelectedTimeLabel("Intervalo customizado")

    if (field === "start") {
      setStartTimeFrom(value)
    } else {
      setStartTimeTo(value)
    }
  }

  function addAdvancedFilter() {
    const normalizedField = advancedField === "attributes" ? `attributes.${attributeKey.trim()}` : advancedField
    const valueIsOptional = ["exists", "notExists"].includes(advancedOp)

    if (!normalizedField || normalizedField === "attributes." || (!valueIsOptional && !advancedValue.trim())) return

    setAdvancedFilters((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        field: normalizedField,
        op: advancedOp,
        value: valueIsOptional ? "" : advancedValue.trim(),
      },
    ])
    setAdvancedValue("")
  }

  function removeAdvancedFilter(id: string) {
    setAdvancedFilters((prev) => prev.filter((filter) => filter.id !== id))
  }

  async function fetchLinkedLogs(traceIdValue: string) {
    if (!traceIdValue || logsByTraceId[traceIdValue]) return

    setLoadingTraceId(traceIdValue)
    setLogsErrorByTraceId((prev) => ({ ...prev, [traceIdValue]: "" }))

    try {
      const response = await api.get(
        `/logs?traceId=${encodeURIComponent(traceIdValue)}&severityText=ALL&limit=20`
      )
      const payload = normalizeLogsResponse(response.data)
      setLogsByTraceId((prev) => ({ ...prev, [traceIdValue]: payload.data }))
    } catch {
      setLogsErrorByTraceId((prev) => ({
        ...prev,
        [traceIdValue]: "Nao foi possivel carregar os logs desta request.",
      }))
    } finally {
      setLoadingTraceId("")
    }
  }

  function getLinkedLogKey(log: LinkedLogItem, idx?: number) {
    return `${log.timestamp || "no-time"}-${log.traceId || "no-trace"}-${log.spanId || "no-span"}-${idx ?? ""}`
  }

  async function fetchLinkedLogDetail(traceIdValue: string, log: LinkedLogItem, key: string) {
    if (!log.traceId || !log.spanId || log.attributes !== undefined || loadingLinkedLogDetailKey === key) return

    setLoadingLinkedLogDetailKey(key)
    setLinkedLogDetailErrors((prev) => ({ ...prev, [key]: "" }))

    try {
      const params = new URLSearchParams()
      if (log.timestamp) params.set("timestamp", log.timestamp)

      const response = await api.get(`/logs/${encodeURIComponent(log.traceId)}/${encodeURIComponent(log.spanId)}?${params.toString()}`)
      const detail = response.data as LinkedLogItem

      setLogsByTraceId((prev) => ({
        ...prev,
        [traceIdValue]: (prev[traceIdValue] || []).map((item) => (
          item.traceId === log.traceId && item.spanId === log.spanId && item.timestamp === log.timestamp
            ? { ...item, ...detail }
            : item
        )),
      }))
    } catch {
      setLinkedLogDetailErrors((prev) => ({ ...prev, [key]: "Nao foi possivel carregar os detalhes deste log." }))
    } finally {
      setLoadingLinkedLogDetailKey("")
    }
  }

  function toggleLinkedLogDetail(traceIdValue: string, log: LinkedLogItem, key: string) {
    const current = expandedLinkedLogByTraceId[traceIdValue]
    const nextId = current === key ? "" : key

    setExpandedLinkedLogByTraceId((prev) => ({
      ...prev,
      [traceIdValue]: nextId,
    }))

    if (nextId) {
      fetchLinkedLogDetail(traceIdValue, log, key)
    }
  }

  async function copyToClipboard(value: unknown, label: string) {
    const text = formatOTelValue(value)
    if (text === "-") return

    try {
      await navigator.clipboard.writeText(text)
      toast.info(`${label} copiado`)
    } catch {
      toast.error(`Nao foi possivel copiar ${label}`)
    }
  }

  function openTraceLogs(traceId?: string) {
    if (!traceId) return
    window.location.href = `/logs?traceId=${encodeURIComponent(traceId)}`
  }

  function handleToggle(item: SearchItem) {
    const newSelected = selectedId === item.spanId ? "" : item.spanId
    setSelectedId(newSelected)

    if (newSelected && isRequest(item)) {
      fetchLinkedLogs(item.traceId)
    }
  }

  useEffect(() => {
    setSelectedId("")
    setAdvancedField(dataType === "requests" ? "path" : "query")
    setAttributeKey("")
  }, [dataType])

  useEffect(() => {
    fetchData()
  }, [dataType, startTimeFrom, startTimeTo, debouncedTraceId, debouncedAdvancedFilters])

  return (
    <div className="app-shell flex flex-col">
      <div className="modern-page-header">
        <h1 className="page-title">Search</h1>
        <p className="page-subtitle">Busca unificada de requests e queries com filtros compostos.</p>
      </div>

      <div className="app-content">
        <Card className="soft-card mb-3">
          <CardContent className="space-y-4 p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Filter className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="text-base font-bold text-slate-950 dark:text-foreground">Filtros</p>
                  <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-muted-foreground">Escolha o tipo, período e adicione quantos filtros precisar.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="default" className="rounded-xl border-slate-200 bg-white px-4 font-semibold text-slate-700 shadow-sm hover:border-primary/50 dark:bg-secondary/70" onClick={clearFilters}>
                  <RotateCcw className="size-4" />
                  Limpar filtros
                </Button>
                <Button type="button" size="default" className="rounded-xl bg-primary px-4 font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90" onClick={addAdvancedFilter}>
                  <Plus className="size-4" />
                  Filtro
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 items-end gap-x-4 gap-y-3 md:grid-cols-2 xl:grid-cols-12">
              <div>
                <label className="field-label">Tipo</label>
                <Select value={dataType} onValueChange={(v) => setDataType(v as DataType)}>
                  <SelectTrigger className="control-surface w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="requests">Requests</SelectItem>
                    <SelectItem value="queries">Queries</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="xl:col-span-3">
                <TimeRangeFilter
                  label="Período"
                  labelClassName="field-label"
                  triggerClassName="control-surface w-full justify-between px-4"
                  selectedLabel={selectedTimeLabel}
                  presets={LOG_TIME_PRESETS}
                  customStart={startTimeFrom}
                  customEnd={startTimeTo}
                  onPresetSelect={applyTimePreset}
                  onCustomStartChange={(value) => updateCustomTime("start", value)}
                  onCustomEndChange={(value) => updateCustomTime("end", value)}
                />
              </div>

              <div className="xl:col-span-8">
                <label className="field-label">Trace ID</label>
                <Input className="control-surface font-medium" value={traceId} onChange={(e) => setTraceId(e.target.value)} placeholder="Trace completo" />
              </div>

              <div className={advancedField === "attributes" ? "xl:col-span-3" : "xl:col-span-4"}>
                <label className="field-label">Campo</label>
                <Select value={advancedField} onValueChange={setAdvancedField}>
                  <SelectTrigger className="control-surface w-full border-primary/35">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getAdvancedFields(dataType).map((field) => (
                      <SelectItem key={field.value} value={field.value}>{field.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {advancedField === "attributes" && (
                <div className="xl:col-span-3">
                  <label className="field-label">Nome do atributo</label>
                  <Input className="control-surface font-medium" value={attributeKey} onChange={(e) => setAttributeKey(e.target.value)} placeholder="http.target" />
                </div>
              )}

              <div className={advancedField === "attributes" ? "xl:col-span-2" : "xl:col-span-3"}>
                <label className="field-label">Operador</label>
                <Select value={advancedOp} onValueChange={(value) => setAdvancedOp(value as SearchWhereOperator)}>
                  <SelectTrigger className="control-surface w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getOperators().map((op) => (
                      <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className={advancedField === "attributes" ? "xl:col-span-4" : "xl:col-span-5"}>
                <label className="field-label">Valor</label>
                <Input
                  className="control-surface font-medium"
                  value={advancedValue}
                  onChange={(e) => setAdvancedValue(e.target.value)}
                  placeholder={["exists", "notExists"].includes(advancedOp) ? "Opcional" : "Valor"}
                  disabled={["exists", "notExists"].includes(advancedOp)}
                />
              </div>

            </div>

            {advancedFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
                <span className="text-xs font-medium text-muted-foreground">Ativos</span>
                {advancedFilters.map((filter) => (
                  <Badge key={filter.id} variant="outline" className="gap-2 bg-muted/40">
                    <span>{formatFilterLabel(filter)}</span>
                    <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => removeAdvancedFilter(filter.id)}>
                      x
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {error && (
          <Card className="mb-4 border-red-500/30 bg-red-950/35">
            <CardContent className="flex items-center gap-2 p-4 text-red-100">
              <AlertTriangle className="size-4" />
              <p className="text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <Card className="soft-card">
            <CardContent className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Carregando resultados...
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2.5">
            {items.length === 0 ? (
              <Card className="soft-card">
                <CardContent className="py-12 text-center">
                  <p className="font-semibold">Nenhum resultado encontrado</p>
                  <p className="text-sm text-muted-foreground">Tente reduzir os filtros ou mudar o periodo.</p>
                </CardContent>
              </Card>
            ) : (
              items.map((item) => (
                <Card
                  key={`${item.traceId}-${item.spanId}`}
                  className="soft-card transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/10"
                >
                  <CardContent className="p-4 sm:p-5">
                    <button
                      type="button"
                      className="flex w-full cursor-pointer items-start justify-between gap-4 text-left"
                      onClick={() => handleToggle(item)}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2.5">
                          {isRequest(item) ? (
                            <>
                              <Badge variant="outline" className="rounded-md border-primary/25 bg-primary/5 font-mono text-xs font-bold text-primary">{item.httpMethod}</Badge>
                              <Badge className={`${getStatusColor(item.httpStatus)} rounded-md px-3 font-bold`}>{item.httpStatus}</Badge>
                              <code className="truncate text-[15px] font-semibold text-slate-900 dark:text-foreground">{item.httpTarget || "-"}</code>
                            </>
                          ) : (
                            <>
                              <Badge variant="outline" className="rounded-md border-primary/25 bg-primary/5 font-mono text-xs font-bold text-primary">{item.dbOperation || "QUERY"}</Badge>
                              <Badge variant="outline" className="rounded-md bg-slate-100 font-bold text-slate-700 dark:bg-secondary/70 dark:text-foreground">{item.dbTable || "-"}</Badge>
                              <code className="truncate text-[15px] font-semibold text-slate-900 dark:text-foreground">{item.dbStatement || "-"}</code>
                            </>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-slate-500 dark:text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="size-3" />{formatWhen(item.startTime)}</span>
                          <span className="flex items-center gap-1"><Activity className="size-3" />{Math.round(item.durationNs / 1_000_000)}ms</span>
                          <span className="flex items-center gap-1"><Database className="size-3" />{item.serviceName}</span>
                        </div>
                      </div>

                      <ChevronRight className={`mt-1 size-5 shrink-0 text-primary transition-transform ${selectedId === item.spanId ? "rotate-90" : ""}`} />
                    </button>

                    {selectedId === item.spanId && (
                      <div
                        className="mt-4 grid gap-3 border-t border-border pt-4 text-xs sm:grid-cols-2"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-muted-foreground">Trace ID</p>
                            {item.traceId && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 text-[11px] cursor-pointer"
                                onClick={() => openTraceLogs(item.traceId)}
                              >
                                Ver trace completo
                              </Button>
                            )}
                          </div>
                          <p className="break-all font-mono">{item.traceId}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Span ID</p>
                          <p className="break-all font-mono">{item.spanId}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Inicio</p>
                          <p className="font-mono">{new Date(item.startTime).toLocaleString("pt-BR")}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Servico</p>
                          <p className="font-mono">{item.serviceName}</p>
                        </div>

                        {isRequest(item) && (
                          <div className="sm:col-span-2">
                            <div className="mb-2 flex items-center justify-between">
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Logs vinculados
                              </p>
                              {logsByTraceId[item.traceId] && (
                                <Badge variant="outline">{logsByTraceId[item.traceId].length} logs</Badge>
                              )}
                            </div>

                            {loadingTraceId === item.traceId && (
                              <div className="rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
                                Carregando logs desta request...
                              </div>
                            )}

                            {logsErrorByTraceId[item.traceId] && (
                              <div className="space-y-2 rounded-md border border-red-500/30 bg-red-950/35 p-3 text-xs text-red-100">
                                <p>{logsErrorByTraceId[item.traceId]}</p>
                                <Button size="sm" variant="outline" onClick={() => fetchLinkedLogs(item.traceId)}>
                                  Tentar novamente
                                </Button>
                              </div>
                            )}

                            {!loadingTraceId &&
                              !logsErrorByTraceId[item.traceId] &&
                              logsByTraceId[item.traceId] && (
                                <div className="space-y-2 rounded-md border border-border bg-background p-2">
                                  {logsByTraceId[item.traceId].length === 0 ? (
                                    <p className="p-2 text-xs text-muted-foreground">Nenhum log encontrado para este trace.</p>
                                  ) : (
                                    logsByTraceId[item.traceId].map((log, idx) => {
                                      const linkedLogKey = getLinkedLogKey(log, idx)

                                      return (
                                      <div
                                        key={linkedLogKey}
                                        className="rounded border border-border/70 p-2"
                                      >
                                        <div className="mb-1 flex items-start justify-between gap-2">
                                          <div className="flex min-w-0 items-center gap-2">
                                            <Badge className={`${getLogLevelColor(log.severityText)} text-[10px]`}>
                                              {(log.severityText || "INFO").toUpperCase()}
                                            </Badge>
                                            <span className="text-[11px] text-muted-foreground">{formatWhen(log.timestamp)}</span>
                                            {log.serviceName && (
                                              <span className="rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                                                {log.serviceName}
                                              </span>
                                            )}
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 px-2 text-[11px]"
                                            onClick={(event) => {
                                              event.stopPropagation()
                                              toggleLinkedLogDetail(item.traceId, log, linkedLogKey)
                                            }}
                                          >
                                            {expandedLinkedLogByTraceId[item.traceId] === linkedLogKey ? "Ocultar" : "Detalhes"}
                                          </Button>
                                        </div>
                                        <p className="line-clamp-2 text-xs text-foreground">{log.message || "Sem mensagem"}</p>

                                        {expandedLinkedLogByTraceId[item.traceId] === linkedLogKey && (
                                          <div className="mt-2 space-y-2 border-t border-border/60 pt-2">
                                            <div className="grid grid-cols-1 gap-2 text-[11px] sm:grid-cols-2">
                                              <div>
                                                <div className="flex items-center gap-2">
                                                  <p className="text-muted-foreground">Trace ID</p>
                                                  {log.traceId && (
                                                    <>
                                                      <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        className="h-6 w-6"
                                                        onClick={() => copyToClipboard(log.traceId, "Trace ID")}
                                                      >
                                                        <Copy className="h-3.5 w-3.5" />
                                                      </Button>
                                                      <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-6 px-2 text-[11px] cursor-pointer"
                                                        onClick={() => openTraceLogs(log.traceId)}
                                                      >
                                                        Ver trace completo
                                                      </Button>
                                                    </>
                                                  )}
                                                </div>
                                                <p className="break-all font-mono text-foreground">{log.traceId || "-"}</p>
                                              </div>
                                              <div>
                                                <div className="flex items-center gap-2">
                                                  <p className="text-muted-foreground">Span ID</p>
                                                  {log.spanId && (
                                                    <Button
                                                      type="button"
                                                      variant="ghost"
                                                      size="icon-sm"
                                                      className="h-6 w-6"
                                                      onClick={() => copyToClipboard(log.spanId, "Span ID")}
                                                    >
                                                      <Copy className="h-3.5 w-3.5" />
                                                    </Button>
                                                  )}
                                                </div>
                                                <p className="break-all font-mono text-foreground">{log.spanId || "-"}</p>
                                              </div>
                                              <div>
                                                <p className="text-muted-foreground">Host</p>
                                                <p className="break-all font-mono text-foreground">{log.host || "-"}</p>
                                              </div>
                                              <div>
                                                <p className="text-muted-foreground">Environment</p>
                                                <p className="font-mono text-foreground">{log.environment || "-"}</p>
                                              </div>
                                              <div>
                                                <p className="text-muted-foreground">Logger</p>
                                                <p className="break-all font-mono text-foreground">{log.loggerName || "-"}</p>
                                              </div>
                                              <div>
                                                <p className="text-muted-foreground">Versao app</p>
                                                <p className="font-mono text-foreground">{log.appVersion || "-"}</p>
                                              </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                                              <div>
                                                <div className="flex items-center justify-between gap-2">
                                                  <p className="text-[11px] text-muted-foreground">Attributes</p>
                                                  {formatOTelValue(log.attributes) !== "-" && (
                                                    <Button
                                                      type="button"
                                                      variant="ghost"
                                                      size="sm"
                                                      className="h-6 px-2 text-[11px]"
                                                      onClick={() => copyToClipboard(log.attributes, "Attributes")}
                                                    >
                                                      <Copy className="h-3.5 w-3.5" />
                                                      Copiar
                                                    </Button>
                                                  )}
                                                </div>
                                                <pre className="mt-1 max-h-[400px] min-h-80 overflow-auto whitespace-pre-wrap break-words rounded border border-border/70 bg-muted/20 p-2 font-mono text-[11px] text-foreground">
                                                  {formatOTelValue(log.attributes)}
                                                </pre>
                                              </div>
                                              <div>
                                                <div className="flex items-center justify-between gap-2">
                                                  <p className="text-[11px] text-muted-foreground">Body</p>
                                                  {formatOTelValue(log.body) !== "-" && (
                                                    <Button
                                                      type="button"
                                                      variant="ghost"
                                                      size="sm"
                                                      className="h-6 px-2 text-[11px]"
                                                      onClick={() => copyToClipboard(log.body, "Body")}
                                                    >
                                                      <Copy className="h-3.5 w-3.5" />
                                                      Copiar
                                                    </Button>
                                                  )}
                                                </div>
                                                <pre className="mt-1 max-h-[400px] min-h-80 overflow-auto whitespace-pre-wrap break-words rounded border border-border/70 bg-muted/20 p-2 font-mono text-[11px] text-foreground">
                                                  {formatOTelValue(log.body)}
                                                </pre>
                                              </div>
                                            </div>

                                            {loadingLinkedLogDetailKey === linkedLogKey && (
                                              <div className="flex items-center gap-2 rounded border border-border/70 bg-muted/20 p-2 text-[11px] text-muted-foreground">
                                                <Loader2 className="size-3 animate-spin" />
                                                Carregando detalhes do log...
                                              </div>
                                            )}

                                            {linkedLogDetailErrors[linkedLogKey] && (
                                              <div className="rounded border border-red-500/30 bg-red-950/35 p-2 text-[11px] text-red-100">
                                                {linkedLogDetailErrors[linkedLogKey]}
                                              </div>
                                            )}

                                            {(log.exceptionType || log.exceptionMessage || log.exceptionStacktrace) && (
                                              <div className="rounded border border-red-500/30 bg-red-950/35 p-2">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-red-200">Exception</p>
                                                <p className="text-[11px] text-red-100">{log.exceptionType || "Exception"}</p>
                                                {log.exceptionMessage && <p className="mt-1 text-xs text-red-100">{log.exceptionMessage}</p>}
                                                {log.exceptionStacktrace && (
                                                  <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-words rounded border border-red-500/30 bg-background/70 p-2 font-mono text-[11px] text-red-100">
                                                    {log.exceptionStacktrace}
                                                  </pre>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                      )
                                    })
                                  )}
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
          <p>Mostrando <span className="font-medium text-foreground">{items.length}</span> registros</p>
          <p className="flex items-center gap-1"><Activity className="size-4" />Atualizado agora</p>
        </div>
      </div>
    </div>
  )
}

function getStatusColor(status?: number) {
  if (!status) return "bg-muted text-muted-foreground"
  if (status >= 200 && status < 300) return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-200"
  if (status >= 400 && status < 500) return "bg-amber-500/15 text-amber-700 dark:text-amber-200"
  if (status >= 500) return "bg-red-500/15 text-red-700 dark:text-red-200"
  return "bg-muted text-muted-foreground"
}

function getLogLevelColor(level?: string) {
  const normalized = (level || "INFO").toUpperCase()
  if (normalized === "ERROR") return "bg-red-500/15 text-red-700 dark:text-red-200"
  if (normalized === "WARNING") return "bg-amber-500/15 text-amber-700 dark:text-amber-200"
  if (normalized === "CRITICAL") return "bg-rose-500/15 text-rose-700 dark:text-rose-200"
  if (normalized === "DEBUG") return "bg-zinc-500/15 text-zinc-700 dark:text-zinc-200"
  return "bg-blue-500/15 text-blue-700 dark:text-blue-200"
}

function formatWhen(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const diff = Date.now() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  if (minutes < 1) return "agora"
  if (minutes < 60) return `${minutes}m atras`
  if (hours < 24) return `${hours}h atras`
  return date.toLocaleDateString("pt-BR")
}

function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debounced
}

function normalizeLogsResponse(value: unknown): { data: LinkedLogItem[]; nextCursor: string | null } {
  if (Array.isArray(value)) {
    return { data: value as LinkedLogItem[], nextCursor: null }
  }

  const payload = value as LogsResponse
  return {
    data: payload?.data || [],
    nextCursor: payload?.nextCursor || null,
  }
}

function getAdvancedFields(dataType: DataType) {
  const common = [
    { value: "serviceName", label: "Service name" },
    { value: "environment", label: "Environment" },
    { value: "durationNs", label: "Duration ns" },
    { value: "attributes", label: "Attributes.<chave>" },
  ]

  if (dataType === "requests") {
    return [
      { value: "path", label: "Path" },
      { value: "method", label: "Metodo HTTP" },
      { value: "statusCode", label: "Status code" },
      ...common,
    ]
  }

  return [
    { value: "query", label: "SQL/query" },
    { value: "tableName", label: "Tabela" },
    { value: "operation", label: "Operacao" },
    ...common,
  ]
}

function getOperators(): Array<{ value: SearchWhereOperator; label: string }> {
  return [
    { value: "contains", label: "contem" },
    { value: "eq", label: "igual" },
    { value: "startsWith", label: "comeca com" },
    { value: "gt", label: ">" },
    { value: "gte", label: ">=" },
    { value: "lt", label: "<" },
    { value: "lte", label: "<=" },
    { value: "exists", label: "existe" },
    { value: "notExists", label: "nao existe" },
  ]
}

function normalizeFilterValue(value: string) {
  const trimmed = value.trim()
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed)
  if (trimmed.toLowerCase() === "true") return true
  if (trimmed.toLowerCase() === "false") return false
  return trimmed
}

function formatFilterLabel(filter: AdvancedFilter) {
  return `${filter.field} ${filter.op}${filter.value ? ` ${filter.value}` : ""}`
}

function formatDateTimeParam(value: string) {
  if (!value.includes("T")) return value

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const pad = (part: number, size = 2) => part.toString().padStart(size, "0")
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}.${pad(date.getUTCMilliseconds(), 3)}`
}
