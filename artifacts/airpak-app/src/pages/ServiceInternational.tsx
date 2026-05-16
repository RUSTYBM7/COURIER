import { PublicLayout } from "@/components/PublicLayout";
import { Link } from "wouter";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Globe, Plane, FileCheck, MapPin } from "lucide-react";

const PRICING = [
  { tier: "Zone 1 — Europe", weight: "0 – 2 kg", price: "£18.50", eta: "3–5 days" },
  { tier: "Zone 1 — Europe", weight: "2 – 5 kg", price: "£28.90", eta: "3–5 days" },
  { tier: "Zone 2 — Americas/Asia", weight: "0 – 2 kg", price: "£32.00", eta: "5–7 days" },
  { tier: "Zone 2 — Americas/Asia", weight: "2 – 5 kg", price: "£49.00", eta: "5–7 days" },
];

const FEATURES = [
  { icon: Globe, title: "200+ countries", body: "Door-to-door delivery worldwide." },
  { icon: FileCheck, title: "Customs handled", body: "We complete the paperwork for you." },
  { icon: Plane, title: "Air-priority lanes", body: "Direct injection into partner hubs." },
  { icon: MapPin, title: "End-to-end tracking", body: "One reference, every milestone." },
];

export default function ServiceInternational() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-primary/5 to-background py-20 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight">International shipping</h1>
          <p className="mt-3 text-muted-foreground">Reach 200+ countries with one trusted partner.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild><Link href="/shipnow">Book a shipment</Link></Button>
            <Button asChild variant="outline"><Link href="/calculator">Get a quote</Link></Button>
          </div>
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map((f) => (
          <Card key={f.title}>
            <CardHeader>
              <f.icon className="h-6 w-6 text-primary" />
              <CardTitle className="text-lg mt-2">{f.title}</CardTitle>
              <CardDescription>{f.body}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <Card>
          <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zone</TableHead><TableHead>Weight</TableHead><TableHead>ETA</TableHead><TableHead className="text-right">From</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PRICING.map((p, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{p.tier}</TableCell>
                  <TableCell>{p.weight}</TableCell>
                  <TableCell>{p.eta}</TableCell>
                  <TableCell className="text-right">{p.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>
      <section className="bg-muted/40 py-16 text-center px-6">
        <h2 className="text-2xl font-bold">Sending abroad?</h2>
        <p className="text-muted-foreground mt-2">Get an instant rate for your route.</p>
        <Button asChild className="mt-5"><Link href="/calculator">Get quote</Link></Button>
      </section>
    </PublicLayout>
  );
}
