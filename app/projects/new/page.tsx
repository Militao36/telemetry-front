
import { NewProjectView } from "@/components/new-project-view"
import { Sidebar } from "@/components/sidebar"
import { Suspense } from "react"

export default function NewProjectPage() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <Suspense fallback={<div>Loading…</div>}>
        <NewProjectView />
      </Suspense>
    </div>
  )
}
