"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DefaultSlowestQuery } from "./queries-view"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"


export function QueriesTable({ slowesType, title }: { slowesType: DefaultSlowestQuery[], title: string }) {
  const teste = {
    id: 2,
    query: "SELECT * FROM orders LEFT JOIN items ON orders.id = items.order_id",
    avgTime: "1.8s",
    maxTime: "8.2s",
    executions: 890,
    indexes: "OK",
    issue: "Unindexed join",
  }

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-card/50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Query</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Avg Time</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Executions</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Db/Table</th>
            </tr>
          </thead>
          <tbody>
            {slowesType.map((query, idx) => (
              <tr key={idx} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                <td className="px-6 py-4">
                  <Tooltip>
                    <div>
                      <TooltipTrigger>
                        <p className="text-xs font-mono text-muted-foreground mb-1 line-clamp-2">
                          {query.dbStatement}
                        </p>



                        <TooltipContent>
                          {query.dbStatement}
                        </TooltipContent>
                      </TooltipTrigger>
                    </div>
                  </Tooltip>
                </td>
                <td className="px-6 py-4 text-sm font-semibold">{((query?.avgDurationMs || 0).toFixed(2))}ms</td>
                <td className="px-6 py-4 text-sm text-red-400 font-semibold">{(query.durationMs || 0).toFixed(2)}ms</td>
                <td className="px-6 py-4 text-sm">{query?.executions?.toLocaleString("en-US")}</td>
                <td className="px-6 py-4">
                  <Badge
                    className={`text-xs bg-green-300/20 text-green-400`}
                  >
                    {`${query.dbName}/${query.dbTable}`}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
