"use client"

export function LogsFilter({ selectedLevel, onChange }: { selectedLevel: string; onChange: (level: string) => void }) {
  const levels = [
    { id: "ALL", label: "Todos", color: "bg-primary text-primary-foreground border-primary shadow-primary/25" },
    { id: "INFO", label: "Info", color: "bg-blue-500/15 text-blue-700 border-blue-400/70 dark:bg-blue-500/20 dark:text-blue-100" },
    { id: "WARNING", label: "Warning", color: "bg-amber-500/15 text-amber-700 border-amber-400/70 dark:bg-amber-500/20 dark:text-amber-100" },
    { id: "ERROR", label: "Erro", color: "bg-red-500/15 text-red-700 border-red-400/70 dark:bg-red-500/20 dark:text-red-100" },
    { id: "CRITICAL", label: "Crítico", color: "bg-rose-500/15 text-rose-700 border-rose-400/70 dark:bg-rose-500/20 dark:text-rose-100" },
    { id: "DEBUG", label: "Debug", color: "bg-slate-500/15 text-slate-700 border-slate-400/70 dark:bg-slate-500/20 dark:text-slate-100" },
  ]

  return (
    <div className="flex gap-2 flex-wrap">
      {levels.map((level) => (
        <button
          key={level.id}
          onClick={() => onChange(level.id)}
          className={`rounded-md border px-4 py-1.5 text-xs font-semibold transition-all ${
            selectedLevel === level.id
              ? `${level.color} shadow-none dark:shadow-lg`
              : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/60 hover:bg-accent/60 hover:text-foreground"
          }`}
        >
          {level.label}
        </button>
      ))}
    </div>
  )
}
