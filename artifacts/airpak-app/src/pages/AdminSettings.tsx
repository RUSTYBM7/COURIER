import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function AdminSettings() {
  const [autoNotify, setAutoNotify] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  const [rate, setRate] = useState("1.2");
  const [base, setBase] = useState("5.99");

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Admin settings</h1>
          <p className="text-sm text-muted-foreground">Network-wide configuration.</p>
        </div>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="danger">Danger zone</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Operational toggles</CardTitle>
                <CardDescription>Affect every customer immediately.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Auto-notify customers</Label>
                    <p className="text-sm text-muted-foreground">Send email + push on every tracking event.</p>
                  </div>
                  <Switch checked={autoNotify} onCheckedChange={setAutoNotify} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Maintenance mode</Label>
                    <p className="text-sm text-muted-foreground">Redirect customers to the maintenance page.</p>
                  </div>
                  <Switch checked={maintenance} onCheckedChange={setMaintenance} />
                </div>
                <Button onClick={() => toast.success("Settings saved")}>Save</Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Domestic pricing</CardTitle>
                <CardDescription>Adjust base and per-kg rates.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Base (£)</Label><Input value={base} onChange={(e) => setBase(e.target.value)} /></div>
                <div className="space-y-2"><Label>Per kg (£)</Label><Input value={rate} onChange={(e) => setRate(e.target.value)} /></div>
                <Button onClick={() => toast.success("Pricing updated")} className="col-span-2 w-fit">Update pricing</Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="danger">
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Danger zone</CardTitle>
                <CardDescription>Irreversible network actions.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={() => toast.error("Demo only — disabled")}>
                  Purge demo data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
