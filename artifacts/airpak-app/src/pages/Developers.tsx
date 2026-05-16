import { PublicLayout } from "@/components/PublicLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code2, Webhook, Boxes } from "lucide-react";

const SAMPLE_REST = `curl https://api.airpak-express.com/v1/shipments \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "service": "express",
    "origin": "Cardiff, UK",
    "destination": "Berlin, DE",
    "recipientName": "Lena Schmidt",
    "weightKg": 2.4
  }'`;

const SAMPLE_WEBHOOK = `POST https://your-app.com/airpak/webhook
Signature: sha256=...

{
  "type": "shipment.status_changed",
  "data": {
    "trackingNumber": "AP1A2B3C4D",
    "status": "out_for_delivery"
  }
}`;

const SAMPLE_SDK = `import { Airpak } from "@airpak/sdk";
const airpak = new Airpak({ apiKey: process.env.AIRPAK_KEY });

const shipment = await airpak.shipments.create({
  service: "express",
  origin: "Cardiff, UK",
  destination: "Berlin, DE",
  recipientName: "Lena Schmidt",
  weightKg: 2.4,
});`;

function Code({ children }: { children: string }) {
  return (
    <pre className="rounded-xl bg-muted/60 border p-4 text-sm overflow-x-auto font-mono leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

export default function Developers() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-5xl px-6 py-16 space-y-8">
        <header className="text-center space-y-3">
          <Badge variant="secondary" className="mx-auto"><Code2 className="h-3 w-3 mr-1" /> v1 API</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Airpak for developers</h1>
          <p className="text-muted-foreground">Quote, book, track and reconcile shipments — all over HTTPS.</p>
          <div className="flex justify-center gap-3 pt-2">
            <Button>Get an API key</Button>
            <Button variant="outline">OpenAPI spec</Button>
          </div>
        </header>

        <Tabs defaultValue="rest" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="rest"><Code2 className="h-4 w-4 mr-1" /> REST</TabsTrigger>
            <TabsTrigger value="webhooks"><Webhook className="h-4 w-4 mr-1" /> Webhooks</TabsTrigger>
            <TabsTrigger value="sdks"><Boxes className="h-4 w-4 mr-1" /> SDKs</TabsTrigger>
          </TabsList>
          <TabsContent value="rest">
            <Card>
              <CardHeader>
                <CardTitle>Create a shipment</CardTitle>
                <CardDescription>POST /v1/shipments — returns a tracking number you can hand to your end users.</CardDescription>
              </CardHeader>
              <CardContent><Code>{SAMPLE_REST}</Code></CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="webhooks">
            <Card>
              <CardHeader>
                <CardTitle>Receive status updates</CardTitle>
                <CardDescription>Subscribe to shipment.* events and verify the signature header.</CardDescription>
              </CardHeader>
              <CardContent><Code>{SAMPLE_WEBHOOK}</Code></CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="sdks">
            <Card>
              <CardHeader>
                <CardTitle>Official SDKs</CardTitle>
                <CardDescription>Node.js, Python, PHP and Ruby. Type-safe, idempotent and retry-aware.</CardDescription>
              </CardHeader>
              <CardContent><Code>{SAMPLE_SDK}</Code></CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </PublicLayout>
  );
}
