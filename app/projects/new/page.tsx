import { NewProjectView } from "@/components/new-project-view"
import { Sidebar } from "@/components/sidebar"

export default function NewProjectPage() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <NewProjectView />
    </div>
  )
}
