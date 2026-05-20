"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { LanguagesIcon } from "lucide-react"

type LanguageDropdownProps = {
  trigger: React.ReactNode
  defaultOpen?: boolean
  align?: "start" | "center" | "end"
}

const languages = [
  { value: "english", label: "English" },
  { value: "german", label: "Deutsch" },
  { value: "spanish", label: "Española" },
  { value: "portuguese", label: "Português" },
  { value: "korean", label: "한국인" },
]

function LanguageDropdown({ defaultOpen, align, trigger }: LanguageDropdownProps) {
  const [language, setLanguage] = useState("english")

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={align || "end"}
        className="w-44 bg-white/10 border-white/15 backdrop-blur-xl"
      >
        <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
          {languages.map((lang) => (
            <DropdownMenuRadioItem
              key={lang.value}
              value={lang.value}
              className={cn(
                "text-white/70 hover:text-white hover:bg-white/8 cursor-pointer",
                "data-[state=checked]:bg-white/12 data-[state=checked]:text-white"
              )}
            >
              {lang.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ProfileDropdown({
  trigger,
  defaultOpen,
}: {
  trigger: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen || false)

  const menuItems = [
    { label: "Profile", href: "/settings" },
    { label: "Billing", href: "/payment" },
    { label: "Admin Panel", href: "/admin" },
  ]

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}>{trigger}</button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white/10 border border-white/15 rounded-xl p-1.5 z-50 backdrop-blur-xl shadow-xl"
            >
              <div className="px-3 py-2 mb-1">
                <p className="text-white text-sm font-semibold">Alex Morgan</p>
                <p className="text-white/40 text-xs">alex@airpak.com</p>
              </div>
              <div className="border-t border-white/10 pt-1.5 space-y-0.5">
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block px-3 py-2 rounded-lg text-white/60 text-sm hover:text-white hover:bg-white/8 transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
                <div className="border-t border-white/10 pt-1.5 mt-1">
                  <a
                    href="/signin"
                    className="block px-3 py-2 rounded-lg text-red-400/60 text-sm hover:text-red-400 hover:bg-red-500/6 transition-colors"
                  >
                    Sign Out
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function DashboardDropdown01() {
  return (
    <div className="py-16 px-6">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Language dropdown */}
        <div>
          <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-3">
            Language Selector
          </p>
          <LanguageDropdown
            defaultOpen
            align="start"
            trigger={
              <Button
                variant="outline"
                size="icon"
                className="bg-white/6 border-white/15 text-white hover:bg-white/10 hover:border-white/25"
              >
                <LanguagesIcon className="h-4 w-4" />
              </Button>
            }
          />
        </div>

        {/* Profile dropdown */}
        <div>
          <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-3">
            Profile Menu
          </p>
          <ProfileDropdown
            trigger={
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center cursor-pointer hover:bg-white/14 transition-colors">
                <span className="text-white text-xs font-semibold">AM</span>
              </div>
            }
          />
        </div>

        {/* Header example */}
        <div>
          <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-3">
            Header Integration
          </p>
          <div className="flex items-center justify-between bg-white/6 border border-white/10 rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
                <span className="text-black text-xs font-bold">A</span>
              </div>
              <span className="text-white font-semibold text-sm">Airpak Express</span>
            </div>
            <div className="flex items-center gap-2">
              <LanguageDropdown
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/60 hover:text-white"
                  >
                    <LanguagesIcon className="h-4 w-4" />
                  </Button>
                }
              />
              <ProfileDropdown
                trigger={
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center cursor-pointer hover:bg-white/14 transition-colors">
                    <span className="text-white text-xs font-semibold">AM</span>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}