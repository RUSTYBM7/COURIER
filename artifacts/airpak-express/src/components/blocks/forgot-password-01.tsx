"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ArrowLeft, Mail } from "lucide-react"

export default function ForgotPassword01() {
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<{ email?: string }>({})
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = (val: string) => {
    if (!val.trim()) return "Email address is required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Enter a valid email address"
    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate(email)
    if (err) { setErrors({ email: err }); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm text-center"
        >
          <div className="w-14 h-14 rounded-full bg-white/8 border border-white/12 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-6 h-6 text-white/60" />
          </div>
          <h2 className="text-xl font-semibold mb-3">Check your email</h2>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            We sent a password reset link to <span className="text-white font-medium">{email}</span>. It expires in 30 minutes.
          </p>
          <button
            onClick={() => { setSent(false); setEmail("") }}
            className="text-white/40 text-sm hover:text-white transition-colors"
          >
            Didn't get it? Try again
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <a
            href="/signin"
            className="inline-flex items-center gap-1.5 text-white/40 text-sm hover:text-white transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </a>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold mb-2">Forgot password?</h1>
            <p className="text-white/50 text-sm leading-relaxed">
              No worries. Enter your email and we'll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-white/80">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors({}) }}
                onBlur={() => setErrors({ email: validate(email) })}
                placeholder="you@company.com"
                className={cn(
                  "w-full px-4 py-3 rounded-lg text-sm bg-white/6 text-white placeholder:text-white/25",
                  "border outline-none transition-all duration-150",
                  "focus:ring-2 focus:ring-white/20 focus:border-white/25",
                  errors.email ? "border-red-500/50" : "border-white/10"
                )}
              />
              {errors.email ? (
                <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full py-3 rounded-lg text-sm font-semibold transition-all duration-150",
                "bg-white text-black hover:bg-white/90 active:scale-[0.98]",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}