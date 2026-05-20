import { useState } from "react";
import { AppNav } from "@/components/AppNav";
import { AppSidebar } from "@/components/AppSidebar";
import TimelineComponent05 from "@/components/blocks/timeline-component-05";
import { DashboardDialog01 } from "@/components/blocks/dashboard-dialog-01";
import {
  Search, Package, MapPin, Truck, CheckCircle,
  Clock, AlertCircle, RefreshCw, Share2
} from "lucide-react";

interface TrackingEvent {
  status: string;
  location: string;
  time: string;
  desc: string;
  done: boolean;
}

interface TrackingResult {
  id: string;
  status: "delivered" | "in-transit" | "pending" | "exception";
  origin: string;
  destination: string;
  weight: string;
  service: string;
  estimatedDelivery: string;
  events: TrackingEvent[];
}

const MOCK_DATA: Record<string, TrackingResult> = {
  "APX-2024-001": {
    id: "APX-2024-001", status: "delivered",
    origin: "Cardiff, Wales UK", destination: "Tokyo, Japan",
    weight: "2.3 kg", service: "International Express",
    estimatedDelivery: "Delivered Dec 15, 2024",
    events: [
      { status: "Delivered", location: "Tokyo, Japan", time: "Dec 15 · 14:23", desc: "Package delivered to recipient", done: true },
      { status: "Out for Delivery", location: "Tokyo Sorting Hub, Japan", time: "Dec 15 · 08:10", desc: "With delivery courier", done: true },
      { status: "Customs Cleared", location: "Narita Airport, Japan", time: "Dec 14 · 16:45", desc: "Customs clearance completed", done: true },
      { status: "In Transit", location: "London Heathrow, UK", time: "Dec 12 · 22:30", desc: "Departed international hub", done: true },
      { status: "Picked Up", location: "Cardiff, Wales UK", time: "Dec 11 · 10:00", desc: "Package collected from sender", done: true },
    ],
  },
  "APX-2024-002": {
    id: "APX-2024-002", status: "in-transit",
    origin: "Cardiff, Wales UK", destination: "New York, USA",
    weight: "4.1 kg", service: "Express Shipping",
    estimatedDelivery: "Expected Dec 20, 2024",
    events: [
      { status: "In Transit", location: "JFK International, New York", time: "Dec 18 · 11:20", desc: "Arrived at destination country", done: true },
      { status: "In Transit", location: "London Heathrow, UK", time: "Dec 17 · 23:50", desc: "Departed international hub", done: true },
      { status: "In Transit", location: "London Sorting Hub, UK", time: "Dec 17 · 15:30", desc: "Processed at hub", done: true },
      { status: "Picked Up", location: "Cardiff, Wales UK", time: "Dec 16 · 09:15", desc: "Package collected from sender", done: true },
      { status: "Out for Delivery", location: "New York, USA", time: "Dec 20 · (estimated)", desc: "Pending customs clearance", done: false },
    ],
  },
};

const STATUS_CONFIG = {
  delivered: { color: "var(--apple-green)", bg: "rgba(52,199,89,0.12)", icon: <CheckCircle size={20} />, label: "Delivered" },
  "in-transit": { color: "var(--apple-orange)", bg: "rgba(255,149,0,0.12)", icon: <Truck size={20} />, label: "In Transit" },
  pending: { color: "var(--apple-blue)", bg: "rgba(0,122,255,0.12)", icon: <Clock size={20} />, label: "Pending" },
  exception: { color: "var(--apple-red)", bg: "rgba(255,59,48,0.12)", icon: <AlertCircle size={20} />, label: "Exception" },
};

const STEPS = ["Order Placed", "Picked Up", "In Transit", "Out for Delivery", "Delivered"];

export default function Tracking() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true); setNotFound(false); setResult(null);
    await new Promise(r => setTimeout(r, 700));
    const found = MOCK_DATA[query.trim().toUpperCase()];
    setLoading(false);
    if (found) setResult(found);
    else setNotFound(true);
  }

  const stepIndex = result ? Math.max(0, result.events.filter(e => e.done).length - 1) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--apple-bg)" }}>
      <AppNav variant="app" showSidebar sidebarOpen={sidebarOpen} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="dashboard-layout" style={{ paddingTop: "var(--nav-height)" }}>
        <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main id="main-content" className="dashboard-main">
          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Track Package</h1>
              <p style={{ color: "var(--apple-label-secondary)", fontSize: "var(--text-sm)", marginTop: "var(--space-1)" }}>
                Unit 7, Wales International Hub, Cardiff Bay, Wales CF10 5AL
              </p>
            </div>
          </div>

          {/* Search */}
          <section aria-label="Package tracking search" className="glass-card-sm" style={{ padding: 28, borderRadius: "var(--radius-xl)", marginBottom: 24 }}>
            <form onSubmit={handleSearch} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
                <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--apple-label-tertiary)" }} aria-hidden="true" />
                <label htmlFor="tracking-input" className="sr-only">Enter tracking number</label>
                <input
                  id="tracking-input"
                  type="text"
                  className="input"
                  style={{ paddingLeft: 42 }}
                  placeholder="Enter tracking number (e.g. APX-2024-001)"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  aria-label="Tracking number"
                  aria-required="true"
                />
              </div>
              <button type="submit" className="btn-primary" disabled={loading} aria-busy={loading} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {loading ? <><RefreshCw size={14} className="spin" aria-hidden="true" /> Tracking…</> : <><Search size={14} aria-hidden="true" /> Track</>}
              </button>
            </form>
            <p style={{ marginTop: 12, fontSize: "var(--text-sm)", color: "var(--apple-label-tertiary)" }}>
              Try: APX-2024-001 (delivered) or APX-2024-002 (in transit)
            </p>
          </section>

          {/* Not Found */}
          {notFound && (
            <div role="alert" className="glass-card-sm" style={{ padding: 32, borderRadius: "var(--radius-xl)", textAlign: "center", marginBottom: 24 }}>
              <AlertCircle size={40} color="var(--apple-label-tertiary)" style={{ margin: "0 auto 12px" }} aria-hidden="true" />
              <h2 style={{ marginBottom: 8 }}>No results found</h2>
              <p style={{ color: "var(--apple-label-secondary)" }}>No shipment found for <strong>"{query}"</strong>. Check the tracking number and try again.</p>
            </div>
          )}

          {/* Tracking Result + Timeline */}
          {result && (() => {
            const cfg = STATUS_CONFIG[result.status];
            return (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
                {/* Main Card */}
                <section aria-label="Tracking details" className="glass-card-sm" style={{ borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
                  {/* Status Banner */}
                  <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--apple-separator)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ padding: "3px 12px", borderRadius: 999, background: cfg.bg, color: cfg.color, fontSize: "var(--text-sm)", fontWeight: "var(--font-semibold)", display: "flex", alignItems: "center", gap: 6 }}>
                          <span aria-hidden="true">{cfg.icon}</span>{cfg.label}
                        </span>
                      </div>
                      <h2 style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--font-bold)", marginBottom: 4 }}>{result.id}</h2>
                      <p style={{ color: "var(--apple-label-secondary)", fontSize: "var(--text-sm)" }}>{result.estimatedDelivery}</p>
                    </div>
                    <button className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--text-sm)" }} aria-label="Share tracking link">
                      <Share2 size={14} aria-hidden="true" /> Share
                    </button>
                  </div>

                  {/* Route */}
                  <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--apple-separator)", display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--apple-label-tertiary)", marginBottom: 4, fontWeight: "var(--font-semibold)", textTransform: "uppercase" }}>Origin</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: "var(--font-semibold)" }}>
                        <MapPin size={14} color="var(--apple-blue)" aria-hidden="true" />{result.origin}
                      </div>
                    </div>
                    <div style={{ color: "var(--apple-label-tertiary)", fontSize: 20 }} aria-hidden="true">→</div>
                    <div style={{ flex: 1, textAlign: "right" }}>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--apple-label-tertiary)", marginBottom: 4, fontWeight: "var(--font-semibold)", textTransform: "uppercase" }}>Destination</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: "var(--font-semibold)", justifyContent: "flex-end" }}>
                        <MapPin size={14} color="var(--apple-green)" aria-hidden="true" />{result.destination}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--apple-separator)" }} aria-label="Delivery progress">
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      {STEPS.map((step, i) => (
                        <div key={step} style={{ flex: 1, textAlign: "center" }}>
                          <div style={{ width: 24, height: 24, borderRadius: "50%", background: i <= stepIndex ? "var(--apple-blue)" : "var(--apple-separator)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px", color: "white", transition: "background 0.3s" }} aria-hidden="true">
                            {i <= stepIndex && <CheckCircle size={12} />}
                          </div>
                          <div style={{ fontSize: "var(--text-2xs)", color: i <= stepIndex ? "var(--apple-blue)" : "var(--apple-label-tertiary)", fontWeight: i === stepIndex ? "var(--font-semibold)" : "var(--font-regular)", whiteSpace: "nowrap" }}>{step}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ height: 4, background: "var(--apple-separator)", borderRadius: 2, position: "relative", marginTop: 4 }}>
                      <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(stepIndex / (STEPS.length - 1)) * 100}%`, background: "var(--apple-blue)", borderRadius: 2, transition: "width 0.5s" }} aria-hidden="true" />
                    </div>
                  </div>

                  {/* Event Timeline */}
                  <div style={{ padding: "20px 24px" }}>
                    <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-semibold)", marginBottom: 20 }}>Tracking History</h3>
                    <ol style={{ listStyle: "none", position: "relative" }} aria-label="Shipping events">
                      {result.events.map((ev, i) => (
                        <li key={i} style={{ display: "flex", gap: 16, paddingBottom: i < result.events.length - 1 ? 20 : 0, position: "relative" }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div style={{ width: 12, height: 12, borderRadius: "50%", background: ev.done ? "var(--apple-blue)" : "var(--apple-separator)", border: "2px solid", borderColor: ev.done ? "var(--apple-blue)" : "var(--apple-separator)", flexShrink: 0, zIndex: 1 }} aria-hidden="true" />
                            {i < result.events.length - 1 && (
                              <div style={{ flex: 1, width: 2, background: ev.done ? "var(--apple-blue)" : "var(--apple-separator)", margin: "4px 0", opacity: 0.3 }} aria-hidden="true" />
                            )}
                          </div>
                          <div style={{ flex: 1, paddingBottom: 4 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 2 }}>
                              <span style={{ fontWeight: "var(--font-semibold)", fontSize: "var(--text-sm)", color: ev.done ? "var(--apple-label)" : "var(--apple-label-tertiary)" }}>{ev.status}</span>
                              <span style={{ fontSize: "var(--text-xs)", color: "var(--apple-label-tertiary)", whiteSpace: "nowrap" }}>{ev.time}</span>
                            </div>
                            <div style={{ fontSize: "var(--text-sm)", color: "var(--apple-label-secondary)", marginBottom: 2 }}>{ev.desc}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "var(--apple-label-tertiary)" }}>
                              <MapPin size={10} aria-hidden="true" />{ev.location}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </section>

                {/* Side Info */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <aside className="glass-card-sm" style={{ padding: 20, borderRadius: "var(--radius-xl)" }} aria-label="Package details">
                    <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-semibold)", marginBottom: 16 }}>Package Details</h3>
                    {[
                      { label: "Service", value: result.service },
                      { label: "Weight", value: result.weight },
                      { label: "Tracking ID", value: result.id },
                    ].map(item => (
                      <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--apple-separator)" }}>
                        <span style={{ fontSize: "var(--text-sm)", color: "var(--apple-label-secondary)" }}>{item.label}</span>
                        <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-semibold)" }}>{item.value}</span>
                      </div>
                    ))}
                  </aside>

                  <div className="glass-card-sm" style={{ padding: 20, borderRadius: "var(--radius-xl)", textAlign: "center" }}>
                    <Package size={32} color="var(--apple-label-tertiary)" style={{ margin: "0 auto 12px" }} aria-hidden="true" />
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--apple-label-secondary)", marginBottom: 12 }}>Need help with this shipment?</p>
                    <a href="/chat" className="btn-secondary" style={{ display: "block", textAlign: "center" }}>Contact Support</a>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Timeline Component — shown when a shipment is found */}
          {result && (
            <div className="mt-8">
              <TimelineComponent05 />
            </div>
          )}

          {/* Recent Shipments (when no search) */}
          {!result && !notFound && !loading && (
            <section aria-label="Your recent shipments" className="glass-card-sm" style={{ padding: 28, borderRadius: "var(--radius-xl)" }}>
              <h2 style={{ fontSize: "var(--text-xl)", fontWeight: "var(--font-semibold)", marginBottom: 20 }}>Recent Shipments</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {["APX-2024-001", "APX-2024-002"].map(id => {
                  const d = MOCK_DATA[id];
                  const cfg = STATUS_CONFIG[d.status];
                  return (
                    <button
                      key={id}
                      onClick={() => { setQuery(id); setResult(d); }}
                      style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 16px", borderRadius: "var(--radius-lg)", border: "1.5px solid var(--apple-separator)", background: "transparent", cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--apple-fill-tertiary)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      aria-label={`View tracking for ${id} — ${d.status}`}
                    >
                      <Truck size={18} color={cfg.color} aria-hidden="true" />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "var(--font-semibold)", fontSize: "var(--text-sm)", marginBottom: 2 }}>{id}</div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--apple-label-secondary)" }}>{d.origin} → {d.destination}</div>
                      </div>
                      <span style={{ padding: "3px 10px", borderRadius: 999, background: cfg.bg, color: cfg.color, fontSize: "var(--text-xs)", fontWeight: "var(--font-semibold)" }}>{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </main>
      </div>

      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } } .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }`}</style>
    </div>
  );
}