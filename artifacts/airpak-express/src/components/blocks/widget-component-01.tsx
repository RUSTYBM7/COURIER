"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  ChevronDown,
  ChevronUp,
  EllipsisVertical,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

const menuItems = ["Share", "Update", "Refresh"]

const earningData = [
  {
    platform: "Zipcar",
    technologies: "Vuejs & HTML",
    earnings: "$23,569.26",
    progressPercentage: 75,
  },
  {
    platform: "Bitbank",
    technologies: "Figma & React",
    earnings: "$12,650.31",
    progressPercentage: 25,
  },
  {
    platform: "Aviato",
    technologies: "HTML & Angular",
    earnings: "$55,699.50",
    progressPercentage: 50,
  },
]

type Props = {
  title?: string
  earning?: number
  trend?: "up" | "down"
  percentage?: number
  comparisonText?: string
  className?: string
}

const TotalEarningCard = ({
  title = "Total Earning",
  earning = 24650,
  trend = "up",
  percentage = 10,
  comparisonText = "Compare to last year ($84,325)",
  className,
}: Props) => {
  return (
    <Card className={cn("bg-white/6 border-white/10", className)}>
      <CardHeader className="flex items-center justify-between pb-2">
        <span className="text-white font-semibold">{title}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full text-white/40 hover:text-white hover:bg-white/8"
            >
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white/8 border-white/12 backdrop-blur-xl"
          >
            <DropdownMenuGroup>
              {menuItems.map((item) => (
                <DropdownMenuItem
                  key={item}
                  className="text-white/70 hover:text-white hover:bg-white/8 cursor-pointer"
                >
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-white">
              ${earning.toLocaleString()}
            </span>
            <span
              className={cn(
                "flex items-center gap-0.5 text-sm font-medium",
                trend === "up" ? "text-green-400" : "text-red-400"
              )}
            >
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {percentage}%
            </span>
          </div>
          <span className="text-white/40 text-sm">{comparisonText}</span>
        </div>

        <div className="flex flex-col gap-4">
          {earningData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-9 w-11 rounded flex-shrink-0 bg-white/8 border border-white/10">
                  <AvatarFallback className="bg-white/10 rounded text-white/60 text-xs">
                    {item.platform.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {item.platform}
                  </p>
                  <p className="text-white/40 text-xs truncate">
                    {item.technologies}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <p className="text-white text-sm font-medium">{item.earnings}</p>
                <Progress
                  value={item.progressPercentage}
                  className="h-1.5 w-28 bg-white/8 [&>div]:bg-white/60"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function WidgetComponent01() {
  return (
    <div className="py-16 px-6">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <TotalEarningCard />
        </motion.div>
      </div>
    </div>
  )
}