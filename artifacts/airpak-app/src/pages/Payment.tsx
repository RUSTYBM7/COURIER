import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCreatePayment, useGetShipment, PaymentInputMethod } from "@workspace/api-client-react";
import { toast } from "sonner";
import { Loader2, CreditCard, Smartphone, Building } from "lucide-react";

export default function Payment() {
  const [location, setLocation] = useLocation();
  const [method, setMethod] = useState<PaymentInputMethod>("card");
  const [isSuccess, setIsSuccess] = useState(false);

  // Extract shipmentId from URL search params
  const searchParams = new URLSearchParams(window.location.search);
  const shipmentIdParam = searchParams.get("shipmentId");
  const shipmentId = shipmentIdParam ? parseInt(shipmentIdParam, 10) : 0;

  const { data: shipment, isLoading: loadingShipment } = useGetShipment(shipmentId, {
    query: {
      enabled: !!shipmentId,
      queryKey: ["getShipment", shipmentId]
    }
  });

  const createPayment = useCreatePayment();

  // Redirect if no valid shipment id
  useEffect(() => {
    if (!shipmentIdParam && !isSuccess) {
      setLocation("/dashboard");
    }
  }, [shipmentIdParam, setLocation, isSuccess]);

  const handlePay = () => {
    if (!shipment) return;
    
    createPayment.mutate(
      {
        data: {
          shipmentId,
          amountGbp: shipment.costGbp,
          method
        }
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          toast.success("Payment successful!");
        },
        onError: (err) => {
          toast.error((err.data as { error?: string } | null)?.error ?? err.message ?? "Payment failed");
        }
      }
    );
  };

  if (isSuccess) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto mt-12">
          <Card className="glass-card border-none shadow-xl text-center py-8">
            <CardHeader>
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <CardTitle className="text-2xl">Payment Successful</CardTitle>
              <CardDescription>Your shipment has been booked and paid for.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-xl text-left mb-6">
                <p className="text-sm text-muted-foreground">Tracking Number</p>
                <p className="font-bold text-lg">{shipment?.trackingNumber}</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full rounded-full" onClick={() => setLocation(`/tracking/${shipment?.trackingNumber}`)}>
                Track Shipment
              </Button>
              <Button variant="outline" className="w-full rounded-full" onClick={() => setLocation("/dashboard")}>
                Return to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-md mx-auto mt-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          <p className="text-muted-foreground mt-1">Complete your shipment booking.</p>
        </div>

        {loadingShipment ? (
          <div className="p-8 text-center text-muted-foreground">Loading details...</div>
        ) : shipment ? (
          <>
            <Card className="glass-card-sm border-none shadow-sm">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium capitalize">{shipment.service}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">Destination</span>
                  <span className="font-medium truncate max-w-[200px]">{shipment.destination}</span>
                </div>
                <div className="pt-4 border-t flex justify-between items-center">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-2xl">£{shipment.costGbp.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Payment Method</Label>
              <RadioGroup value={method} onValueChange={(v) => setMethod(v as PaymentInputMethod)} className="space-y-3">
                <div className="flex items-center space-x-2 border p-4 rounded-xl hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex-1 flex items-center gap-3 cursor-pointer">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    Credit / Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-xl hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="applepay" id="applepay" />
                  <Label htmlFor="applepay" className="flex-1 flex items-center gap-3 cursor-pointer">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    Apple Pay
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-xl hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="flex-1 flex items-center gap-3 cursor-pointer">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    Bank Transfer
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              className="w-full h-14 text-lg rounded-xl" 
              onClick={handlePay}
              disabled={createPayment.isPending}
            >
              {createPayment.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Pay £{shipment.costGbp.toFixed(2)}
            </Button>
          </>
        ) : (
          <div className="p-8 text-center text-destructive">Failed to load shipment details.</div>
        )}
      </div>
    </AppShell>
  );
}
