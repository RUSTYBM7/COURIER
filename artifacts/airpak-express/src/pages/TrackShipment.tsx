import { useState } from "react";
import { useLocation } from "wouter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function TrackShipment() {
  const [, navigate] = useLocation();
  const [id, setId] = useState("");
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-[#fafafa] py-16">
          <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center">
            <div className="text-sm font-semibold text-[#E11D2A] mb-2 tracking-wide uppercase">Track Shipment</div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Where is my parcel?</h1>
            <p className="text-lg text-gray-600 mt-4">Enter your tracking number to see live status and location.</p>
            <form
              onSubmit={(e) => { e.preventDefault(); if (id.trim()) navigate(`/tracking?id=${encodeURIComponent(id.trim())}`); }}
              className="flex bg-white rounded-full shadow-lg overflow-hidden mt-8 max-w-xl mx-auto border border-gray-100"
            >
              <input value={id} onChange={(e) => setId(e.target.value)} placeholder="Enter tracking number" className="flex-1 px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none text-sm" />
              <button type="submit" className="px-8 py-4 bg-[#E11D2A] text-white font-semibold hover:bg-[#c41723] transition-colors text-sm">Track</button>
            </form>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
