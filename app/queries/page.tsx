import { QueriesView } from "@/components/queries-view"
import { Sidebar } from "@/components/sidebar"

export default function QueriesPage() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <QueriesView />
    </div>
  )
}
