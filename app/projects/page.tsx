import { ProjectsView } from "@/components/projects-view"
import { Sidebar } from "@/components/sidebar"

export default function ProjectsPage() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <ProjectsView />
    </div>
  )
}
