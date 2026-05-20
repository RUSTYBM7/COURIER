"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Truck, TriangleAlert, Calendar, Clock } from "lucide-react"

const stats = [
  {
    icon: Truck,
    value: "42",
    title: "Shipped Orders",
    changePercentage: "+18.2%",
    changeType: "up" as const,
    color: "text-blue-400 bg-blue-400/10",
  },
  {
    icon: TriangleAlert,
    value: "8",
    title: "Damaged Returns",
    changePercentage: "-8.7%",
    changeType: "down" as const,
    color: "text-red-400 bg-red-400/10",
  },
  {
    icon: Calendar,
    value: "27",
    title: "Missed Delivery Slots",
    changePercentage: "+4.3%",
    changeType: "up" as const,
    color: "text-yellow-400 bg-yellow-400/10",
  },
  {
    icon: Clock,
    value: "13",
    title: "Late Deliveries",
    changePercentage: "-2.5%",
    changeType: "down" as const,
    color: "text-orange-400 bg-orange-400/10",
  },
]

export default function StatisticsCard01() {
  return (
    <div className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
              >
                <Card className="bg-white/6 border-white/10 hover:bg-white/8 transition-colors duration-200">
                  <CardContent className="p-5">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center mb-4",
                        stat.color
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-white text-2xl font-bold mb-1">
                      {stat.value}
                    </p>
                    <p className="text-white/60 text-xs mb-2">{stat.title}</p>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        stat.changeType === "up"
                          ? "text-blue-400"
                          : "text-green-400"
                      )}
                    >
                      {stat.changePercentage}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}