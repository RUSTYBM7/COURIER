import { useState } from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/components/PublicLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Calculator as CalcIcon, Info } from "lucide-react";

const RATES = {
  domestic:      { base: 5.99,  perKg: 1.2, label: "Domestic" },
  international: { base: 18.5,  perKg: 3.4, label: "International" },
  express:       { base: 14.5,  perKg: 2.6, label: "Express" },
  freight:       { base: 49,    perKg: 0.9, label: "Freight" },
} as const;

export default function Calculator() {
  const [service, setService] = useState<keyof typeof RATES>("domestic");
  const [weight, setWeight] = useState("1");
  const [origin, setOrigin] = useState("Cardiff, UK");
  const [destination, setDestination] = useState("London, UK");
  const w = Math.max(0, parseFloat(weight) || 0);
  const r = RATES[service];
  const total = Math.round((r.base + w * r.perKg) * 100) / 100;

  return (
    <PublicLayout>
      <section className="mx-auto max-w-4xl px-6 py-16 space-y-8">
        <header className="text-center space-y-3">
          <Badge variant="secondary" className="mx-auto">Live rate</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Shipping rate calculator</h1>
          <p className="text-muted-foreground">Get an instant quote in seconds.</p>
        </header>

        <div className="grid md:grid-cols-[1fr,360px] gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CalcIcon className="h-5 w-5 text-primary" /> Shipment details</CardTitle>
              <CardDescription>Estimates only — final price may vary at booking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Service</Label>
                <Select value={service} onValueChange={(v) => setService(v as keyof typeof RATES)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(RATES).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v.label} — £{v.base.toFixed(2)} base + £{v.perKg.toFixed(2)}/kg</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Weight (kg)
                  <Tooltip>
                    <TooltipTrigger asChild><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
                    <TooltipContent>Volumetric weight may apply for low-density parcels.</TooltipContent>
                  </Tooltip>
                </Label>
                <Input type="number" min={0} step={0.1} value={weight} onChange={(e) => setWeight(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Origin</Label>
                  <Input value={origin} onChange={(e) => setOrigin(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Destination</Label>
                  <Input value={destination} onChange={(e) => setDestination(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardDescription>Estimated total</CardDescription>
              <CardTitle className="text-4xl">£{total.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Service</span><Badge>{r.label}</Badge></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Base</span><span>£{r.base.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">{w} kg × £{r.perKg.toFixed(2)}</span><span>£{(w * r.perKg).toFixed(2)}</span></div>
              <Separator />
              <Button className="w-full" size="lg" asChild>
                <Link href={`/shipnow?service=${service}&weight=${w}`}>Book this shipment</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
}
