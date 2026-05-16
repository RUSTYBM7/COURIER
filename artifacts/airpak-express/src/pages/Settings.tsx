import { useState } from "react";
import { AppNav } from "@/components/AppNav";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage, LANGUAGES, Lang } from "@/hooks/useLanguage";
import {
  User, Bell, Lock, Palette, Globe, CreditCard,
  ChevronRight, Check, Moon, Sun, Monitor
} from "lucide-react";

type Section = "profile" | "notifications" | "privacy" | "appearance" | "language" | "billing";

const NAV_ITEMS: { id: Section; icon: React.ReactNode; label: string }[] = [
  { id: "profile", icon: <User size={18} />, label: "Profile" },
  { id: "notifications", icon: <Bell size={18} />, label: "Notifications" },
  { id: "privacy", icon: <Lock size={18} />, label: "Privacy & Security" },
  { id: "appearance", icon: <Palette size={18} />, label: "Appearance" },
  { id: "language", icon: <Globe size={18} />, label: "Language & Region" },
  { id: "billing", icon: <CreditCard size={18} />, label: "Billing" },
];

function Field({ label, id, type = "text", value, placeholder }: { label: string; id: string; type?: string; value?: string; placeholder?: string }) {
  const [val, setVal] = useState(value || "");
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>{label}</label>
      <input type={type} id={id} className="input" value={val} onChange={e => setVal(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function Toggle({ label, description, defaultChecked }: { label: string; description?: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked ?? true);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid var(--apple-separator)" }}>
      <div>
        <div style={{ fontSize: "var(--text-md)", fontWeight: "var(--font-medium)", marginBottom: description ? 2 : 0 }}>{label}</div>
        {description && <div style={{ fontSize: "var(--text-sm)", color: "var(--apple-label-secondary)" }}>{description}</div>}
      </div>
      <button
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => setOn(!on)}
        style={{
          width: 44, height: 26, borderRadius: 13, border: "none", cursor: "pointer",
          background: on ? "var(--apple-blue)" : "var(--apple-gray-4)",
          transition: "background 0.2s", position: "relative", flexShrink: 0
        }}
      >
        <span style={{
          position: "absolute", top: 2, left: on ? "calc(100% - 24px)" : 2,
          width: 22, height: 22, borderRadius: "50%", background: "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "left 0.2s"
        }} />
      </button>
    </div>
  );
}

export default function Settings() {
  const [active, setActive] = useState<Section>("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { lang, setLang } = useLanguage();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--apple-bg)" }}>
      <AppNav variant="app" showSidebar sidebarOpen={sidebarOpen} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main id="main-content" className="pref-layout" style={{ paddingTop: "var(--nav-height)" }}>
        {/* Settings Sidebar */}
        <aside className="pref-sidebar" aria-label="Settings navigation">
          <div className="pref-sidebar-header">
            <h1 className="pref-sidebar-title">Settings</h1>
          </div>
          <nav className="pref-nav" role="navigation" aria-label="Settings sections">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                className={`pref-nav-item${active === item.id ? " active" : ""}`}
                onClick={() => setActive(item.id)}
                aria-current={active === item.id ? "page" : undefined}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
                <ChevronRight size={14} style={{ marginLeft: "auto" }} aria-hidden="true" />
              </button>
            ))}
          </nav>
        </aside>

        {/* Settings Content */}
        <div style={{ flex: 1, padding: "40px 40px 80px", maxWidth: 680 }}>

          {active === "profile" && (
            <section aria-labelledby="section-profile">
              <h2 id="section-profile" style={{ fontSize: "var(--text-3xl)", fontWeight: "var(--font-bold)", marginBottom: 32 }}>Profile</h2>
              <div className="glass-card-sm" style={{ padding: 28, borderRadius: "var(--radius-xl)", marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid var(--apple-separator)" }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, var(--apple-blue), var(--apple-indigo))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--text-3xl)", color: "white", fontWeight: "var(--font-bold)" }} aria-label="User avatar">A</div>
                  <div>
                    <h3 style={{ fontWeight: "var(--font-semibold)", marginBottom: 4 }}>Alex Johnson</h3>
                    <p style={{ color: "var(--apple-label-secondary)", fontSize: "var(--text-sm)", marginBottom: 12 }}>alex.johnson@company.com</p>
                    <button className="btn-secondary" style={{ fontSize: "var(--text-sm)", padding: "6px 16px" }}>Change Photo</button>
                  </div>
                </div>
                <Field label="Full Name" id="name" value="Alex Johnson" />
                <Field label="Email address" id="email" type="email" value="alex.johnson@company.com" />
                <Field label="Phone number" id="phone" type="tel" value="+44 7700 900142" />
                <Field label="Company" id="company" value="Johnson Logistics Ltd" />
                <Field label="Address" id="address" value="Unit 7, Wales International Hub" />
              </div>
              <button className="btn-primary" onClick={handleSave} aria-live="polite">
                {saved ? <><Check size={16} aria-hidden="true" /> Saved!</> : "Save Changes"}
              </button>
            </section>
          )}

          {active === "notifications" && (
            <section aria-labelledby="section-notif">
              <h2 id="section-notif" style={{ fontSize: "var(--text-3xl)", fontWeight: "var(--font-bold)", marginBottom: 32 }}>Notifications</h2>
              <div className="glass-card-sm" style={{ padding: 28, borderRadius: "var(--radius-xl)" }}>
                <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-semibold)", marginBottom: 4 }}>Shipment Updates</h3>
                <Toggle label="Email notifications" description="Receive shipment status updates via email" defaultChecked />
                <Toggle label="Push notifications" description="Browser push notifications for real-time updates" defaultChecked />
                <Toggle label="SMS updates" description="Text message alerts for delivery events" />
                <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-semibold)", margin: "24px 0 4px" }}>Marketing</h3>
                <Toggle label="Promotional emails" description="Special offers, news, and product updates" />
                <Toggle label="Weekly digest" description="Weekly summary of your shipping activity" defaultChecked />
              </div>
            </section>
          )}

          {active === "privacy" && (
            <section aria-labelledby="section-privacy">
              <h2 id="section-privacy" style={{ fontSize: "var(--text-3xl)", fontWeight: "var(--font-bold)", marginBottom: 32 }}>Privacy & Security</h2>
              <div className="glass-card-sm" style={{ padding: 28, borderRadius: "var(--radius-xl)", marginBottom: 24 }}>
                <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-semibold)", marginBottom: 4 }}>Security</h3>
                <Toggle label="Two-factor authentication" description="Add an extra layer of security to your account" />
                <Toggle label="Login notifications" description="Get notified of new sign-ins to your account" defaultChecked />
                <div style={{ padding: "16px 0" }}>
                  <button className="btn-secondary" style={{ marginRight: 12 }}>Change Password</button>
                  <button className="btn-secondary">View Active Sessions</button>
                </div>
              </div>
              <div className="glass-card-sm" style={{ padding: 28, borderRadius: "var(--radius-xl)" }}>
                <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-semibold)", marginBottom: 16 }}>Data & Privacy</h3>
                <Toggle label="Data analytics" description="Help us improve by sharing anonymized usage data" defaultChecked />
                <div style={{ padding: "16px 0" }}>
                  <button className="btn-secondary" style={{ marginRight: 12 }}>Download My Data</button>
                  <button style={{ color: "var(--apple-red)", background: "rgba(255,59,48,0.08)", border: "none", padding: "8px 16px", borderRadius: "var(--radius-full)", fontSize: "var(--text-sm)", fontWeight: "var(--font-semibold)", cursor: "pointer" }}>Delete Account</button>
                </div>
              </div>
            </section>
          )}

          {active === "appearance" && (
            <section aria-labelledby="section-appear">
              <h2 id="section-appear" style={{ fontSize: "var(--text-3xl)", fontWeight: "var(--font-bold)", marginBottom: 32 }}>Appearance</h2>
              <div className="glass-card-sm" style={{ padding: 28, borderRadius: "var(--radius-xl)" }}>
                <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-semibold)", marginBottom: 20 }}>Theme</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }} role="radiogroup" aria-label="Theme selection">
                  {[
                    { id: "light" as const, label: "Light", icon: <Sun size={20} /> },
                    { id: "dark" as const, label: "Dark", icon: <Moon size={20} /> },
                    { id: "system" as const, label: "System", icon: <Monitor size={20} /> },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      role="radio"
                      aria-checked={theme === opt.id}
                      onClick={() => setTheme(opt.id)}
                      style={{
                        padding: 16, borderRadius: "var(--radius-lg)", cursor: "pointer",
                        border: theme === opt.id ? "2px solid var(--apple-blue)" : "1.5px solid var(--apple-separator)",
                        background: theme === opt.id ? "rgba(0,122,255,0.06)" : "transparent",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                        color: theme === opt.id ? "var(--apple-blue)" : "var(--apple-label-secondary)",
                      }}
                    >
                      <span aria-hidden="true">{opt.icon}</span>
                      <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-medium)" }}>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {active === "language" && (
            <section aria-labelledby="section-lang">
              <h2 id="section-lang" style={{ fontSize: "var(--text-3xl)", fontWeight: "var(--font-bold)", marginBottom: 32 }}>Language & Region</h2>
              <div className="glass-card-sm" style={{ padding: 28, borderRadius: "var(--radius-xl)" }}>
                <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-semibold)", marginBottom: 16 }}>Language</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }} role="radiogroup" aria-label="Language selection">
                  {(Object.entries(LANGUAGES) as [Lang, typeof LANGUAGES[Lang]][]).map(([code, info]) => (
                    <button
                      key={code}
                      role="radio"
                      aria-checked={lang === code}
                      onClick={() => setLang(code)}
                      style={{
                        padding: "12px 16px", borderRadius: "var(--radius-lg)", cursor: "pointer",
                        border: lang === code ? "2px solid var(--apple-blue)" : "1.5px solid var(--apple-separator)",
                        background: lang === code ? "rgba(0,122,255,0.06)" : "transparent",
                        display: "flex", alignItems: "center", gap: 10,
                        color: lang === code ? "var(--apple-blue)" : "var(--apple-label)",
                      }}
                    >
                      <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-bold)" }}>{info.flag}</span>
                      <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-medium)" }}>{info.label}</span>
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: 28 }}>
                  <div className="field">
                    <label className="field-label" htmlFor="currency">Currency</label>
                    <select id="currency" className="input" style={{ appearance: "auto" }}>
                      <option value="GBP">GBP — British Pound (£)</option>
                      <option value="USD">USD — US Dollar ($)</option>
                      <option value="EUR">EUR — Euro (€)</option>
                      <option value="AED">AED — UAE Dirham (د.إ)</option>
                    </select>
                  </div>
                  <div className="field">
                    <label className="field-label" htmlFor="timezone">Timezone</label>
                    <select id="timezone" className="input" style={{ appearance: "auto" }}>
                      <option>Europe/London (GMT+0)</option>
                      <option>America/New_York (GMT-5)</option>
                      <option>Asia/Dubai (GMT+4)</option>
                      <option>Asia/Tokyo (GMT+9)</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>
          )}

          {active === "billing" && (
            <section aria-labelledby="section-billing">
              <h2 id="section-billing" style={{ fontSize: "var(--text-3xl)", fontWeight: "var(--font-bold)", marginBottom: 32 }}>Billing</h2>
              <div className="glass-card-sm" style={{ padding: 28, borderRadius: "var(--radius-xl)", marginBottom: 24 }}>
                <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-semibold)", marginBottom: 16 }}>Current Plan</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--font-bold)", color: "var(--apple-blue)" }}>Business Pro</div>
                    <div style={{ color: "var(--apple-label-secondary)", marginTop: 4 }}>£89/month · Renews Jan 1, 2027</div>
                  </div>
                  <button className="btn-secondary">Change Plan</button>
                </div>
              </div>
              <div className="glass-card-sm" style={{ padding: 28, borderRadius: "var(--radius-xl)" }}>
                <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-semibold)", marginBottom: 16 }}>Payment Method</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                  <div style={{ padding: "8px 14px", borderRadius: 8, border: "1.5px solid var(--apple-separator)", fontWeight: "var(--font-bold)", fontSize: "var(--text-sm)" }}>VISA</div>
                  <div>
                    <div style={{ fontWeight: "var(--font-medium)" }}>•••• •••• •••• 4242</div>
                    <div style={{ fontSize: "var(--text-sm)", color: "var(--apple-label-secondary)" }}>Expires 09/28</div>
                  </div>
                </div>
                <button className="btn-secondary">Update Payment Method</button>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
