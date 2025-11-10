import { LogsView } from "@/components/logs-view"
import { Sidebar } from "@/components/sidebar"

export default function LogsPage() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <LogsView />
    </div>
  )
}
