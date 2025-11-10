import { ErrorsView } from "@/components/errors-view"
import { Sidebar } from "@/components/sidebar"

export default function ErrorsPage() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <ErrorsView />
    </div>
  )
}
