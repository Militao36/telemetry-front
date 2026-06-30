"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
  import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, ChevronRight, Copy, Loader2 } from "lucide-react"
import { api } from "@/api/api"
import { cn } from "@/lib/utils"
import { formatOTelValue } from "@/lib/otel-format"
import { toast } from "react-toastify"
import type { LogsFilters } from "./logs-view"

interface Log {
  id: number
  timestamp: string;
  traceId: string;
  spanId: string;
  severityText: "INFO" | "WARNING" | "ERROR" | "CRITICAL" | "DEBUG" | "info" | "warning" | "error" | "critical" | "debug";
  severity_number: number;
  serviceName: string;
  environment: string;
  host: string;
  appVersion: string;
  loggerName: string;
  message: string;
  attributes: unknown;
  body: unknown;
  exceptionType: string;
  exceptionMessage: string;
  exceptionStacktrace: string;
}

type LogsResponse = {
  data?: Log[]
  nextCursor?: string | null
}

export function LogsTable({
  filters,
  selectedLevel,
  onViewTrace,
}: {
  filters: LogsFilters
  selectedLevel: string
  onViewTrace: (traceId: string) => void
}) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
  const [logs, setLogs] = useState<Log[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingDetailKey, setLoadingDetailKey] = useState<string | null>(null)
  const [detailErrors, setDetailErrors] = useState<Record<string, string>>({})
  const debouncedMessage = useDebounced(filters.message, 700)
  const debouncedTraceId = useDebounced(filters.traceId, 700)

  const getLevelColor = (level?: Log["severityText"]) => {
    const normalized = (level || "INFO").toUpperCase()
    const colors = {
      INFO: "bg-blue-500/15 text-blue-700 border-blue-400/70 dark:bg-blue-500/25 dark:text-blue-100",
      WARNING: "bg-amber-500/15 text-amber-700 border-amber-400/70 dark:bg-amber-500/25 dark:text-amber-100",
      ERROR: "bg-red-500/15 text-red-700 border-red-400/70 dark:bg-red-500/25 dark:text-red-100",
      CRITICAL: "bg-rose-500/15 text-rose-700 border-rose-400/70 dark:bg-rose-500/25 dark:text-rose-100",
      DEBUG: "bg-slate-500/25 text-slate-700 border-slate-400/70 dark:text-slate-100",
    }
    return colors[normalized as keyof typeof colors] ?? colors.INFO
  }

  const getLevelAccent = (level?: Log["severityText"]) => {
    const normalized = (level || "INFO").toUpperCase()
    const colors = {
      INFO: "bg-blue-500",
      WARNING: "bg-amber-500",
      ERROR: "bg-red-500",
      CRITICAL: "bg-rose-500",
      DEBUG: "bg-zinc-500",
    }
    return colors[normalized as keyof typeof colors] ?? colors.INFO
  }

  const formatTimestamp = (value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "medium",
    }).format(date)
  }

  const formatPreview = (value: unknown, maxLength = 260) => {
    const text = formatOTelValue(value)
    if (text.length <= maxLength) return text

    return `${text.slice(0, maxLength).trimEnd()}...`
  }

  const copyToClipboard = async (value: unknown, label: string) => {
    const text = formatOTelValue(value)
    if (text === "-") return

    try {
      await navigator.clipboard.writeText(text)
      toast.info(`${label} copiado`)
    } catch {
      toast.error(`Nao foi possivel copiar ${label}`)
    }
  }

  const hasExceptionData = (log: Log) => {
    return Boolean(log.exceptionType || log.exceptionMessage || log.exceptionStacktrace)
  }

  function getLogKey(log: Log, idx?: number) {
    return `${log.timestamp ?? "no-time"}-${log.traceId ?? "no-trace"}-${log.spanId ?? "no-span"}-${idx ?? ""}`
  }

  function buildLogsUrl(cursor?: string | null) {
    const queryParams = new URLSearchParams()
    queryParams.set("severityText", selectedLevel)

    if (debouncedMessage.trim()) {
      queryParams.set("message", debouncedMessage.trim())
      queryParams.set("searchMode", filters.searchMode)
    }
    if (debouncedTraceId.trim()) queryParams.set("traceId", debouncedTraceId.trim())
    if (filters.startTime) queryParams.set("startTime", filters.startTime)
    if (filters.endTime) queryParams.set("endTime", filters.endTime)
    if (cursor) queryParams.set("cursor", cursor)

    return `/logs?${queryParams.toString()}`
  }

  async function findLogs(cursor?: string | null) {
    const isLoadingNextPage = Boolean(cursor)
    if (isLoadingNextPage) {
      setIsLoadingMore(true)
    } else {
      setIsLoading(true)
      setLogs([])
      setNextCursor(null)
      setExpandedKey(null)
      setDetailErrors({})
    }
    setError(null)
    try {
      const url = buildLogsUrl(cursor)
      const response = await api.get(url)
      const payload = response.data as LogsResponse
      setLogs((prev) => (isLoadingNextPage ? [...prev, ...(payload.data || [])] : payload.data || []))
      setNextCursor(payload.nextCursor || null)
    } catch {
      setError("Nao foi possivel carregar os logs. Tente novamente em instantes.")
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  async function fetchLogDetail(log: Log, key: string) {
    if (!log.traceId || !log.spanId || log.attributes !== undefined || loadingDetailKey === key) return

    setLoadingDetailKey(key)
    setDetailErrors((prev) => ({ ...prev, [key]: "" }))

    try {
      const params = new URLSearchParams()
      if (log.timestamp) params.set("timestamp", log.timestamp)

      const response = await api.get(`/logs/${encodeURIComponent(log.traceId)}/${encodeURIComponent(log.spanId)}?${params.toString()}`)
      const detail = response.data as Log

      setLogs((prev) => prev.map((item) => (
        item.traceId === log.traceId && item.spanId === log.spanId && item.timestamp === log.timestamp
          ? { ...item, ...detail }
          : item
      )))
    } catch {
      setDetailErrors((prev) => ({ ...prev, [key]: "Nao foi possivel carregar os detalhes deste log." }))
    } finally {
      setLoadingDetailKey(null)
    }
  }

  function toggleLog(log: Log, key: string) {
    const nextKey = expandedKey === key ? null : key
    setExpandedKey(nextKey)

    if (nextKey) {
      fetchLogDetail(log, key)
    }
  }

  useEffect(() => {
    findLogs()
  }, [selectedLevel, debouncedMessage, debouncedTraceId, filters.searchMode, filters.startTime, filters.endTime])

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Card key={idx} className="border-border p-4">
            <Skeleton className="mb-3 h-4 w-56" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-500/30 bg-red-950/35 p-5 text-red-100">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5" />
          <div>
            <p className="text-sm font-semibold">Erro ao buscar logs</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {logs.map((log, idx) => {
        const rowKey = getLogKey(log, idx)

        return (
          <Card
            key={rowKey}
            className="soft-card cursor-pointer overflow-hidden py-0 transition-colors hover:border-primary/60"
            onClick={() => toggleLog(log, rowKey)}
          >
            <div className="p-4">
              <div className={cn("mb-3 h-1.5 w-14 rounded-full", getLevelAccent(log.severityText))} />
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2.5">
                    <Badge className={`${getLevelColor(log.severityText)} shrink-0 border text-[10px] uppercase shadow-none`}>
                      {(log.severityText || "INFO").toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatTimestamp(log.timestamp)}</span>
                    <span className="rounded-md border border-border bg-secondary/60 px-2 py-0.5 text-xs text-foreground">{log.serviceName}</span>
                    {log.traceId && (
                      <span className="rounded-md border border-border bg-secondary/60 px-2 py-0.5 font-mono text-xs text-muted-foreground">
                        trace {log.traceId.slice(0, 12)}...
                      </span>
                    )}
                  </div>

                  <p className="line-clamp-2 text-sm font-semibold text-foreground">{log.message || "Sem mensagem"}</p>

                  {log.exceptionMessage && <p className="mt-3 truncate font-mono text-xs text-muted-foreground">{formatPreview(log.exceptionMessage)}</p>}
                </div>

                <ChevronRight
                  size={20}
                  className={cn(
                    "mt-0.5 shrink-0 text-muted-foreground transition-transform",
                    expandedKey === rowKey && "rotate-90"
                  )}
                />
              </div>

              {expandedKey === rowKey && (
                <div
                   className="mt-4 space-y-4 border-t border-border pt-4"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Trace ID</span>
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
                              onClick={() => onViewTrace(log.traceId)}
                            >
                              Ver trace completo
                            </Button>
                          </>
                        )}
                      </div>
                      <p className="mt-1 break-all font-mono text-foreground">{log.traceId || "-"}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Span ID</span>
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
                      <p className="mt-1 break-all font-mono text-foreground">{log.spanId || "-"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Host</span>
                      <p className="mt-1 break-all font-mono text-foreground">{log.host || "-"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Environment</span>
                      <p className="mt-1 font-mono text-foreground">{log.environment || "-"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Logger</span>
                      <p className="mt-1 break-all font-mono text-foreground">{log.loggerName || "-"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Versao app</span>
                      <p className="mt-1 font-mono text-foreground">{log.appVersion || "-"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground">Attributes</span>
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
                       <pre className="mt-2 max-h-52 overflow-auto rounded-md border border-border bg-secondary/45 p-3 font-mono text-xs text-slate-700 dark:text-emerald-100/90">
                        {formatOTelValue(log.attributes)}
                      </pre>
                    </div>
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground">Body</span>
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
                       <pre className="mt-2 max-h-52 overflow-auto rounded-md border border-border bg-secondary/45 p-3 font-mono text-xs text-slate-700 dark:text-emerald-100/90">
                        {formatOTelValue(log.body)}
                      </pre>
                    </div>
                  </div>

                  {loadingDetailKey === rowKey && (
                    <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/35 p-3 text-xs text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Carregando detalhes do log...
                    </div>
                  )}

                  {detailErrors[rowKey] && (
                    <div className="rounded-md border border-red-500/30 bg-red-950/35 p-3 text-xs text-red-100">
                      {detailErrors[rowKey]}
                    </div>
                  )}

                  {hasExceptionData(log) && (
                    <div className="rounded-md border border-red-500/30 bg-red-950/35 p-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-200">Exception</p>
                      <p className="text-xs text-red-100">{log.exceptionType || "Exception"}</p>
                      {log.exceptionMessage && <p className="mt-1 text-sm text-red-100">{log.exceptionMessage}</p>}
                      {log.exceptionStacktrace && (
                        <pre className="mt-2 max-h-52 overflow-auto rounded border border-red-500/30 bg-background/70 p-2 font-mono text-xs text-red-100">
                          {log.exceptionStacktrace}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        )
      })}

      {logs.length === 0 && (
        <Card className="soft-card p-12 text-center">
          <p className="text-lg font-semibold text-foreground">Nenhum log encontrado</p>
          <p className="mt-2 text-sm text-muted-foreground">Tente ajustar os filtros de mensagem, data ou severidade.</p>
        </Card>
      )}

      {nextCursor && logs.length > 0 && (
        <div className="flex justify-center pt-3">
          <Button variant="outline" onClick={() => findLogs(nextCursor)} disabled={isLoadingMore}>
            {isLoadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Carregar mais
          </Button>
        </div>
      )}
    </div>
  )
}

function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debounced
}
