"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { X, Package, Truck, AlertTriangle, CheckCircle2 } from "lucide-react"

// Dialog 01 — New Shipment Form
function Dialog01Content() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 text-green-400" />
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">
          Shipment Created
        </h3>
        <p className="text-white/50 text-sm mb-6">
          Your shipment APX-2025-8847292 has been scheduled for pickup.
        </p>
        <Button
          onClick={() => setDone(false)}
          variant="outline"
          className="bg-white/6 border-white/15 text-white hover:bg-white/10"
        >
          Create Another
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label className="text-white/70 text-xs uppercase tracking-wide">
            Sender Name
          </Label>
          <Input
            placeholder="John Doe"
            defaultValue="John Doe"
            className="mt-1.5 bg-white/6 border-white/12 text-white placeholder:text-white/25 focus:border-white/25"
          />
        </div>
        <div className="col-span-2">
          <Label className="text-white/70 text-xs uppercase tracking-wide">
            Recipient Name
          </Label>
          <Input
            placeholder="Jane Smith"
            className="mt-1.5 bg-white/6 border-white/12 text-white placeholder:text-white/25 focus:border-white/25"
          />
        </div>
        <div>
          <Label className="text-white/70 text-xs uppercase tracking-wide">
            Weight (kg)
          </Label>
          <Input
            type="number"
            placeholder="2.5"
            defaultValue="2.5"
            className="mt-1.5 bg-white/6 border-white/12 text-white placeholder:text-white/25 focus:border-white/25"
          />
        </div>
        <div>
          <Label className="text-white/70 text-xs uppercase tracking-wide">
            Service Type
          </Label>
          <Input
            placeholder="Express"
            defaultValue="Express"
            className="mt-1.5 bg-white/6 border-white/12 text-white placeholder:text-white/25 focus:border-white/25"
          />
        </div>
      </div>
      <DialogFooter className="pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black hover:bg-white/90"
        >
          {loading ? "Creating..." : "Create Shipment"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function DashboardDialog01() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white text-black hover:bg-white/90">
          <Package className="w-4 h-4 mr-2" />
          New Shipment
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-neutral-950 border-white/12 text-white sm:max-w-md [&>button]:text-white/40 [&>button]:hover:text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Shipment</DialogTitle>
          <DialogDescription className="text-white/50">
            Enter the details below to schedule a new pickup.
          </DialogDescription>
        </DialogHeader>
        <Separator className="bg-white/8" />
        <Dialog01Content />
      </DialogContent>
    </Dialog>
  )
}

export default function DashboardDialog01Demo() {
  return (
    <div className="py-16 px-6">
      <div className="max-w-md mx-auto">
        <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-4">
          Dialog 01 — New Shipment Form
        </p>
        <DashboardDialog01 />
      </div>
    </div>
  )
}