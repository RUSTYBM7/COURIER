import { PublicLayout } from "@/components/PublicLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";

const BRANCHES = [
  { city: "Cardiff Bay", country: "United Kingdom", hq: true, address: "Unit 7, Wales International Hub, Cardiff Bay, CF10 5AL", phone: "+44 29 2011 3344", hours: "Mon–Fri 08:00–20:00 · Sat 09:00–17:00" },
  { city: "London", country: "United Kingdom", address: "12 Canary Wharf, London, E14 5AB", phone: "+44 20 7946 1100", hours: "Mon–Fri 08:00–20:00" },
  { city: "Berlin", country: "Germany", address: "Friedrichstraße 100, 10117 Berlin", phone: "+49 30 1234 5678", hours: "Mon–Fri 09:00–19:00" },
  { city: "Dubai", country: "UAE", address: "Jebel Ali Free Zone, Warehouse W12", phone: "+971 4 123 4567", hours: "Sun–Thu 08:00–18:00" },
  { city: "Singapore", country: "Singapore", address: "1 Changi Airport Cargo Way", phone: "+65 6123 4567", hours: "Mon–Sat 08:00–22:00" },
  { city: "Kuala Lumpur", country: "Malaysia", address: "KLIA Free Commercial Zone, Hangar 4", phone: "+60 3 8888 9999", hours: "Mon–Sat 08:00–20:00" },
  { city: "Shanghai", country: "China", address: "Pudong International Cargo Terminal", phone: "+86 21 5555 0000", hours: "Mon–Sat 08:00–20:00" },
  { city: "New York", country: "USA", address: "JFK Cargo Building 77, Jamaica NY 11430", phone: "+1 718 555 0100", hours: "Mon–Fri 07:00–21:00" },
  { city: "Sydney", country: "Australia", address: "Sydney Airport Freight Centre, Mascot", phone: "+61 2 9000 4000", hours: "Mon–Fri 08:00–18:00" },
];

export default function Branches() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-6xl px-6 py-16 space-y-10">
        <header className="text-center space-y-3">
          <Badge variant="secondary" className="mx-auto">9 hubs worldwide</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Our branches</h1>
          <p className="text-muted-foreground">Visit a hub or speak to a local team.</p>
        </header>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BRANCHES.map((b) => (
            <Card key={b.city} className={b.hq ? "ring-2 ring-primary/40 glass-card" : "glass-card"}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>{b.city}</CardTitle>
                    <CardDescription>{b.country}</CardDescription>
                  </div>
                  {b.hq && <Badge>HQ</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" /><span>{b.address}</span></div>
                <div className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" /><span>{b.phone}</span></div>
                <div className="flex gap-2"><Clock className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" /><span>{b.hours}</span></div>
                <Button asChild variant="outline" size="sm" className="w-full mt-2">
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(b.address)}`} target="_blank" rel="noreferrer">
                    Open in maps <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
