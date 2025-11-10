import { ProjectDetailView } from "@/components/project-detail-view"
import { Sidebar } from "@/components/sidebar"

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <ProjectDetailView projectId={params.id} />
    </div>
  )
}
