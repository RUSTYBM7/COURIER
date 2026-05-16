import { useState } from "react";
import { useLocation } from "wouter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Package,
  Globe,
  Truck,
  Plane,
  Building2,
  Clock,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";

const HERO_BG =
  "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=2000&q=80";

const SERVICES = [
  { icon: Truck, title: "Domestic Delivery", desc: "Same-day and next-day delivery across Singapore." },
  { icon: Globe, title: "International Shipping", desc: "Trusted door-to-door delivery to 200+ countries." },
  { icon: Plane, title: "Express Courier", desc: "Time-critical priority shipping when it matters." },
  { icon: Package, title: "Freight Forwarding", desc: "Air, sea and land freight solutions for any volume." },
  { icon: Building2, title: "Enterprise Solutions", desc: "Custom logistics built for high-volume shippers." },
  { icon: ShieldCheck, title: "Secure Handling", desc: "Insured, tracked and handled with end-to-end care." },
];

const STATS = [
  { value: "30+", label: "Years of Experience" },
  { value: "200+", label: "Countries Served" },
  { value: "10M+", label: "Shipments Delivered" },
  { value: "99.8%", label: "On-Time Rate" },
];

const FEATURES = [
  { icon: Clock, title: "Always On Time", desc: "Industry-leading on-time delivery performance backed by real-time tracking." },
  { icon: ShieldCheck, title: "Secure & Insured", desc: "Every parcel is insured and handled by trained logistics professionals." },
  { icon: HeartHandshake, title: "Personal Service", desc: "Dedicated account managers for our enterprise customers." },
];

export default function Home() {
  const [, navigate] = useLocation();
  const [trackingId, setTrackingId] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      navigate(`/tracking?id=${encodeURIComponent(trackingId.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_BG})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-28 md:py-40">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5">
                Seamless International
                <br />
                Express Courier Services
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-10 max-w-xl">
                With over 30 years of experience, we know what it takes to deliver.
              </p>

              <div>
                <div className="text-sm font-medium mb-3 text-white/90">Track your shipment</div>
                <form
                  onSubmit={handleTrack}
                  className="flex bg-white rounded-full shadow-xl overflow-hidden max-w-xl"
                >
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter your tracking number"
                    className="flex-1 px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 bg-[#E11D2A] text-white font-semibold hover:bg-[#c41723] transition-colors text-sm"
                  >
                    Track
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-[#fafafa] border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#E11D2A]">{s.value}</div>
                <div className="text-sm text-gray-600 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-2xl mb-12">
              <div className="text-sm font-semibold text-[#E11D2A] mb-2 tracking-wide uppercase">Our Services</div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Logistics solutions built for every shipment
              </h2>
              <p className="text-gray-600 mt-4">
                From single parcels to enterprise freight, our network is designed to move your goods reliably, quickly and securely.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.title}
                    className="p-7 rounded-xl border border-gray-100 hover:border-[#E11D2A] hover:shadow-lg transition-all bg-white group cursor-pointer"
                    onClick={() => navigate("/services")}
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#E11D2A]/10 flex items-center justify-center mb-4 group-hover:bg-[#E11D2A] transition-colors">
                      <Icon className="h-6 w-6 text-[#E11D2A] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                    <p className="text-sm text-gray-600">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why */}
        <section className="py-20 bg-[#fafafa]">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="text-sm font-semibold text-[#E11D2A] mb-2 tracking-wide uppercase">Why Airpak</div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Built on trust, delivered with care</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="text-center">
                    <div className="w-16 h-16 rounded-full bg-white mx-auto flex items-center justify-center shadow-md mb-4">
                      <Icon className="h-7 w-7 text-[#E11D2A]" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{f.title}</h3>
                    <p className="text-gray-600 text-sm">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-[#E11D2A]">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white">
              <h2 className="text-2xl md:text-3xl font-bold">Ready to ship with confidence?</h2>
              <p className="text-white/90 mt-2">Get started in minutes — no setup fees, no minimums.</p>
            </div>
            <button
              onClick={() => navigate("/signup")}
              className="px-7 py-3.5 rounded-full bg-white text-[#E11D2A] font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              Open an account
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
