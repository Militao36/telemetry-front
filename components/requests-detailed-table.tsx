"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { api } from "@/api/api";
import { useEffect, useState } from "react";

interface Request {
  traceId: string;
  spanId: string;
  parentSpanId: string;
  serviceName: string;
  serviceVersion: string;
  serviceEnvironment: string;
  kind: string;
  name: string;
  startTime: string;
  endTime: string;
  durationNs: string;
  httpUrl: string;
  httpMethod: string;
  httpTarget: string;
  httpStatus: string;
  attributes: string;
  ingestionTime: string;
}

export function RequestsTable({
  searchQuery,
  statusFilter,
  onSelectRequest,
}: {
  searchQuery: string;
  statusFilter: string;
  onSelectRequest: (id: string) => void;
}) {
  const [requests, setRequests] = useState<Request[]>([]);

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-500/20 text-green-400";
    if (status >= 300 && status < 400) return "bg-blue-500/20 text-blue-400";
    if (status >= 400 && status < 500)
      return "bg-yellow-500/20 text-yellow-400";
    if (status >= 500) return "bg-red-500/20 text-red-400";
    return "bg-gray-500/20 text-gray-400";
  };

  const getStatusCategory = (status: number) => {
    if (status >= 200 && status < 300) return "2xx";
    if (status >= 300 && status < 400) return "3xx";
    if (status >= 400 && status < 500) return "4xx";
    if (status >= 500) return "5xx";
    return "all";
  };

  async function fetchRequests(): Promise<Request[]> {
    const response = await api.get("/requests/recent");

    return response.data as Request[];
  }

  useEffect(() => {
    fetchRequests().then((data) => setRequests(data));
  }, []);

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold">Recent Requests</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-card/50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
                Method
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
                Enviroment
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
                Endpoint
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
                Duration/ms
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr
                key={req.spanId}
                className="border-b border-border/50 hover:bg-card/50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4">
                  <Badge variant="outline" className="font-mono text-xs">
                    {req.httpMethod}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                  {req.serviceEnvironment}
                </td>
                <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                  {req.httpTarget}
                </td>
                <td className="px-6 py-4">
                  <Badge
                    className={`${getStatusColor(
                      +req.httpStatus
                    )} font-mono text-xs`}
                  >
                    {req.httpStatus}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm font-semibold">
                  {+req.durationNs / 1e6}ms
                </td>

                <td className="px-6 py-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectRequest(req.spanId)}
                    className="gap-1"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
