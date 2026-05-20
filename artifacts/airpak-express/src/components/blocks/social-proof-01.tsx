"use client"

import { useEffect, useState } from "react"
import { Truck, Clock, Globe, Headphones } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const stats = [
  {
    value: 50000,
    suffix: "+",
    label: "Shipments",
    icon: Truck,
  },
  {
    value: 99.8,
    suffix: "%",
    label: "On-Time",
    icon: Clock,
  },
  {
    value: 40,
    suffix: "+",
    label: "Countries",
    icon: Globe,
  },
  {
    value: 24,
    suffix: "/7",
    label: "Support",
    icon: Headphones,
  },
]

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 2000
    const increment = target / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [target])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}

export default function SocialProof01() {
  return (
    <div className="min-h-screen bg-black text-white font-sans py-16 px-6 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/6 border border-white/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white/60" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-white mb-1">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-white/40 text-sm">{stat.label}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}