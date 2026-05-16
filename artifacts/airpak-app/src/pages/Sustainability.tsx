import { PublicLayout } from "@/components/PublicLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Leaf, BatteryCharging, Recycle, Plane } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const DATA = [
  { year: "2021", co2: 100 },
  { year: "2022", co2: 92 },
  { year: "2023", co2: 81 },
  { year: "2024", co2: 70 },
  { year: "2025", co2: 62 },
];

export default function Sustainability() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-5xl px-6 py-16 space-y-10">
        <header className="text-center space-y-3">
          <Badge variant="secondary" className="mx-auto"><Leaf className="h-3 w-3 mr-1" /> On track for net zero by 2030</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Logistics with less footprint.</h1>
          <p className="text-muted-foreground">We measure every gram of CO₂ and publish a full sustainability report each year.</p>
        </header>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: BatteryCharging, label: "Electric last-mile fleet", value: 64 },
            { icon: Plane, label: "SAF-blended air freight", value: 28 },
            { icon: Recycle, label: "Recycled packaging", value: 91 },
          ].map((s) => (
            <Card key={s.label} className="glass-card">
              <CardHeader className="pb-3">
                <s.icon className="h-5 w-5 text-primary mb-1" />
                <CardDescription>{s.label}</CardDescription>
                <CardTitle className="text-3xl">{s.value}%</CardTitle>
              </CardHeader>
              <CardContent><Progress value={s.value} /></CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Scope 1 emissions, indexed to 2021</CardTitle>
            <CardDescription>Lower is better. 100 = 2021 baseline.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ co2: { label: "CO₂ index", color: "var(--primary)" } }} className="h-[280px] w-full">
              <BarChart data={DATA}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="year" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="co2" fill="var(--color-co2)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>
    </PublicLayout>
  );
}
