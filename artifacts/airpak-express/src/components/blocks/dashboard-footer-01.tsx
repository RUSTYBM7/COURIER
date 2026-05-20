"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

const footerLinks = {
  Company: ["About Us", "Careers", "Press", "Blog"],
  Services: ["Domestic Delivery", "International Shipping", "Warehousing", "Express Courier"],
  Support: ["Track Shipment", "FAQs", "Contact Us", "File a Claim"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
}

export default function DashboardFooter01() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <span className="text-black text-xs font-bold">A</span>
              </div>
              <span className="text-white font-semibold text-sm">Airpak Express</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Moving the world forward — one shipment at a time. Available in 40+ countries.
            </p>
            <div className="flex gap-3 mt-5">
              {["X", "in", "ig", "fb"].map((s) => (
                <button
                  key={s}
                  className="w-8 h-8 rounded-lg bg-white/6 border border-white/10 text-white/50 text-xs hover:text-white hover:bg-white/10 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-white font-semibold text-sm mb-4">{group}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-white/40 text-sm hover:text-white/70 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="bg-white/8 mb-6" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white/30 text-xs">
          <p>© 2025 Airpak Express. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-white/60 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}