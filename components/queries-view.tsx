"use client";

import { useState, useEffect } from "react";
import { api } from "@/api/api";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QueriesChart } from "./queries-chart";
import { QueriesTable } from "./queries-table";

import { RefreshCw } from "lucide-react";
import { convertToHours, DASHBOARD_TIME_RANGES } from "@/utils";
import { formatMsToMsOrSeconds } from "@/lib/utils";

export interface DefaultSlowestQuery {
  traceId: string;
  spanId: string;
  parentSpanId: string;
  serviceName: string;
  serviceVersion: string;
  serviceEnvironment: string;
  startTime: string;
  endTime: string;
  durationMs: number;
  dbStatement: string;
  dbParams: string;
  dbTable: string;
  dbName: string;
  avgDurationMs: number;
  executions: number;
}

export interface QueriesVolumeByHours {
  interval: string;
  selects: string;
  inserts: string;
  updates: string;
  deletes: string;
}

export interface IMetrics {
  totalQueries: string;
  avgMs: number;
  p50Ms: number;
  p90Ms: number;
  p95Ms: number;
  p99Ms: number;
  intervalHour: string;
}

interface IQueries {
  avgQueryTimeByHour: IMetrics[];
  metrics: IMetrics;
  slowesTypeDelete: DefaultSlowestQuery[];
  slowesTypeInsert: DefaultSlowestQuery[];
  slowesTypeSelect: DefaultSlowestQuery[];
  slowesTypeUpdate: DefaultSlowestQuery[];
  slowestQuery: DefaultSlowestQuery[];
  queryVolumeByType: {
    queryType: string;
    total: string;
  }[];
  queryVolumeByHours: QueriesVolumeByHours[];
}

export function QueriesView() {
  const [queryType, setQueryType] = useState("all");
  const [timeRange, setTimeRange] = useState("24h");
  const [queries, setQueries] = useState<IQueries>();

  const list = async () => {
    const { data } = await api.get(
      `/queries?queryTy=${queryType}&hour=${convertToHours(timeRange)}`
    );

    setQueries(data);
  };

  useEffect(() => {
    list();
  }, [queryType, timeRange]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Query Performance</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor query performance
            </p>
          </div>
          <Button onClick={() => list()} variant="outline" size="sm" className="gap-2 bg-transparent">
            <RefreshCw size={18} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Filters */}
          <Card className="bg-card border-border p-4">
            <div className="flex gap-4 items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Query Type</p>
                <div className="flex gap-2">
                  {["all", "select", "insert", "update", "delete"].map(
                    (type) => (
                      <button
                        key={type}
                        onClick={() => setQueryType(type)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors capitalize ${queryType === type
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                      >
                        {type}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Time Range</p>
                <div className="flex gap-2 flex-wrap">
                  {DASHBOARD_TIME_RANGES.map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${timeRange === range
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">
                Total Queries
              </p>
              <p className="text-3xl font-bold">
                {Number(queries?.metrics?.totalQueries || 0).toLocaleString(
                  "en-US"
                )}
              </p>
              {/* <p className="text-xs text-green-400 mt-2">+12.5% from yesterday</p> */}
            </Card>
            <Card className="bg-card border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">
                Avg Query Time
              </p>
              <p className="text-3xl font-bold">
                {(queries?.metrics?.avgMs || 0).toLocaleString("en-US")}ms
              </p>
              {/* <p className="text-xs text-yellow-400 mt-2">+8% slower than last week</p> */}
            </Card>
            <Card className="bg-card border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">
                Slowest Query
              </p>
              <p className="text-3xl font-bold">
                {formatMsToMsOrSeconds(queries?.slowestQuery[0]?.durationMs || 0)}
              </p>
              {/* <p className="text-xs text-red-400 mt-2">Unindexed join detected</p> */}
            </Card>
          </div>

          {/* Charts */}
          <QueriesChart
            queryVolumeByHours={queries?.queryVolumeByHours || []}
            avgQueryTimeByHour={queries?.avgQueryTimeByHour || []}
          />

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <QueriesTable
              title="Slowest SELECT Queries"
              slowesType={queries?.slowesTypeSelect || []}
            />
            <QueriesTable
              title="Slowest INSERT Queries"
              slowesType={queries?.slowesTypeInsert || []}
            />
            <QueriesTable
              title="Slowest DELETE Queries"
              slowesType={queries?.slowesTypeDelete || []}
            />
            <QueriesTable
              title="Slowest UPDATE Queries"
              slowesType={queries?.slowesTypeUpdate || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
