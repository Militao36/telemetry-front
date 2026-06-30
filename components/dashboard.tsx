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

  useEffect(() => {
    let mounted = true;

    async function fetchDashboardData() {
      const hour = convertToHours(timeRange);
      const [dashboardResponse, queriesResponse] = await Promise.all([
        api.get(`/dashboard?hour=${hour}`),
        api.get(`/queries/dashboard?hour=${hour}`),
      ]);

      if (!mounted) return;

      setDashboardData({
        avgResponse: dashboardResponse.data.avgResponse,
        p50Ms: dashboardResponse.data.p50Ms,
        p90Ms: dashboardResponse.data.p90Ms,
        p95Ms: dashboardResponse.data.p95Ms,
        p99Ms: dashboardResponse.data.p99Ms,
        totalErrors: dashboardResponse.data.totalErrors,
        totalRequests: dashboardResponse.data.totalRequests,
        totalQueries: dashboardResponse.data.totalQueries,
        topRequests: dashboardResponse.data.topRequests,
        requestPerTimeSeries: dashboardResponse.data.requestPerTimeSeries,
        slowestRequests: dashboardResponse.data.slowestRequests,
        queriesPerTimeSeries: queriesResponse.data.queriesPerTimeSeries,
      });
    }

    fetchDashboardData();

    return () => {
      mounted = false;
    };
  }, [timeRange]);

  return (
    <div className="app-shell flex flex-col w-full">
      <Header timeRange={timeRange} setTimeRange={setTimeRange} />
      <div className="app-content">
        <div className="app-section">
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
