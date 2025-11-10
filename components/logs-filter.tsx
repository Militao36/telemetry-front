"use client"

export function LogsFilter({ selectedLevel, onChange }: { selectedLevel: string; onChange: (level: string) => void }) {
  const levels = [
    { id: "all", label: "All", color: "bg-blue-500/20 text-blue-400" },
    { id: "info", label: "Info", color: "bg-blue-500/20 text-blue-400" },
    { id: "warning", label: "Warning", color: "bg-yellow-500/20 text-yellow-400" },
    { id: "error", label: "Error", color: "bg-red-500/20 text-red-400" },
    { id: "critical", label: "Critical", color: "bg-purple-500/20 text-purple-400" },
    { id: "debug", label: "Debug", color: "bg-gray-500/20 text-gray-400" },
  ]

  return (
    <div className="flex gap-2 flex-wrap">
      {levels.map((level) => (
        <button
          key={level.id}
          onClick={() => onChange(level.id)}
          className={`px-3 py-1 rounded text-sm font-medium transition-opacity ${
            selectedLevel === level.id ? `${level.color} opacity-100` : `${level.color} opacity-50 hover:opacity-75`
          }`}
        >
          {level.label}
        </button>
      ))}
    </div>
  )
}
