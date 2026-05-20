"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Shield, Smartphone } from "lucide-react"

export default function TwoFactorAuthentication01() {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return
    const next = code.map((c, i) => (i === index ? val : c))
    setCode(next)
    if (val && index < 5) inputs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (!pasted) return
    setCode(pasted.padEnd(6, "").split("").slice(0, 6))
    inputs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const allFilled = code.every((c) => c.length === 1)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!allFilled) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    alert("Code verified! Redirecting...")
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-full bg-white/8 border border-white/12 flex items-center justify-center mx-auto mb-5">
            <Shield className="w-6 h-6 text-white/60" />
          </div>
          <h1 className="text-xl font-semibold mb-2">Two-factor authentication</h1>
          <p className="text-white/50 text-sm leading-relaxed">
            Enter the 6-digit code from your authenticator app.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 6-digit input */}
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={cn(
                  "w-11 h-13 rounded-xl text-center text-lg font-semibold",
                  "bg-white/6 border outline-none transition-all duration-150",
                  "focus:ring-2 focus:ring-white/20 focus:border-white/25",
                  digit ? "border-white/20 text-white" : "border-white/10 text-white/40"
                )}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={!allFilled || loading}
            className={cn(
              "w-full py-3 rounded-lg text-sm font-semibold transition-all duration-150",
              "bg-white text-black hover:bg-white/90 active:scale-[0.98]",
              "disabled:opacity-30 disabled:cursor-not-allowed"
            )}
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        <div className="mt-8 flex items-center gap-2 justify-center text-white/30 text-xs">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Codes expire in 30 seconds</span>
        </div>

        <div className="mt-6 text-center space-y-2">
          <button className="text-white/40 text-xs hover:text-white/60 transition-colors block w-full">
            Use a backup code
          </button>
          <button className="text-white/40 text-xs hover:text-white/60 transition-colors block w-full">
            Lost access to your device?
          </button>
        </div>
      </motion.div>
    </div>
  )
}