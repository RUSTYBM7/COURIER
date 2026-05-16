import { useState } from "react";
import { Link } from "wouter";
import { AppNav } from "@/components/AppNav";
import {
  Truck, Zap, Shield, Globe, Smartphone, MessageCircle,
  Box, Rocket, Building, ArrowRight, Package, Star
} from "lucide-react";

const PUBLIC_SITE = "https://airpak-express.site";

const STATS = [
  { value: "2M+", label: "Packages Delivered" },
  { value: "190+", label: "Countries Served" },
  { value: "99.8%", label: "On-Time Rate" },
  { value: "24/7", label: "Support Available" },
];

const FEATURES = [
  { icon: <Truck size={24} />, title: "Real-Time Tracking", desc: "Monitor every package from pickup to delivery with our advanced GPS system." },
  { icon: <Zap size={24} />, title: "Express Delivery", desc: "Same-day and next-day delivery options across our global network." },
  { icon: <Shield size={24} />, title: "Secure Handling", desc: "Insurance options and tamper-proof packaging for peace of mind." },
  { icon: <Globe size={24} />, title: "Global Reach", desc: "Coverage in 190+ countries with local expertise in every region." },
  { icon: <Smartphone size={24} />, title: "Mobile App", desc: "Manage shipments, track packages, and get notifications on the go." },
  { icon: <MessageCircle size={24} />, title: "24/7 Support", desc: "Our multilingual team is available around the clock to help you." },
];

const SERVICES = [
  { icon: <Box size={28} />, title: "Package Delivery", desc: "Small to medium parcels with real-time tracking", price: "From £4.99" },
  { icon: <Rocket size={28} />, title: "Express Shipping", desc: "Priority handling with 24-48h delivery", price: "From £12.99" },
  { icon: <Building size={28} />, title: "Business Solutions", desc: "Volume rates and dedicated account management", price: "Custom" },
  { icon: <Globe size={28} />, title: "International", desc: "Worldwide coverage with customs clearance", price: "From £8.99" },
];

const TESTIMONIALS = [
  { name: "Sarah Chen", role: "E-commerce Founder", text: "Airpak Express transformed our shipping operations. 99.8% on-time rate and the tracking is phenomenal.", rating: 5 },
  { name: "Marcus Williams", role: "Operations Director", text: "Switched from DHL six months ago. Cost savings of 23% with better service. The dashboard is intuitive.", rating: 5 },
  { name: "Priya Nair", role: "Import/Export Manager", text: "The customs clearance support is exceptional. They handle all the paperwork for our international shipments.", rating: 5 },
];

export default function Home() {
  const [trackingNum, setTrackingNum] = useState("");

  return (
    <div style={{ minHeight: "100vh", background: "var(--apple-bg)", overflowX: "hidden" }}>
      <AppNav variant="public" />

      <main id="main-content">
        {/* HERO */}
        <section className="hero" aria-label="Hero section">
          <div className="hero-bg" aria-hidden="true" />
          <div className="container">
            <div className="hero-content">
              <div className="hero-text">
                <div className="hero-badge" aria-label="New feature announcement">
                  <Zap size={14} aria-hidden="true" />
                  New: AI-Powered Logistics
                </div>
                <h1 className="hero-title">
                  Global Logistics,<br />
                  <span className="highlight">Seamless Delivery</span>
                </h1>
                <p className="hero-subtitle">
                  From Wales to the world — we handle your packages with precision, speed, and care.
                  Real-time tracking, instant quotes, and 24/7 support.
                </p>
                <div className="hero-cta">
                  <Link href="/signup" className="btn-primary btn-lg" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    Get a Quote <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                  <Link href="/tracking" className="btn-secondary btn-lg" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <Package size={16} aria-hidden="true" /> Track Package
                  </Link>
                </div>

                {/* Inline tracking */}
                <div className="hero-track-input" style={{ marginTop: 32 }}>
                  <label htmlFor="hero-tracking" className="sr-only">Enter tracking number</label>
                  <div style={{ display: "flex", gap: 8, maxWidth: 440 }}>
                    <input
                      id="hero-tracking"
                      type="text"
                      className="input"
                      placeholder="Enter tracking number (APX-2024-…)"
                      value={trackingNum}
                      onChange={e => setTrackingNum(e.target.value)}
                      aria-label="Tracking number"
                      style={{ flex: 1 }}
                    />
                    <Link href={trackingNum ? `/tracking?q=${trackingNum}` : "/tracking"} className="btn-primary" style={{ whiteSpace: "nowrap" }}>Track</Link>
                  </div>
                </div>
              </div>

              {/* Hero visual */}
              <div className="hero-visual" aria-hidden="true">
                <div className="hero-card glass-card" style={{ padding: 24, maxWidth: 340 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--apple-blue)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Package size={20} color="white" />
                    </div>
                    <div>
                      <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-semibold)" }}>APX-2024-0072</div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--apple-label-secondary)" }}>Tokyo, Japan</div>
                    </div>
                    <div style={{ marginLeft: "auto", padding: "3px 10px", borderRadius: 999, background: "rgba(52,199,89,0.12)", color: "var(--apple-green)", fontSize: "var(--text-xs)", fontWeight: "var(--font-semibold)" }}>Delivered</div>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {["Order", "Pickup", "Transit", "Delivery"].map((step, i) => (
                      <div key={step} style={{ flex: 1 }}>
                        <div style={{ height: 4, borderRadius: 2, background: i < 4 ? "var(--apple-blue)" : "var(--apple-separator)", marginBottom: 4 }} />
                        <div style={{ fontSize: "var(--text-2xs)", color: i < 4 ? "var(--apple-blue)" : "var(--apple-label-tertiary)", textAlign: "center" }}>{step}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section aria-label="Company statistics" style={{ padding: "48px 0", borderTop: "1px solid var(--apple-separator)", borderBottom: "1px solid var(--apple-separator)", background: "var(--apple-bg-secondary)" }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 32, textAlign: "center" }}>
              {STATS.map(stat => (
                <div key={stat.label}>
                  <div style={{ fontSize: "var(--text-5xl)", fontWeight: "var(--font-black)", color: "var(--apple-blue)", letterSpacing: "-0.03em" }} aria-label={`${stat.value} ${stat.label}`}>{stat.value}</div>
                  <div style={{ fontSize: "var(--text-sm)", color: "var(--apple-label-secondary)", marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section aria-label="Features" style={{ padding: "80px 0" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div className="hero-badge" style={{ display: "inline-flex", marginBottom: 16 }}>Why Choose Us</div>
              <h2 style={{ fontSize: "clamp(var(--text-4xl), 4vw, var(--text-6xl))", fontWeight: "var(--font-bold)", letterSpacing: "-0.02em", marginBottom: 16 }}>
                Everything You Need,<br />Nothing You Don't
              </h2>
              <p style={{ fontSize: "var(--text-xl)", color: "var(--apple-label-secondary)", maxWidth: 560, margin: "0 auto" }}>
                We built Airpak Express for businesses and individuals who demand more from their logistics partner.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
              {FEATURES.map(f => (
                <article key={f.title} className="glass-card-sm glass-card-hover" style={{ padding: 28, borderRadius: "var(--radius-xl)" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(0,122,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--apple-blue)", marginBottom: 16 }} aria-hidden="true">{f.icon}</div>
                  <h3 style={{ fontSize: "var(--text-xl)", fontWeight: "var(--font-semibold)", marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ color: "var(--apple-label-secondary)", fontSize: "var(--text-md)", lineHeight: 1.6 }}>{f.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section aria-label="Services" style={{ padding: "80px 0", background: "var(--apple-bg-secondary)" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div className="hero-badge" style={{ display: "inline-flex", marginBottom: 16 }}>Our Services</div>
              <h2 style={{ fontSize: "clamp(var(--text-4xl), 4vw, var(--text-5xl))", fontWeight: "var(--font-bold)", letterSpacing: "-0.02em", marginBottom: 16 }}>Solutions for Every Need</h2>
              <p style={{ fontSize: "var(--text-xl)", color: "var(--apple-label-secondary)" }}>
                Whether you're shipping a startup MVP or enterprise freight, we have you covered.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
              {SERVICES.map(s => (
                <article key={s.title} className="glass-card-sm glass-hover-lift" style={{ padding: 28, borderRadius: "var(--radius-xl)", cursor: "pointer" }}>
                  <div style={{ color: "var(--apple-blue)", marginBottom: 16 }} aria-hidden="true">{s.icon}</div>
                  <h3 style={{ fontSize: "var(--text-xl)", fontWeight: "var(--font-semibold)", marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ color: "var(--apple-label-secondary)", fontSize: "var(--text-sm)", marginBottom: 16, lineHeight: 1.6 }}>{s.desc}</p>
                  <div style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-bold)", color: "var(--apple-blue)" }}>{s.price}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section aria-label="Customer testimonials" style={{ padding: "80px 0" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <h2 style={{ fontSize: "clamp(var(--text-4xl), 4vw, var(--text-5xl))", fontWeight: "var(--font-bold)", letterSpacing: "-0.02em" }}>Trusted by Thousands</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
              {TESTIMONIALS.map(t => (
                <blockquote key={t.name} className="glass-card-sm" style={{ padding: 28, borderRadius: "var(--radius-xl)" }}>
                  <div style={{ display: "flex", gap: 2, marginBottom: 16 }} aria-label={`${t.rating} stars`}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={16} fill="var(--apple-yellow)" color="var(--apple-yellow)" aria-hidden="true" />
                    ))}
                  </div>
                  <p style={{ color: "var(--apple-label)", lineHeight: 1.7, marginBottom: 20, fontSize: "var(--text-md)" }}>"{t.text}"</p>
                  <footer style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, var(--apple-blue), var(--apple-indigo))", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "var(--font-bold)", fontSize: "var(--text-md)" }} aria-hidden="true">{t.name[0]}</div>
                    <div>
                      <div style={{ fontWeight: "var(--font-semibold)", fontSize: "var(--text-sm)" }}>{t.name}</div>
                      <div style={{ color: "var(--apple-label-secondary)", fontSize: "var(--text-xs)" }}>{t.role}</div>
                    </div>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section aria-label="Call to action" style={{ padding: "80px 0", background: "linear-gradient(135deg, var(--apple-blue) 0%, var(--apple-indigo) 100%)" }}>
          <div className="container" style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "clamp(var(--text-4xl), 4vw, var(--text-6xl))", fontWeight: "var(--font-bold)", color: "white", marginBottom: 16, letterSpacing: "-0.02em" }}>Ready to Ship?</h2>
            <p style={{ fontSize: "var(--text-xl)", color: "rgba(255,255,255,0.85)", marginBottom: 40, maxWidth: 500, margin: "0 auto 40px" }}>
              Join 50,000+ businesses who trust Airpak Express for their logistics needs.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/signup" className="btn-primary" style={{ background: "white", color: "var(--apple-blue)", fontWeight: "var(--font-semibold)", display: "inline-flex", alignItems: "center", gap: 8 }}>
                Get Started Free <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a href={`${PUBLIC_SITE}/contact.html`} className="btn-secondary" style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1.5px solid rgba(255,255,255,0.3)" }}>
                Contact Sales
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer role="contentinfo" style={{ background: "var(--apple-bg-secondary)", borderTop: "1px solid var(--apple-separator)", padding: "48px 0 32px" }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 40, marginBottom: 40 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect width="32" height="32" rx="6" fill="#007AFF"/><path d="M8 16h16M16 8v16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><circle cx="16" cy="16" r="6" fill="none" stroke="white" strokeWidth="2"/></svg>
                  <span style={{ fontWeight: "var(--font-bold)", fontSize: "var(--text-lg)" }}>Airpak Express</span>
                </div>
                <p style={{ color: "var(--apple-label-secondary)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>Global logistics, reimagined. From Wales to the world.</p>
              </div>
              <nav aria-label="Company links">
                <h3 style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-semibold)", marginBottom: 12 }}>Company</h3>
                {[
                  { label: "About", href: `${PUBLIC_SITE}/aboutus.html` },
                  { label: "Careers", href: `${PUBLIC_SITE}/careers.html` },
                  { label: "Contact", href: `${PUBLIC_SITE}/contact.html` },
                ].map(l => <a key={l.label} href={l.href} style={{ display: "block", color: "var(--apple-label-secondary)", fontSize: "var(--text-sm)", marginBottom: 8, textDecoration: "none" }}>{l.label}</a>)}
              </nav>
              <nav aria-label="Services links">
                <h3 style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-semibold)", marginBottom: 12 }}>Services</h3>
                {["Package Delivery", "Express Shipping", "Business Solutions", "International"].map(l => (
                  <Link key={l} href="/signup" style={{ display: "block", color: "var(--apple-label-secondary)", fontSize: "var(--text-sm)", marginBottom: 8, textDecoration: "none" }}>{l}</Link>
                ))}
              </nav>
              <nav aria-label="Support links">
                <h3 style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-semibold)", marginBottom: 12 }}>Support</h3>
                <Link href="/faq" style={{ display: "block", color: "var(--apple-label-secondary)", fontSize: "var(--text-sm)", marginBottom: 8, textDecoration: "none" }}>FAQs</Link>
                <Link href="/tracking" style={{ display: "block", color: "var(--apple-label-secondary)", fontSize: "var(--text-sm)", marginBottom: 8, textDecoration: "none" }}>Tracking</Link>
                <Link href="/chat" style={{ display: "block", color: "var(--apple-label-secondary)", fontSize: "var(--text-sm)", marginBottom: 8, textDecoration: "none" }}>Help Center</Link>
              </nav>
            </div>
            <div style={{ borderTop: "1px solid var(--apple-separator)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <p style={{ color: "var(--apple-label-tertiary)", fontSize: "var(--text-xs)" }}>
                © 2026 Airpak Express Ltd. All rights reserved. Registered in England & Wales.
              </p>
              <div style={{ display: "flex", gap: 20 }}>
                <Link href="/privacy" style={{ color: "var(--apple-label-tertiary)", fontSize: "var(--text-xs)", textDecoration: "none" }}>Privacy Policy</Link>
                <Link href="/terms" style={{ color: "var(--apple-label-tertiary)", fontSize: "var(--text-xs)", textDecoration: "none" }}>Terms of Service</Link>
                <a href={`${PUBLIC_SITE}/standardconditionsofcarriage.html`} style={{ color: "var(--apple-label-tertiary)", fontSize: "var(--text-xs)", textDecoration: "none" }}>Conditions of Carriage</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
