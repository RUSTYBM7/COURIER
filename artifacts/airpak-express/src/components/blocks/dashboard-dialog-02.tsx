"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Trash2, AlertTriangle, X, MapPin, Pencil, CheckCircle2 } from "lucide-react"

// Dialog 02 — Edit Address + Confirm Delete

function EditAddressDialog() {
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setDone(true)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/8"
        >
          <Pencil className="w-3.5 h-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-neutral-950 border-white/12 text-white sm:max-w-sm [&>button]:text-white/40 [&>button]:hover:text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Delivery Address</DialogTitle>
          <DialogDescription className="text-white/50">
            Update the recipient address for APX-2025-8847291.
          </DialogDescription>
        </DialogHeader>
        <Separator className="bg-white/8" />

        {done ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-white font-semibold mb-1">Address Updated</p>
            <p className="text-white/40 text-sm">Changes saved successfully.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-white/70 text-xs uppercase tracking-wide">
                Full Address
              </Label>
              <Input
                defaultValue="42 Orchard Road, #12-03"
                className="mt-1.5 bg-white/6 border-white/12 text-white focus:border-white/25"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/70 text-xs uppercase tracking-wide">
                  City
                </Label>
                <Input
                  defaultValue="Singapore"
                  className="mt-1.5 bg-white/6 border-white/12 text-white focus:border-white/25"
                />
              </div>
              <div>
                <Label className="text-white/70 text-xs uppercase tracking-wide">
                  Postal Code
                </Label>
                <Input
                  defaultValue="238801"
                  className="mt-1.5 bg-white/6 border-white/12 text-white focus:border-white/25"
                />
              </div>
            </div>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-white text-black hover:bg-white/90"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}

        {done && (
          <Button
            onClick={() => { setOpen(false); setDone(false) }}
            variant="outline"
            className="w-full mt-2 bg-white/6 border-white/12 text-white/70 hover:bg-white/10"
          >
            Close
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}

function ConfirmDeleteDialog() {
  const [open, setOpen] = useState(false)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-400/60 hover:text-red-400 hover:bg-red-500/6"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-neutral-950 border-white/12 text-white">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <AlertDialogTitle className="text-white">
                Delete Shipment?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-white/50">
                This action cannot be undone.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel className="bg-white/6 border-white/12 text-white/70 hover:bg-white/10 hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => setOpen(false)}
            className="bg-red-600 text-white hover:bg-red-500"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function DashboardDialog02() {
  return (
    <div className="bg-white/4 border border-white/8 rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <MapPin className="w-4 h-4 text-white/60" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold mb-0.5">
              42 Orchard Road, #12-03
            </p>
            <p className="text-white/40 text-xs">
              Singapore 238801 · Jane Smith
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <EditAddressDialog />
          <ConfirmDeleteDialog />
        </div>
      </div>
    </div>
  )
}

export default function DashboardDialog02Demo() {
  return (
    <div className="py-16 px-6">
      <div className="max-w-md mx-auto">
        <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-4">
          Dialog 02 — Edit Address + Confirm Delete
        </p>
        <div className="space-y-3">
          <DashboardDialog02 />
          <div className="bg-white/4 border border-white/8 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-white/60" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold mb-0.5">
                    88 Queen's Tower, #24-01
                  </p>
                  <p className="text-white/40 text-xs">
                    Hong Kong 999077 · David Tan
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <EditAddressDialog />
                <ConfirmDeleteDialog />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}