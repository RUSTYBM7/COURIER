import { useRoute, Link } from "wouter";
import { PublicLayout } from "@/components/PublicLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { HELP_TOPICS } from "./Help";

export default function HelpArticle() {
  const [, params] = useRoute("/help/:slug");
  const slug = params?.slug;
  const topic = HELP_TOPICS.find((t) => t.slug === slug);
  if (!topic) {
    return (
      <PublicLayout>
        <section className="mx-auto max-w-3xl px-6 py-24 text-center space-y-4">
          <h1 className="text-3xl font-bold">Article not found</h1>
          <p className="text-muted-foreground">We couldn't find that help article.</p>
          <Button asChild><Link href="/help">Back to help</Link></Button>
        </section>
      </PublicLayout>
    );
  }
  const related = HELP_TOPICS.filter((t) => t.slug !== topic.slug).slice(0, 4);

  return (
    <PublicLayout>
      <section className="mx-auto max-w-5xl px-6 py-12 space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link href="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink asChild><Link href="/help">Help</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>{topic.title}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid md:grid-cols-[1fr,260px] gap-6">
          <Card className="glass-card">
            <CardHeader>
              <Badge variant="secondary" className="w-fit">Article</Badge>
              <CardTitle className="text-3xl">{topic.title}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>{topic.desc}</p>
              <p>
                Most issues can be resolved within a few minutes. Start by checking the latest
                tracking events in your dashboard — Airpak couriers scan parcels at every hub,
                so the timeline is usually a reliable picture of what's happening.
              </p>
              <p>
                If the tracking hasn't updated for more than 24 hours, open a chat with our
                concierge team. We respond within five minutes during UK working hours and can
                escalate to the relevant local hub on your behalf.
              </p>
              <p>
                For payments and refunds, all transactions are itemised in your invoices page
                and refunds are credited to the original method within 3–5 working days.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Related</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {related.map((r) => (
                <Link key={r.slug} href={`/help/${r.slug}`}>
                  <div className="text-sm hover:text-primary cursor-pointer flex items-center gap-2">
                    <r.icon className="h-3.5 w-3.5" /> {r.title}
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
}
