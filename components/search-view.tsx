"use client"

import { useEffect, useMemo, useState } from "react"
import { api } from "@/api/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, AlertTriangle, ChevronRight, Clock, Copy, Database, Loader2, Search } from "lucide-react"
import { formatOTelValue } from "@/lib/otel-format"
import { toast } from "react-toastify"

type DataType = "requests" | "queries"
type HttpMethod = "ALL" | "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

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

function isRequest(item: SearchItem): item is RequestItem {
  return "httpMethod" in item
}

export function SearchView() {
  const [dataType, setDataType] = useState<DataType>("requests")
  const [method, setMethod] = useState<HttpMethod>("ALL")
  const [statusCode, setStatusCode] = useState("ALL")
  const [searchTerm, setSearchTerm] = useState("")
  const [traceId, setTraceId] = useState("")
  const [tableName, setTableName] = useState("")
  const [startTimeFrom, setStartTimeFrom] = useState("")
  const [startTimeTo, setStartTimeTo] = useState("")
  const [selectedId, setSelectedId] = useState("")
  const [items, setItems] = useState<SearchItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [logsByTraceId, setLogsByTraceId] = useState<Record<string, LinkedLogItem[]>>({})
  const [logsErrorByTraceId, setLogsErrorByTraceId] = useState<Record<string, string>>({})
  const [loadingTraceId, setLoadingTraceId] = useState("")
  const [expandedLinkedLogByTraceId, setExpandedLinkedLogByTraceId] = useState<Record<string, string>>({})

  const methods: HttpMethod[] = ["ALL", "GET", "POST", "PUT", "PATCH", "DELETE"]

  const debouncedTerm = useDebounced(searchTerm, 350)
  const debouncedTrace = useDebounced(traceId, 350)

  const activeFilters = useMemo(() => {
    const tags: string[] = []
    if (dataType === "requests" && method !== "ALL") tags.push(`Metodo: ${method}`)
    if (dataType === "requests" && statusCode !== "ALL") tags.push(`Status: ${statusCode}`)
    if (dataType === "queries" && tableName.trim()) tags.push(`Tabela: ${tableName.trim()}`)
    if (debouncedTerm.trim()) tags.push(`Busca: ${debouncedTerm.trim()}`)
    if (debouncedTrace.trim()) tags.push(`Trace: ${debouncedTrace.trim().slice(0, 12)}...`)
    if (startTimeFrom) tags.push(`De: ${startTimeFrom}`)
    if (startTimeTo) tags.push(`Ate: ${startTimeTo}`)
    return tags
  }, [dataType, method, statusCode, tableName, debouncedTerm, debouncedTrace, startTimeFrom, startTimeTo])

  async function fetchData() {
    setIsLoading(true)
    setError("")
    try {
      const params = new URLSearchParams()
      params.set("type", dataType === "requests" ? "HTTP" : "DATABASE")
      params.set("limit", "40")
      params.set("offset", "0")

      if (startTimeFrom) params.set("startTimeFrom", startTimeFrom)
      if (startTimeTo) params.set("startTimeTo", startTimeTo)

      const normalizedTerm = debouncedTerm.trim()
      const normalizedTrace = debouncedTrace.trim()

      if (normalizedTrace) params.set("traceId", normalizedTrace)

      if (dataType === "requests") {
        if (method !== "ALL") params.set("method", method)
        if (statusCode !== "ALL") params.set("statusCode", statusCode)
        if (normalizedTerm) {
          params.set("pathContains", normalizedTerm)
          params.set("q", normalizedTerm)
        }
      }

      if (dataType === "queries") {
        if (normalizedTerm) params.set("queryContains", normalizedTerm)
        if (tableName.trim()) params.set("tableName", tableName.trim())
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
    setMethod("ALL")
    setStatusCode("ALL")
    setSearchTerm("")
    setTraceId("")
    setTableName("")
    setStartTimeFrom("")
    setStartTimeTo("")
  }

  async function fetchLinkedLogs(traceIdValue: string) {
    if (!traceIdValue || logsByTraceId[traceIdValue]) return

    setLoadingTraceId(traceIdValue)
    setLogsErrorByTraceId((prev) => ({ ...prev, [traceIdValue]: "" }))

    try {
      const response = await api.get(
        `/logs?traceId=${encodeURIComponent(traceIdValue)}&severityText=ALL&limit=20&offset=0`
      )
      setLogsByTraceId((prev) => ({ ...prev, [traceIdValue]: (response.data || []) as LinkedLogItem[] }))
    } catch {
      setLogsErrorByTraceId((prev) => ({
        ...prev,
        [traceIdValue]: "Nao foi possivel carregar os logs desta request.",
      }))
    } finally {
      setLoadingTraceId("")
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
  }, [dataType])

  useEffect(() => {
    fetchData()
  }, [dataType, method, statusCode, debouncedTerm, debouncedTrace, tableName, startTimeFrom, startTimeTo])

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="page-header">
        <h1 className="text-2xl font-bold">Searches</h1>
        <p className="mt-1 text-sm text-muted-foreground">Busca unificada de requests e queries com filtros diretos.</p>
      </div>

      <div className="flex-1 overflow-auto p-5">
        <Card className="mb-6 border-border/60">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Filtros</p>
              <Button variant="ghost" size="sm" onClick={clearFilters}>Limpar</Button>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
              <div className="lg:col-span-2">
                <label className="mb-1 block text-xs text-muted-foreground">Tipo</label>
                <Select value={dataType} onValueChange={(v) => setDataType(v as DataType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="requests">Requests</SelectItem>
                    <SelectItem value="queries">Queries</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="lg:col-span-5">
                <label className="mb-1 block text-xs text-muted-foreground">
                  {dataType === "requests" ? "Path contem" : "Query contem"}
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={dataType === "requests" ? "/api/users" : "SELECT * FROM"}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="lg:col-span-5">
                <label className="mb-1 block text-xs text-muted-foreground">Trace ID</label>
                <Input value={traceId} onChange={(e) => setTraceId(e.target.value)} placeholder="Opcional" />
              </div>

              {dataType === "requests" && (
                <>
                  <div className="lg:col-span-5">
                    <label className="mb-1 block text-xs text-muted-foreground">Metodo</label>
                    <div className="flex flex-wrap gap-2">
                      {methods.map((item) => (
                        <Button
                          key={item}
                          size="sm"
                          variant={method === item ? "default" : "outline"}
                          className="h-8 px-3"
                          onClick={() => setMethod(item)}
                        >
                          {item}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <label className="mb-1 block text-xs text-muted-foreground">Status</label>
                    <Input
                      value={statusCode === "ALL" ? "" : statusCode}
                      onChange={(e) => setStatusCode(e.target.value ? e.target.value : "ALL")}
                      placeholder="Ex: 500"
                    />
                  </div>
                </>
              )}

              {dataType === "queries" && (
                <div className="lg:col-span-4">
                  <label className="mb-1 block text-xs text-muted-foreground">Tabela</label>
                  <Input value={tableName} onChange={(e) => setTableName(e.target.value)} placeholder="Ex: users" />
                </div>
              )}

              <div className="lg:col-span-2">
                <label className="mb-1 block text-xs text-muted-foreground">Data inicial</label>
                <Input type="date" value={startTimeFrom} onChange={(e) => setStartTimeFrom(e.target.value)} />
              </div>
              <div className="lg:col-span-2">
                <label className="mb-1 block text-xs text-muted-foreground">Data final</label>
                <Input type="date" value={startTimeTo} onChange={(e) => setStartTimeTo(e.target.value)} />
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-muted/40">{tag}</Badge>
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
          <Card className="border-border/50">
            <CardContent className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Carregando resultados...
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {items.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="py-14 text-center">
                  <p className="font-semibold">Nenhum resultado encontrado</p>
                  <p className="text-sm text-muted-foreground">Tente reduzir os filtros ou mudar o periodo.</p>
                </CardContent>
              </Card>
            ) : (
              items.map((item) => (
                <Card
                  key={`${item.traceId}-${item.spanId}`}
                  className="border-border/50 transition-all hover:border-border hover:shadow-none"
                >
                  <CardContent className="p-4">
                    <button
                      type="button"
                      className="flex w-full cursor-pointer items-start justify-between gap-4 text-left"
                      onClick={() => handleToggle(item)}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          {isRequest(item) ? (
                            <>
                              <Badge variant="outline" className="font-mono text-xs">{item.httpMethod}</Badge>
                              <Badge className={getStatusColor(item.httpStatus)}>{item.httpStatus}</Badge>
                              <code className="truncate text-sm">{item.httpTarget || "-"}</code>
                            </>
                          ) : (
                            <>
                              <Badge variant="outline" className="font-mono text-xs">{item.dbOperation || "QUERY"}</Badge>
                              <Badge variant="outline">{item.dbTable || "-"}</Badge>
                              <code className="truncate text-sm">{item.dbStatement || "-"}</code>
                            </>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="size-3" />{formatWhen(item.startTime)}</span>
                          <span className="flex items-center gap-1"><Activity className="size-3" />{Math.round(item.durationNs / 1_000_000)}ms</span>
                          <span className="flex items-center gap-1"><Database className="size-3" />{item.serviceName}</span>
                        </div>
                      </div>

                      <ChevronRight className={`size-4 shrink-0 transition-transform ${selectedId === item.spanId ? "rotate-90" : ""}`} />
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
                                    logsByTraceId[item.traceId].map((log, idx) => (
                                      <div
                                        key={`${log.id || idx}-${log.timestamp}`}
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
                                              const key = item.traceId
                                              const current = expandedLinkedLogByTraceId[key]
                                              const nextId = `${log.id || idx}`
                                              setExpandedLinkedLogByTraceId((prev) => ({
                                                ...prev,
                                                [key]: current === nextId ? "" : nextId,
                                              }))
                                            }}
                                          >
                                            {expandedLinkedLogByTraceId[item.traceId] === `${log.id || idx}` ? "Ocultar" : "Detalhes"}
                                          </Button>
                                        </div>
                                        <p className="line-clamp-2 text-xs text-foreground">{log.message || "Sem mensagem"}</p>

                                        {expandedLinkedLogByTraceId[item.traceId] === `${log.id || idx}` && (
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
                                    ))
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
