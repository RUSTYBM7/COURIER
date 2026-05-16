import { useState } from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/components/PublicLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, PackageSearch, CreditCard, Truck, ShieldCheck, MessagesSquare, User } from "lucide-react";

export const HELP_TOPICS = [
  { slug: "tracking-basics", icon: PackageSearch, title: "Tracking basics", desc: "How to read tracking events and ETAs." },
  { slug: "payments-and-refunds", icon: CreditCard, title: "Payments & refunds", desc: "Cards, Apple Pay, refunds and receipts." },
  { slug: "shipping-restrictions", icon: Truck, title: "Shipping restrictions", desc: "What you can and can't send abroad." },
  { slug: "insurance-and-claims", icon: ShieldCheck, title: "Insurance & claims", desc: "Cover levels and how to file a claim." },
  { slug: "messaging-support", icon: MessagesSquare, title: "Messaging support", desc: "Talk to a human within minutes." },
  { slug: "account-and-security", icon: User, title: "Account & security", desc: "Two-factor, sessions and password resets." },
];

export default function Help() {
  const [q, setQ] = useState("");
  const visible = HELP_TOPICS.filter((t) => (t.title + t.desc).toLowerCase().includes(q.toLowerCase()));

  return (
    <PublicLayout>
      <section className="mx-auto max-w-5xl px-6 py-16 space-y-8">
        <header className="text-center space-y-3">
          <Badge variant="secondary" className="mx-auto">Help centre</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">How can we help?</h1>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 h-12 rounded-2xl" placeholder="Search articles" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </header>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((t) => (
            <Link key={t.slug} href={`/help/${t.slug}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer glass-card">
                <CardHeader>
                  <t.icon className="h-6 w-6 text-primary mb-2" />
                  <CardTitle className="text-lg">{t.title}</CardTitle>
                  <CardDescription>{t.desc}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="text-sm text-primary">Browse articles →</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
