import { useState } from "react";
import { Link, useLocation } from "wouter";
import { AirpakLogo } from "@/components/AirpakLogo";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun, ArrowRight } from "lucide-react";

export default function SignUp() {
  const [, navigate] = useLocation();
  const { toggle, resolvedTheme } = useTheme();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", terms: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: field === "terms" ? (e.target as HTMLInputElement).checked : e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) { setError("Please fill in all required fields."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (!form.terms) { setError("You must agree to the Terms of Service."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    navigate("/dashboard");
  }

  return (
    <div id="main-content">
      <nav className="nav-bar" style={{ position: "relative", zIndex: 100 }} role="navigation" aria-label="Auth navigation">
        <div className="nav-left">
          <Link href="/" className="nav-logo" aria-label="Airpak Express — Home"><AirpakLogo size={28} /><span className="nav-logo-text">Airpak Express</span></Link>
          <nav className="nav-links" aria-label="Site links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/signup" className="nav-link active" aria-current="page">Sign Up</Link>
            <Link href="/signin" className="nav-link">Sign In</Link>
            <Link href="/tracking" className="nav-link">Tracking</Link>
            <Link href="/faq" className="nav-link">FAQ</Link>
          </nav>
        </div>
        <div className="nav-right">
          <button className="theme-toggle" onClick={toggle} aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}>
            {resolvedTheme === "dark" ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>
          <Link href="/signin" className="nav-signin">Sign In</Link>
        </div>
      </nav>

      <main className="auth-page" id="main-content" style={{ paddingTop: "var(--nav-height, 56px)" }}>
        <div className="auth-bg-overlay" aria-hidden="true" />
        <div className="auth-card">
          <div className="auth-header">
            <Link href="/" className="auth-logo" aria-label="Airpak Express"><AirpakLogo size={40} /></Link>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join 50,000+ businesses shipping with Airpak</p>
          </div>

          <form className="auth-form" id="signup-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div role="alert" style={{ background: "rgba(255,59,48,0.1)", border: "1px solid rgba(255,59,48,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: "var(--text-sm)", color: "var(--apple-red)" }}>
                {error}
              </div>
            )}
            <div className="field">
              <label className="field-label" htmlFor="name">Full Name</label>
              <input type="text" id="name" className="input" placeholder="Enter your full name" required aria-required="true" value={form.name} onChange={update("name")} autoComplete="name" />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="email">Email address</label>
              <input type="email" id="email" className="input" placeholder="you@company.com" required aria-required="true" value={form.email} onChange={update("email")} autoComplete="email" />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="password">Password</label>
              <input type="password" id="password" className="input" placeholder="Create a strong password" required aria-required="true" minLength={8} value={form.password} onChange={update("password")} autoComplete="new-password" />
              <span className="field-hint">Must be at least 8 characters</span>
            </div>
            <div className="field">
              <label className="field-label" htmlFor="confirm-password">Confirm Password</label>
              <input type="password" id="confirm-password" className="input" placeholder="Confirm your password" required aria-required="true" value={form.confirm} onChange={update("confirm")} autoComplete="new-password" />
            </div>

            <div className="field" style={{ marginTop: 8 }}>
              <label style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}>
                <input type="checkbox" checked={form.terms} onChange={update("terms")} required aria-required="true" style={{ marginTop: 2 }} />
                <span className="label-text">
                  I agree to the{" "}
                  <Link href="/terms" style={{ color: "var(--apple-blue)" }}>Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" style={{ color: "var(--apple-blue)" }}>Privacy Policy</Link>
                </span>
              </label>
            </div>

            <button type="submit" className="btn-primary btn-block btn-lg" disabled={loading} aria-busy={loading}>
              {loading ? "Creating account…" : <><ArrowRight size={16} aria-hidden="true" /> Create Account</>}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{" "}
            <Link href="/signin" style={{ color: "var(--apple-blue)", fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
