import * as React from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/EmptyState";
import { toast } from "sonner";
import { Bell, BellOff, Check, MoreHorizontal, Trash2, AtSign, ServerCog, Package } from "lucide-react";

interface Notice {
  id: string;
  category: "shipment" | "mention" | "system";
  title: string;
  body: string;
  at: string;
  read: boolean;
}

const SEED: Notice[] = [
  { id: "n1", category: "shipment", title: "Delivered", body: "AE-100023 was delivered to Manchester.", at: new Date().toISOString(), read: false },
  { id: "n2", category: "shipment", title: "Out for delivery", body: "AE-100024 is on the truck.", at: new Date(Date.now() - 3600_000).toISOString(), read: false },
  { id: "n3", category: "mention", title: "Mentioned by Sam", body: "Sam mentioned you in thread #112.", at: new Date(Date.now() - 7200_000).toISOString(), read: true },
  { id: "n4", category: "system", title: "Scheduled maintenance", body: "Routine maintenance Sunday at 02:00 UTC.", at: new Date(Date.now() - 86400_000).toISOString(), read: true },
  { id: "n5", category: "shipment", title: "Exception", body: "AE-100025 missed pickup window.", at: new Date(Date.now() - 90000_000).toISOString(), read: false },
];

const iconFor: Record<Notice["category"], React.ComponentType<{ className?: string }>> = {
  shipment: Package,
  mention: AtSign,
  system: ServerCog,
};

export default function Notifications() {
  const [items, setItems] = React.useState<Notice[]>(SEED);

  const markRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    toast.success("Marked as read");
  };
  const remove = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification removed");
  };

  const renderList = (rows: Notice[]) => {
    if (rows.length === 0) {
      return <EmptyState icon={BellOff} title="All caught up" description="No notifications in this view." />;
    }
    return (
      <ScrollArea className="h-[60vh] pr-2">
        <div className="space-y-3">
          {rows.map((n) => {
            const Icon = iconFor[n.category];
            return (
              <Card key={n.id} className={!n.read ? "border-primary/30" : ""}>
                <CardContent className="flex items-start gap-3 p-4">
                  <div className="rounded-full bg-muted p-2"><Icon className="h-4 w-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{n.title}</p>
                      {!n.read ? <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">New</Badge> : null}
                    </div>
                    <p className="text-sm text-muted-foreground">{n.body}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(n.at).toLocaleString()}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => markRead(n.id)}><Check className="mr-2 h-4 w-4" /> Mark as read</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => remove(n.id)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    );
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <p className="text-sm text-muted-foreground">Updates from your shipments and account.</p>
          </div>
          <Button variant="outline" onClick={() => { setItems((p) => p.map((n) => ({ ...n, read: true }))); toast.success("All marked as read"); }}>
            <Bell className="mr-2 h-4 w-4" /> Mark all read
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inbox</CardTitle>
            <CardDescription>{items.filter((n) => !n.read).length} unread</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="mentions">Mentions</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="pt-4">{renderList(items)}</TabsContent>
              <TabsContent value="unread" className="pt-4">{renderList(items.filter((n) => !n.read))}</TabsContent>
              <TabsContent value="mentions" className="pt-4">{renderList(items.filter((n) => n.category === "mention"))}</TabsContent>
              <TabsContent value="system" className="pt-4">{renderList(items.filter((n) => n.category === "system"))}</TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
