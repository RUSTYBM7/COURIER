import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const ITEMS = [
  { date: "Mar 2026", tag: "Press Release", title: "Airpak Express expands cross-border network to Vietnam and Indonesia" },
  { date: "Feb 2026", tag: "News", title: "Airpak partners with regional eCommerce platforms for fulfilment" },
  { date: "Jan 2026", tag: "Award", title: "Recognised as Singapore's Top Logistics SME for the fifth year running" },
  { date: "Dec 2025", tag: "Press Release", title: "Airpak goes carbon-neutral on all Singapore domestic deliveries" },
];

export default function MediaCentre() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-[#fafafa] py-16">
          <div className="max-w-5xl mx-auto px-6 lg:px-10">
            <div className="text-sm font-semibold text-[#E11D2A] mb-2 tracking-wide uppercase">Media Centre</div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">News and announcements</h1>
          </div>
        </section>
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-6 lg:px-10 space-y-4">
            {ITEMS.map((i) => (
              <article key={i.title} className="p-6 rounded-lg border border-gray-100 hover:border-[#E11D2A] hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <span>{i.date}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#E11D2A]/10 text-[#E11D2A] font-semibold">{i.tag}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{i.title}</h3>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
