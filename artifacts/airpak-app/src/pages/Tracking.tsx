import { useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useTrackByNumber, useGetCurrentUser } from "@workspace/api-client-react";
import { AppShell } from "@/components/AppShell";
import { PublicLayout } from "@/components/PublicLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { Search, MapPin, Package, Calendar } from "lucide-react";

// Fix leaflet icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function TrackingView({ trackingNumber }: { trackingNumber?: string }) {
  const [searchQuery, setSearchQuery] = useState(trackingNumber || "");
  const [_, setLocation] = useLocation();
  const { data, isLoading, error } = useTrackByNumber(trackingNumber || "", {
    query: {
      enabled: !!trackingNumber,
      queryKey: ["trackByNumber", trackingNumber],
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/tracking/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const coordinates = data?.events.filter(e => e.lat && e.lng).map(e => [e.lat, e.lng] as [number, number]) || [];
  const latestEvent = data?.events[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-card p-6 rounded-2xl border shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter tracking number..."
              className="pl-10 h-12 text-lg"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 px-8 rounded-xl">Track</Button>
        </form>
      </div>

      {isLoading && <div className="text-center py-12">Loading...</div>}
      
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-center">
          Tracking number not found or error occurred.
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-2xl border overflow-hidden shadow-sm h-[400px]">
              {coordinates.length > 0 ? (
                <MapContainer 
                  center={coordinates[0]} 
                  zoom={5} 
                  style={{ height: "100%", width: "100%", zIndex: 0 }}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  />
                  {coordinates.map((coord, i) => (
                    <Marker key={i} position={coord}>
                      <Popup>{data.events[i].location}</Popup>
                    </Marker>
                  ))}
                  {coordinates.length > 1 && (
                    <Polyline positions={coordinates} color="#E11D2A" weight={3} dashArray="5, 10" />
                  )}
                </MapContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted/20">
                  <span className="text-muted-foreground">Map data unavailable</span>
                </div>
              )}
            </div>

            <div className="bg-card rounded-2xl border shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-6">Tracking History</h3>
              <div className="space-y-6">
                {data.events.map((event, i) => (
                  <div key={event.id} className="flex gap-4 relative">
                    {i !== data.events.length - 1 && (
                      <div className="absolute left-2.5 top-6 bottom-[-24px] w-px bg-border" />
                    )}
                    <div className="relative z-10 mt-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${i === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted border'}`}>
                        <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-white' : 'bg-muted-foreground'}`} />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{event.message}</p>
                      <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(event.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-2xl border shadow-sm p-6 space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${data.shipment.status === 'delivered' ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}`} />
                  <p className="text-xl font-bold capitalize">{data.shipment.status.replace(/_/g, ' ')}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
                <p className="font-medium">{data.shipment.trackingNumber}</p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-1">Service</p>
                <p className="font-medium capitalize">{data.shipment.service} Shipping</p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-1">Route</p>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                    <span className="font-medium">{data.shipment.origin}</span>
                  </div>
                  <div className="w-0.5 h-4 bg-border ml-1" />
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="font-medium">{data.shipment.destination}</span>
                  </div>
                </div>
              </div>

              {data.shipment.eta && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
                  <p className="font-medium">{new Date(data.shipment.eta).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Tracking() {
  const { id } = useParams();
  const { data: auth, isLoading } = useGetCurrentUser();
  
  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  if (auth?.user) {
    return (
      <AppShell>
        <TrackingView trackingNumber={id} />
      </AppShell>
    );
  }

  return (
    <PublicLayout>
      <div className="p-6 py-12 md:py-24">
        <TrackingView trackingNumber={id} />
      </div>
    </PublicLayout>
  );
}
