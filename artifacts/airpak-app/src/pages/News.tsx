import { useState } from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export const NEWS = [
  { slug: "cardiff-bay-hub-opens", title: "Airpak opens new Cardiff Bay super-hub", date: "2026-05-01", tag: "Company", excerpt: "A 12,000 m² automated sortation centre comes online in Wales, halving lead times to Europe." },
  { slug: "berlin-night-line", title: "Overnight line launched to Berlin", date: "2026-04-18", tag: "Network", excerpt: "Cardiff to Berlin door-to-door next morning, six nights a week." },
  { slug: "carbon-neutral-2030", title: "On track for carbon-neutral by 2030", date: "2026-03-29", tag: "Sustainability", excerpt: "Sustainability report 2025 shows a 38% drop in scope 1 emissions year on year." },
  { slug: "api-v1-ga", title: "Developer API v1 reaches GA", date: "2026-03-10", tag: "Product", excerpt: "Stable endpoints, signed webhooks and official SDKs in Node, Python, PHP and Ruby." },
  { slug: "kuala-lumpur-expansion", title: "New KL hangar quadruples Southeast Asia capacity", date: "2026-02-22", tag: "Network", excerpt: "More frequencies between London, KL and Sydney." },
  { slug: "sme-credit-line", title: "Net 30 credit available for SMEs", date: "2026-02-04", tag: "Business", excerpt: "Welsh SMEs can apply for instant Net 30 credit lines up to £25,000." },
  { slug: "winter-resilience", title: "Storm Eira: full network resilience held", date: "2026-01-15", tag: "Operations", excerpt: "Only 0.6% of UK shipments delayed during one of Wales' worst winter storms." },
  { slug: "apple-design-app", title: "All-new Apple-styled customer app", date: "2026-01-04", tag: "Product", excerpt: "iOS 26 design language across web and mobile, with live tracking maps." },
];

export default function News() {
  const [page, setPage] = useState(1);
  const perPage = 6;
  const pages = Math.ceil(NEWS.length / perPage);
  const visible = NEWS.slice((page - 1) * perPage, page * perPage);

  return (
    <PublicLayout>
      <section className="mx-auto max-w-6xl px-6 py-16 space-y-8">
        <header className="text-center space-y-3">
          <Badge variant="secondary" className="mx-auto">Newsroom</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Latest from Airpak</h1>
          <p className="text-muted-foreground">Network expansions, product launches and the occasional storm story.</p>
        </header>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((n) => (
            <Link key={n.slug} href={`/news/${n.slug}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer glass-card">
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{n.tag}</Badge>
                    <span className="text-xs text-muted-foreground">{n.date}</span>
                  </div>
                  <CardTitle className="text-lg">{n.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{n.excerpt}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }} />
            </PaginationItem>
            {Array.from({ length: pages }).map((_, i) => (
              <PaginationItem key={i}>
                <button
                  className={`px-3 py-1 rounded-md text-sm ${page === i + 1 ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(pages, p + 1)); }} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
    </PublicLayout>
  );
}
