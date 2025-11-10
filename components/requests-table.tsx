"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export function RequestsTable() {
  const requests = [
    { id: 1, method: "GET", path: "/api/users", status: 200, time: "45ms", count: "1.2K" },
    { id: 2, method: "POST", path: "/api/logs", status: 201, time: "120ms", count: "890" },
    { id: 3, method: "GET", path: "/api/projects", status: 200, time: "78ms", count: "2.3K" },
    { id: 4, method: "PUT", path: "/api/config", status: 500, time: "250ms", count: "45" },
    { id: 5, method: "DELETE", path: "/api/temp", status: 204, time: "32ms", count: "120" },
  ]

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-500/20 text-green-400"
    if (status >= 400 && status < 500) return "bg-yellow-500/20 text-yellow-400"
    if (status >= 500) return "bg-red-500/20 text-red-400"
    return "bg-blue-500/20 text-blue-400"
  }

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border">
        <h3 className="text-base sm:text-lg font-semibold">Top Requests</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-card/50 border-b border-border">
            <tr>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-muted-foreground">
                Method
              </th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-muted-foreground">
                Endpoint
              </th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-muted-foreground">
                Status
              </th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-muted-foreground hidden sm:table-cell">
                Response
              </th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-muted-foreground hidden md:table-cell">
                Requests
              </th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                <td className="px-3 md:px-6 py-2 md:py-4">
                  <Badge variant="outline" className="font-mono text-xs">
                    {req.method}
                  </Badge>
                </td>
                <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm font-mono text-muted-foreground truncate max-w-24 md:max-w-none">
                  {req.path}
                </td>
                <td className="px-3 md:px-6 py-2 md:py-4">
                  <Badge className={`font-mono text-xs ${getStatusColor(req.status)}`}>{req.status}</Badge>
                </td>
                <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm hidden sm:table-cell">{req.time}</td>
                <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm font-semibold hidden md:table-cell">
                  {req.count}
                </td>
                <td className="px-3 md:px-6 py-2 md:py-4">
                  <Button variant="ghost" size="sm" className="gap-1 p-1">
                    <ChevronRight size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
