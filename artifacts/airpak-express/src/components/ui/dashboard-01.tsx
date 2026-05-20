"use client"

import * as React from "react"
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  Badge,
} from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1% from last month",
    changeType: "positive",
    icon: DollarSign,
  },
  {
    title: "Subscriptions",
    value: "+2350",
    change: "+180.1% from last month",
    changeType: "positive",
    icon: Users,
  },
  {
    title: "Sales",
    value: "+12,234",
    change: "+19% from last month",
    changeType: "positive",
    icon: CreditCard,
  },
  {
    title: "Active Now",
    value: "573",
    change: "+201 since last hour",
    changeType: "positive",
    icon: Activity,
  },
]

const sales = [
  { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00" },
  { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$159.00" },
  { name: "Sofia Anderson", email: "sofia.anderson@email.com", amount: "+$349.00" },
  { name: "David Kim", email: "david.kim@email.com", amount: "+$249.00" },
  { name: "Emma Johnson", email: "emma.johnson@email.com", amount: "+$399.00" },
]

export function Dashboard01() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="glass-card-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <ArrowUpRight className="inline h-3 w-3 mr-1 text-green-500" />
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}

      {/* Recent Sales */}
      <Card className="col-span-4 glass-card-sm">
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sales.map((sale) => (
              <div
                key={sale.email}
                className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {sale.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{sale.name}</p>
                  <p className="text-xs text-muted-foreground">{sale.email}</p>
                </div>
                <div className="font-medium">{sale.amount}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}