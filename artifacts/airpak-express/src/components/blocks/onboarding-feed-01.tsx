"use client"

import { CheckCircle, Truck, MapPin, Package } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const steps = [
  {
    icon: CheckCircle,
    title: "Create Account",
    description: "Sign up in seconds and set up your business profile",
  },
  {
    icon: Truck,
    title: "Schedule Pickup",
    description: "Book a pickup time that works for your schedule",
  },
  {
    icon: MapPin,
    title: "Track Real Time",
    description: "Monitor your shipments with live GPS tracking",
  },
  {
    icon: Package,
    title: "Delivered",
    description: "Receive proof of delivery instantly",
  },
]

export default function OnboardingFeed01() {
  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center gap-2 mb-12">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-colors duration-300",
                i === 0 ? "bg-white" : "bg-white/20"
              )}
            />
          ))}
        </div>

        <div className="space-y-0">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.4 }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center bg-white/6">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-px h-16 bg-white/10" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {step.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-8"
        >
          <button className="w-full bg-white text-black font-semibold py-3 px-6 rounded-lg hover:bg-white/90 transition-colors">
            Get Started
          </button>
        </motion.div>
      </div>
    </div>
  )
}