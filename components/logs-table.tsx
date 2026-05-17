"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, ChevronRight } from "lucide-react"
import { api } from "@/api/api"
import { cn } from "@/lib/utils"
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
  attributes: string | Record<string, any>;
  body: string | Record<string, any>;
  exceptionType: string;
  exceptionMessage: string;
  exceptionStacktrace: string;
}

export function LogsTable({ filters, selectedLevel }: { filters: LogsFilters, selectedLevel: string }) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
  const [logs, setLogs] = useState<Log[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const debouncedMessage = useDebounced(filters.message, 700)
  const debouncedTraceId = useDebounced(filters.traceId, 700)

  const getLevelColor = (level?: Log["severityText"]) => {
    const normalized = (level || "INFO").toUpperCase()
    const colors = {
      INFO: "bg-blue-500/15 text-blue-700 border-blue-300/70",
      WARNING: "bg-amber-500/15 text-amber-700 border-amber-300/70",
      ERROR: "bg-red-500/15 text-red-700 border-red-300/70",
      CRITICAL: "bg-rose-500/15 text-rose-700 border-rose-300/70",
      DEBUG: "bg-zinc-500/15 text-zinc-700 border-zinc-300/70",
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

  const formatField = (field: string | Record<string, any>) => {
    if (!field) return "-"
    if (typeof field === "string") return field
    return JSON.stringify(field, null, 2)
  }

  const hasExceptionData = (log: Log) => {
    return Boolean(log.exceptionType || log.exceptionMessage || log.exceptionStacktrace)
  }

  async function findLogs() {
    setIsLoading(true)
    setError(null)
    try {
      const queryParams = new URLSearchParams()
      queryParams.set("severityText", selectedLevel)

      if (debouncedMessage.trim()) queryParams.set("message", debouncedMessage.trim())
      if (debouncedTraceId.trim()) queryParams.set("traceId", debouncedTraceId.trim())
      if (filters.startTime) queryParams.set("startTime", filters.startTime)
      if (filters.endTime) queryParams.set("endTime", filters.endTime)

      const url = `/logs?${queryParams.toString()}`
      const response = await api.get(url)
      setLogs(response.data as Log[])
    } catch {
      setError("Nao foi possivel carregar os logs. Tente novamente em instantes.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    findLogs()
  }, [selectedLevel, debouncedMessage, debouncedTraceId, filters.startTime, filters.endTime])

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
      <Card className="border-red-200 bg-red-50 p-5 text-red-800">
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
    <div className="space-y-2">
      {logs.map((log, idx) => {
        const rowKey = `${log.id ?? "no-id"}-${log.timestamp ?? "no-time"}-${log.traceId ?? "no-trace"}-${log.spanId ?? "no-span"}-${idx}`

        return (
        <Card
          key={rowKey}
          className="cursor-pointer overflow-hidden border-border bg-card transition-colors hover:border-primary/50"
          onClick={() => setExpandedKey(expandedKey === rowKey ? null : rowKey)}
        >
          <div className="p-4">
            <div className={cn("mb-3 h-1.5 w-14 rounded-full", getLevelAccent(log.severityText))} />
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2.5">
                  <Badge className={`${getLevelColor(log.severityText)} shrink-0 border text-[10px] uppercase`}>
                    {(log.severityText || "INFO").toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatTimestamp(log.timestamp)}</span>
                  <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">{log.serviceName}</span>
                  {log.traceId && (
                    <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                      trace {log.traceId.slice(0, 12)}...
                    </span>
                  )}
                </div>

                <p className="line-clamp-2 text-sm font-medium text-foreground">{log.message || "Sem mensagem"}</p>

                <p className="mt-2 line-clamp-1 font-mono text-xs text-muted-foreground">
                  {formatField(log.attributes)}
                </p>
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
                className="mt-4 space-y-4 border-t border-border/60 pt-4"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <span className="text-muted-foreground">Trace ID</span>
                    <p className="mt-1 break-all font-mono text-foreground">{log.traceId || "-"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Span ID</span>
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
                    <span className="text-xs text-muted-foreground">Attributes</span>
                    <pre className="mt-2 max-h-52 overflow-auto rounded-md border border-border/70 bg-muted/20 p-3 font-mono text-xs text-foreground">
                      {formatField(log.attributes)}
                    </pre>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Body</span>
                    <pre className="mt-2 max-h-52 overflow-auto rounded-md border border-border/70 bg-muted/20 p-3 font-mono text-xs text-foreground">
                      {formatField(log.body)}
                    </pre>
                  </div>
                </div>

                {hasExceptionData(log) && (
                  <div className="rounded-md border border-red-200 bg-red-50/70 p-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-700">Exception</p>
                    <p className="text-xs text-red-800">{log.exceptionType || "Exception"}</p>
                    {log.exceptionMessage && <p className="mt-1 text-sm text-red-900">{log.exceptionMessage}</p>}
                    {log.exceptionStacktrace && (
                      <pre className="mt-2 max-h-52 overflow-auto rounded border border-red-200 bg-white/70 p-2 font-mono text-xs text-red-900">
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
        <Card className="border-border bg-card p-12 text-center">
          <p className="text-lg font-semibold text-foreground">Nenhum log encontrado</p>
          <p className="mt-2 text-sm text-muted-foreground">Tente ajustar os filtros de mensagem, data ou severidade.</p>
        </Card>
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
