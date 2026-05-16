import { PublicLayout } from "@/components/PublicLayout";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Truck, Clock, ShieldCheck, MapPin } from "lucide-react";

const PRICING = [
  { tier: "Standard", weight: "0 – 2 kg", price: "£5.99", eta: "2–3 days" },
  { tier: "Standard+", weight: "2 – 5 kg", price: "£8.49", eta: "2–3 days" },
  { tier: "Next-day", weight: "0 – 2 kg", price: "£9.99", eta: "Next day" },
  { tier: "Next-day", weight: "2 – 5 kg", price: "£12.99", eta: "Next day" },
];

const FEATURES = [
  { icon: Truck, title: "Nationwide network", body: "Daily collections in every UK postcode." },
  { icon: Clock, title: "Next-day available", body: "Drop off by 18:00 for next-day delivery." },
  { icon: ShieldCheck, title: "Insured up to £100", body: "Standard cover for every parcel." },
  { icon: MapPin, title: "Live tracking", body: "Map updates from pickup to doorstep." },
];

export default function ServiceDomestic() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-primary/5 to-background py-20 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight">Domestic shipping</h1>
          <p className="mt-3 text-muted-foreground">Fast, reliable UK delivery from £5.99 with live tracking.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild><Link href="/shipnow">Book a shipment</Link></Button>
            <Button asChild variant="outline"><Link href="/calculator">Get a quote</Link></Button>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <Card key={f.title}>
              <CardHeader>
                <f.icon className="h-6 w-6 text-primary" />
                <CardTitle className="text-lg mt-2">{f.title}</CardTitle>
                <CardDescription>{f.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-16">
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>Prices include VAT.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tier</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead className="text-right">From</TableHead>
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
          </CardContent>
        </Card>
      </section>

      <section className="bg-muted/40 py-16 text-center px-6">
        <h2 className="text-2xl font-bold">Ready to ship?</h2>
        <p className="text-muted-foreground mt-2">Create an account and get £10 off your first shipment.</p>
        <Button asChild className="mt-5"><Link href="/signup">Get started</Link></Button>
      </section>
    </PublicLayout>
  );
}
