import { QueriesPerTimeSery, RequestPerTimeSery } from "@/components/dashboard";
import { clsx, type ClassValue } from "clsx";
import { DateTime } from "luxon";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatValueToK(value: string) {
  if (value.length <= 3) {
    return value;
  }

  return `${value.substring(0, value.length - 3) || 0}k`;
}

export function formatNsToMsOrSeconds(value: number) {
  const seconds = value / 1_000_000_000;

  if (seconds >= 1) {
    return `${seconds.toFixed(2)} s`;
  }

  const milliseconds = value / 1_000_000;
  return `${milliseconds.toFixed(2)} ms`;
}

export function formatMsToMsOrSeconds(value: number) {
  const seconds = value / 1000;

  if (seconds >= 1) {
    return `${seconds.toFixed(2)} s`;
  }

  return `${value.toFixed(2)} ms`;
}

export function formatRequestsData(data: RequestPerTimeSery[]) {
  return data.map((item) => ({
    time: DateTime.fromSQL(item.time, { zone: "utc" })
      .toLocal()
      .toFormat("yyyy-MM-dd HH:mm:ss"),
    value: item.totalRequests,
  }));
}

export function formatResponseTimeData(data: RequestPerTimeSery[]) {
  return data.map((item) => ({
    time: DateTime.fromSQL(item.time, { zone: "utc" })
      .toLocal()
      .toFormat("yyyy-MM-dd HH:mm:ss"),
    ms: item.avgMs,
  }));
}

export function formatQueriesData(data: QueriesPerTimeSery[]) {
  return data.map((item) => ({
    time: DateTime.fromSQL(item.time, { zone: "utc" })
      .toLocal()
      .toFormat("yyyy-MM-dd HH:mm:ss"),
    ms: item.totalQueries,
  }));
}

export function formatQueryTimeData(data: QueriesPerTimeSery[]) {
  return data.map((item) => ({
    time: DateTime.fromSQL(item.time, { zone: "utc" })
      .toLocal()
      .toFormat("yyyy-MM-dd HH:mm:ss"),
    ms: item.avgMs,
  }));
}
