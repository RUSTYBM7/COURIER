import { useState } from "react";
import { AppNav } from "@/components/AppNav";
import { AppSidebar } from "@/components/AppSidebar";
import { Link } from "wouter";
import {
  Package, Truck, CheckCircle, DollarSign,
  Plus, Search, ArrowRight, TrendingUp, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import WidgetComponent01 from "@/components/blocks/widget-component-01";
import WidgetProductInsights from "@/components/blocks/widget-product-insights";
import StatisticsCard01 from "@/components/blocks/statistics-card-01";
import { DashboardDialog01 } from "@/components/blocks/dashboard-dialog-01";

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
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Welcome back, Alex</h1>
              <p style={{ color: "var(--apple-label-secondary)", marginTop: "var(--space-1)", fontSize: "var(--text-sm)" }}>
                Unit 7, Wales International Hub, Cardiff Bay, Wales CF10 5AL, United Kingdom
              </p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Link href="/tracking">
                <Button variant="outline" size="sm" style={{ gap: 8 }}>
                  <Search size={16} aria-hidden="true" /> Track Package
                </Button>
              </Link>
              <DashboardDialog01 />
            </div>
          </div>

          {/* Widget — Total Earnings */}
          <section aria-label="Earnings overview" className="mb-8">
            <WidgetComponent01 />
          </section>

          {/* Widget — Product Insights */}
          <section aria-label="Product insights" className="mb-8">
            <WidgetProductInsights />
          </section>

          {/* Stats grid */}
          <section aria-label="Shipment statistics" className="mb-8">
            <StatisticsCard01 />
          </section>

          <section aria-label="Recent shipments" style={{ borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
            <Card style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--apple-separator)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <h2 style={{ fontSize: "var(--text-xl)", fontWeight: "var(--font-semibold)", color: "var(--apple-label)" }}>Recent Shipments</h2>
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ position: "relative" }}>
                    <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--apple-label-tertiary)" }} aria-hidden="true" />
                    <Input
                      type="search"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search shipments…"
                      aria-label="Search shipments"
                      style={{ paddingLeft: 32, width: 200, height: 36 }}
                    />
                  </div>
                  <Link href="/tracking">
                    <Button variant="ghost" size="sm" style={{ fontSize: "var(--text-sm)", gap: 4 }}>
                      View all <ArrowRight size={14} aria-hidden="true" />
                    </Button>
                  </Link>
                </div>
              </div>

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

              <div style={{ overflowX: "auto" }}>
                <Table aria-label="Shipments list">
                  <TableHeader>
                    <TableRow>
                      {["Tracking ID", "Destination", "Status", "Date", "Weight", "Cost"].map(h => (
                        <TableHead key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "var(--text-xs)", fontWeight: "var(--font-semibold)", color: "var(--apple-label-secondary)", background: "var(--apple-fill-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} style={{ padding: 40, textAlign: "center", color: "var(--apple-label-tertiary)" }}>No shipments found</TableCell>
                      </TableRow>
                    )}
                    {filtered.map((s, i) => {
                      const st = STATUS_STYLES[s.status];
                      return (
                        <TableRow key={s.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--apple-separator)" : "none", transition: "background 0.1s" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "var(--apple-fill-tertiary)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <TableCell style={{ padding: "14px 16px" }}>
                            <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-semibold)", color: "var(--apple-blue)", fontFamily: "monospace" }}>{s.id}</span>
                          </TableCell>
                          <TableCell style={{ padding: "14px 16px", fontSize: "var(--text-sm)", color: "var(--apple-label)" }}>{s.destination}</TableCell>
                          <TableCell style={{ padding: "14px 16px" }}>
                            <Badge style={{ background: st.bg, color: st.color, display: "inline-flex", alignItems: "center", gap: 6 }}>
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: st.color }} aria-hidden="true" />
                              {st.label}
                            </Badge>
                          </TableCell>
                          <TableCell style={{ padding: "14px 16px", fontSize: "var(--text-sm)", color: "var(--apple-label-secondary)" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} aria-hidden="true" /> {s.date}</span>
                          </TableCell>
                          <TableCell style={{ padding: "14px 16px", fontSize: "var(--text-sm)", color: "var(--apple-label-secondary)" }}>{s.weight}</TableCell>
                          <TableCell style={{ padding: "14px 16px", fontSize: "var(--text-sm)", fontWeight: "var(--font-semibold)", color: "var(--apple-label)" }}>{s.cost}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}