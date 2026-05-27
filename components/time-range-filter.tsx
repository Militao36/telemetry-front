"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarDays, ChevronDown, Clock } from "lucide-react"

export type TimeRangePreset = {
  label: string
  shortLabel: string
  value: string
}

export const LOG_TIME_PRESETS: TimeRangePreset[] = [
  { label: "Ultimos 5 minutos", shortLabel: "5m", value: "5m" },
  { label: "Ultimos 15 minutos", shortLabel: "15m", value: "15m" },
  { label: "Ultimos 30 minutos", shortLabel: "30m", value: "30m" },
  { label: "Ultima 1 hora", shortLabel: "1h", value: "1h" },
  { label: "Ultimas 3 horas", shortLabel: "3h", value: "3h" },
  { label: "Ultimas 6 horas", shortLabel: "6h", value: "6h" },
  { label: "Ultimas 12 horas", shortLabel: "12h", value: "12h" },
]

export const DASHBOARD_TIME_PRESETS: TimeRangePreset[] = [
  { label: "Ultima 1 hora", shortLabel: "1h", value: "1h" },
  { label: "Ultimas 3 horas", shortLabel: "3h", value: "3h" },
  { label: "Ultimas 6 horas", shortLabel: "6h", value: "6h" },
  { label: "Ultimas 12 horas", shortLabel: "12h", value: "12h" },
  { label: "Ultimas 24 horas", shortLabel: "24h", value: "24h" },
  { label: "Ultimos 3 dias", shortLabel: "3d", value: "3d" },
  { label: "Ultimos 7 dias", shortLabel: "7d", value: "7d" },
  { label: "Ultimos 15 dias", shortLabel: "15d", value: "15d" },
  { label: "Ultimos 30 dias", shortLabel: "30d", value: "30d" },
]

export function TimeRangeFilter({
  label = "Periodo",
  selectedLabel,
  presets,
  customStart,
  customEnd,
  onPresetSelect,
  onCustomStartChange,
  onCustomEndChange,
}: {
  label?: string
  selectedLabel: string
  presets: TimeRangePreset[]
  customStart?: string
  customEnd?: string
  onPresetSelect: (preset: TimeRangePreset) => void
  onCustomStartChange?: (value: string) => void
  onCustomEndChange?: (value: string) => void
}) {
  const showCustom = Boolean(onCustomStartChange && onCustomEndChange)

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-foreground">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" className="h-10 w-full justify-between px-3 font-normal">
            <span className="flex min-w-0 items-center gap-2 truncate">
              <Clock className="h-4 w-4 shrink-0 text-primary" />
              <span className="truncate">{selectedLabel}</span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80 p-0">
          <div className="border-b border-border p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tempo relativo</p>
          </div>
          <div className="max-h-80 overflow-auto py-2">
            {presets.map((preset) => (
              <button
                key={preset.value}
                type="button"
                className={`flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm hover:bg-muted ${selectedLabel === preset.label ? "bg-primary/10 text-primary" : ""}`}
                onClick={() => onPresetSelect(preset)}
              >
                <span>{preset.label}</span>
                <span className="font-mono text-xs text-muted-foreground">{preset.shortLabel}</span>
              </button>
            ))}
          </div>
          {showCustom && (
            <div className="space-y-3 border-t border-border p-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                Horarios de inicio e termino
              </div>
              <div className="grid gap-2">
                <label className="text-xs text-muted-foreground">Inicio</label>
                <Input type="datetime-local" value={customStart || ""} onChange={(e) => onCustomStartChange?.(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <label className="text-xs text-muted-foreground">Termino</label>
                <Input type="datetime-local" value={customEnd || ""} onChange={(e) => onCustomEndChange?.(e.target.value)} />
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

export function getPresetLabel(presets: TimeRangePreset[], value: string) {
  return presets.find((preset) => preset.value === value)?.label || value
}

export function getPresetMinutes(value: string) {
  const match = value.match(/^(\d+)([mhd])$/)
  if (!match) return 0

  const amount = Number(match[1])
  const unit = match[2]

  if (unit === "m") return amount
  if (unit === "h") return amount * 60
  return amount * 24 * 60
}

export function toDateTimeLocalValue(date: Date) {
  const offsetMs = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16)
}
