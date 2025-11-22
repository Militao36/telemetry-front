"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Clock, Activity, Database, ChevronRight, AlertCircle, CheckCircle, Info, XCircle } from "lucide-react"
import { useEffect, useState } from "react"

type LogType = "all" | "error" | "warning" | "info" | "success"
type DataType = "logs" | "queries" | "requests"

interface LogEntry {
  id: string
  timestamp: Date
  type: LogType
  method?: string
  path: string
  duration?: number
  status?: number
  message: string
  queryTime?: number
}

const mockLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 120000),
    type: "error",
    method: "POST",
    path: "/api/users/create",
    duration: 1234,
    status: 500,
    message: "Database connection timeout",
    queryTime: 850,
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 60000),
    type: "success",
    method: "GET",
    path: "/api/products/list",
    duration: 145,
    status: 200,
    message: "Query executed successfully",
    queryTime: 95,
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 30000),
    type: "warning",
    method: "PUT",
    path: "/api/orders/update",
    duration: 456,
    status: 429,
    message: "Rate limit approaching threshold",
    queryTime: 234,
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 10000),
    type: "info",
    method: "GET",
    path: "/api/analytics/dashboard",
    duration: 89,
    status: 200,
    message: "Analytics data retrieved",
    queryTime: 45,
  },
]

export function SearchView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [logType, setLogType] = useState<LogType>("all")
  const [dataType, setDataType] = useState<DataType>("logs")
  const [timeRange, setTimeRange] = useState("12h")
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch =
      log.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = logType === "all" || log.type === logType
    return matchesSearch && matchesType
  })

  const getLogIcon = (type: LogType) => {
    switch (type) {
      case "error":
        return <XCircle className="size-4 text-red-500" />
      case "warning":
        return <AlertCircle className="size-4 text-amber-500" />
      case "success":
        return <CheckCircle className="size-4 text-emerald-500" />
      default:
        return <Info className="size-4 text-blue-500" />
    }
  }

  const getStatusColor = (status?: number) => {
    if (!status) return "bg-muted text-muted-foreground"
    if (status >= 200 && status < 300) return "bg-emerald-500/10 text-emerald-500"
    if (status >= 400 && status < 500) return "bg-amber-500/10 text-amber-500"
    if (status >= 500) return "bg-red-500/10 text-red-500"
    return "bg-muted text-muted-foreground"
  }

  const formatTimestamp = (date: Date) => {
    const now = Date.now()
    const diff = now - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 1) return "agora"
    if (minutes < 60) return `${minutes}m atrás`
    if (hours < 24) return `${hours}h atrás`
    return date.toLocaleDateString("pt-BR")
  }

  useEffect(() => {
    console.log(logType, dataType, timeRange)
  }, [logType, dataType, timeRange])

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b border-border bg-card px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold">Searches</h1>

          <p className="text-sm text-muted-foreground mt-1">
            Perform advanced searches of your requests/logs and queries.
          </p>
        </div>
      </div>

      <div className="p-5 overflow-auto">
        <Card className="mb-6 border-border/50 p-0">
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Busca */}
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por path, mensagem..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={dataType} onValueChange={(value) => setDataType(value as DataType)}>
                <SelectTrigger>
                  <Database className="mr-2 size-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="logs">Logs</SelectItem>
                  <SelectItem value="queries">Queries</SelectItem>
                  <SelectItem value="requests">Requests</SelectItem>
                </SelectContent>
              </Select>

              {/* Período */}
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <Clock className="mr-2 size-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last 1 hour</SelectItem>
                  <SelectItem value="12h">Last 12 hours</SelectItem>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtros de Status */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant={logType === "all" ? "default" : "outline"} size="sm" onClick={() => setLogType("all")}>
                <Activity className="mr-2 size-4" />
                All
              </Button>
              <Button variant={logType === "error" ? "default" : "outline"} size="sm" onClick={() => setLogType("error")}>
                <XCircle className="mr-2 size-4" />
                Errors
              </Button>
              <Button
                variant={logType === "warning" ? "default" : "outline"}
                size="sm"
                onClick={() => setLogType("warning")}
              >
                <AlertCircle className="mr-2 size-4" />
                Warnings
              </Button>
              <Button
                variant={logType === "success" ? "default" : "outline"}
                size="sm"
                onClick={() => setLogType("success")}
              >
                <CheckCircle className="mr-2 size-4" />
                Success
              </Button>
              <Button variant={logType === "info" ? "default" : "outline"} size="sm" onClick={() => setLogType("info")}>
                <Info className="mr-2 size-4" />
                Info
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          {filteredLogs.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Database className="size-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">Nenhum log encontrado</h3>
                <p className="text-sm text-muted-foreground">Tente ajustar os filtros ou período de tempo</p>
              </CardContent>
            </Card>
          ) : (
            filteredLogs.map((log) => (
              <Card
                key={log.id}
                className="border-border/50 transition-all hover:border-border hover:shadow-md cursor-pointer"
                onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Ícone do tipo */}
                      <div className="mt-1">{getLogIcon(log.type)}</div>

                      {/* Informações principais */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {log.method && (
                            <Badge variant="outline" className="font-mono text-xs">
                              {log.method}
                            </Badge>
                          )}
                          {log.status && (
                            <Badge className={`${getStatusColor(log.status)} font-mono text-xs`}>{log.status}</Badge>
                          )}
                          <code className="text-sm font-mono text-foreground truncate">{log.path}</code>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 text-pretty">{log.message}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {formatTimestamp(log.timestamp)}
                          </span>
                          {log.duration && (
                            <span className="flex items-center gap-1">
                              <Activity className="size-3" />
                              {log.duration}ms
                            </span>
                          )}
                          {log.queryTime && (
                            <span className="flex items-center gap-1">
                              <Database className="size-3" />
                              Query: {log.queryTime}ms
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Botão de expandir */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`shrink-0 transition-transform ${selectedLog?.id === log.id ? "rotate-90" : ""}`}
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>

                  {/* Detalhes expandidos */}
                  {selectedLog?.id === log.id && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Timestamp Completo</p>
                          <p className="text-sm font-mono">{log.timestamp.toLocaleString("pt-BR")}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">ID</p>
                          <p className="text-sm font-mono">{log.id}</p>
                        </div>
                        {log.queryTime && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Tempo de Query</p>
                            <p className="text-sm font-mono">{log.queryTime}ms</p>
                          </div>
                        )}
                        {log.duration && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Duração Total</p>
                            <p className="text-sm font-mono">{log.duration}ms</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Mostrando <span className="font-medium text-foreground">{filteredLogs.length}</span> de{" "}
            <span className="font-medium text-foreground">{mockLogs.length}</span> registros
          </p>
          <p className="flex items-center gap-1">
            <Activity className="size-4" />
            Atualizado agora
          </p>
        </div>
      </div>
    </div>
  )
}
