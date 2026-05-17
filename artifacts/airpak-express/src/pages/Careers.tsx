import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MapPin, Briefcase } from "lucide-react";

const ROLES = [
  { title: "Operations Manager", location: "Singapore HQ", type: "Full-time" },
  { title: "Courier Driver", location: "Singapore", type: "Full-time" },
  { title: "Customer Service Specialist", location: "Singapore HQ", type: "Full-time" },
  { title: "Warehouse Associate", location: "Changi", type: "Full-time" },
  { title: "Senior Software Engineer", location: "Remote / Singapore", type: "Full-time" },
];

export default function Careers() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-[#fafafa] py-16">
          <div className="max-w-5xl mx-auto px-6 lg:px-10">
            <div className="text-sm font-semibold text-[#E11D2A] mb-2 tracking-wide uppercase">Careers</div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Join the Airpak family</h1>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl">We're hiring across operations, customer service and engineering. Help us deliver the world.</p>
          </div>
        </section>
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-6 lg:px-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Open positions</h2>
            <div className="space-y-3">
              {ROLES.map((r) => (
                <div key={r.title} className="flex items-center justify-between p-5 rounded-lg border border-gray-100 hover:border-[#E11D2A] hover:shadow-md transition-all">
                  <div>
                    <div className="font-semibold text-gray-900">{r.title}</div>
                    <div className="flex gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{r.location}</span>
                      <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{r.type}</span>
                    </div>
                  </div>
                  <a href="mailto:careers@airpak-express.site" className="text-sm font-semibold text-[#E11D2A] hover:underline">Apply →</a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
