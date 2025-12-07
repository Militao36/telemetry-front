"use client";

import { useEffect, useState } from "react";
import { Search, BarChart3, FileText, Database, User2Icon, Settings, Menu, X, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignupModal } from "./company";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [tokens, setTokens] = useState([] as Array<{ token: string, project: Record<string, any> }>);

  const navItems = [
    { icon: Layout, label: "Dashboard", href: "/dashboard" },
    { icon: FileText, label: "Logs", href: "/logs" },
    // { icon: AlertCircle, label: "Errors", href: "/errors" },
    { icon: Database, label: "Queries", href: "/queries" },
    { icon: BarChart3, label: "Requests", href: "/requests" },
    { icon: Search, label: "Search", href: "/search" },
    { icon: Settings, label: "Projects", href: "/projects" },
    { icon: User2Icon, label: "Settings", href: null },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined')
      setTokens(JSON.parse(localStorage.getItem("tokens") || "{}"))
  }, [])

  return (
    <>
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button variant="ghost" size="sm" onClick={() => setMobileOpen(!mobileOpen)} className="bg-card border border-sidebar-border">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar - hidden on mobile, visible on tablet and up */}
      <div className={`${collapsed ? "w-20" : "w-64"} bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col hidden md:flex`}>
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <div className={`flex items-center gap-2 ${collapsed ? "justify-center w-full" : ""}`}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-sm font-bold">ML</div>
            {!collapsed && <span className="font-bold text-lg">Monitor</span>}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            if (item.href === null) {
              return (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground"
                  onClick={() => setIsSignupOpen(true)}
                >
                  <item.icon size={20} />
                  {!collapsed && <span className="text-sm">{item.label}</span>}
                </button>
              )
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${collapsed ? "justify-center" : ""
                  } hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground`}
                title={item.label}
              >
                <item.icon size={20} />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <select
            name="enviroment"
            className="w-full px-3 py-2 bg-card border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            onChange={(e) => {
              localStorage.setItem('tokenSelected', JSON.stringify(tokens.find(token => token.project.id === e.target.value)));
              window.location.reload();
            }}
            value={typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("tokenSelected") || "{}").project?.id || "-1" : "-1"}
          >
            {tokens.map((token: { token: string, project: Record<string, any> }) => (
              <option key={token.project.id} value={token.project.id}>{token.project.name}</option>
            ))}
            <option value="-1">Selecionar projeto</option>
          </select>
          <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="w-full justify-center">
            <Menu size={20} />
          </Button>
        </div>
      </div>

      {/* Mobile drawer - appears on mobile when menu is open */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-sm font-bold">ML</div>
                <span className="font-bold text-lg">Monitor</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setMobileOpen(false)}>
                <X size={20} />
              </Button>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => {
                if (item.href === null) {
                  return (
                    <button
                      key={item.label}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground"
                      onClick={() => {
                        setIsSignupOpen(true);
                        setMobileOpen(false);
                      }}
                    >
                      <item.icon size={20} />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  )
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href as string}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    <item.icon size={20} />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
