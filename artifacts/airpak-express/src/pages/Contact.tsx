import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-[#fafafa] py-16">
          <div className="max-w-5xl mx-auto px-6 lg:px-10">
            <div className="text-sm font-semibold text-[#E11D2A] mb-2 tracking-wide uppercase">Contact</div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Get in touch</h1>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl">Questions about shipping, billing or partnerships? Our team is happy to help.</p>
          </div>
        </section>
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Visit or call us</h2>
              <ul className="space-y-5 text-gray-700">
                <li className="flex gap-3"><MapPin className="h-5 w-5 text-[#E11D2A] mt-0.5" /><div><div className="font-semibold">Headquarters</div>5 Changi North Way, Singapore 498771</div></li>
                <li className="flex gap-3"><Phone className="h-5 w-5 text-[#E11D2A] mt-0.5" /><div><div className="font-semibold">Customer Service</div><a href="tel:+6562508588" className="hover:text-[#E11D2A]">+65 6250 8588</a></div></li>
                <li className="flex gap-3"><Mail className="h-5 w-5 text-[#E11D2A] mt-0.5" /><div><div className="font-semibold">General Enquiries</div><a href="mailto:enquiry@airpak-express.site" className="hover:text-[#E11D2A]">enquiry@airpak-express.site</a></div></li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Send a message</h2>
              {sent ? (
                <div className="p-6 rounded-lg bg-green-50 border border-green-200 text-green-800">Thanks — we'll get back to you within one business day.</div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
                  <input required placeholder="Your name" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#E11D2A] focus:outline-none" />
                  <input required type="email" placeholder="Email address" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#E11D2A] focus:outline-none" />
                  <input placeholder="Subject" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#E11D2A] focus:outline-none" />
                  <textarea required rows={5} placeholder="How can we help?" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#E11D2A] focus:outline-none resize-none" />
                  <button type="submit" className="w-full py-3 rounded-full bg-[#E11D2A] text-white font-semibold hover:bg-[#c41723] transition-colors">Send message</button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
