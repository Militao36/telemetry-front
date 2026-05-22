"use client"

export function LogsFilter({ selectedLevel, onChange }: { selectedLevel: string; onChange: (level: string) => void }) {
  const levels = [
    { id: "ALL", label: "Todos", color: "bg-slate-400/15 text-slate-200 border-slate-400/40" },
    { id: "INFO", label: "Info", color: "bg-blue-500/15 text-blue-200 border-blue-400/40" },
    { id: "WARNING", label: "Warning", color: "bg-amber-500/15 text-amber-200 border-amber-400/40" },
    { id: "ERROR", label: "Erro", color: "bg-red-500/15 text-red-200 border-red-400/40" },
    { id: "CRITICAL", label: "Crítico", color: "bg-rose-500/15 text-rose-200 border-rose-400/40" },
    { id: "DEBUG", label: "Debug", color: "bg-zinc-400/15 text-zinc-200 border-zinc-400/40" },
  ]

  return (
    <div className="flex gap-2 flex-wrap">
      {levels.map((level) => (
        <button
          key={level.id}
          onClick={() => onChange(level.id)}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
            selectedLevel === level.id
              ? `${level.color} shadow-sm`
              : "border-border bg-muted/50 text-muted-foreground hover:bg-muted"
          }`}
        >
          {level.label}
        </button>
      ))}
    </div>
  )
}
