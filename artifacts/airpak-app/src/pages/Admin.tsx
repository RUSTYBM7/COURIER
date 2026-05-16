import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetAdminStats, useAdminListUsers, useAdminListShipments, useAdminSetShipmentStatus, useAdminAddTrackingEvent, ShipmentStatus } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Activity, Users, Package, PoundSterling } from "lucide-react";

export default function Admin() {
  const { data: stats } = useGetAdminStats();
  const { data: users } = useAdminListUsers();
  const { data: shipments } = useAdminListShipments();
  
  const queryClient = useQueryClient();
  const setStatus = useAdminSetShipmentStatus();
  const addEvent = useAdminAddTrackingEvent();

  // Force dark theme for admin
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    return () => {
      // Clean up on unmount, let theme provider take over
      const theme = localStorage.getItem('airpak-theme') || 'system';
      if (theme !== 'system') document.documentElement.setAttribute('data-theme', theme);
    };
  }, []);

  const [selectedShipment, setSelectedShipment] = useState<number | null>(null);
  const [actionType, setActionType] = useState<"status" | "event">("status");
  const [newStatus, setNewStatus] = useState<ShipmentStatus>("in_transit");
  const [eventMsg, setEventMsg] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventLat, setEventLat] = useState("");
  const [eventLng, setEventLng] = useState("");

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;

    if (actionType === "status") {
      setStatus.mutate(
        { id: selectedShipment, data: { status: newStatus } },
        {
          onSuccess: () => {
            toast.success("Status updated");
            queryClient.invalidateQueries({ queryKey: ["adminListShipments"] });
          }
        }
      );
    } else {
      addEvent.mutate(
        {
          id: selectedShipment,
          data: {
            status: newStatus,
            message: eventMsg,
            location: eventLocation,
            lat: Number(eventLat),
            lng: Number(eventLng)
          }
        },
        {
          onSuccess: () => {
            toast.success("Event added");
            queryClient.invalidateQueries({ queryKey: ["adminListShipments"] });
          }
        }
      );
    }
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
          <p className="text-muted-foreground mt-1">Backend operations simulation center.</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted/50 border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="shipments">Operations</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass-card-sm border-none shadow-sm bg-card/40">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.users || 0}</div>
                </CardContent>
              </Card>
              <Card className="glass-card-sm border-none shadow-sm bg-card/40">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Shipments</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.shipments || 0}</div>
                </CardContent>
              </Card>
              <Card className="glass-card-sm border-none shadow-sm bg-card/40">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Now</CardTitle>
                  <Activity className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-500">{stats?.activeNow || 0}</div>
                </CardContent>
              </Card>
              <Card className="glass-card-sm border-none shadow-sm bg-card/40">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Revenue (GBP)</CardTitle>
                  <PoundSterling className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">£{stats?.revenueGbp.toFixed(2) || "0.00"}</div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card border-none bg-card/40">
              <CardHeader>
                <CardTitle>Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.statusBreakdown.map((s) => (
                    <div key={s.status} className="flex items-center">
                      <div className="w-[140px] text-sm capitalize">{s.status.replace(/_/g, ' ')}</div>
                      <div className="flex-1 mx-4 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${(s.count / Math.max(stats.shipments, 1)) * 100}%` }}
                        />
                      </div>
                      <div className="w-10 text-right text-sm font-medium">{s.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipments">
            <Card className="glass-card border-none bg-card/40">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tracking #</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Origin → Dest</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments?.map(s => (
                    <TableRow key={s.id}>
                      <TableCell>{s.id}</TableCell>
                      <TableCell className="font-mono">{s.trackingNumber}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary capitalize">
                          {s.status.replace(/_/g, ' ')}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {s.origin} → {s.destination}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedShipment(s.id)}>Simulate</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Simulate Backend Operation</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSimulate} className="space-y-4 pt-4">
                              <div className="flex gap-4 mb-6">
                                <Button type="button" variant={actionType === 'status' ? 'default' : 'outline'} onClick={() => setActionType('status')} className="flex-1">Update Status</Button>
                                <Button type="button" variant={actionType === 'event' ? 'default' : 'outline'} onClick={() => setActionType('event')} className="flex-1">Add Location Event</Button>
                              </div>

                              <div className="space-y-2">
                                <Label>New Status</Label>
                                <Select value={newStatus} onValueChange={(v: any) => setNewStatus(v)}>
                                  <SelectTrigger><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    {Object.values(ShipmentStatus).map(st => (
                                      <SelectItem key={st} value={st} className="capitalize">{st.replace(/_/g, ' ')}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {actionType === 'event' && (
                                <>
                                  <div className="space-y-2">
                                    <Label>Message</Label>
                                    <Input required value={eventMsg} onChange={(e) => setEventMsg(e.target.value)} placeholder="e.g. Arrived at Sort Facility" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Location</Label>
                                    <Input required value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="e.g. London, UK" />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Latitude</Label>
                                      <Input required type="number" step="any" value={eventLat} onChange={(e) => setEventLat(e.target.value)} placeholder="51.5072" />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Longitude</Label>
                                      <Input required type="number" step="any" value={eventLng} onChange={(e) => setEventLng(e.target.value)} placeholder="-0.1276" />
                                    </div>
                                  </div>
                                </>
                              )}

                              <Button type="submit" className="w-full" disabled={setStatus.isPending || addEvent.isPending}>
                                Execute Operation
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="glass-card border-none bg-card/40">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map(u => (
                    <TableRow key={u.id} className="cursor-pointer hover:bg-accent/40" onClick={() => window.location.assign(`/app/admin/users/${u.id}`)}>
                      <TableCell>{u.id}</TableCell>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${u.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {u.role}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
