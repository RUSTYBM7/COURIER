import { useState } from "react";
import { Link } from "wouter";
import { AirpakLogo } from "@/components/AirpakLogo";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun, ArrowRight, CheckCircle } from "lucide-react";

export default function ResetPassword() {
  const { toggle, resolvedTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email) { setError("Please enter your email address."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
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
        </div>
      </nav>

      <main className="auth-page">
        <div className="auth-bg-overlay" style={{ background: "linear-gradient(135deg, rgba(88,86,214,0.25) 0%, rgba(0,122,255,0.25) 100%)" }} aria-hidden="true" />
        <div className="auth-card" style={{ maxWidth: 420 }}>
          {!sent ? (
            <>
              <div className="auth-header">
                <Link href="/" className="auth-logo" aria-label="Airpak Express"><AirpakLogo size={40} /></Link>
                <h1 className="auth-title">Reset Password</h1>
                <p className="auth-subtitle">Enter your email and we'll send you a reset link</p>
              </div>
              <form className="auth-form" onSubmit={handleSubmit} noValidate>
                {error && (
                  <div role="alert" style={{ background: "rgba(255,59,48,0.1)", border: "1px solid rgba(255,59,48,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: "var(--text-sm)", color: "var(--apple-red)" }}>
                    {error}
                  </div>
                )}
                <div className="field">
                  <label className="field-label" htmlFor="email">Email address</label>
                  <input type="email" id="email" className="input" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} required aria-required="true" autoComplete="email" />
                </div>
                <button type="submit" className="btn-primary btn-block btn-lg" disabled={loading} aria-busy={loading}>
                  {loading ? "Sending…" : <><ArrowRight size={16} aria-hidden="true" /> Send Reset Link</>}
                </button>
              </form>
              <p className="auth-footer">
                Remember your password?{" "}
                <Link href="/signin" style={{ color: "var(--apple-blue)", fontWeight: 600 }}>Sign in</Link>
              </p>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <CheckCircle size={56} color="var(--apple-green)" style={{ margin: "0 auto 16px", display: "block" }} aria-hidden="true" />
              <h2 className="auth-title">Check your email</h2>
              <p className="auth-subtitle" style={{ marginTop: 8, marginBottom: 24 }}>
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <Link href="/signin" className="btn-primary btn-block">Back to Sign In</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
