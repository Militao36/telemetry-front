"use client";

import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface RequestsDataStatus {
  status: string;
  count: number;
}

export interface RequestsData {
  time: string;
  requests: number;
  avgTime: number;
}

export function RequestsChart({
  statusData = [{ status: "200", count: 0 }],
  requestData = [{ time: "00:00", requests: 0, avgTime: 0 }],
}: {
  statusData: RequestsDataStatus[];
  requestData: RequestsData[];
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Requests Timeline</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={requestData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" yAxisId="left" />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              yAxisId="right"
              orientation="right"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="requests"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
              name="Requests"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgTime"
              stroke="#fbbf24"
              strokeWidth={2}
              dot={false}
              name="Avg Time (ms)"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold mb-4">
          Response Status Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis dataKey="status" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
