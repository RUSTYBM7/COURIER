"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"

export default function VerifyEmail01() {
  const [loading, setLoading] = useState(false)
  const [resent, setResent] = useState(false)
  const [email] = useState("alex@airpak.com")

  const handleResend = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setResent(true)
    setTimeout(() => setResent(false), 3000)
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm text-center"
      >
        <div className="w-16 h-16 rounded-full bg-white/8 border border-white/12 flex items-center justify-center mx-auto mb-6">
          <Mail className="w-7 h-7 text-white/60" />
        </div>

        <h1 className="text-xl font-semibold mb-3">Verify your email</h1>
        <p className="text-white/50 text-sm leading-relaxed mb-2">
          We sent a verification link to
        </p>
        <p className="text-white font-medium text-sm mb-8">{email}</p>

        <div className="bg-white/4 border border-white/8 rounded-xl p-5 text-left mb-8">
          <p className="text-white/60 text-xs font-medium uppercase tracking-wide mb-3">
            Didn't receive it?
          </p>
          <button
            onClick={handleResend}
            disabled={loading}
            className={cn(
              "w-full py-2.5 rounded-lg text-sm border border-white/15 transition-all duration-150",
              "hover:bg-white/8 text-white/80 hover:text-white",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              resent && "border-green-500/30 text-green-400"
            )}
          >
            {loading ? "Sending..." : resent ? "✓ Link sent" : "Resend verification email"}
          </button>
        </div>

        <a
          href="/signin"
          className="inline-flex items-center gap-1.5 text-white/40 text-sm hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </a>
      </motion.div>
    </div>
  )
}