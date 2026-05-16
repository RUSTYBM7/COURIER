import { PublicLayout } from "@/components/PublicLayout";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Truck, Globe, Zap, Package } from "lucide-react";

const features = {
  domestic: [
    { icon: Truck, title: "Nationwide reach", body: "Coverage across the UK with next-day delivery." },
    { icon: Package, title: "Flexible drop-off", body: "Drop off at any of 500+ partner locations." },
    { icon: Zap, title: "Live tracking", body: "Real-time updates from pickup to delivery." },
  ],
  international: [
    { icon: Globe, title: "200+ countries", body: "Trusted carriers around the globe." },
    { icon: Package, title: "Customs cleared", body: "We handle paperwork and duties." },
    { icon: Zap, title: "Door-to-door", body: "Single contract from origin to destination." },
  ],
  express: [
    { icon: Zap, title: "Same-day where possible", body: "Express handling on critical routes." },
    { icon: Truck, title: "Priority sorting", body: "Skip the queue at every hub." },
    { icon: Globe, title: "Time-definite", body: "Guaranteed delivery windows." },
  ],
  freight: [
    { icon: Package, title: "Full truckload", body: "Dedicated trailers for large shipments." },
    { icon: Truck, title: "LTL options", body: "Less-than-truckload for smaller pallets." },
    { icon: Globe, title: "Air & ocean", body: "Multi-modal global freight." },
  ],
} as const;

type ServiceKey = keyof typeof features;

const links: Record<ServiceKey, string> = {
  domestic: "/services/domestic",
  international: "/services/international",
  express: "/services/express",
  freight: "/services/freight",
};

export default function Services() {
  return (
    <PublicLayout>
      <section className="max-w-6xl mx-auto px-6 py-16 space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight">Services that move with you</h1>
          <p className="text-muted-foreground mt-3">Choose the right shipping option for every parcel and every route.</p>
        </div>

        <Tabs defaultValue="domestic" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-xl mx-auto">
            <TabsTrigger value="domestic">Domestic</TabsTrigger>
            <TabsTrigger value="international">International</TabsTrigger>
            <TabsTrigger value="express">Express</TabsTrigger>
            <TabsTrigger value="freight">Freight</TabsTrigger>
          </TabsList>
          {(Object.keys(features) as ServiceKey[]).map((k) => (
            <TabsContent key={k} value={k} className="pt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {features[k].map((f) => (
                  <Card key={f.title}>
                    <CardHeader>
                      <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center text-primary">
                        <f.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="mt-2">{f.title}</CardTitle>
                      <CardDescription>{f.body}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button asChild><Link href={links[k]}>Learn more about {k}</Link></Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </PublicLayout>
  );
}
