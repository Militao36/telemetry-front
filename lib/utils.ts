import { clsx, type ClassValue } from "clsx";
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
    return `${seconds.toFixed(2)}s`;
  }

  const milliseconds = value / 1_000_000;
  return `${milliseconds.toFixed(2)}ms`;
}
