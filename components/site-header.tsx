"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const NAV = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services", hasDropdown: true },
  { href: "/media-centre", label: "Media Centre" },
  { href: "/contact", label: "Contact" },
  { href: "/careers", label: "Careers" },
  { href: "/tracking", label: "Track Shipment" },
];

const SERVICES = [
  { href: "/services#domestic", label: "Domestic Delivery" },
  { href: "/services#international", label: "International Shipping" },
  { href: "/services#express", label: "Express Courier" },
  { href: "/services#freight", label: "Freight Forwarding" },
  { href: "/services#enterprise", label: "Enterprise Solutions" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-[family-name:var(--font-caveat-brush)] text-4xl text-[#E11D2A]">Airpak<sup className="text-xs align-super">®</sup></span>
          <span className="text-xs font-semibold tracking-wide text-gray-800 mt-0.5">Airpak Express</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map((item) =>
            item.hasDropdown ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setSvcOpen(true)}
                onMouseLeave={() => setSvcOpen(false)}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-gray-800 hover:text-[#E11D2A] transition-colors">
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {svcOpen && (
                  <div className="absolute top-full left-0 pt-2 w-64">
                    <div className="bg-white border border-gray-100 rounded-lg shadow-lg py-2">
                      {SERVICES.map((s) => (
                        <Link
                          key={s.href}
                          href={s.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#E11D2A]"
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-800 hover:text-[#E11D2A] transition-colors"
              >
                {item.label}
              </Link>
            ),
          )}

          <Link
            href="https://shipnow.airpak-express.site"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-800 hover:text-[#E11D2A] transition-colors"
          >
            Login
          </Link>

          <Link
            href="https://shipnow.airpak-express.site"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full bg-[#E11D2A] text-white text-sm font-semibold hover:bg-[#c41723] transition-colors"
          >
            Sign Up
          </Link>
        </nav>

        <button onClick={() => setOpen(!open)} className="lg:hidden p-2" aria-label="menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="px-6 py-4 space-y-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm font-medium text-gray-800"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="https://shipnow.airpak-express.site"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-gray-800"
            >
              Login
            </Link>
            <Link
              href="https://shipnow.airpak-express.site"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="block mt-3 px-5 py-2 rounded-full bg-[#E11D2A] text-white text-sm font-semibold text-center"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
