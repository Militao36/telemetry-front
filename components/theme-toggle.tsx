"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle({ collapsed = false }: { collapsed?: boolean }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = !mounted || theme === "dark"

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={`w-full ${collapsed ? "justify-center px-2" : "justify-start"}`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Usar tema claro" : "Usar tema escuro"}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {!collapsed && <span>{isDark ? "Tema claro" : "Tema escuro"}</span>}
    </Button>
  )
}
