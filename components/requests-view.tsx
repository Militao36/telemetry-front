"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RequestsChart } from "./requests-chart";
import { IRequest, RequestsTable } from "./requests-detailed-table";
import { RequestDetail } from "./request-detail";
import { Search } from "lucide-react";
import { api } from "@/api/api";

export function RequestsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const [requestsRecents, setRequestsRecents] = useState<IRequest[]>([]);
  const [requestsSlowest, setRequestsSlowest] = useState<IRequest[]>([]);

  async function fetchRequests(): Promise<IRequest[]> {
    const response = await api.get("/requests/recent");

    return response.data as IRequest[];
  }

  async function fetchSlowestRequests(): Promise<IRequest[]> {
    const response = await api.get("/requests/slowest");

    return response.data as IRequest[];
  }

  useEffect(() => {
    fetchRequests().then((data) => setRequestsRecents(data));
    fetchSlowestRequests().then((data) => setRequestsSlowest(data));
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b border-border bg-card px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold">Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Detailed analysis of HTTP requests and responses
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">
            <div className="p-6 space-y-6">
              {/* Search and Filters */}
              <Card className="bg-card border-border p-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Search Requests
                    </label>
                    <div className="relative">
                      <Search
                        size={18}
                        className="absolute left-3 top-3 text-muted-foreground"
                      />
                      <Input
                        placeholder="Search by endpoint, method, status..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-input border-border"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {["all", "2xx", "3xx", "4xx", "5xx"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          statusFilter === status
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {status === "all" ? "All Status" : `Status ${status}`}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Charts */}
              <RequestsChart />

              {/* Table */}
              <div className="columns-2xl">
                <div>
                  <RequestsTable
                    searchQuery={searchQuery}
                    statusFilter={statusFilter}
                    onSelectRequest={setSelectedRequest}
                    dataRequests={requestsSlowest}
                    title="Slowest Requests"
                  />
                </div>

                <div>
                  <RequestsTable
                    searchQuery={searchQuery}
                    statusFilter={statusFilter}
                    onSelectRequest={setSelectedRequest}
                    dataRequests={requestsRecents}
                    title="Recent Requests"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedRequest && (
          <RequestDetail
            requestId={selectedRequest}
            onClose={() => setSelectedRequest(null)}
          />
        )}
      </div>
    </div>
  );
}
