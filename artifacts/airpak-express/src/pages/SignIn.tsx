import { useState } from "react";
import { Link, useLocation } from "wouter";
import { AirpakLogo } from "@/components/AirpakLogo";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun, ArrowRight } from "lucide-react";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

export default function SignIn() {
  const [, navigate] = useLocation();
  const { toggle, resolvedTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    navigate("/dashboard");
  }

  return (
    <div id="main-content">
      <nav className="nav-bar" style={{ position: "relative", zIndex: 100 }} role="navigation" aria-label="Auth navigation">
        <div className="nav-left">
          <Link href="/" className="nav-logo" aria-label="Airpak Express — Home"><AirpakLogo size={28} /><span className="nav-logo-text">Airpak Express</span></Link>
        </div>
        <div className="nav-right">
          <button className="theme-toggle" onClick={toggle} aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}>
            {resolvedTheme === "dark" ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>
          <Link href="/signup" className="lang-pill"><span className="flag" aria-hidden="true">EN</span> English</Link>
        </div>
      </nav>

      <main className="auth-page">
        <div className="auth-bg-overlay" style={{ background: "linear-gradient(135deg, rgba(0,122,255,0.3) 0%, rgba(88,86,214,0.3) 100%)" }} aria-hidden="true" />
        <div className="auth-card" style={{ maxWidth: 420 }}>
          <div className="auth-header">
            <Link href="/" className="auth-logo" aria-label="Airpak Express"><AirpakLogo size={40} /></Link>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to manage your shipments</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div role="alert" style={{ background: "rgba(255,59,48,0.1)", border: "1px solid rgba(255,59,48,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: "var(--text-sm)", color: "var(--apple-red)" }}>
                {error}
              </div>
            )}
            <div className="field">
              <label className="field-label" htmlFor="email">Email address</label>
              <input
                type="email" id="email" className="input" placeholder="you@company.com"
                value={email} onChange={e => setEmail(e.target.value)}
                required autoComplete="email" aria-required="true"
              />
            </div>
            <div className="field">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className="field-label" htmlFor="password">Password</label>
                <Link href="/reset-password" className="btn-ghost" style={{ fontSize: "var(--text-sm)" }}>Forgot password?</Link>
              </div>
              <input
                type="password" id="password" className="input" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                required autoComplete="current-password" aria-required="true"
              />
            </div>
            <div className="checkbox">
              <input type="checkbox" id="remember" checked={remember} onChange={e => setRemember(e.target.checked)} />
              <label className="label-text" htmlFor="remember">Remember me for 30 days</label>
            </div>
            <button type="submit" className="btn-primary btn-block btn-lg" disabled={loading} aria-busy={loading}>
              {loading ? "Signing in…" : <><ArrowRight size={16} aria-hidden="true" /> Sign In</>}
            </button>
            <div className="auth-divider"><span>or continue with</span></div>
            <div className="auth-social">
              <button type="button" className="btn-social" onClick={() => alert("Google auth coming soon")} aria-label="Sign in with Google"><GoogleIcon /> Google</button>
              <button type="button" className="btn-social" onClick={() => alert("Apple auth coming soon")} aria-label="Sign in with Apple"><AppleIcon /> Apple</button>
            </div>
          </form>

          <p className="auth-footer">
            Don't have an account?{" "}
            <Link href="/signup" style={{ color: "var(--apple-blue)", fontWeight: 600 }}>Sign up</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
