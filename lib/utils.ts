import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatValueToK(value: string) {
  if (value.length <= 3) {
    return value;
  }

  return `${value.substring(0, value.length - 3) || 0}k`;
}

export function formatMsToSecondsWhenGratherThan1s(value: number) {
  if (parseInt(value.toFixed(0)) > 1000) {
    return `${(value / 1000).toFixed(1)} ms`
  }

  return `${value.toFixed(1)}s`
}
