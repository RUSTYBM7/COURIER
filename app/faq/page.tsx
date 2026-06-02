"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
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
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#fafafa] py-16">
          <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How can we help?</h1>
            <p className="text-gray-600 mb-8">Search or browse categories below</p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="search"
                className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 focus:border-[#E11D2A] focus:outline-none text-sm"
                placeholder={`Search ${FAQS.length} questions...`}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {filtered.length > 0 && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-6 lg:px-10">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat 
                      ? "bg-[#E11D2A] text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                  {activeCategory === cat && cat !== "All" && (
                    <span className="ml-2 text-xs">({FAQS.filter(f => f.cat === cat).length})</span>
                  )}
                </button>
              ))}
            </div>

            {/* Questions */}
            <div className="space-y-3">
              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-gray-500 mb-4">No questions found for &quot;{search}&quot;</p>
                  <button 
                    className="px-4 py-2 rounded-full border border-gray-200 text-sm hover:bg-gray-50"
                    onClick={() => { setSearch(""); setActiveCategory("All"); }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
              {filtered.map((faq, i) => {
                const isOpen = openItems.has(i);
                return (
                  <div key={i} className={`border rounded-lg transition-all ${isOpen ? "border-[#E11D2A] shadow-sm" : "border-gray-100"}`}>
                    <button
                      className="w-full flex items-center justify-between p-5 text-left"
                      onClick={() => toggleItem(i)}
                    >
                      <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-500 transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-[#fafafa]">
          <div className="max-w-xl mx-auto px-6 text-center">
            <MessageCircle className="h-10 w-10 text-[#E11D2A] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Still have questions?</h2>
            <p className="text-gray-600 mb-6">
              Our support team is available 24/7 to help you with anything.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/contact" className="px-6 py-3 rounded-full bg-[#E11D2A] text-white font-semibold hover:bg-[#c41723] transition-colors flex items-center gap-2">
                <MessageCircle className="h-4 w-4" /> Contact Support
              </Link>
              <a href="mailto:support@airpak-express.site" className="px-6 py-3 rounded-full border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                Email Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
