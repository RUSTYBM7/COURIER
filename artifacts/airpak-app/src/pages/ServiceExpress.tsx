import { PublicLayout } from "@/components/PublicLayout";
import { Link } from "wouter";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Zap, Clock, Timer, ShieldCheck } from "lucide-react";

const PRICING = [
  { tier: "Express UK", weight: "0 – 2 kg", price: "£14.50", eta: "Today" },
  { tier: "Express UK", weight: "2 – 5 kg", price: "£21.80", eta: "Today" },
  { tier: "Express EU", weight: "0 – 2 kg", price: "£29.00", eta: "Next day" },
  { tier: "Express Global", weight: "0 – 2 kg", price: "£45.00", eta: "1–2 days" },
];

const FEATURES = [
  { icon: Zap, title: "Same-day UK", body: "Pickup before 11:00, delivery by 18:00." },
  { icon: Clock, title: "Guaranteed windows", body: "Money-back if we miss the slot." },
  { icon: Timer, title: "Priority sorting", body: "Skips the queue at every hub." },
  { icon: ShieldCheck, title: "Premium insurance", body: "Up to £1,000 cover included." },
];

export default function ServiceExpress() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-primary/5 to-background py-20 text-center px-6">
        <h1 className="text-4xl font-bold tracking-tight">Express shipping</h1>
        <p className="mt-3 text-muted-foreground">For when it absolutely has to arrive today.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild><Link href="/shipnow">Book express</Link></Button>
          <Button asChild variant="outline"><Link href="/calculator">Get a quote</Link></Button>
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
              <TableRow><TableHead>Service</TableHead><TableHead>Weight</TableHead><TableHead>ETA</TableHead><TableHead className="text-right">From</TableHead></TableRow>
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
        <h2 className="text-2xl font-bold">Need it now?</h2>
        <Button asChild className="mt-5"><Link href="/shipnow">Ship express</Link></Button>
      </section>
    </PublicLayout>
  );
}
