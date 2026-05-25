"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { formatNsToMsOrSeconds } from "@/lib/utils";

export interface IRequest {
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
  methodFilter,
  onSelectRequest,
  dataRequests,
  title,
}: {
  searchQuery?: string;
  methodFilter?: string;
  onSelectRequest: (id: string) => void;
  dataRequests: IRequest[];
  title: string;
}) {
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-500/20 text-green-400";
    if (status >= 300 && status < 400) return "bg-blue-500/20 text-blue-400";
    if (status >= 400 && status < 500)
      return "bg-yellow-500/20 text-yellow-400";
    if (status >= 500) return "bg-red-500/20 text-red-400";
    return "bg-zinc-500/20 text-zinc-300";
  };


  return (
    <Card className="bg-card/95 border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/45 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
                Method
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
                Endpoint
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
                ms/s
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {dataRequests.map((req) => (
              <tr
                key={req.spanId}
                className="border-b border-border/70 hover:bg-secondary/35 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4">
                  <Badge variant="outline" className="font-mono text-xs">
                    {req.httpMethod}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-foreground">
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
                  {formatNsToMsOrSeconds(+req.durationNs)}
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
