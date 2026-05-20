"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Package, DollarSign, ShoppingCart, Star } from "lucide-react"

const insights = [
  {
    label: "Total Products",
    value: "1,284",
    change: "+12.3%",
    trend: "up" as const,
    icon: Package,
    color: "text-blue-400",
  },
  {
    label: "Total Revenue",
    value: "$84,325",
    change: "+8.7%",
    trend: "up" as const,
    icon: DollarSign,
    color: "text-green-400",
  },
  {
    label: "Units Sold",
    value: "3,541",
    change: "-3.2%",
    trend: "down" as const,
    icon: ShoppingCart,
    color: "text-yellow-400",
  },
  {
    label: "Avg. Rating",
    value: "4.8",
    change: "+0.2",
    trend: "up" as const,
    icon: Star,
    color: "text-purple-400",
  },
]

export default function WidgetProductInsights() {
  return (
    <div className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-white/6 border-white/10">
            <CardHeader className="pb-4">
              <span className="text-white font-semibold">Product Insights</span>
              <p className="text-white/40 text-xs mt-1">
                Overview of your product performance this month
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {insights.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.3 }}
                      className={cn(
                        "bg-white/4 border border-white/8 rounded-xl p-4",
                        "hover:bg-white/8 transition-colors duration-200"
                      )}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center bg-white/6 border border-white/10",
                            item.color
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div
                          className={cn(
                            "flex items-center gap-0.5 text-xs font-medium",
                            item.trend === "up" ? "text-green-400" : "text-red-400"
                          )}
                        >
                          {item.trend === "up" ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {item.change}
                        </div>
                      </div>
                      <p className="text-white text-xl font-semibold mb-0.5">
                        {item.value}
                      </p>
                      <p className="text-white/40 text-xs">{item.label}</p>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}