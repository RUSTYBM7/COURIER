"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  CheckCircle2,
  Circle,
  Package,
  Plane,
  Warehouse,
  Truck,
  Home,
} from "lucide-react"

const steps = [
  {
    label: "Order Placed",
    description: "Shipment created and pickup scheduled",
    time: "May 18, 09:30 AM",
    icon: Package,
    status: "completed" as const,
  },
  {
    label: "Picked Up",
    description: "Collected from sender — Kuala Lumpur Hub",
    time: "May 18, 02:15 PM",
    icon: Truck,
    status: "completed" as const,
  },
  {
    label: "In Transit — Origin",
    description: "Departed Kuala Lumpur International Airport",
    time: "May 18, 08:45 PM",
    icon: Plane,
    status: "completed" as const,
  },
  {
    label: "Arrived — Transit Hub",
    description: "Arrived at Singapore Changi Distribution Center",
    time: "May 19, 06:20 AM",
    icon: Warehouse,
    status: "completed" as const,
  },
  {
    label: "Customs Clearance",
    description: "Customs inspection in progress",
    time: "May 19, 09:00 AM",
    icon: CheckCircle2,
    status: "in-progress" as const,
  },
  {
    label: "Out for Delivery",
    description: "Estimated delivery by 6:00 PM today",
    time: "Est. 3:00 PM",
    icon: Truck,
    status: "pending" as const,
  },
  {
    label: "Delivered",
    description: "Signed by: J. Tan",
    time: "—",
    icon: Home,
    status: "pending" as const,
  },
]

export default function TimelineComponent05() {
  return (
    <div className="py-16 px-6">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <h2 className="text-white text-xl font-semibold mb-2">
            Shipment Timeline
          </h2>
          <p className="text-white/40 text-sm">
            Tracking: <span className="text-white/70 font-mono">APX-2025-8847291</span>
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-3 bottom-3 w-px bg-white/10" />

          <div className="space-y-0">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isCompleted = step.status === "completed"
              const isActive = step.status === "in-progress"
              const isPending = step.status === "pending"

              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="relative flex gap-5 pl-0 py-5"
                >
                  {/* Icon node */}
                  <div
                    className={cn(
                      "relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                      "border-2 transition-colors duration-300",
                      isCompleted &&
                        "bg-green-500/15 border-green-500 text-green-400",
                      isActive &&
                        "bg-white/10 border-white text-white shadow-[0_0_12px_rgba(255,255,255,0.15)]",
                      isPending &&
                        "bg-white/4 border-white/20 text-white/30"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1.5 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p
                          className={cn(
                            "text-sm font-semibold mb-0.5",
                            isCompleted && "text-white/70",
                            isActive && "text-white",
                            isPending && "text-white/30"
                          )}
                        >
                          {step.label}
                        </p>
                        <p
                          className={cn(
                            "text-xs leading-relaxed",
                            isCompleted && "text-white/40",
                            isActive && "text-white/60",
                            isPending && "text-white/20"
                          )}
                        >
                          {step.description}
                        </p>
                      </div>
                      <p
                        className={cn(
                          "text-xs flex-shrink-0",
                          isCompleted && "text-white/30",
                          isActive && "text-white/50",
                          isPending && "text-white/20"
                        )}
                      >
                        {step.time}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}