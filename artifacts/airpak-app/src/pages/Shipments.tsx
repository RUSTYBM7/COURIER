import { useState } from "react";
import { Link } from "wouter";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListShipments, ShipmentStatus } from "@workspace/api-client-react";
import { Search, MapPin } from "lucide-react";

export default function Shipments() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const { data: shipments, isLoading } = useListShipments({
    status: statusFilter !== "all" ? (statusFilter as ShipmentStatus) : undefined
  });

  const filteredShipments = shipments?.filter(s => 
    s.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.recipientName.toLowerCase().includes(search.toLowerCase()) ||
    s.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
          <Link href="/shipnow">
            <Button className="rounded-full">Book New Shipment</Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search tracking, recipient, or destination..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.values(ShipmentStatus).map(status => (
                <SelectItem key={status} value={status}>
                  <span className="capitalize">{status.replace(/_/g, ' ')}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Tracking Number</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Service</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell>
                </TableRow>
              )}
              {filteredShipments?.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell className="font-medium">{shipment.trackingNumber}</TableCell>
                  <TableCell>{shipment.recipientName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {shipment.destination}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                      {shipment.status.replace(/_/g, ' ')}
                    </span>
                  </TableCell>
                  <TableCell className="capitalize">{shipment.service}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/tracking/${shipment.trackingNumber}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && filteredShipments?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No shipments found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppShell>
  );
}
