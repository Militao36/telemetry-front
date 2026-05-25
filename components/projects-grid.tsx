"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, ChevronRight } from "lucide-react"
import { api } from "@/api/api"
import { useEffect, useState } from "react"
import Link from "next/link"

export function ProjectsGrid() {
  const [projects, setProjects] = useState<Array<{
    id: string
    name: string
    enviroment: string
    languageOrFramework: string
    redactionFields?: string[]
  }>>([])

  async function listProjects() {
    const response = await api.get('/projects')
    setProjects(response.data)
  }

  useEffect(() => {
    listProjects()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="bg-card/95 border-border hover:border-primary/60 transition-colors overflow-hidden group"
        >
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
              </div>
              <Button onClick={() => window.location.href = `/projects/new?id=${project.id}`} variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                <MoreHorizontal size={18} />
              </Button>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
              <span>{project.enviroment}</span>
              <span>{project.languageOrFramework}</span>
            </div>

            {!!project.redactionFields?.length && (
              <Badge variant="outline" className="bg-secondary/50 text-xs">
                Redaction: {project.redactionFields.length} custom fields
              </Badge>
            )}

            <Link href={`/projects/new?id=${project.id}`} className="w-full sm:w-auto">
              <Button variant="outline" className="cursor-pointer w-full justify-between gap-2 bg-transparent" size="sm">
                <span>View Details</span>
                <ChevronRight size={16} />
              </Button>
            </Link>

          </div>
        </Card>
      ))}
    </div>
  )
}
