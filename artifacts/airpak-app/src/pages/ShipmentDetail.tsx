import { useParams, Link } from "wouter";
import { AppShell } from "@/components/AppShell";
import { useGetShipment, useListShipmentEvents } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShipmentStatusBadge } from "@/components/ShipmentStatusBadge";
import { ServiceBadge } from "@/components/ServiceBadge";
import { TrackingMap } from "@/components/TrackingMap";
import { TrackingTimeline } from "@/components/TrackingTimeline";
import { EmptyState } from "@/components/EmptyState";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  AlertCircle,
  Download,
  Mail,
  MoreHorizontal,
  Printer,
  Share2,
  Tag,
  Truck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function ShipmentDetail() {
  const params = useParams<{ id: string }>();
  const idNum = Number(params.id);
  const validId = Number.isFinite(idNum) && idNum > 0;

  const shipmentQ = useGetShipment(validId ? idNum : 0, { query: { enabled: validId } as never });
  const eventsQ = useListShipmentEvents(validId ? idNum : 0, { query: { enabled: validId } as never });

  const shipment = shipmentQ.data;
  const events = eventsQ.data ?? [];
  const latest = events[events.length - 1] ?? shipment?.latestEvent ?? null;
  const lat = latest?.lat ?? 51.4816;
  const lng = latest?.lng ?? -3.1791;

  const handleCopy = () => {
    if (!shipment) return;
    void navigator.clipboard.writeText(`${window.location.origin}/tracking/${shipment.trackingNumber}`);
    toast.success("Tracking link copied");
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Shipment</h1>
            <p className="text-sm text-muted-foreground">
              {shipment ? shipment.trackingNumber : "Loading..."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="mr-2 h-4 w-4" /> Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Manage</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast.success("Label sent to printer")}>
                  <Printer className="mr-2 h-4 w-4" /> Print label
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success("PDF download started")}>
                  <Download className="mr-2 h-4 w-4" /> Download PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopy}>
                  <Share2 className="mr-2 h-4 w-4" /> Share tracking link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success("Email notification sent")}>
                  <Mail className="mr-2 h-4 w-4" /> Notify recipient
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <XCircle className="mr-2 h-4 w-4" /> Cancel shipment
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel this shipment?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will request cancellation. Charges already incurred may not be refunded.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep shipment</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => toast.success("Cancellation request submitted")}
                  >
                    Cancel shipment
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {shipmentQ.isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="lg:col-span-1 h-96 rounded-2xl" />
            <Skeleton className="lg:col-span-2 h-96 rounded-2xl" />
          </div>
        ) : shipmentQ.isError || !shipment ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Could not load shipment</AlertTitle>
            <AlertDescription>
              {shipmentQ.error?.message ?? "Shipment not found or unavailable."}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-4 w-4" /> Details
                </CardTitle>
                <CardDescription>{shipment.trackingNumber}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <ShipmentStatusBadge status={shipment.status} />
                  <ServiceBadge service={shipment.service} />
                </div>
                <Separator />
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="documents">Docs</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="pt-4 space-y-3 text-sm">
                    <Row label="Origin" value={shipment.origin} />
                    <Row label="Destination" value={shipment.destination} />
                    <Row label="Recipient" value={shipment.recipientName} />
                    <Row label="Phone" value={shipment.recipientPhone ?? "—"} />
                    <Row label="Weight" value={`${shipment.weightKg} kg`} />
                    <Row label="Cost" value={`£${shipment.costGbp.toFixed(2)}`} />
                    <Row
                      label="ETA"
                      value={shipment.eta ? new Date(shipment.eta).toLocaleString() : "—"}
                    />
                  </TabsContent>
                  <TabsContent value="timeline" className="pt-4">
                    {events.length === 0 ? (
                      <EmptyState title="No events" description="Tracking events will appear here." />
                    ) : (
                      <ul className="space-y-2 text-sm">
                        {events.map((ev) => (
                          <li key={ev.id} className="flex items-center justify-between">
                            <span className="capitalize">{ev.status.replace(/_/g, " ")}</span>
                            <span className="text-muted-foreground text-xs">
                              {new Date(ev.createdAt).toLocaleString()}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </TabsContent>
                  <TabsContent value="documents" className="pt-4">
                    <EmptyState
                      icon={Tag}
                      title="No documents"
                      description="Shipping label and invoice will appear here once generated."
                    >
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/shipments/${shipment.id}/label`}>Generate label</Link>
                      </Button>
                    </EmptyState>
                  </TabsContent>
                  <TabsContent value="activity" className="pt-4 text-sm text-muted-foreground">
                    Activity log will show user actions and system events.
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
              <TrackingMap lat={lat} lng={lng} label={shipment.trackingNumber} className="h-80" />
              <TrackingTimeline
                events={events.map((e) => ({
                  id: e.id,
                  status: e.status,
                  message: e.message,
                  location: e.location,
                  createdAt: e.createdAt,
                }))}
              />
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
