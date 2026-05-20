"use client"

import { Package } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export default function EmptyState01() {
  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="relative inline-block mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Package className="w-16 h-16 text-white/40 mx-auto" />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-px h-16 bg-gradient-to-b from-white/20 to-transparent" />
          </div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-2xl font-semibold text-white mb-3"
        >
          No shipments yet
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-white/60 text-sm leading-relaxed mb-8"
        >
          Create your first shipment to start tracking in real time
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-white text-black font-semibold py-3 px-8 rounded-lg hover:bg-white/90 transition-colors"
        >
          Create First Shipment
        </motion.button>

        <div className="mt-12 flex justify-center">
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </div>
    </div>
  )
}