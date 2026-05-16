import { PublicLayout } from "@/components/PublicLayout";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Boxes, Wallet, Users2, LineChart, ShieldCheck } from "lucide-react";

export default function Business() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-6xl px-6 py-16 space-y-14">
        <header className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <Badge variant="secondary">For business</Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Logistics that scales with you.</h1>
            <p className="text-muted-foreground text-lg">
              Net 30 billing, a dedicated account manager, bulk pickups and an API built for engineering teams. Trusted by 1,200+ Welsh and international businesses.
            </p>
            <div className="flex gap-3 pt-2">
              <Button asChild size="lg"><Link href="/contact">Talk to sales</Link></Button>
              <Button asChild size="lg" variant="outline"><Link href="/developers">Read the API docs</Link></Button>
            </div>
          </div>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>What teams get</CardTitle>
              <CardDescription>Everything in one contract.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2"><Wallet className="h-4 w-4 text-primary" /> Net 30 invoicing</div>
              <div className="flex items-center gap-2"><Users2 className="h-4 w-4 text-primary" /> Account manager</div>
              <div className="flex items-center gap-2"><Boxes className="h-4 w-4 text-primary" /> Bulk pickups</div>
              <div className="flex items-center gap-2"><LineChart className="h-4 w-4 text-primary" /> Live analytics</div>
              <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> Multi-site billing</div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> SLA up to 99.9%</div>
            </CardContent>
          </Card>
        </header>
      </section>
    </PublicLayout>
  );
}
