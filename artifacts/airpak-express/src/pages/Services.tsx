import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Truck, Globe, Plane, Package, Building2 } from "lucide-react";

const SERVICES = [
  { id: "domestic", icon: Truck, title: "Domestic Delivery", desc: "Same-day and next-day delivery across Singapore.", features: ["Same-day service", "Real-time tracking", "Proof of delivery", "Failed-delivery retry"] },
  { id: "international", icon: Globe, title: "International Shipping", desc: "Door-to-door delivery to over 200 countries.", features: ["Customs clearance handled", "Duties & taxes calculator", "End-to-end tracking", "Insurance included"] },
  { id: "express", icon: Plane, title: "Express Courier", desc: "Time-critical priority shipping when it matters.", features: ["Next-flight-out options", "Dedicated express handling", "Priority customs lane", "Live SLA monitoring"] },
  { id: "freight", icon: Package, title: "Freight Forwarding", desc: "Air, sea and land freight for any volume.", features: ["FCL & LCL ocean freight", "Air consolidation", "Cross-border trucking", "Warehousing"] },
  { id: "enterprise", icon: Building2, title: "Enterprise Solutions", desc: "Custom logistics for high-volume shippers.", features: ["Dedicated account manager", "API & EDI integration", "Custom SLAs", "Volume pricing"] },
];

export default function Services() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-[#fafafa] py-16">
          <div className="max-w-5xl mx-auto px-6 lg:px-10">
            <div className="text-sm font-semibold text-[#E11D2A] mb-2 tracking-wide uppercase">Services</div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Logistics, your way</h1>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl">
              From a single parcel to an entire freight container, we offer end-to-end shipping solutions backed by 30 years of experience.
            </p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16 space-y-12">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <section key={s.id} id={s.id} className="border-l-4 border-[#E11D2A] pl-6 scroll-mt-24">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-[#E11D2A]/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-[#E11D2A]" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{s.title}</h2>
                </div>
                <p className="text-gray-700 mb-4">{s.desc}</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E11D2A]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
