"use client"

import { Package, Plane, Warehouse, Zap, Ship, FileCheck } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const services = [
  {
    icon: Package,
    title: "Domestic Delivery",
    description: "Fast and reliable delivery across your country",
  },
  {
    icon: Plane,
    title: "International Shipping",
    description: "Global reach with competitive transit times",
  },
  {
    icon: Warehouse,
    title: "Warehousing",
    description: "Secure storage with inventory management",
  },
  {
    icon: Zap,
    title: "Express Courier",
    description: "Same-day and next-day delivery options",
  },
  {
    icon: Ship,
    title: "Freight Forwarding",
    description: "Sea and air freight solutions for large cargo",
  },
  {
    icon: FileCheck,
    title: "Customs Clearance",
    description: "Expert handling of import/export documentation",
  },
]

export default function Portfolio01() {
  return (
    <div className="min-h-screen bg-black text-white font-sans py-16 px-6 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-semibold text-center mb-12"
        >
          Our Services
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="group bg-white/6 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-white/6 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-white/10">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                <button className="text-white/40 text-sm hover:text-white transition-colors">
                  Learn More
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}