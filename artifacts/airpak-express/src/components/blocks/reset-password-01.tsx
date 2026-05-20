"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ArrowLeft, Eye, EyeOff, Check, X } from "lucide-react"

function PasswordRule({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-4 h-4 rounded-full flex items-center justify-center transition-colors", met ? "bg-green-500/20 text-green-400" : "bg-white/8 text-white/20")}>
        {met ? <Check className="w-2.5 h-2.5" /> : null}
      </div>
      <span className={cn("text-xs", met ? "text-white/60" : "text-white/30")}>{label}</span>
    </div>
  )
}

export default function ResetPassword01() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState("")

  const rules = {
    len: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    match: confirm.length > 0 && password === confirm,
  }
  const allMet = rules.len && rules.upper && rules.lower && rules.number && rules.match

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!allMet) { setGlobalError("Please meet all password requirements"); return }
    setGlobalError("")
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm text-center"
        >
          <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-6 h-6 text-green-400" />
          </div>
          <h2 className="text-xl font-semibold mb-3">Password updated</h2>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            Your password has been reset. Sign in with your new password.
          </p>
          <a
            href="/signin"
            className="inline-block w-full py-3 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            Sign In
          </a>
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
            <h1 className="text-2xl font-semibold mb-2">Set new password</h1>
            <p className="text-white/50 text-sm leading-relaxed">
              Must be at least 8 characters with uppercase, lowercase, and a number.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5 text-white/80">
                New password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className={cn(
                    "w-full px-4 py-3 pr-11 rounded-lg text-sm bg-white/6 text-white placeholder:text-white/25",
                    "border border-white/10 outline-none transition-all duration-150",
                    "focus:ring-2 focus:ring-white/20 focus:border-white/25"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-medium mb-1.5 text-white/80">
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  className={cn(
                    "w-full px-4 py-3 pr-11 rounded-lg text-sm bg-white/6 text-white placeholder:text-white/25",
                    "border outline-none transition-all duration-150",
                    "focus:ring-2 focus:ring-white/20",
                    confirm && !rules.match ? "border-red-500/50" : "border-white/10 focus:border-white/25"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirm && !rules.match ? (
                <p className="mt-1.5 text-xs text-red-400">Passwords do not match</p>
              ) : null}
            </div>

            {/* Rules checklist */}
            <div className="grid grid-cols-2 gap-1.5 p-4 rounded-lg bg-white/4 border border-white/8">
              <PasswordRule met={rules.len} label="At least 8 characters" />
              <PasswordRule met={rules.upper} label="Uppercase letter" />
              <PasswordRule met={rules.lower} label="Lowercase letter" />
              <PasswordRule met={rules.number} label="Number" />
            </div>

            {globalError ? (
              <p className="text-xs text-red-400">{globalError}</p>
            ) : null}

            <button
              type="submit"
              disabled={loading || !allMet}
              className={cn(
                "w-full py-3 rounded-lg text-sm font-semibold transition-all duration-150",
                "bg-white text-black hover:bg-white/90 active:scale-[0.98]",
                "disabled:opacity-30 disabled:cursor-not-allowed"
              )}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}