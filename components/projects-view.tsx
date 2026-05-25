"use client"

import { useState } from "react"
import Link from "next/link"
import { ProjectsGrid } from "./projects-grid"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function ProjectsView() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="page-header">
        <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
          <div className="w-full sm:w-auto">
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage and monitor your applications</p>
          </div>
          <Link href="/projects/new" className="w-full sm:w-auto">
            <Button className="gap-2 bg-primary hover:bg-primary/90 w-full sm:w-auto">
              <Plus size={18} />
              New Project
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-3 sm:p-4 md:p-6">
          <ProjectsGrid />
        </div>
      </div>
    </div>
  )
}
