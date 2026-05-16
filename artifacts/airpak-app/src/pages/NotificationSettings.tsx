import * as React from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Item { id: string; label: string; description?: string; }

const groups: { title: string; items: Item[] }[] = [
  {
    title: "Shipment updates",
    items: [
      { id: "ship-created", label: "Shipment created", description: "Email when a new shipment is booked." },
      { id: "ship-in-transit", label: "In transit updates" },
      { id: "ship-delivered", label: "Delivery confirmation" },
      { id: "ship-exception", label: "Delivery exceptions" },
    ],
  },
  {
    title: "Marketing",
    items: [
      { id: "mkt-promos", label: "Promotions and offers" },
      { id: "mkt-news", label: "Product news" },
    ],
  },
  {
    title: "Billing",
    items: [
      { id: "bill-invoice", label: "New invoice issued" },
      { id: "bill-overdue", label: "Overdue reminders" },
    ],
  },
  {
    title: "System",
    items: [
      { id: "sys-maintenance", label: "Scheduled maintenance" },
      { id: "sys-security", label: "Security alerts" },
    ],
  },
];

export default function NotificationSettings() {
  const [state, setState] = React.useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    groups.forEach((g) => g.items.forEach((i) => { init[i.id] = i.id !== "mkt-promos"; }));
    return init;
  });

  const set = (id: string, v: boolean) => setState((s) => ({ ...s, [id]: v }));

  return (
    <AppShell>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notification settings</h1>
          <p className="text-sm text-muted-foreground">Choose what we email you about.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {groups.map((g) => (
            <Card key={g.title}>
              <CardHeader>
                <CardTitle>{g.title}</CardTitle>
                <CardDescription>{g.items.length} preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {g.items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <Label htmlFor={it.id} className="font-medium">{it.label}</Label>
                      {it.description ? <p className="text-xs text-muted-foreground mt-0.5">{it.description}</p> : null}
                    </div>
                    <Switch id={it.id} checked={state[it.id]} onCheckedChange={(v) => set(it.id, v)} />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={() => toast.success("Notification preferences saved")}>Save preferences</Button>
        </div>
      </div>
    </AppShell>
  );
}
