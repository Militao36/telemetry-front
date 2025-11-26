import { SearchView } from "@/components/search-view"
import { Sidebar } from "@/components/sidebar"

export default function SearchPage() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <SearchView />
    </div>
  )
}
