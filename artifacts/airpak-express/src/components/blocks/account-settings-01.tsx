"use client"

import { useState } from "react"
import { User, Bell, Lock } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold text-lg">
      {initials}
    </div>
  )
}

function Toggle({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-white text-sm">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked="true"
        className="w-11 h-6 rounded-full bg-white/20 relative data-[state=checked]:bg-white data-[state=checked]:data-[state=checked]:bg-white"
      >
        <span className="block w-5 h-5 rounded-full bg-white/40 absolute top-0.5 left-0.5 transition-transform data-[state=checked]:translate-x-5 data-[state=checked]:bg-white" />
      </button>
    </div>
  )
}

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
]

export default function AccountSettings01() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="min-h-screen bg-black text-white font-sans p-6 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/6 border border-white/10 rounded-xl p-6"
        >
          <div className="flex border-b border-white/10 mb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
                    activeTab === tab.id
                      ? "border-white text-white"
                      : "border-transparent text-white/40 hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <InitialsAvatar name="Alex Morgan" />
                <div>
                  <p className="text-white font-semibold">Alex Morgan</p>
                  <p className="text-white/40 text-sm">alex@airpak.com</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-white/60 text-xs uppercase tracking-wide mb-2 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Alex Morgan"
                    className="w-full bg-white/6 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs uppercase tracking-wide mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="alex@airpak.com"
                    className="w-full bg-white/6 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
                <button className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-white/90 transition-colors">
                  Edit Profile
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <Toggle label="Email Notifications" />
              <Toggle label="SMS Alerts" />
              <Toggle label="Push Notifications" />
              <div className="pt-4">
                <button className="w-full border border-white/20 text-white font-semibold py-3 rounded-lg hover:bg-white/10 transition-colors">
                  Save Preferences
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <label className="text-white/60 text-xs uppercase tracking-wide mb-2 block">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full bg-white/6 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div>
                <label className="text-white/60 text-xs uppercase tracking-wide mb-2 block">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full bg-white/6 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <button className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-white/90 transition-colors">
                Update Password
              </button>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-white text-sm">Two-Factor Auth</span>
                <button className="px-4 py-2 border border-white/20 rounded-lg text-sm hover:bg-white/10 transition-colors">
                  Enable 2FA
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}