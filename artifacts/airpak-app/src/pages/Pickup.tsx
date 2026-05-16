import * as React from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { CheckCircle2, CalendarClock } from "lucide-react";

const SLOTS = ["08:00 – 10:00", "10:00 – 12:00", "12:00 – 14:00", "14:00 – 16:00", "16:00 – 18:00"];
const ADDRESSES = [
  { id: "a1", label: "Home — Cardiff CF10 5AL" },
  { id: "a2", label: "Office — London EC2N 4AG" },
  { id: "a3", label: "Warehouse — Manchester M17 1WT" },
];

export default function Pickup() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [slot, setSlot] = React.useState(SLOTS[1]);
  const [address, setAddress] = React.useState(ADDRESSES[0].id);
  const [notes, setNotes] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const confirm = () => {
    setOpen(false);
    toast.success("Pickup scheduled", {
      description: `${date?.toLocaleDateString()} · ${slot}`,
    });
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Schedule a pickup</h1>
          <p className="text-sm text-muted-foreground">A courier will collect your parcels at the selected time.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CalendarClock className="h-4 w-4" /> Date</CardTitle>
              <CardDescription>Select a pickup day.</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Pickup details</CardTitle>
              <CardDescription>Confirm slot, address and notes for the driver.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Time slot</Label>
                <RadioGroup value={slot} onValueChange={setSlot} className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SLOTS.map((s) => (
                    <Label key={s} className="flex items-center gap-2 border rounded-md p-3 cursor-pointer hover:bg-accent">
                      <RadioGroupItem value={s} />
                      <span className="text-sm">{s}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Pickup address</Label>
                <Select value={address} onValueChange={setAddress}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{ADDRESSES.map((a) => <SelectItem key={a.id} value={a.id}>{a.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notes for driver</Label>
                <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Buzzer code, parking instructions..." />
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={() => setOpen(true)} disabled={!date}>Schedule pickup</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Confirm pickup
              </DialogTitle>
              <DialogDescription>
                {date?.toLocaleDateString()} between {slot} at {ADDRESSES.find((a) => a.id === address)?.label}.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>Edit</Button>
              <Button onClick={confirm}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
