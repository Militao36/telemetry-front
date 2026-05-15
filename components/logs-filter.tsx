"use client"

export function LogsFilter({ selectedLevel, onChange }: { selectedLevel: string; onChange: (level: string) => void }) {
  const levels = [
    { id: "ALL", label: "Todos", color: "bg-slate-500/15 text-slate-600 border-slate-300/70" },
    { id: "INFO", label: "Info", color: "bg-blue-500/15 text-blue-700 border-blue-300/70" },
    { id: "WARNING", label: "Warning", color: "bg-amber-500/15 text-amber-700 border-amber-300/70" },
    { id: "ERROR", label: "Erro", color: "bg-red-500/15 text-red-700 border-red-300/70" },
    { id: "CRITICAL", label: "Crítico", color: "bg-rose-500/15 text-rose-700 border-rose-300/70" },
    { id: "DEBUG", label: "Debug", color: "bg-zinc-500/15 text-zinc-700 border-zinc-300/70" },
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
