"use client"

import Link from "next/link"
import { ProjectsGrid } from "./projects-grid"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function ProjectsView() {
  return (
    <div className="app-shell flex flex-col">
      <div className="modern-page-header">
        <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
          <div className="w-full sm:w-auto">
            <h1 className="page-title">Projects</h1>
            <p className="page-subtitle">Manage and monitor your applications</p>
          </div>
          <Link href="/projects/new" className="w-full sm:w-auto">
            <Button size="lg" className="w-full gap-2 rounded-xl bg-primary px-5 font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 sm:w-auto">
              <Plus size={18} />
              New Project
            </Button>
          </Link>
        </div>
      </div>
      <div className="app-content">
        <div>
          <ProjectsGrid />
        </div>
      </div>
    </div>
  )
}
