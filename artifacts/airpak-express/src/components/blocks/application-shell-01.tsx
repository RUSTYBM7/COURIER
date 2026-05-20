"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  Home,
  Package,
  Truck,
  BarChart3,
  MessageSquare,
  Settings,
  Bell,
  ChevronDown,
  Menu,
  X,
  Zap,
} from "lucide-react"

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Package, label: "My Shipments", href: "/tracking" },
  { icon: Truck, label: "Schedule Pickup", href: "#" },
  { icon: BarChart3, label: "Analytics", href: "#" },
  { icon: MessageSquare, label: "Messages", href: "/chat" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export default function ApplicationShell01({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="text-white font-semibold text-sm hidden sm:block">Airpak Express</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                    "text-white/50 hover:text-white hover:bg-white/6"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </a>
              )
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/6 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-white" />
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/6 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">AM</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-white/40 hidden sm:block" />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white/8 border border-white/12 rounded-xl p-1.5 z-50 backdrop-blur-xl shadow-xl"
                  >
                    <div className="px-3 py-2 mb-1.5">
                      <p className="text-white text-sm font-semibold">Alex Morgan</p>
                      <p className="text-white/40 text-xs">alex@airpak.com</p>
                    </div>
                    <div className="border-t border-white/8 pt-1.5 space-y-0.5">
                      {[
                        { label: "Profile", href: "/settings" },
                        { label: "Billing", href: "/payment" },
                        { label: "Admin Panel", href: "/admin" },
                      ].map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          className="block px-3 py-2 rounded-lg text-white/60 text-sm hover:text-white hover:bg-white/6 transition-colors"
                        >
                          {item.label}
                        </a>
                      ))}
                      <div className="border-t border-white/8 pt-1.5 mt-1.5">
                        <a
                          href="/signin"
                          className="block px-3 py-2 rounded-lg text-red-400/60 text-sm hover:text-red-400 hover:bg-red-500/6 transition-colors"
                        >
                          Sign Out
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/6 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden border-t border-white/10"
          >
            <nav className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-white/60 text-sm hover:text-white hover:bg-white/6 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </a>
                )
              })}
            </nav>
          </motion.div>
        )}
      </header>

      {/* Page content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-white/30 text-xs">
          <p>© 2025 Airpak Express. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white/60 transition-colors">Terms</a>
            <a href="/contact" className="hover:text-white/60 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}