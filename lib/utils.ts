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

export function formatChartTick(value: string) {
  return DateTime.fromFormat(value, "yyyy-MM-dd HH:mm:ss").toFormat("dd/MM HH:mm");
}

export function formatChartTooltipLabel(value: string) {
  return DateTime.fromFormat(value, "yyyy-MM-dd HH:mm:ss").toFormat("dd/MM/yyyy HH:mm:ss");
}

export function downsampleSeries<T>(data: T[], maxPoints = 180): T[] {
  if (data.length <= maxPoints) return data;

  const step = Math.ceil(data.length / maxPoints);
  const sampled: T[] = [];

  for (let index = 0; index < data.length; index += step) {
    sampled.push(data[index]);
  }

  const lastItem = data[data.length - 1];
  if (sampled[sampled.length - 1] !== lastItem) {
    sampled.push(lastItem);
  }

  return sampled;
}

export function formatRequestsData(data: RequestPerTimeSery[]) {
  return downsampleSeries(
    data.map((item) => ({
      time: DateTime.fromSQL(item.time, { zone: "utc" })
        .toLocal()
        .toFormat("yyyy-MM-dd HH:mm:ss"),
      value: item.totalRequests,
    }))
  );
}

export function formatResponseTimeData(data: RequestPerTimeSery[]) {
  return downsampleSeries(
    data.map((item) => ({
      time: DateTime.fromSQL(item.time, { zone: "utc" })
        .toLocal()
        .toFormat("yyyy-MM-dd HH:mm:ss"),
      ms: item.avgMs,
    }))
  );
}

export function formatQueriesData(data: QueriesPerTimeSery[]) {
  return downsampleSeries(
    data.map((item) => ({
      time: DateTime.fromSQL(item.time, { zone: "utc" })
        .toLocal()
        .toFormat("yyyy-MM-dd HH:mm:ss"),
      ms: item.totalQueries,
    }))
  );
}

export function formatQueryTimeData(data: QueriesPerTimeSery[]) {
  return downsampleSeries(
    data.map((item) => ({
      time: DateTime.fromSQL(item.time, { zone: "utc" })
        .toLocal()
        .toFormat("yyyy-MM-dd HH:mm:ss"),
      ms: item.avgMs,
    }))
  );
}
