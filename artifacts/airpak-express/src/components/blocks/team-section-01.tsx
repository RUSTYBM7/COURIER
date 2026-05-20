"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const members = [
  { name: "Sarah Chen", role: "Chief Executive Officer", initials: "SC" },
  { name: "James Wilson", role: "Chief Operations Officer", initials: "JW" },
  { name: "Priya Sharma", role: "Head of Global Logistics", initials: "PS" },
  { name: "David Tan", role: "Chief Technology Officer", initials: "DT" },
  { name: "Lisa Wong", role: "Head of Customer Experience", initials: "LW" },
  { name: "Marco Rossi", role: "Director, Europe Operations", initials: "MR" },
]

export default function TeamSection01() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-white text-2xl font-semibold mb-3">
            Our Leadership Team
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-md mx-auto">
            Meet the team driving Airpak Express forward across 40+ countries
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {members.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className={cn(
                "bg-white/4 border border-white/8 rounded-xl p-6",
                "hover:bg-white/8 transition-colors duration-300",
                "text-center"
              )}
            >
              <div className="w-14 h-14 rounded-full bg-white/8 border border-white/12 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-semibold text-sm">{member.initials}</span>
              </div>
              <p className="text-white font-semibold text-sm mb-1">{member.name}</p>
              <p className="text-white/40 text-xs">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}