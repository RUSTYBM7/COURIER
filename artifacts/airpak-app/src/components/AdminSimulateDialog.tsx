import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  useAdminSetShipmentStatus,
  useAdminAddTrackingEvent,
  ShipmentStatus,
} from "@workspace/api-client-react";

interface Props {
  shipmentId: number;
  trigger?: React.ReactNode;
}

export function AdminSimulateDialog({ shipmentId, trigger }: Props) {
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState<ShipmentStatus>(ShipmentStatus.in_transit);
  const [message, setMessage] = React.useState("");
  const [location, setLocation] = React.useState("");

  const setStatusMut = useAdminSetShipmentStatus();
  const addEventMut = useAdminAddTrackingEvent();

  const submitStatus = () => {
    setStatusMut.mutate(
      { id: shipmentId, data: { status } },
      {
        onSuccess: () => {
          toast.success("Shipment status updated");
          setOpen(false);
        },
        onError: () => toast.error("Failed to update status"),
      }
    );
  };

  const submitEvent = () => {
    addEventMut.mutate(
      {
        id: shipmentId,
        data: {
          status,
          message,
          location,
          lat: 51.5,
          lng: -0.12,
        },
      },
      {
        onSuccess: () => {
          toast.success("Tracking event added");
          setOpen(false);
        },
        onError: () => toast.error("Failed to add event"),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <Button variant="outline">Simulate</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Simulate shipment</DialogTitle>
          <DialogDescription>Update status or push a tracking event.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="status">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="status">Set status</TabsTrigger>
            <TabsTrigger value="event">Add event</TabsTrigger>
          </TabsList>
          <TabsContent value="status" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as ShipmentStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ShipmentStatus).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button onClick={submitStatus} disabled={setStatusMut.isPending}>
                {setStatusMut.isPending ? "Saving..." : "Save status"}
              </Button>
            </DialogFooter>
          </TabsContent>
          <TabsContent value="event" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as ShipmentStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ShipmentStatus).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Arrived at hub" />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="London, UK" />
            </div>
            <DialogFooter>
              <Button onClick={submitEvent} disabled={addEventMut.isPending}>
                {addEventMut.isPending ? "Adding..." : "Add event"}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default AdminSimulateDialog;
