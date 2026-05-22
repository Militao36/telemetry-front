"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Settings } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function ProjectDetailView({ projectId }: { projectId: string }) {
  const [activeTab, setActiveTab] = useState("overview")

  const projectData = [
    { time: "00:00", requests: 1000 },
    { time: "04:00", requests: 1200 },
    { time: "08:00", requests: 2400 },
    { time: "12:00", requests: 2200 },
    { time: "16:00", requests: 2100 },
    { time: "20:00", requests: 1800 },
    { time: "23:59", requests: 1500 },
  ]

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b border-border/70 bg-card/80 px-6 py-4 shadow-lg shadow-black/10 backdrop-blur-xl">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft size={18} />
            Back
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">E-Commerce API</h1>
            <p className="text-sm text-muted-foreground mt-1">Backend team • Environment: Production</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/20 text-green-400">● Active</Badge>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Settings size={16} />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Tabs */}
          <div className="flex gap-4 border-b border-border">
            {["overview", "settings", "integrations"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 border-b-2 transition-colors capitalize ${activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Requests", value: "2.4M", change: "+12%" },
                  { label: "Error Rate", value: "0.02%", change: "-5%" },
                  { label: "Avg Response", value: "145ms", change: "+2%" },
                  { label: "Uptime", value: "99.99%", change: "+0.01%" },
                ].map((stat) => (
                  <Card key={stat.label} className="bg-card border-border p-4">
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{stat.value}</span>
                      <span className="text-xs text-green-400">{stat.change}</span>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="bg-card border-border p-6">
                  <h3 className="text-lg font-semibold mb-4">Request Volume</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={projectData}>
                      <defs>
                        <linearGradient id="projectGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1e1e2e", border: "1px solid rgba(255,255,255,0.1)" }}
                      />
                      <Area type="monotone" dataKey="requests" stroke="#8b5cf6" fill="url(#projectGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="bg-card border-border p-6">
                  <h3 className="text-lg font-semibold mb-4">API Endpoints</h3>
                  <div className="space-y-3">
                    {[
                      { endpoint: "/api/users", requests: "1.2K" },
                      { endpoint: "/api/products", requests: "890" },
                      { endpoint: "/api/orders", requests: "580" },
                      { endpoint: "/api/payments", requests: "250" },
                    ].map((api) => (
                      <div
                        key={api.endpoint}
                        className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border"
                      >
                        <span className="font-mono text-sm text-muted-foreground">{api.endpoint}</span>
                        <span className="font-bold text-primary">{api.requests}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <Card className="bg-card border-border p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Project Name</label>
                  <input
                    type="text"
                    defaultValue="E-Commerce API"
                    className="w-full bg-input border border-border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">API Key</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      defaultValue="••••••••••••••••"
                      className="flex-1 bg-input border border-border rounded px-3 py-2"
                    />
                    <Button variant="outline">Copy</Button>
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "integrations" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Slack", status: "connected", icon: "💬" },
                { name: "PagerDuty", status: "connected", icon: "🚨" },
                { name: "Email Alerts", status: "pending", icon: "📧" },
                { name: "Webhooks", status: "available", icon: "🔗" },
              ].map((integration) => (
                <Card key={integration.name} className="bg-card border-border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{integration.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Status:{" "}
                        <Badge variant="outline" className="text-xs">
                          {integration.status}
                        </Badge>
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
