"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { RequestsChart } from "./requests-chart";
import { IRequest, RequestsTable } from "./requests-detailed-table";
import { RequestDetail } from "./request-detail";
import { api } from "@/api/api";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  formatChartTick,
  formatChartTooltipLabel,
  formatRequestsData,
  formatResponseTimeData,
} from "@/lib/utils";
import { DateTime } from "luxon";
import { convertToHours, DASHBOARD_TIME_RANGES } from "@/utils";

export function RequestsView() {
  const [methodFilter, setMethodFilter] = useState("all");
  const [hourFilter, setHourFilter] = useState("3h");
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [requestsData, setRequestsData] = useState<any[]>([]);
  const [responseStatusDistribution, setResponseStatusDistribution] = useState<
    any[]
  >([]);

  const [requestsRecents, setRequestsRecents] = useState<IRequest[]>([]);
  const [requestsSlowest, setRequestsSlowest] = useState<IRequest[]>([]);

  const hour = convertToHours(hourFilter).toString();

  async function fetchRequests(): Promise<IRequest[]> {
    const response = await api.get(
      `/requests/recent?httpMethod=${methodFilter}&hour=${hour}`,
    );

    return response.data as IRequest[];
  }

  async function fetchSlowestRequests(): Promise<IRequest[]> {
    const response = await api.get(
      `/requests/slowest?httpMethod=${methodFilter}&hour=${hour}`,
    );

    return response.data as IRequest[];
  }

  async function fetchMetricsData() {
    const response = await api.get(
      `/requests/metrics?hour=${hour}&httpMethod=${methodFilter}`,
    );

    return response.data;
  }

  useEffect(() => {
    fetchRequests().then((data) => setRequestsRecents(data));
    fetchSlowestRequests().then((data) => setRequestsSlowest(data));
    fetchMetricsData().then((data) => {
      setRequestsData(data.requestPerTimeSeries);
      setResponseStatusDistribution(data.responseStatusDistribution);
    });
  }, [methodFilter, hourFilter]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b border-border/70 bg-card/80 px-6 py-4 shadow-lg shadow-black/10 backdrop-blur-xl">
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
                  <div className=" flex gap-2 justify-between">
                    <div className="flex gap-2 flex-wrap">
                      {["all", "GET", "POST", "PATCH", "PUT", "DELETE"].map(
                        (method) => (
                          <button
                            key={method}
                            onClick={() => setMethodFilter(method)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              methodFilter === method
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            {method === "all" ? "All Methods" : `${method}`}
                          </button>
                        ),
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {DASHBOARD_TIME_RANGES.map((hour) => (
                        <button
                          key={hour}
                          onClick={() => setHourFilter(hour)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            hourFilter === hour
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {hour}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Charts */}
              <RequestsChart
                statusData={responseStatusDistribution.map((e) => {
                  return {
                    status: e.httpStatus,
                    count: e.count,
                  };
                })}
                requestData={requestsData.map((e) => {
                  return {
                    time: DateTime.fromSQL(e.time, { zone: "utc" })
                      .toLocal()
                      .toFormat("yyyy-MM-dd HH:mm:ss"),
                    avgTime: +e.avgMs.toFixed(2),
                    requests: e.totalRequests,
                  };
                })}
              />

              <div>
                <div className="flex flex-row gap-2">
                  <div className="w-full">
                    <Card className="bg-card border-border p-4 md:p-6 lg:col-span-2 mb-2 w-full">
                      <h3 className="text-base sm:text-lg font-semibold mb-3 md:mb-4">
                        Requests Over Time
                      </h3>
                      <ResponsiveContainer
                        width="100%"
                        height={250}
                        minHeight={200}
                      >
                        <AreaChart data={formatRequestsData(requestsData)}>
                          <defs>
                            <linearGradient
                              id="colorValue"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#8b5cf6"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#8b5cf6"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.1)"
                          />
                          <XAxis
                            dataKey="time"
                            stroke="rgba(255,255,255,0.5)"
                            tick={{ fontSize: 12 }}
                            tickFormatter={formatChartTick}
                            minTickGap={36}
                          />
                          <YAxis
                            stroke="rgba(255,255,255,0.5)"
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip
                            labelFormatter={formatChartTooltipLabel}
                            contentStyle={{
                              backgroundColor: "#111827",
                              border: "1px solid rgba(148,163,184,0.22)",
                              color: "#e5e7eb",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#8b5cf6"
                            fillOpacity={1}
                            fill="url(#colorValue)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Card>
                  </div>

                  <div className="w-full">
                    <Card className="bg-card border-border p-4 md:p-6 mb-2 w-full">
                      <h3 className="text-base sm:text-lg font-semibold mb-3 md:mb-4">
                        Response Time
                      </h3>
                      <ResponsiveContainer
                        width="100%"
                        height={250}
                        minHeight={200}
                      >
                        <LineChart data={formatResponseTimeData(requestsData)}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.1)"
                          />
                          <XAxis
                            dataKey="time"
                            stroke="rgba(255,255,255,0.5)"
                            tick={{ fontSize: 12 }}
                            tickFormatter={formatChartTick}
                            minTickGap={36}
                          />
                          <YAxis
                            stroke="rgba(255,255,255,0.5)"
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip
                            labelFormatter={formatChartTooltipLabel}
                            contentStyle={{
                              backgroundColor: "#111827",
                              border: "1px solid rgba(148,163,184,0.22)",
                              color: "#e5e7eb",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="ms"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Card>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <RequestsTable
                    methodFilter={methodFilter}
                    onSelectRequest={setSelectedRequest}
                    dataRequests={requestsRecents}
                    title="Recent Requests"
                  />

                  <RequestsTable
                    methodFilter={methodFilter}
                    onSelectRequest={setSelectedRequest}
                    dataRequests={requestsSlowest}
                    title="Slowest Requests"
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
