"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  Truck,
  BarChart3,
  Users,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", active: true },
  { icon: Package, label: "Shipments", href: "#", active: false },
  { icon: Truck, label: "Pickups", href: "#", active: false },
  { icon: BarChart3, label: "Analytics", href: "#", active: false },
  { icon: Users, label: "Customers", href: "#", active: false },
]

const secondaryItems = [
  { icon: Bell, label: "Notifications", href: "#", active: false },
  { icon: Settings, label: "Settings", href: "/settings", active: false },
]

export default function DashboardShell01({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const NavItem = ({ item, compact = false }: { item: typeof navItems[0]; compact?: boolean }) => {
    const Icon = item.icon
    return (
      <a
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg transition-colors duration-150",
          compact ? "justify-center p-2.5" : "px-3 py-2.5",
          item.active
            ? "bg-white/10 text-white"
            : "text-white/50 hover:text-white hover:bg-white/6"
        )}
      >
        <Icon className={cn("flex-shrink-0", compact ? "w-5 h-5" : "w-4 h-4")} />
        {!compact && (
          <span className="text-sm font-medium">{item.label}</span>
        )}
      </a>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 z-40 bg-black/90 backdrop-blur-xl",
          "border-r border-white/10 flex flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-56",
          "hidden md:flex"
        )}
      >
        {/* Logo */}
        <div className={cn("flex items-center h-16 px-4 border-b border-white/10", collapsed ? "justify-center" : "gap-2")}>
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
            <span className="text-black text-xs font-bold">A</span>
          </div>
          {!collapsed && <span className="text-white font-semibold text-sm">Airpak Admin</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem key={item.label} item={item} compact={collapsed} />
          ))}
          <div className="pt-4 border-t border-white/8 mt-4">
            {secondaryItems.map((item) => (
              <NavItem key={item.label} item={item} compact={collapsed} />
            ))}
          </div>
        </nav>

        {/* Collapse toggle + logout */}
        <div className="p-2 border-t border-white/10">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center p-2.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/6 transition-colors mb-1"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          <a
            href="/signin"
            className="flex items-center justify-center p-2.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/6 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </a>
        </div>
      </aside>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <motion.aside
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            className="absolute left-0 top-0 bottom-0 w-60 bg-black/95 backdrop-blur-xl border-r border-white/10 flex flex-col"
          >
            <div className="flex items-center gap-2 h-16 px-4 border-b border-white/10">
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
                <span className="text-black text-xs font-bold">A</span>
              </div>
              <span className="text-white font-semibold text-sm">Airpak Admin</span>
            </div>
            <nav className="flex-1 py-4 px-3 space-y-1">
              {navItems.map((item) => <NavItem key={item.label} item={item} />)}
              <div className="pt-4 border-t border-white/8 mt-4">
                {secondaryItems.map((item) => <NavItem key={item.label} item={item} />)}
              </div>
              <div className="pt-4 border-t border-white/8 mt-4">
                <a href="/signin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/6 transition-colors">
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Sign Out</span>
                </a>
              </div>
            </nav>
          </motion.aside>
        </div>
      )}

      {/* Main content */}
      <div className={cn("flex-1 flex flex-col transition-all duration-300", collapsed ? "md:ml-16" : "md:ml-56")}>
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 bg-black/80 backdrop-blur-md border-b border-white/10">
          <button
            className="md:hidden text-white/60 hover:text-white transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="hidden md:block text-sm text-white/40">Welcome back, Admin</div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">AD</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}