import * as React from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApplePayCard } from "@/components/ApplePayCard";
import { toast } from "sonner";
import { Apple, Building2, CreditCard, Plus, Smartphone } from "lucide-react";

export default function Wallet() {
  const [open, setOpen] = React.useState(false);
  const budget = 1500;
  const spent = 920;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Wallet</h1>
            <p className="text-sm text-muted-foreground">Manage payment methods and budgets.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Add method</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add payment method</DialogTitle>
                <DialogDescription>Choose how you'd like to pay.</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="card">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="card"><CreditCard className="mr-1 h-4 w-4" /> Card</TabsTrigger>
                  <TabsTrigger value="bank"><Building2 className="mr-1 h-4 w-4" /> Bank</TabsTrigger>
                  <TabsTrigger value="applepay"><Apple className="mr-1 h-4 w-4" /> Apple</TabsTrigger>
                  <TabsTrigger value="googlepay"><Smartphone className="mr-1 h-4 w-4" /> Google</TabsTrigger>
                </TabsList>
                <TabsContent value="card" className="space-y-3 pt-4">
                  <Label>Card number</Label>
                  <Input placeholder="4242 4242 4242 4242" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2"><Label>Expiry</Label><Input placeholder="MM/YY" /></div>
                    <div className="space-y-2"><Label>CVC</Label><Input placeholder="123" /></div>
                  </div>
                </TabsContent>
                <TabsContent value="bank" className="space-y-3 pt-4">
                  <Label>Account number</Label>
                  <Input placeholder="0000 0000" />
                  <Label>Sort code</Label>
                  <Input placeholder="00-00-00" />
                </TabsContent>
                <TabsContent value="applepay" className="pt-4 text-sm text-muted-foreground">
                  Open the Apple Pay flow on your device to connect.
                </TabsContent>
                <TabsContent value="googlepay" className="pt-4 text-sm text-muted-foreground">
                  Open the Google Pay flow on your device to connect.
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => { setOpen(false); toast.success("Payment method added"); }}>Add method</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ApplePayCard brand="applepay" last4="0024" holder="Jane Smith" />
            <ApplePayCard brand="googlepay" last4="7781" holder="Jane Smith" />
            <ApplePayCard brand="card" last4="4242" holder="Jane Smith" />
            <ApplePayCard brand="bank" last4="1156" holder="Airpak Ltd" />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Monthly budget</CardTitle>
              <CardDescription>£{spent.toFixed(2)} of £{budget.toFixed(2)} spent.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Progress value={(spent / budget) * 100} />
              <p className="text-xs text-muted-foreground">Resets on the 1st of every month.</p>
              <Button variant="outline" className="w-full" onClick={() => toast.info("Budget editor coming soon")}>Edit budget</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
