import { useState } from "react";
import { AppNav } from "@/components/AppNav";
import { Link } from "wouter";
import { ChevronDown, Search, MessageCircle } from "lucide-react";

const CATEGORIES = ["All", "Shipping", "Tracking", "Billing", "Account", "International"];

const FAQS = [
  { cat: "Shipping", q: "How do I create a shipment?", a: "Sign in to your account, go to Dashboard, and click 'New Shipment'. Follow the step-by-step wizard to enter package details, choose a service level, and schedule pickup." },
  { cat: "Shipping", q: "What are your delivery timeframes?", a: "Standard delivery: 5-7 business days. Express: 2-3 business days. Same-day and next-day options are available in select areas. International delivery varies by destination (3-14 days)." },
  { cat: "Shipping", q: "What items are prohibited?", a: "Prohibited items include: hazardous materials, firearms, live animals, perishables without proper packaging, and any items restricted by destination country customs laws." },
  { cat: "Shipping", q: "What is the maximum package size?", a: "Maximum weight is 70 kg per package. Maximum dimensions: 120cm x 80cm x 80cm. Oversized items may incur additional fees. Contact us for bulk or freight solutions." },
  { cat: "Tracking", q: "How do I track my package?", a: "Visit our Track page and enter your tracking number (format: APX-YYYY-NNN). You'll see real-time updates including GPS location, estimated delivery time, and delivery confirmation." },
  { cat: "Tracking", q: "Why isn't my tracking updating?", a: "Tracking updates may be delayed by 2-4 hours at certain transit points. If tracking hasn't updated for more than 24 hours, please contact our support team with your tracking number." },
  { cat: "Tracking", q: "Can I change my delivery address?", a: "Address changes can be requested before the package reaches the final sorting hub. Log in to your account, find the shipment, and click 'Change Delivery Address'. Fees may apply." },
  { cat: "Billing", q: "What payment methods do you accept?", a: "We accept all major credit/debit cards (Visa, Mastercard, Amex), PayPal, Apple Pay, Google Pay, and bank transfers for business accounts. All payments are secured with 256-bit encryption." },
  { cat: "Billing", q: "How do I get a refund?", a: "Refunds are processed within 5-7 business days. For lost or damaged packages, file a claim within 30 days of the scheduled delivery date. Approved claims are refunded to your original payment method." },
  { cat: "Billing", q: "Do you offer business pricing?", a: "Yes! Business accounts with 50+ monthly shipments qualify for volume discounts of 10-30%. Contact our sales team at sales@airpak-express.site for a custom quote." },
  { cat: "Account", q: "How do I reset my password?", a: "Click 'Forgot password?' on the sign-in page and enter your email. You'll receive a reset link within 5 minutes. Check your spam folder if you don't see it." },
  { cat: "Account", q: "Can I have multiple users on one account?", a: "Business accounts support up to 25 team members with role-based permissions (Admin, Manager, Viewer). Manage team members in Settings > Team." },
  { cat: "International", q: "Do you handle customs clearance?", a: "Yes, we provide full customs documentation assistance for international shipments. Our team will guide you through required forms, HS codes, and any applicable duties and taxes." },
  { cat: "International", q: "What countries do you ship to?", a: "We deliver to 190+ countries worldwide. Some remote areas may have limited service or longer delivery times. Use our quote tool to check availability and pricing for specific routes." },
  { cat: "International", q: "How are import duties calculated?", a: "Import duties are calculated by destination country customs based on the declared value and HS code of goods. We provide Delivery Duty Paid (DDP) and Delivery Duty Unpaid (DDU) options." },
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (idx: number) => {
    const next = new Set(openItems);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setOpenItems(next);
  };

  const filtered = FAQS.filter(f => {
    const matchCat = activeCategory === "All" || f.cat === activeCategory;
    const matchSearch = !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--apple-bg)" }}>
      <AppNav variant="public" />

      <main id="main-content" className="faq-page" style={{ paddingTop: "var(--nav-height)" }}>
        {/* Hero */}
        <header className="faq-hero">
          <h1>How can we help?</h1>
          <p>Search or browse categories below</p>
          <div className="faq-search-wrap">
            <Search className="faq-search-icon" size={20} aria-hidden="true" />
            <input
              type="search"
              className="faq-search-input"
              placeholder={`Search ${FAQS.length} questions…`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search frequently asked questions"
            />
            {filtered.length > 0 && (
              <span className="faq-search-count" aria-live="polite" aria-atomic="true">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </header>

        {/* Body */}
        <div className="faq-body">
          {/* Category Tabs */}
          <aside className="faq-categories" aria-label="FAQ categories">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`faq-category-btn${activeCategory === cat ? " active" : ""}`}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
              >
                {cat}
                {activeCategory === cat && cat !== "All" && (
                  <span className="faq-category-count">{FAQS.filter(f => f.cat === cat).length}</span>
                )}
              </button>
            ))}
          </aside>

          {/* Questions */}
          <div className="faq-list" role="list">
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <p style={{ color: "var(--apple-label-secondary)", marginBottom: 16 }}>No questions found for "{search}"</p>
                <button className="btn-secondary" onClick={() => { setSearch(""); setActiveCategory("All"); }}>Clear filters</button>
              </div>
            )}
            {filtered.map((faq, i) => {
              const isOpen = openItems.has(i);
              return (
                <div key={i} className={`faq-item${isOpen ? " open" : ""}`} role="listitem">
                  <button
                    className="faq-question"
                    onClick={() => toggleItem(i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    id={`faq-question-${i}`}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      style={{ transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div
                      className="faq-answer"
                      id={`faq-answer-${i}`}
                      role="region"
                      aria-labelledby={`faq-question-${i}`}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="faq-contact glass-card-sm" style={{ textAlign: "center", padding: "40px 20px", margin: "0 auto 60px", maxWidth: 600 }}>
          <MessageCircle size={40} color="var(--apple-blue)" style={{ margin: "0 auto 16px", display: "block" }} aria-hidden="true" />
          <h2 style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--font-bold)", marginBottom: 8 }}>Still have questions?</h2>
          <p style={{ color: "var(--apple-label-secondary)", marginBottom: 24 }}>
            Our support team is available 24/7 to help you with anything.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/chat" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><MessageCircle size={16} aria-hidden="true" /> Chat with Support</Link>
            <a href="mailto:support@airpak-express.site" className="btn-secondary">Email Us</a>
          </div>
        </div>
      </main>
    </div>
  );
}
