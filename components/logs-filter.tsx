"use client"

export function LogsFilter({ selectedLevel, onChange }: { selectedLevel: string; onChange: (level: string) => void }) {
  const levels = [
    { id: "ALL", label: "Todos", color: "bg-primary text-primary-foreground border-primary shadow-primary/25" },
    { id: "INFO", label: "Info", color: "bg-blue-500/20 text-blue-100 border-blue-400/70" },
    { id: "WARNING", label: "Warning", color: "bg-amber-500/20 text-amber-100 border-amber-400/70" },
    { id: "ERROR", label: "Erro", color: "bg-red-500/20 text-red-100 border-red-400/70" },
    { id: "CRITICAL", label: "Crítico", color: "bg-rose-500/20 text-rose-100 border-rose-400/70" },
    { id: "DEBUG", label: "Debug", color: "bg-slate-500/20 text-slate-100 border-slate-400/70" },
  ]

  return (
    <div className="flex gap-2 flex-wrap">
      {levels.map((level) => (
        <button
          key={level.id}
          onClick={() => onChange(level.id)}
          className={`rounded-md border px-4 py-1.5 text-xs font-semibold transition-all ${
            selectedLevel === level.id
              ? `${level.color} shadow-lg`
              : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/60 hover:bg-accent/60 hover:text-foreground"
          }`}
        >
          {level.label}
        </button>
      ))}
    </div>
  )
}
