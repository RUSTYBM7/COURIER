import { useState } from "react";
import { useLocation, Link } from "wouter";
import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";

export default function Landing() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [_, setLocation] = useLocation();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      setLocation(`/tracking/${encodeURIComponent(trackingNumber.trim())}`);
    }
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(225,29,42,0.05),transparent)]" />
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mb-6">
          Global Logistics, <span className="text-primary">Simplified.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-12">
          Track your parcels, book shipments, and manage your freight with the calm, premium experience you deserve.
        </p>
        
        <div className="w-full max-w-2xl bg-card rounded-2xl p-2 shadow-xl border glass">
          <form onSubmit={handleTrack} className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-muted-foreground ml-3" />
            <Input 
              type="text" 
              placeholder="Enter your tracking number (e.g. TRK123456789)" 
              className="border-0 focus-visible:ring-0 text-lg h-14 bg-transparent"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
            <Button type="submit" size="lg" className="rounded-xl h-14 px-8">
              Track
            </Button>
          </form>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-muted/30 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {["Domestic", "International", "Express", "Freight"].map((service) => (
              <div key={service} className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{service} Shipping</h3>
                <p className="text-muted-foreground text-sm">Reliable and fast {service.toLowerCase()} delivery solutions for your business.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
