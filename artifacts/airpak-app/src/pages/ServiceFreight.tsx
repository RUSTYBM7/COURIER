import { PublicLayout } from "@/components/PublicLayout";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Truck, Container, Plane, ShieldCheck } from "lucide-react";

export default function ServiceFreight() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-6xl px-6 py-16 space-y-12">
        <header className="space-y-4 text-center">
          <Badge variant="secondary" className="mx-auto">Freight & Pallet</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Heavy and bulk, handled with care.</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pallet, air, sea and rail freight from Cardiff Bay to anywhere in the world. Dedicated coordinators for every shipment.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button asChild size="lg"><Link href="/shipnow">Book a freight pickup</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/calculator">Get a rate</Link></Button>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Truck, title: "Pallets up to 1000 kg", desc: "Standard EUR pallets, half pallets and oversized loads." },
            { icon: Container, title: "Sea freight", desc: "FCL and LCL with weekly sailings from major UK ports." },
            { icon: Plane, title: "Air freight", desc: "Priority air slots for time-critical industrial cargo." },
            { icon: ShieldCheck, title: "Cargo insurance", desc: "All-risk cover available up to £500k per consignment." },
            { icon: Truck, title: "White glove delivery", desc: "Tail-lift, two-person crews and inside placement." },
            { icon: Container, title: "Customs handled", desc: "End-to-end import/export documentation by our brokers." },
          ].map((f) => (
            <Card key={f.title} className="glass-card">
              <CardHeader>
                <f.icon className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-lg">{f.title}</CardTitle>
                <CardDescription>{f.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Indicative pricing</CardTitle>
            <CardDescription>From Cardiff Bay. Prices ex-VAT and exclude duties.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lane</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Transit</TableHead>
                  <TableHead className="text-right">From</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ["Cardiff → London", "Pallet road", "1 day", "£49"],
                  ["Cardiff → Berlin", "Pallet road", "3-4 days", "£189"],
                  ["Cardiff → Dubai", "Air freight", "4-6 days", "£499"],
                  ["Cardiff → Shanghai", "Sea LCL", "30-35 days", "£350"],
                ].map(([lane, mode, transit, price]) => (
                  <TableRow key={lane}>
                    <TableCell className="font-medium">{lane}</TableCell>
                    <TableCell>{mode}</TableCell>
                    <TableCell>{transit}</TableCell>
                    <TableCell className="text-right">{price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </PublicLayout>
  );
}
