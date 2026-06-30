"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { formatValueToK } from "@/lib/utils";

export function RequestsTable({ topRequests }: { topRequests: any[] }) {
  return (
    <Card className="soft-card overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border">
        <h3 className="text-base sm:text-lg font-semibold">Top Requests</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/45 border-b border-border">
            <tr>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-muted-foreground">
                Method
              </th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-muted-foreground">
                Endpoint
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
            {topRequests.map((req, index) => (
              <tr
                key={index}
                className="border-b border-border/70 hover:bg-secondary/35 transition-colors"
              >
                <td className="px-3 md:px-6 py-2 md:py-4">
                  <Badge variant="outline" className="font-mono text-xs">
                    {req.httpMethod}
                  </Badge>
                </td>
                <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm font-mono text-foreground truncate max-w-24 md:max-w-none">
                  {req.path}
                </td>
                <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm hidden sm:table-cell">
                  {req.avgMs.toFixed(1) + ' ms'}
                </td>
                <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm font-semibold hidden md:table-cell">
                  {formatValueToK(String(req.totalRequests || 0))}
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
  );
}
