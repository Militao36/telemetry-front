import { Duration } from "luxon";

export const DASHBOARD_TIME_RANGES = [
  "1h",
  "3h",
  "6h",
  "12h",
  "24h",
  "3d",
  "7d",
  "15d",
  "30d",
] as const;

const MAX_RANGE_HOURS = 30 * 24;

export type DashboardTimeRange = (typeof DASHBOARD_TIME_RANGES)[number];

export function convertToHours(value: string): number {
  const sanitized = value.replace("hr", "h");
  const match = sanitized.match(/^(\d+)([hd])$/);
  if (!match) throw new Error("Formato inválido");

  const amount = parseInt(match[1], 10);
  const unit = match[2] === "h" ? "hours" : "days";

  const duration = Duration.fromObject({ [unit]: amount });

  return Math.min(duration.as("hours"), MAX_RANGE_HOURS);
}

export function clearLocalStorage() {
  localStorage.clear();
}
