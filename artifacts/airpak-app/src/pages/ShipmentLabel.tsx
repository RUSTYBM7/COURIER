import { useParams, Link } from "wouter";
import { AppShell } from "@/components/AppShell";
import { useGetShipment } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShipmentStatusBadge } from "@/components/ShipmentStatusBadge";
import { ServiceBadge } from "@/components/ServiceBadge";
import { AlertCircle, ArrowLeft, Printer } from "lucide-react";

export default function ShipmentLabel() {
  const params = useParams<{ id: string }>();
  const idNum = Number(params.id);
  const valid = Number.isFinite(idNum) && idNum > 0;
  const { data, isLoading, isError, error } = useGetShipment(valid ? idNum : 0, {
    query: { enabled: valid } as never,
  });

  return (
    <AppShell>
      <div className="space-y-4 print:space-y-0">
        <div className="flex items-center justify-between print:hidden">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/shipments/${params.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to shipment
            </Link>
          </Button>
          <Button onClick={() => window.print()} size="sm">
            <Printer className="mr-2 h-4 w-4" /> Print label
          </Button>
        </div>

        {isLoading ? (
          <Skeleton className="h-96 w-full max-w-2xl mx-auto rounded-2xl" />
        ) : isError || !data ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Could not load shipment</AlertTitle>
            <AlertDescription>{error?.message ?? "Not found"}</AlertDescription>
          </Alert>
        ) : (
          <Card className="mx-auto max-w-2xl border-2 border-foreground/80 print:border-black print:shadow-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">AIRPAK EXPRESS</CardTitle>
                <p className="text-xs text-muted-foreground">Shipping Label</p>
              </div>
              <div className="text-right">
                <ServiceBadge service={data.service} />
                <div className="mt-1">
                  <ShipmentStatusBadge status={data.status} />
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-6 pt-6 text-sm">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">From</p>
                  <p className="font-semibold mt-1">{data.origin}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground">To</p>
                  <p className="font-semibold mt-1">{data.recipientName}</p>
                  <p className="text-muted-foreground">{data.destination}</p>
                  {data.recipientPhone ? (
                    <p className="text-muted-foreground">{data.recipientPhone}</p>
                  ) : null}
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Weight</p>
                  <p className="text-lg font-semibold mt-1">{data.weightKg} kg</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Cost</p>
                  <p className="text-lg font-semibold mt-1">£{data.costGbp.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground">ETA</p>
                  <p className="text-lg font-semibold mt-1">
                    {data.eta ? new Date(data.eta).toLocaleDateString() : "—"}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs uppercase text-muted-foreground">Tracking number</p>
                <div className="rounded-md bg-foreground p-4 text-center">
                  <div
                    className="mx-auto h-16 w-full max-w-md"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, #fff 0, #fff 2px, transparent 2px, transparent 4px, #fff 4px, #fff 7px, transparent 7px, transparent 9px)",
                    }}
                    aria-label="barcode"
                  />
                </div>
                <p className="text-center text-lg font-mono tracking-widest">
                  {data.trackingNumber}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
