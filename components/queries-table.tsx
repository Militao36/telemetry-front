"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DefaultSlowestQuery } from "./queries-view"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { toast } from 'react-toastify';
import { format } from "sql-formatter";
import { formatMsToMsOrSeconds } from "@/lib/utils"


export function QueriesTable({ slowesType, title }: { slowesType: DefaultSlowestQuery[], title: string }) {
  function copyTraceId(traceId: string) {
    if (!traceId) return
    navigator.clipboard.writeText(traceId)
    toast.info("Trace ID copied to clipboard!")
  }

  function openTraceLogs(traceId: string) {
    if (!traceId) return
    window.location.href = `/logs?traceId=${encodeURIComponent(traceId)}`
  }

  return (
    <Card className="soft-card overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/45 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Query</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Db Params</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Avg Time</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Executions</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Trace</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Db/Table</th>
            </tr>
          </thead>
          <tbody>
            {slowesType.map((query, idx) => {

              return (
                <tr key={idx} className="border-b border-border/70 hover:bg-secondary/35 transition-colors">
                  <td className="px-6 py-4">
                    <Tooltip>
                      <div>
                        <TooltipTrigger>
                          <p onClick={() => {
                            let sqlFormatted: string;
                            try {
                              sqlFormatted = query.dbStatement ? format(query.dbStatement, { language: "postgresql" }).toString() : '';
                            } catch {
                              sqlFormatted = query.dbStatement;
                            }

                            toast.info("Query copied to clipboard!");
                            navigator.clipboard.writeText(sqlFormatted || query.dbStatement)
                           }} className="text-xs text-left font-mono text-foreground mb-1 line-clamp-2 cursor-pointer hover:text-primary hover:weight-semibold">
                            {query.dbStatement.trim().trimEnd().trimStart().substring(0, 50)}
                          </p>

                          <TooltipContent>
                            {query.dbStatement}
                          </TooltipContent>
                        </TooltipTrigger>
                      </div>
                    </Tooltip>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">
                    <Tooltip>
                      <div>
                        <TooltipTrigger>
                          <p onClick={() => {
                            toast.info("Query copied to clipboard!");
                            navigator.clipboard.writeText(query.dbParams || query.dbParams)
                          }} className="text-xs text-left font-mono text-foreground mb-1 line-clamp-2 cursor-pointer hover:text-primary hover:weight-semibold">
                            {query.dbParams.trim().trimEnd().trimStart().substring(0, 50)}
                          </p>

                          <TooltipContent>
                            {query.dbParams}
                          </TooltipContent>
                        </TooltipTrigger>
                      </div>
                    </Tooltip>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">{formatMsToMsOrSeconds(query?.avgDurationMs)}</td>
                  <td className="px-6 py-4 text-sm text-red-400 font-semibold">{formatMsToMsOrSeconds(query?.durationMs)}</td>
                  <td className="px-6 py-4 text-sm">{query?.executions?.toLocaleString("en-US")}</td>
                  <td className="px-6 py-4">
                    {query.traceId ? (
                      <div className="space-y-1">
                        <button
                          type="button"
                          className="block max-w-40 truncate font-mono text-xs text-muted-foreground hover:text-primary"
                          title={query.traceId}
                          onClick={() => copyTraceId(query.traceId)}
                        >
                          trace {query.traceId.slice(0, 12)}...
                        </button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-[11px] cursor-pointer"
                          onClick={() => openTraceLogs(query.traceId)}
                        >
                          Ver trace completo
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      className={`text-xs bg-green-300/20 text-green-400`}
                    >
                      {`${query.dbTable}`}
                    </Badge>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
