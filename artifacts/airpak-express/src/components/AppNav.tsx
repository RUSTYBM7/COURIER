import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { AirpakLogo } from "@/components/AirpakLogo";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage, LANGUAGES, Lang } from "@/hooks/useLanguage";
import { Moon, Sun, Bell, Menu, X, Settings, ChevronDown } from "lucide-react";

interface NavProps {
  variant?: "public" | "app" | "auth";
  showSidebar?: boolean;
  onMenuToggle?: () => void;
  sidebarOpen?: boolean;
}

const PUBLIC_SITE = "https://airpak-express.site";

export function AppNav({ variant = "public", showSidebar, onMenuToggle, sidebarOpen }: NavProps) {
  const [location] = useLocation();
  const { toggle, resolvedTheme } = useTheme();
  const { lang, setLang, langInfo } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isActive = (path: string) => location === path;

  return (
    <>
      <nav className="nav-bar" role="navigation" aria-label="Main navigation">
        <div className="nav-left">
          {/* Hamburger for mobile / sidebar toggle */}
          {(showSidebar || variant !== "auth") && (
            <button
              className="nav-icon"
              style={{ display: "flex" }}
              onClick={() => {
                if (onMenuToggle) onMenuToggle();
                else setMobileOpen(!mobileOpen);
              }}
              aria-label={sidebarOpen || mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={sidebarOpen || mobileOpen}
              aria-controls="mobile-nav"
            >
              {sidebarOpen || mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}

          <Link href="/" className="nav-logo" aria-label="Airpak Express — Home">
            <AirpakLogo size={28} />
            <span className="nav-logo-text">Airpak Express</span>
          </Link>

          {/* Desktop nav links */}
          {variant === "public" && (
            <nav className="nav-links" aria-label="Site navigation">
              <a href={`${PUBLIC_SITE}/`} className="nav-link">Home</a>
              <a href={`${PUBLIC_SITE}/aboutus.html`} className="nav-link">About</a>
              <a href={`${PUBLIC_SITE}/contact.html`} className="nav-link">Contact</a>
              <Link href="/tracking" className={`nav-link${isActive("/tracking") ? " active" : ""}`}>Track</Link>
              <Link href="/faq" className={`nav-link${isActive("/faq") ? " active" : ""}`}>FAQ</Link>
            </nav>
          )}

          {variant === "app" && (
            <nav className="nav-links" aria-label="App navigation">
              <Link href="/dashboard" className={`nav-link${isActive("/dashboard") ? " active" : ""}`}>Dashboard</Link>
              <Link href="/tracking" className={`nav-link${isActive("/tracking") ? " active" : ""}`}>Shipments</Link>
              <Link href="/payment" className={`nav-link${isActive("/payment") ? " active" : ""}`}>Wallet</Link>
            </nav>
          )}
        </div>

        <div className="nav-right">
          {/* Language Switcher */}
          <div className="lang-pill-wrapper" ref={langRef} style={{ position: "relative" }}>
            <button
              className="lang-pill"
              aria-label={`Language: ${langInfo.label}. Click to change`}
              aria-expanded={langOpen}
              aria-haspopup="listbox"
              onClick={() => setLangOpen(!langOpen)}
            >
              <span className="flag" aria-hidden="true">{langInfo.flag}</span>
              <ChevronDown size={12} aria-hidden="true" />
            </button>
            {langOpen && (
              <div className="lang-dropdown" role="listbox" aria-label="Select language">
                {(Object.entries(LANGUAGES) as [Lang, typeof LANGUAGES[Lang]][]).map(([code, info]) => (
                  <button
                    key={code}
                    className={`lang-option${lang === code ? " active" : ""}`}
                    role="option"
                    aria-selected={lang === code}
                    onClick={() => { setLang(code); setLangOpen(false); }}
                  >
                    <span className="flag" aria-hidden="true">{info.flag}</span> {info.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            className="theme-toggle"
            onClick={toggle}
            aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
          >
            {resolvedTheme === "dark" ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>

          {variant === "app" && (
            <button className="nav-icon" aria-label="Notifications">
              <Bell size={18} aria-hidden="true" />
              <span className="badge-dot" aria-hidden="true" />
            </button>
          )}

          {variant === "public" && (
            <>
              <Link href="/signin" className="nav-signin">Sign In</Link>
              <Link href="/signup" className="nav-cta" aria-label="Get started with Airpak Express">Get Started</Link>
            </>
          )}

          {variant === "app" && (
            <Link href="/settings" className="nav-signin" style={{ marginLeft: 8, display: "inline-flex", alignItems: "center", gap: 6 }} aria-label="Settings">
              <Settings size={16} aria-hidden="true" /> Settings
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile nav drawer */}
      {!showSidebar && (
        <>
          {mobileOpen && (
            <div
              className="mobile-menu-overlay open"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
          )}
          <div
            id="mobile-nav"
            className={`mobile-nav-drawer${mobileOpen ? " open" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div style={{ padding: "20px", borderBottom: "1px solid var(--apple-separator)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <AirpakLogo size={24} />
                  <span style={{ fontWeight: 700, fontSize: 16 }}>Airpak Express</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--apple-label)", padding: 4 }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <nav style={{ padding: "12px 0" }} aria-label="Mobile navigation">
              {variant === "public" && (
                <>
                  <a href={`${PUBLIC_SITE}/`} className="dashboard-sidebar-item" onClick={() => setMobileOpen(false)}>Home</a>
                  <a href={`${PUBLIC_SITE}/aboutus.html`} className="dashboard-sidebar-item" onClick={() => setMobileOpen(false)}>About</a>
                  <a href={`${PUBLIC_SITE}/contact.html`} className="dashboard-sidebar-item" onClick={() => setMobileOpen(false)}>Contact</a>
                </>
              )}
              <Link href="/tracking" className="dashboard-sidebar-item" onClick={() => setMobileOpen(false)}>Track Package</Link>
              <Link href="/faq" className="dashboard-sidebar-item" onClick={() => setMobileOpen(false)}>FAQ</Link>
              <Link href="/signin" className="dashboard-sidebar-item" onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link href="/signup" className="dashboard-sidebar-item" onClick={() => setMobileOpen(false)}>Sign Up</Link>
              {variant === "app" && (
                <>
                  <Link href="/dashboard" className="dashboard-sidebar-item" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                  <Link href="/payment" className="dashboard-sidebar-item" onClick={() => setMobileOpen(false)}>Wallet</Link>
                  <Link href="/chat" className="dashboard-sidebar-item" onClick={() => setMobileOpen(false)}>Support</Link>
                  <Link href="/settings" className="dashboard-sidebar-item" onClick={() => setMobileOpen(false)}>Settings</Link>
                </>
              )}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
