"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"
import { api } from "@/api/api"

interface Log {
  id: number
  timestamp: string;
  trace_id: string;
  span_id: string;
  severity_text: "info" | "warning" | "error" | "critical" | "debug";
  severity_number: number;
  service_name: string;
  environment: string;
  host: string;
  app_version: string;
  logger_name: string;
  message: string;
  attributes: string | Record<string, any>;
  body: string | Record<string, any>;
  exception_type: string;
  exception_message: string;
  exception_stacktrace: string;
}

export function LogsTable({ searchQuery, selectedLevel }: { searchQuery: string; selectedLevel: string }) {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [logs, setLogs] = useState<Log[]>([])

  const getLevelColor = (level: Log["severity_text"]) => {
    const colors = {
      info: "bg-blue-500/20 text-blue-400",
      warning: "bg-yellow-500/20 text-yellow-400",
      error: "bg-red-500/20 text-red-400",
      critical: "bg-purple-500/20 text-purple-400",
      debug: "bg-gray-500/20 text-gray-400",
    }
    return colors[level]
  }

  async function findLogs() {
    const response = await api.get(`/logs?severityText=${selectedLevel}&message=${searchQuery}`)
    setLogs(response.data as Log[])
  }

  useEffect(() => {
    findLogs()
  }, [searchQuery, selectedLevel])

  return (
    <div className="space-y-2">
      {logs.map((log) => (
        <Card
          key={log.id}
          className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer overflow-hidden"
          onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
        >
          <div className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={`${getLevelColor(log.severity_text)} flex-shrink-0 text-xs uppercase`}>{log.severity_text}</Badge>
                  <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                  <span className="text-xs text-muted-foreground">{log.service_name}</span>
                </div>
                <p className="font-mono text-sm text-muted-foreground mb-2">{typeof log.attributes === "string" ? log.attributes : JSON.stringify(log.attributes)}</p>
                <p className="text-sm text-foreground">{log.message}</p>
              </div>
              <ChevronRight size={20} className="flex-shrink-0 text-muted-foreground" />
            </div>

            {/* {expandedId === log.id && (
              <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">User ID:</span>
                    <p className="font-mono text-foreground mt-1">{log.userId}</p>
                  </div>
                  {log.statusCode && (
                    <div>
                      <span className="text-muted-foreground">Status Code:</span>
                      <p className="font-mono text-foreground mt-1">{log.statusCode}</p>
                    </div>
                  )}
                  {log.duration && (
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <p className="font-mono text-foreground mt-1">{log.duration}</p>
                    </div>
                  )}
                </div>
                {log.details && (
                  <div>
                    <span className="text-xs text-muted-foreground">Details:</span>
                    <p className="font-mono text-xs text-foreground mt-2 bg-background/50 p-3 rounded border border-border/50">
                      {log.details}
                    </p>
                  </div>
                )}
              </div>
            )} */}
          </div>
        </Card>
      ))}

      {logs.length === 0 && (
        <Card className="bg-card border-border p-12 text-center">
          <p className="text-muted-foreground">No logs found matching your filters</p>
        </Card>
      )}
    </div>
  )
}
