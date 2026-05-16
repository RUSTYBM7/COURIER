import { useRoute, Link } from "wouter";
import { PublicLayout } from "@/components/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { NEWS } from "./News";
import { Share2, Copy } from "lucide-react";
import { toast } from "sonner";

export default function NewsArticle() {
  const [, params] = useRoute("/news/:slug");
  const slug = params?.slug;
  const article = NEWS.find((n) => n.slug === slug);
  if (!article) {
    return (
      <PublicLayout>
        <section className="mx-auto max-w-3xl px-6 py-24 text-center space-y-4">
          <h1 className="text-3xl font-bold">Article not found</h1>
          <p className="text-muted-foreground">We couldn't find that story.</p>
          <Button asChild><Link href="/news">Back to newsroom</Link></Button>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <section className="mx-auto max-w-3xl px-6 py-12 space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link href="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink asChild><Link href="/news">News</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>{article.title}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Card className="glass-card">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{article.tag}</Badge>
                <span className="text-xs text-muted-foreground">{article.date}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{article.title}</h1>
              <p className="text-lg text-muted-foreground">{article.excerpt}</p>
            </div>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p>
                This is the long form of the article. Airpak Express continues to invest in its Welsh
                operations, with the new Cardiff Bay hub now anchoring our European network. The
                facility links rail, road and short-haul air into a single sortation flow, supporting
                up to 80,000 parcels a day at peak.
              </p>
              <p>
                For business customers, the change means tighter cut-offs and more predictable delivery
                windows across Britain and into mainland Europe. Tracking events now flow into our
                public API in real time, so you can drive your own dashboards from the same data we use
                internally.
              </p>
              <p>
                We'll have more updates over the coming weeks as the new lanes between Cardiff,
                Berlin, Dubai, Kuala Lumpur and Sydney come fully online.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied"); }}>
                <Copy className="h-4 w-4 mr-2" /> Copy link
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </PublicLayout>
  );
}
