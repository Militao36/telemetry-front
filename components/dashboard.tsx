"use client";

import { StatsCards } from "./stats-cards";
import { MetricsCharts } from "./metrics-charts";
import { RequestsTable } from "./requests-table";
import { Header } from "./header";
import { api } from "@/api/api";
import { useEffect, useState } from "react";
import { convertToHours } from "@/utils";

export interface DashboardData {
  totalRequests: number;
  totalQueries: number;
  totalErrors: number;
  avgResponse: number;
  p50Ms: number;
  p90Ms: number;
  p95Ms: number;
  p99Ms: number;
  topRequests: TopRequest[];
  requestPerTimeSeries: RequestPerTimeSery[];
  slowestRequests: SlowestRequest[];
  queriesPerTimeSeries: QueriesPerTimeSery[];
}

export interface TopRequest {
  httpMethod: string;
  path: string;
  totalRequests: number;
  avgMs: number;
}

export interface RequestPerTimeSery {
  time: string;
  totalRequests: number;
  avgMs: number;
}

export interface QueriesPerTimeSery {
  time: string;
  totalQueries: number;
  avgMs: number;
}

export interface SlowestRequest {
  httpMethod: string;
  path: string;
  durationMs: number;
  startTime: string;
  endTime: string;
}

export function Dashboard() {
  const [timeRange, setTimeRange] = useState("24h");
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    avgResponse: 0,
    p50Ms: 0,
    p90Ms: 0,
    p95Ms: 0,
    p99Ms: 0,
    totalErrors: 0,
    totalRequests: 0,
    totalQueries: 0,
    topRequests: [],
    requestPerTimeSeries: [],
    slowestRequests: [],
    queriesPerTimeSeries: [],
  });

  async function fetchDataRequests() {
    const response = await api.get(`/dashboard?hour=${convertToHours(timeRange)}`);

    setDashboardData((state) => {
      return {
        ...state,
        avgResponse: response.data.avgResponse,
        p50Ms: response.data.p50Ms,
        p90Ms: response.data.p90Ms,
        p95Ms: response.data.p95Ms,
        p99Ms: response.data.p99Ms,
        totalErrors: response.data.totalErrors,
        totalRequests: response.data.totalRequests,
        topRequests: response.data.topRequests,
        requestPerTimeSeries: response.data.requestPerTimeSeries,
        slowestRequests: response.data.slowestRequests,
        totalQueries: response.data.totalQueries,
      };
    });
  }

  async function fetchDataQueries() {
    const response = await api.get(`/queries/dashboard?hour=${convertToHours(timeRange)}`);

    setDashboardData((state) => {
      return {
        ...state,
        queriesPerTimeSeries: response.data.queriesPerTimeSeries,
      };
    });
  }

  useEffect(() => {
    fetchDataRequests();
    fetchDataQueries();
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden w-full">
      <Header timeRange={timeRange} setTimeRange={setTimeRange} />
      <div className="flex-1 overflow-auto">
        <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
          <StatsCards {...dashboardData} />
          <MetricsCharts
            requestsData={dashboardData.requestPerTimeSeries}
            queriesData={dashboardData.queriesPerTimeSeries}
          />
          <RequestsTable topRequests={dashboardData.topRequests} />
        </div>
      </div>
    </div>
  );
}
