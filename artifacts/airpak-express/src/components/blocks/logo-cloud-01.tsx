"use client"

import { cn } from "@/lib/utils"

const logos = [
  "DHL Express",
  "FedEx",
  "UPS",
  "Singapore Post",
  "Royal Mail",
  "Hongkong Post",
]

export default function LogoCloud01() {
  return (
    <section className="bg-black py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-white text-center text-xl font-medium mb-12">
          Trusted by Leading Brands
        </h2>

        <div className="border-t border-white/10 pt-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {logos.map((logo) => (
              <div
                key={logo}
                className="flex items-center justify-center"
              >
                <span
                  className={cn(
                    "text-sm font-medium tracking-wide transition-colors duration-200",
                    "text-white/40 hover:text-white/70"
                  )}
                >
                  {logo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}