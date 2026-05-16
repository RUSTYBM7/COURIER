import { useState } from "react";
import { useLocation } from "wouter";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCreateShipment, ShipmentInputService } from "@workspace/api-client-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ShipNow() {
  const [_, setLocation] = useLocation();
  const createShipment = useCreateShipment();
  
  const [formData, setFormData] = useState({
    service: "domestic" as ShipmentInputService,
    origin: "",
    destination: "",
    recipientName: "",
    recipientPhone: "",
    weightKg: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createShipment.mutate(
      {
        data: {
          ...formData,
          weightKg: Number(formData.weightKg)
        }
      },
      {
        onSuccess: (data) => {
          toast.success("Shipment booked successfully!");
          setLocation(`/payment?shipmentId=${data.id}`);
        },
        onError: (err) => {
          toast.error((err.data as { error?: string } | null)?.error ?? err.message ?? "Failed to book shipment");
        }
      }
    );
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ship Now</h1>
          <p className="text-muted-foreground mt-1">Book a new parcel or freight shipment.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="glass-card-sm border-none shadow-sm">
            <CardHeader>
              <CardTitle>Shipment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-3">
                <Label>Service Type</Label>
                <RadioGroup 
                  value={formData.service} 
                  onValueChange={(val) => setFormData({ ...formData, service: val as ShipmentInputService })}
                  className="grid grid-cols-2 gap-4"
                >
                  {[
                    { id: "domestic", label: "Domestic", desc: "1-2 business days" },
                    { id: "international", label: "International", desc: "3-5 business days" },
                    { id: "express", label: "Express", desc: "Next day delivery" },
                    { id: "freight", label: "Freight", desc: "Heavy/bulk items" }
                  ].map((srv) => (
                    <div key={srv.id}>
                      <RadioGroupItem value={srv.id} id={srv.id} className="peer sr-only" />
                      <Label
                        htmlFor={srv.id}
                        className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <span className="font-semibold">{srv.label}</span>
                        <span className="text-xs text-muted-foreground font-normal">{srv.desc}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">Origin Address</Label>
                  <Input 
                    id="origin" 
                    required 
                    placeholder="City, Country"
                    value={formData.origin}
                    onChange={(e) => setFormData({...formData, origin: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination Address</Label>
                  <Input 
                    id="destination" 
                    required 
                    placeholder="City, Country"
                    value={formData.destination}
                    onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipientName">Recipient Name</Label>
                  <Input 
                    id="recipientName" 
                    required 
                    value={formData.recipientName}
                    onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipientPhone">Recipient Phone</Label>
                  <Input 
                    id="recipientPhone" 
                    value={formData.recipientPhone}
                    onChange={(e) => setFormData({...formData, recipientPhone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weightKg">Weight (kg)</Label>
                <Input 
                  id="weightKg" 
                  type="number" 
                  step="0.1" 
                  min="0.1" 
                  required 
                  className="max-w-[200px]"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({...formData, weightKg: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                <Textarea 
                  id="notes" 
                  className="resize-none" 
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>

            </CardContent>
            <div className="p-6 pt-0 mt-4 border-t flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancel</Button>
              <Button type="submit" className="rounded-xl px-8" disabled={createShipment.isPending}>
                {createShipment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue to Payment
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </AppShell>
  );
}
