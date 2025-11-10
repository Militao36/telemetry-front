"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

interface Request {
  id: string
  method: string
  endpoint: string
  status: number
  time: string
  size: string
  timestamp: string
  userAgent: string
}

export function RequestsTable({
  searchQuery,
  statusFilter,
  onSelectRequest,
}: {
  searchQuery: string
  statusFilter: string
  onSelectRequest: (id: string) => void
}) {
  const requests: Request[] = [
    {
      id: "1",
      method: "GET",
      endpoint: "/api/users/123",
      status: 200,
      time: "145ms",
      size: "12.5KB",
      timestamp: "14:32:15.245",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
    {
      id: "2",
      method: "POST",
      endpoint: "/api/orders",
      status: 201,
      time: "320ms",
      size: "45.2KB",
      timestamp: "14:32:12.892",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)",
    },
    {
      id: "3",
      method: "PUT",
      endpoint: "/api/products/456",
      status: 200,
      time: "85ms",
      size: "8.3KB",
      timestamp: "14:31:45.123",
      userAgent: "Postman/10.0",
    },
    {
      id: "4",
      method: "DELETE",
      endpoint: "/api/temp/789",
      status: 204,
      time: "32ms",
      size: "0.2KB",
      timestamp: "14:31:23.456",
      userAgent: "curl/7.68.0",
    },
    {
      id: "5",
      method: "GET",
      endpoint: "/api/reports",
      status: 500,
      time: "2500ms",
      size: "2.1KB",
      timestamp: "14:30:12.789",
      userAgent: "Mozilla/5.0 (Linux; Android 11)",
    },
    {
      id: "6",
      method: "PATCH",
      endpoint: "/api/users/123/profile",
      status: 200,
      time: "156ms",
      size: "18.7KB",
      timestamp: "14:29:45.234",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    },
  ]

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-500/20 text-green-400"
    if (status >= 300 && status < 400) return "bg-blue-500/20 text-blue-400"
    if (status >= 400 && status < 500) return "bg-yellow-500/20 text-yellow-400"
    if (status >= 500) return "bg-red-500/20 text-red-400"
    return "bg-gray-500/20 text-gray-400"
  }

  const getStatusCategory = (status: number) => {
    if (status >= 200 && status < 300) return "2xx"
    if (status >= 300 && status < 400) return "3xx"
    if (status >= 400 && status < 500) return "4xx"
    if (status >= 500) return "5xx"
    return "all"
  }

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      searchQuery === "" ||
      req.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.method.toLowerCase().includes(searchQuery.toLowerCase())

    const statusCategory = getStatusCategory(req.status)
    const matchesStatus = statusFilter === "all" || statusCategory === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold">Recent Requests</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-card/50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Method</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Endpoint</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Time</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Size</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Timestamp</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => (
              <tr key={req.id} className="border-b border-border/50 hover:bg-card/50 transition-colors cursor-pointer">
                <td className="px-6 py-4">
                  <Badge variant="outline" className="font-mono text-xs">
                    {req.method}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{req.endpoint}</td>
                <td className="px-6 py-4">
                  <Badge className={`${getStatusColor(req.status)} font-mono text-xs`}>{req.status}</Badge>
                </td>
                <td className="px-6 py-4 text-sm font-semibold">{req.time}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{req.size}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{req.timestamp}</td>
                <td className="px-6 py-4">
                  <Button variant="ghost" size="sm" onClick={() => onSelectRequest(req.id)} className="gap-1">
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
