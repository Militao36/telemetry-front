"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, ChevronRight } from "lucide-react"

export function ProjectsGrid() {
  const projects = [
    {
      id: 1,
      name: "E-Commerce API",
      status: "active",
      rps: "2.4K",
      errors: "0",
      lastUpdate: "2 minutes ago",
      team: "Backend",
    },
    {
      id: 2,
      name: "Mobile App API",
      status: "active",
      rps: "1.2K",
      errors: "5",
      lastUpdate: "5 minutes ago",
      team: "Mobile",
    },
    {
      id: 3,
      name: "Analytics Dashboard",
      status: "active",
      rps: "890",
      errors: "2",
      lastUpdate: "1 minute ago",
      team: "Frontend",
    },
    {
      id: 4,
      name: "Legacy System",
      status: "inactive",
      rps: "0",
      errors: "-",
      lastUpdate: "3 days ago",
      team: "Maintenance",
    },
    {
      id: 5,
      name: "Real-Time Chat",
      status: "active",
      rps: "4.5K",
      errors: "12",
      lastUpdate: "30 seconds ago",
      team: "Infrastructure",
    },
    {
      id: 6,
      name: "Payment Service",
      status: "active",
      rps: "500",
      errors: "1",
      lastUpdate: "8 minutes ago",
      team: "Finance",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="bg-card border-border hover:border-primary/50 transition-colors overflow-hidden group"
        >
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
                <Badge
                  className={
                    project.status === "active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                  }
                >
                  {project.status === "active" ? "● Active" : "● Inactive"}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                <MoreHorizontal size={18} />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Requests/sec</p>
                <p className="text-xl font-bold">{project.rps}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Errors</p>
                <p className="text-xl font-bold text-red-400">{project.errors}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
              <span>{project.team}</span>
              <span>{project.lastUpdate}</span>
            </div>

            <Button variant="outline" className="w-full justify-between gap-2 bg-transparent" size="sm">
              <span>View Details</span>
              <ChevronRight size={16} />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
