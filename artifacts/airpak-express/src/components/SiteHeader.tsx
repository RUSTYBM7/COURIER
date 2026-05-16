import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const NAV = [
  { href: "/aboutus", label: "About Us" },
  { href: "/services", label: "Services", hasDropdown: true },
  { href: "/media-centre", label: "Media Centre" },
  { href: "/contact", label: "Contact" },
  { href: "/careers", label: "Careers" },
  { href: "/track-shipment", label: "Track Shipment" },
];

const SERVICES = [
  { href: "/services#domestic", label: "Domestic Delivery" },
  { href: "/services#international", label: "International Shipping" },
  { href: "/services#express", label: "Express Courier" },
  { href: "/services#freight", label: "Freight Forwarding" },
  { href: "/services#enterprise", label: "Enterprise Solutions" },
];

export function SiteHeader() {
  const [, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-['Caveat_Brush'] text-4xl text-[#E11D2A]">Airpak<sup className="text-xs">®</sup></span>
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

          <div
            className="relative"
            onMouseEnter={() => setLoginOpen(true)}
            onMouseLeave={() => setLoginOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-gray-800 hover:text-[#E11D2A] transition-colors">
              Login
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {loginOpen && (
              <div className="absolute top-full right-0 pt-2 w-48">
                <div className="bg-white border border-gray-100 rounded-lg shadow-lg py-2">
                  <Link href="/signin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#E11D2A]">
                    Customer Login
                  </Link>
                  <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#E11D2A]">
                    Admin Login
                  </Link>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate("/signup")}
            className="px-5 py-2 rounded-full bg-[#E11D2A] text-white text-sm font-semibold hover:bg-[#c41723] transition-colors"
          >
            Sign Up
          </button>
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
            <Link href="/signin" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-gray-800">
              Customer Login
            </Link>
            <Link
              href="/signup"
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
