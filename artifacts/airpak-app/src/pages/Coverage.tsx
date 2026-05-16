import { useState } from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Globe2 } from "lucide-react";

const REGIONS: { name: string; countries: string[] }[] = [
  { name: "Europe", countries: ["United Kingdom", "Ireland", "France", "Germany", "Netherlands", "Belgium", "Spain", "Portugal", "Italy", "Poland", "Sweden", "Norway", "Denmark", "Finland", "Austria", "Switzerland", "Czechia"] },
  { name: "Asia", countries: ["China", "Hong Kong", "Japan", "South Korea", "Singapore", "Malaysia", "Thailand", "Vietnam", "Indonesia", "Philippines", "India", "Pakistan"] },
  { name: "Middle East", countries: ["United Arab Emirates", "Saudi Arabia", "Qatar", "Oman", "Kuwait", "Bahrain", "Jordan", "Israel"] },
  { name: "Americas", countries: ["United States", "Canada", "Mexico", "Brazil", "Argentina", "Chile", "Colombia", "Peru"] },
  { name: "Africa", countries: ["South Africa", "Kenya", "Nigeria", "Egypt", "Morocco", "Ghana", "Tanzania"] },
  { name: "Oceania", countries: ["Australia", "New Zealand", "Fiji"] },
];

export default function Coverage() {
  const [q, setQ] = useState("");
  const filtered = REGIONS.map((r) => ({
    ...r,
    countries: r.countries.filter((c) => c.toLowerCase().includes(q.toLowerCase())),
  })).filter((r) => r.countries.length > 0);
  const total = REGIONS.reduce((a, r) => a + r.countries.length, 0);

  return (
    <PublicLayout>
      <section className="mx-auto max-w-4xl px-6 py-16 space-y-8">
        <header className="text-center space-y-3">
          <Badge variant="secondary" className="mx-auto"><Globe2 className="h-3 w-3 mr-1" /> {total} countries</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Global coverage</h1>
          <p className="text-muted-foreground">From Cardiff Bay we ship to every region. Search to confirm a destination.</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Find your destination</CardTitle>
            <CardDescription>We add new lanes monthly. Don't see your country? Contact us.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search country" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <Accordion type="multiple" defaultValue={filtered.map((r) => r.name)}>
              {filtered.map((r) => (
                <AccordionItem key={r.name} value={r.name}>
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-2">
                      {r.name}
                      <Badge variant="secondary">{r.countries.length}</Badge>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                      {r.countries.map((c) => (
                        <Badge key={c} variant="outline" className="justify-start">{c}</Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>
    </PublicLayout>
  );
}
