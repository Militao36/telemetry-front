"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"

interface Query {
  id: number
  query: string
  avgTime: string
  maxTime: string
  executions: number
  indexes?: string
  issue?: string
}

export function QueriesTable({ title, type }: { title: string; type: "select" | "insert" }) {
  const queries: Query[] =
    type === "select"
      ? [
          {
            id: 1,
            query: "SELECT * FROM users WHERE status = ? AND created_at > ?",
            avgTime: "2.5s",
            maxTime: "12.5s",
            executions: 1250,
            indexes: "Missing on status",
            issue: "N+1 query detected",
          },
          {
            id: 2,
            query: "SELECT * FROM orders LEFT JOIN items ON orders.id = items.order_id",
            avgTime: "1.8s",
            maxTime: "8.2s",
            executions: 890,
            indexes: "OK",
            issue: "Unindexed join",
          },
          {
            id: 3,
            query: "SELECT COUNT(*) FROM logs WHERE timestamp BETWEEN ? AND ?",
            avgTime: "1.2s",
            maxTime: "5.1s",
            executions: 450,
            indexes: "Partial",
          },
        ]
      : [
          {
            id: 1,
            query: "INSERT INTO events (user_id, event_type, data) VALUES (?, ?, ?)",
            avgTime: "450ms",
            maxTime: "3.2s",
            executions: 5600,
            indexes: "OK",
          },
          {
            id: 2,
            query: "INSERT INTO audit_logs (...) SELECT * FROM temp_logs WHERE processed = FALSE",
            avgTime: "2.1s",
            maxTime: "6.8s",
            executions: 340,
            indexes: "Missing",
            issue: "High memory usage",
          },
          {
            id: 3,
            query: "INSERT INTO metrics (metric_name, value, timestamp) VALUES (?, ?, NOW())",
            avgTime: "200ms",
            maxTime: "1.5s",
            executions: 12000,
            indexes: "OK",
          },
        ]

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
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Max Time</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Executions</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((query) => (
              <tr key={query.id} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-xs font-mono text-muted-foreground mb-1 line-clamp-2">{query.query}</p>
                    {query.issue && (
                      <div className="flex items-center gap-1 text-xs text-yellow-400">
                        <AlertCircle size={12} />
                        {query.issue}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-semibold">{query.avgTime}</td>
                <td className="px-6 py-4 text-sm text-red-400 font-semibold">{query.maxTime}</td>
                <td className="px-6 py-4 text-sm">{query.executions.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <Badge
                    className={`text-xs ${
                      query.issue
                        ? "bg-red-500/20 text-red-400"
                        : query.indexes === "OK"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {query.indexes || "Good"}
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
