import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"

export default function DashboardPage() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground">
      <Sidebar />
      <Dashboard />
    </div>
  )
}
