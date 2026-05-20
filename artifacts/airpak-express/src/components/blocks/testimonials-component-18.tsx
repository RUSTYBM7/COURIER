"use client"

import { Star } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    quote:
      "Airpak Express has transformed our e-commerce delivery. Their real-time tracking gives our customers complete peace of mind.",
    name: "Sarah Chen",
    role: "E-commerce Director, TechMart",
  },
  {
    quote:
      "The reliability and speed of Airpak's logistics network has cut our delivery times in half. Outstanding service.",
    name: "James Wilson",
    role: "Operations Manager, FastShip Co",
  },
  {
    quote:
      "From customs clearance to final delivery, Airpak handles our international shipments flawlessly. A true partner.",
    name: "Priya Sharma",
    role: "Import-Export Lead, GlobalTrade Ltd",
  },
]

export default function TestimonialsComponent18() {
  return (
    <div className="min-h-screen bg-black text-white font-sans py-16 px-6 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-semibold text-center mb-12"
        >
          Trusted by Businesses Worldwide
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.4 }}
              className="bg-white/6 border border-white/10 rounded-xl p-6"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-white text-white"
                  />
                ))}
              </div>

              <p className="text-white/80 text-sm leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>

              <div>
                <p className="text-white font-semibold">{testimonial.name}</p>
                <p className="text-white/40 text-xs">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}