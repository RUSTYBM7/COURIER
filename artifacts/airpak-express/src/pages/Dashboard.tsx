import { useState } from "react";
import { AppNav } from "@/components/AppNav";
import { AppSidebar } from "@/components/AppSidebar";
import { Link } from "wouter";
import {
  Package, Truck, CheckCircle, DollarSign,
  Plus, Search, ArrowRight, TrendingUp, Clock
} from "lucide-react";

const STATS = [
  { icon: <Package size={20} />, label: "Total Packages", value: "247", change: "+12 this month", color: "var(--apple-blue)" },
  { icon: <Truck size={20} />, label: "In Transit", value: "18", change: "3 arriving today", color: "var(--apple-orange)" },
  { icon: <CheckCircle size={20} />, label: "Delivered", value: "221", change: "99.1% success rate", color: "var(--apple-green)" },
  { icon: <DollarSign size={20} />, label: "Revenue", value: "£14,280", change: "+8.2% vs last month", color: "var(--apple-purple)" },
];

const SHIPMENTS = [
  { id: "APX-2024-001", destination: "Tokyo, Japan", status: "delivered", date: "Dec 15, 2024", weight: "2.3 kg", cost: "£28.50" },
  { id: "APX-2024-002", destination: "New York, USA", status: "in-transit", date: "Dec 18, 2024", weight: "4.1 kg", cost: "£42.00" },
  { id: "APX-2024-003", destination: "Sydney, Australia", status: "in-transit", date: "Dec 20, 2024", weight: "1.8 kg", cost: "£35.75" },
  { id: "APX-2024-004", destination: "Berlin, Germany", status: "pending", date: "Dec 22, 2024", weight: "3.2 kg", cost: "£22.30" },
  { id: "APX-2024-005", destination: "Dubai, UAE", status: "delivered", date: "Dec 10, 2024", weight: "5.0 kg", cost: "£55.00" },
];

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  delivered: { bg: "rgba(52,199,89,0.12)", color: "var(--apple-green)", label: "Delivered" },
  "in-transit": { bg: "rgba(255,149,0,0.12)", color: "var(--apple-orange)", label: "In Transit" },
  pending: { bg: "rgba(0,122,255,0.12)", color: "var(--apple-blue)", label: "Pending" },
};

const TABS = ["All", "In Transit", "Delivered", "Pending"];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = SHIPMENTS.filter(s => {
    const matchTab = activeTab === "All"
      || (activeTab === "In Transit" && s.status === "in-transit")
      || (activeTab === "Delivered" && s.status === "delivered")
      || (activeTab === "Pending" && s.status === "pending");
    const matchSearch = s.id.toLowerCase().includes(search.toLowerCase())
      || s.destination.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--apple-bg)" }}>
      <AppNav
        variant="app"
        showSidebar
        sidebarOpen={sidebarOpen}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="dashboard-layout" style={{ paddingTop: "var(--nav-height)" }}>
        <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main id="main-content" className="dashboard-main">
          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Welcome back, Alex</h1>
              <p style={{ color: "var(--apple-label-secondary)", marginTop: "var(--space-1)", fontSize: "var(--text-sm)" }}>
                Unit 7, Wales International Hub, Cardiff Bay, Wales CF10 5AL, United Kingdom
              </p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Link href="/tracking" className="btn-secondary" style={{ gap: 8, display: "inline-flex", alignItems: "center" }}>
                <Search size={16} aria-hidden="true" /> Track Package
              </Link>
              <button className="btn-primary" style={{ gap: 8 }} aria-label="Create new shipment">
                <Plus size={16} aria-hidden="true" /> New Shipment
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <section aria-label="Shipment statistics">
            <div className="dashboard-stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
              {STATS.map((stat) => (
                <div key={stat.label} className="stat-card glass-card-sm" role="region" aria-label={stat.label}>
                  <div className="stat-icon" style={{ color: stat.color, background: `${stat.color}18` }} aria-hidden="true">{stat.icon}</div>
                  <div className="stat-value" aria-label={`${stat.label}: ${stat.value}`}>{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, fontSize: "var(--text-xs)", color: "var(--apple-label-secondary)" }}>
                    <TrendingUp size={12} aria-hidden="true" /> {stat.change}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Shipments Table */}
          <section aria-label="Recent shipments" className="glass-card-sm" style={{ borderRadius: "var(--radius-xl)", padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--apple-separator)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <h2 style={{ fontSize: "var(--text-xl)", fontWeight: "var(--font-semibold)", color: "var(--apple-label)" }}>Recent Shipments</h2>
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ position: "relative" }}>
                  <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--apple-label-tertiary)" }} aria-hidden="true" />
                  <input
                    type="search"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search shipments…"
                    aria-label="Search shipments"
                    className="input"
                    style={{ paddingLeft: 32, width: 200, height: 36 }}
                  />
                </div>
                <Link href="/tracking" className="btn-ghost" style={{ fontSize: "var(--text-sm)", display: "inline-flex", alignItems: "center", gap: 4 }}>View all <ArrowRight size={14} aria-hidden="true" /></Link>
              </div>
            </div>

            {/* Tabs */}
            <div role="tablist" aria-label="Filter shipments" style={{ display: "flex", gap: 0, padding: "0 24px", borderBottom: "1px solid var(--apple-separator)" }}>
              {TABS.map(tab => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "12px 16px",
                    fontSize: "var(--text-sm)",
                    fontWeight: activeTab === tab ? "var(--font-semibold)" : "var(--font-regular)",
                    color: activeTab === tab ? "var(--apple-blue)" : "var(--apple-label-secondary)",
                    background: "none",
                    border: "none",
                    borderBottom: activeTab === tab ? "2px solid var(--apple-blue)" : "2px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >{tab}</button>
              ))}
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }} aria-label="Shipments list">
                <thead>
                  <tr>
                    {["Tracking ID", "Destination", "Status", "Date", "Weight", "Cost"].map(h => (
                      <th key={h} scope="col" style={{ padding: "12px 16px", textAlign: "left", fontSize: "var(--text-xs)", fontWeight: "var(--font-semibold)", color: "var(--apple-label-secondary)", background: "var(--apple-fill-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "var(--apple-label-tertiary)" }}>No shipments found</td></tr>
                  )}
                  {filtered.map((s, i) => {
                    const st = STATUS_STYLES[s.status];
                    return (
                      <tr key={s.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--apple-separator)" : "none", transition: "background 0.1s" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "var(--apple-fill-tertiary)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-semibold)", color: "var(--apple-blue)", fontFamily: "monospace" }}>{s.id}</span>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: "var(--text-sm)", color: "var(--apple-label)" }}>{s.destination}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 999, background: st.bg, color: st.color, fontSize: "var(--text-xs)", fontWeight: "var(--font-semibold)" }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: st.color }} aria-hidden="true" />
                            {st.label}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: "var(--text-sm)", color: "var(--apple-label-secondary)" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} aria-hidden="true" /> {s.date}</span>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: "var(--text-sm)", color: "var(--apple-label-secondary)" }}>{s.weight}</td>
                        <td style={{ padding: "14px 16px", fontSize: "var(--text-sm)", fontWeight: "var(--font-semibold)", color: "var(--apple-label)" }}>{s.cost}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
