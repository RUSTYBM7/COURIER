import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Truck } from "lucide-react";

type Courier = { id: number; name: string; hub: string; online: boolean; jobs: number };

const SEED: Courier[] = [
  { id: 1, name: "Owain Davies", hub: "Cardiff Bay", online: true, jobs: 14 },
  { id: 2, name: "Megan Hughes", hub: "Cardiff Bay", online: true, jobs: 9 },
  { id: 3, name: "Rhys Pritchard", hub: "London", online: false, jobs: 0 },
  { id: 4, name: "Lena Schmidt", hub: "Berlin", online: true, jobs: 6 },
  { id: 5, name: "Yusuf Hassan", hub: "Dubai", online: true, jobs: 11 },
  { id: 6, name: "Wei Zhang", hub: "Shanghai", online: false, jobs: 0 },
];

export default function AdminCouriers() {
  const [list, setList] = useState<Courier[]>(SEED);
  const [name, setName] = useState("");
  const [hub, setHub] = useState("Cardiff Bay");

  function add() {
    if (!name.trim()) return;
    setList((l) => [...l, { id: Math.max(...l.map((x) => x.id)) + 1, name, hub, online: true, jobs: 0 }]);
    setName("");
    toast.success("Courier added");
  }
  function remove(id: number) {
    setList((l) => l.filter((x) => x.id !== id));
    toast.success("Courier removed");
  }

  return (
    <AppShell>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5 text-primary" /> Couriers</CardTitle>
            <CardDescription>Active drivers across the network.</CardDescription>
          </div>
          <Sheet>
            <SheetTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Add courier</Button></SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>New courier</SheetTitle>
                <SheetDescription>Onboard a new driver to a hub.</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2"><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Cooper" /></div>
                <div className="space-y-2">
                  <Label>Home hub</Label>
                  <Select value={hub} onValueChange={setHub}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Cardiff Bay", "London", "Berlin", "Dubai", "Singapore", "Kuala Lumpur", "Shanghai", "New York", "Sydney"].map((h) => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild><Button onClick={add}>Save</Button></SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Hub</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Jobs today</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.hub}</TableCell>
                  <TableCell>
                    <Badge variant={c.online ? "default" : "secondary"}>
                      <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${c.online ? "bg-green-400" : "bg-muted-foreground"}`} />
                      {c.online ? "Online" : "Offline"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{c.jobs}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="ghost" size="sm">Remove</Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove {c.name}?</AlertDialogTitle>
                          <AlertDialogDescription>They will lose access to the courier app immediately.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => remove(c.id)}>Remove</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppShell>
  );
}
