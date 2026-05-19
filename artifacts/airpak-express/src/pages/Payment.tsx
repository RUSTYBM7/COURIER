import { useState } from "react";
import { AppNav } from "@/components/AppNav";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus, ArrowUpRight, ArrowDownLeft, CreditCard,
  TrendingUp, TrendingDown, Filter, Download, ChevronRight
} from "lucide-react";

const CARDS = [
  { last4: "4242", brand: "VISA", expiry: "09/28", color: "linear-gradient(135deg, #007AFF 0%, #5856D6 100%)", active: true },
  { last4: "8832", brand: "MC", expiry: "03/27", color: "linear-gradient(135deg, #FF9500 0%, #FF3B30 100%)", active: false },
];

const TRANSACTIONS = [
  { id: "TXN-001", desc: "Express Delivery — Tokyo", amount: -28.50, date: "Dec 15, 2024", type: "debit", status: "completed", icon: "📦" },
  { id: "TXN-002", desc: "Wallet Top-up", amount: 200.00, date: "Dec 14, 2024", type: "credit", status: "completed", icon: "💳" },
  { id: "TXN-003", desc: "Express Delivery — New York", amount: -42.00, date: "Dec 12, 2024", type: "debit", status: "completed", icon: "📦" },
  { id: "TXN-004", desc: "Insurance Premium — Q4", amount: -15.99, date: "Dec 10, 2024", type: "debit", status: "completed", icon: "🛡️" },
  { id: "TXN-005", desc: "Refund — Cancelled Shipment", amount: +22.30, date: "Dec 8, 2024", type: "credit", status: "completed", icon: "↩️" },
  { id: "TXN-006", desc: "Business Plan — Monthly", amount: -89.00, date: "Dec 1, 2024", type: "debit", status: "completed", icon: "⭐" },
];

const PLANS = [
  { name: "Starter", price: "Free", features: ["10 shipments/month", "Standard tracking", "Email support"], current: false },
  { name: "Business Pro", price: "£89/mo", features: ["Unlimited shipments", "Priority tracking", "24/7 support", "Volume discounts", "API access"], current: true },
  { name: "Enterprise", price: "Custom", features: ["Dedicated account manager", "SLA guarantees", "Custom integrations", "Bulk pricing"], current: false },
];

export default function Payment() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [filter, setFilter] = useState("All");

  const balance = 1247.50;
  const spent = 175.49;
  const earned = 222.30;

  const filteredTxns = TRANSACTIONS.filter(t => {
    if (filter === "Credits") return t.type === "credit";
    if (filter === "Debits") return t.type === "debit";
    return true;
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--apple-bg)" }}>
      <AppNav variant="app" showSidebar sidebarOpen={sidebarOpen} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="dashboard-layout" style={{ paddingTop: "var(--nav-height)" }}>
        <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main id="main-content" className="dashboard-main">
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Wallet</h1>
              <p style={{ color: "var(--apple-label-secondary)", fontSize: "var(--text-sm)", marginTop: "var(--space-1)" }}>Manage payments and billing</p>
            </div>
            <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8 }} onClick={() => setShowTopUp(true)} aria-label="Add funds to wallet">
              <Plus size={16} aria-hidden="true" /> Add Funds
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
            {/* Balance */}
            <section aria-label="Wallet balance" className="glass-card" style={{ padding: 28, borderRadius: "var(--radius-2xl)", background: "linear-gradient(135deg, var(--apple-blue) 0%, var(--apple-indigo) 100%)", border: "none", color: "white" }}>
              <p style={{ fontSize: "var(--text-sm)", opacity: 0.8, marginBottom: 8 }}>Available Balance</p>
              <div style={{ fontSize: "clamp(var(--text-4xl), 4vw, var(--text-6xl))", fontWeight: "var(--font-black)", letterSpacing: "-0.03em", marginBottom: 24 }} aria-label={`Balance: £${balance.toFixed(2)}`}>
                £{balance.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
              </div>
              <div style={{ display: "flex", gap: 24 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, opacity: 0.7, fontSize: "var(--text-xs)", marginBottom: 2 }}><TrendingDown size={12} aria-hidden="true" /> Spent this month</div>
                  <div style={{ fontWeight: "var(--font-semibold)" }}>£{spent.toFixed(2)}</div>
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, opacity: 0.7, fontSize: "var(--text-xs)", marginBottom: 2 }}><TrendingUp size={12} aria-hidden="true" /> Added this month</div>
                  <div style={{ fontWeight: "var(--font-semibold)" }}>£{earned.toFixed(2)}</div>
                </div>
              </div>
            </section>

            {/* Cards */}
            <section aria-label="Payment cards" className="glass-card-sm" style={{ padding: 24, borderRadius: "var(--radius-xl)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-semibold)" }}>Payment Cards</h2>
                <button className="btn-ghost" style={{ fontSize: "var(--text-sm)" }} aria-label="Add new card"><Plus size={14} aria-hidden="true" /> Add Card</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {CARDS.map((card, i) => (
                  <button
                    key={card.last4}
                    onClick={() => setActiveCard(i)}
                    aria-pressed={activeCard === i}
                    aria-label={`${card.brand} ending in ${card.last4}, expires ${card.expiry}${activeCard === i ? " — selected" : ""}`}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                      borderRadius: "var(--radius-lg)", border: activeCard === i ? "2px solid var(--apple-blue)" : "1.5px solid var(--apple-separator)",
                      background: activeCard === i ? "rgba(0,122,255,0.04)" : "transparent",
                      cursor: "pointer", textAlign: "left",
                    }}
                  >
                    <div style={{ width: 40, height: 26, borderRadius: 5, background: card.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} aria-hidden="true">
                      <span style={{ color: "white", fontSize: "var(--text-2xs)", fontWeight: "var(--font-black)" }}>{card.brand}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-medium)" }}>•••• {card.last4}</div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--apple-label-secondary)" }}>Expires {card.expiry}</div>
                    </div>
                    {activeCard === i && <span style={{ fontSize: "var(--text-xs)", color: "var(--apple-blue)", fontWeight: "var(--font-semibold)" }}>Default</span>}
                    <ChevronRight size={14} color="var(--apple-label-tertiary)" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Transactions */}
          <section aria-label="Transaction history" className="glass-card-sm" style={{ borderRadius: "var(--radius-xl)", overflow: "hidden", marginBottom: 24 }}>
            <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--apple-separator)", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <h2 style={{ fontSize: "var(--text-xl)", fontWeight: "var(--font-semibold)", flex: 1 }}>Transactions</h2>
              <div style={{ display: "flex", gap: 8 }}>
                {["All", "Credits", "Debits"].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    aria-pressed={filter === f}
                    className={filter === f ? "btn-primary" : "btn-secondary"}
                    style={{ fontSize: "var(--text-sm)", padding: "6px 14px" }}
                  >{f}</button>
                ))}
              </div>
              <button className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "var(--text-sm)" }} aria-label="Download transaction history">
                <Download size={14} aria-hidden="true" /> Export
              </button>
            </div>
            <div role="list" aria-label="Transactions list">
              {filteredTxns.map((txn, i) => (
                <div
                  key={txn.id}
                  role="listitem"
                  style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "14px 24px",
                    borderBottom: i < filteredTxns.length - 1 ? "1px solid var(--apple-separator)" : "none",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--apple-fill-tertiary)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--apple-fill)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }} aria-hidden="true">{txn.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "var(--font-medium)", fontSize: "var(--text-sm)", marginBottom: 2 }}>{txn.desc}</div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--apple-label-secondary)" }}>{txn.date} · {txn.id}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {txn.type === "credit"
                      ? <ArrowDownLeft size={14} color="var(--apple-green)" aria-hidden="true" />
                      : <ArrowUpRight size={14} color="var(--apple-red)" aria-hidden="true" />
                    }
                    <span style={{ fontWeight: "var(--font-semibold)", color: txn.amount > 0 ? "var(--apple-green)" : "var(--apple-label)", fontSize: "var(--text-md)" }}>
                      {txn.amount > 0 ? "+" : ""}£{Math.abs(txn.amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Plans */}
          <section aria-label="Subscription plans" style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--font-bold)", marginBottom: 16 }}>Subscription Plans</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
              {PLANS.map(plan => (
                <div
                  key={plan.name}
                  className={`glass-card-sm${plan.current ? "" : " glass-hover-lift"}`}
                  style={{
                    padding: 24, borderRadius: "var(--radius-xl)",
                    border: plan.current ? "2px solid var(--apple-blue)" : undefined,
                    position: "relative",
                  }}
                  aria-label={`${plan.name} plan, ${plan.price}${plan.current ? " — current plan" : ""}`}
                >
                  {plan.current && (
                    <div style={{ position: "absolute", top: -1, right: 16, background: "var(--apple-blue)", color: "white", fontSize: "var(--text-xs)", fontWeight: "var(--font-semibold)", padding: "3px 12px", borderRadius: "0 0 8px 8px" }}>Current</div>
                  )}
                  <h3 style={{ fontSize: "var(--text-xl)", fontWeight: "var(--font-bold)", marginBottom: 4 }}>{plan.name}</h3>
                  <div style={{ fontSize: "var(--text-3xl)", fontWeight: "var(--font-black)", color: "var(--apple-blue)", marginBottom: 16 }}>{plan.price}</div>
                  <ul style={{ listStyle: "none", marginBottom: 20 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--text-sm)", color: "var(--apple-label-secondary)", marginBottom: 8 }}>
                        <CreditCard size={13} color="var(--apple-green)" aria-hidden="true" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button className={plan.current ? "btn-secondary" : "btn-primary"} style={{ width: "100%" }}>
                    {plan.current ? "Current Plan" : plan.price === "Custom" ? "Contact Sales" : "Upgrade"}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Top-up Modal */}
      {showTopUp && (
        <div role="dialog" aria-modal="true" aria-labelledby="topup-title" style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", zIndex: 1000, padding: 20 }}>
          <div className="glass-ultra" style={{ width: "100%", maxWidth: 400, padding: 32 }}>
            <h2 id="topup-title" style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--font-bold)", marginBottom: 20 }}>Add Funds</h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              {[50, 100, 200, 500].map(amt => (
                <button key={amt} className={topUpAmount === String(amt) ? "btn-primary" : "btn-secondary"} style={{ flex: 1, minWidth: 70 }} onClick={() => setTopUpAmount(String(amt))} aria-label={`Add £${amt}`}>£{amt}</button>
              ))}
            </div>
            <div className="field">
              <label className="field-label" htmlFor="custom-amount">Custom amount (£)</label>
              <input type="number" id="custom-amount" className="input" placeholder="0.00" value={topUpAmount} onChange={e => setTopUpAmount(e.target.value)} min="1" step="0.01" />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowTopUp(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => { alert(`£${topUpAmount} added to wallet!`); setShowTopUp(false); }}>Add £{topUpAmount || "0"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
