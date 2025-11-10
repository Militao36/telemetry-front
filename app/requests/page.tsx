import { RequestsView } from "@/components/requests-view"
import { Sidebar } from "@/components/sidebar"

export default function RequestsPage() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <RequestsView />
    </div>
  )
}
