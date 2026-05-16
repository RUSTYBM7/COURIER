import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-[#fafafa] py-16">
          <div className="max-w-5xl mx-auto px-6 lg:px-10">
            <div className="text-sm font-semibold text-[#E11D2A] mb-2 tracking-wide uppercase">About Us</div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Delivering trust since 1991</h1>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl">
              Airpak Express is a Singapore-headquartered courier and logistics company that has been moving goods reliably for over three decades.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-5xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Story</h2>
              <p className="text-gray-700 leading-relaxed">
                Founded in 1991, Airpak Express began as a small local courier in Singapore. Today we operate a global network spanning 200+ countries, with strategic partnerships across every major shipping lane.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                We've grown by staying obsessed with one thing: getting your shipment from A to B safely, on time and at a fair price.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                To make international shipping as simple and reliable as sending a letter across town — for individuals, SMEs and enterprises alike.
              </p>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-6">Our Values</h2>
              <ul className="space-y-2 text-gray-700">
                <li><strong className="text-[#E11D2A]">Reliability</strong> — every package matters.</li>
                <li><strong className="text-[#E11D2A]">Transparency</strong> — clear pricing, clear tracking.</li>
                <li><strong className="text-[#E11D2A]">Care</strong> — your goods, handled like ours.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
