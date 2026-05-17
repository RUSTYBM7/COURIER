import { useParams, useLocation } from "wouter";
import { useState } from "react";
import { useTrackByNumber, useGetCurrentUser } from "@workspace/api-client-react";
import { AppShell } from "@/components/AppShell";
import { PublicLayout } from "@/components/PublicLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from "react-leaflet";
import L from "leaflet";
import { useTheme } from "@/components/theme-provider";
import {
  Search,
  MapPin,
  Package,
  Clock,
  Navigation,
  Plus,
  Minus,
  Locate,
  ChevronUp,
  Truck,
} from "lucide-react";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function TrackingView({ trackingNumber }: { trackingNumber?: string }) {
  const [searchQuery, setSearchQuery] = useState(trackingNumber || "");
  const [, setLocation] = useLocation();
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const { theme } = useTheme();
  const { data, isLoading, error } = useTrackByNumber(trackingNumber || "", {
    query: { enabled: !!trackingNumber, queryKey: ["trackByNumber", trackingNumber] },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/tracking/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const coordinates =
    data?.events.filter((e) => e.lat && e.lng).map((e) => [e.lat, e.lng] as [number, number]) ||
    [];
  const center = coordinates[0] ?? ([51.5074, -0.1278] as [number, number]);

  const tileUrl =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/voyager/{z}/{x}/{y}{r}.png";

  // Empty / search-only state
  if (!trackingNumber) {
    return (
      <div className="relative h-[calc(100vh-3.5rem-1px)] -m-4 md:-m-8 overflow-hidden bg-[#e6e3df] dark:bg-[#1c1c1e]">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: "100%", width: "100%", zIndex: 0 }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer url={tileUrl} />
        </MapContainer>
        <SearchPill
          query={searchQuery}
          setQuery={setSearchQuery}
          onSubmit={handleSearch}
          placeholder="Search tracking number"
        />
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-3.5rem-1px)] -m-4 md:-m-8 overflow-hidden bg-[#e6e3df] dark:bg-[#1c1c1e]">
      {/* Map */}
      <MapContainer
        center={center}
        zoom={5}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url={tileUrl} />
        {coordinates.length > 1 && (
          <Polyline
            positions={coordinates}
            pathOptions={{
              color: "#CD2727",
              weight: 4,
              opacity: 0.9,
              lineCap: "round",
            }}
          />
        )}
        {coordinates.map((coord, i) => (
          <CircleMarker
            key={`c-${i}`}
            center={coord}
            radius={i === 0 ? 9 : 5}
            pathOptions={{
              color: "#ffffff",
              fillColor: i === 0 ? "#CD2727" : "#0a84ff",
              fillOpacity: 1,
              weight: 3,
            }}
          />
        ))}
        {coordinates.length > 0 && (
          <Marker position={coordinates[0]}>
            <Popup>{data?.events[0]?.location}</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Search pill */}
      <SearchPill
        query={searchQuery}
        setQuery={setSearchQuery}
        onSubmit={handleSearch}
        placeholder="Search tracking number"
      />

      {/* Floating map controls (right) */}
      <div className="absolute right-3 top-24 z-[1000] flex flex-col gap-2">
        <MapButton><Plus className="h-4 w-4" /></MapButton>
        <MapButton><Minus className="h-4 w-4" /></MapButton>
        <MapButton><Locate className="h-4 w-4" /></MapButton>
      </div>

      {/* Loading/Error overlays */}
      {isLoading && (
        <Card className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] rounded-2xl bg-white/85 dark:bg-[#1c1c1e]/85 backdrop-blur-xl border border-white/40 px-5 py-3 text-sm shadow-2xl">
          Locating shipment…
        </Card>
      )}
      {error && (
        <Card className="absolute left-1/2 top-24 -translate-x-1/2 z-[1000] rounded-2xl bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur-xl border border-red-500/30 px-5 py-3 text-sm text-red-600 shadow-2xl">
          Tracking number not found.
        </Card>
      )}

      {/* Bottom sheet — iOS Maps style */}
      {data && (
        <div
          className={`absolute left-0 right-0 bottom-0 z-[1000] transition-all duration-300 ease-out ${
            sheetExpanded ? "h-[65vh]" : "h-[230px]"
          }`}
        >
          <div className="mx-auto max-w-3xl h-full rounded-t-[20px] bg-white/85 dark:bg-[#1c1c1e]/90 backdrop-blur-2xl border-t border-white/40 shadow-[0_-12px_40px_rgba(0,0,0,0.18)] overflow-hidden">
            <button
              onClick={() => setSheetExpanded((v) => !v)}
              className="w-full pt-2 pb-1.5 grid place-items-center"
              aria-label="Toggle details"
            >
              <span className="h-1.5 w-9 rounded-full bg-black/20 dark:bg-white/30" />
            </button>

            <div className="px-5 pb-5 h-full overflow-y-auto">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                    {data.shipment.service} shipping
                  </div>
                  <h2 className="text-[22px] font-bold tracking-tight text-[#1d1d1f] dark:text-white truncate">
                    {data.shipment.trackingNumber}
                  </h2>
                </div>
                <Badge
                  className={`rounded-full ${
                    data.shipment.status === "delivered"
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                      : "bg-[#0a84ff]/15 text-[#0a84ff]"
                  } border-0 capitalize`}
                >
                  {data.shipment.status.replace(/_/g, " ")}
                </Badge>
              </div>

              {/* Route summary */}
              <div className="mt-4 flex items-center gap-3 bg-black/[0.03] dark:bg-white/[0.05] rounded-2xl p-3">
                <Endpoint label="From" value={data.shipment.origin} dotClass="bg-muted-foreground" />
                <Navigation className="h-4 w-4 text-muted-foreground shrink-0" />
                <Endpoint label="To" value={data.shipment.destination} dotClass="bg-[#CD2727]" align="right" />
              </div>

              {/* Quick actions */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <ActionPill icon={<Navigation className="h-4 w-4" />} label="Directions" />
                <ActionPill icon={<Truck className="h-4 w-4" />} label="Courier" />
                <ActionPill icon={<Package className="h-4 w-4" />} label="Details" />
              </div>

              {!sheetExpanded && (
                <button
                  onClick={() => setSheetExpanded(true)}
                  className="mt-3 w-full flex items-center justify-center gap-1 text-[13px] font-medium text-[#0a84ff]"
                >
                  Show history <ChevronUp className="h-3.5 w-3.5" />
                </button>
              )}

              {sheetExpanded && (
                <div className="mt-5">
                  <h3 className="text-[15px] font-semibold mb-3 text-[#1d1d1f] dark:text-white">
                    History
                  </h3>
                  <div className="relative pl-5">
                    <div className="absolute left-[7px] top-1 bottom-1 w-px bg-black/10 dark:bg-white/15" />
                    {data.events.map((event, i) => (
                      <div key={event.id} className="relative pb-5 last:pb-0">
                        <span
                          className={`absolute -left-5 top-0.5 grid place-items-center w-[15px] h-[15px] rounded-full ${
                            i === 0
                              ? "bg-[#CD2727] ring-4 ring-[#CD2727]/15"
                              : "bg-white dark:bg-[#1c1c1e] border-2 border-black/20 dark:border-white/25"
                          }`}
                        />
                        <p className="text-[14px] font-medium text-[#1d1d1f] dark:text-white leading-tight">
                          {event.message}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted-foreground">
                          {event.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {event.location}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />{" "}
                            {new Date(event.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SearchPill({
  query,
  setQuery,
  onSubmit,
  placeholder,
}: {
  query: string;
  setQuery: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder: string;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] w-[min(560px,calc(100%-24px))]"
    >
      <div className="flex items-center gap-2 bg-white/85 dark:bg-[#1c1c1e]/85 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] px-2 py-1.5">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 h-9 border-0 bg-transparent focus-visible:ring-0 px-1 text-[15px]"
        />
        <Button
          type="submit"
          size="sm"
          className="rounded-xl h-9 px-4 bg-[#0a84ff] hover:bg-[#0a84ff]/90"
        >
          Track
        </Button>
      </div>
    </form>
  );
}

function MapButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="h-9 w-9 grid place-items-center rounded-xl bg-white/85 dark:bg-[#1c1c1e]/85 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow text-[#1d1d1f] dark:text-white hover:bg-white">
      {children}
    </button>
  );
}

function Endpoint({
  label,
  value,
  dotClass,
  align = "left",
}: {
  label: string;
  value: string;
  dotClass: string;
  align?: "left" | "right";
}) {
  return (
    <div className={`flex-1 min-w-0 ${align === "right" ? "text-right" : ""}`}>
      <div className={`flex items-center gap-1.5 ${align === "right" ? "justify-end" : ""}`}>
        <span className={`h-2 w-2 rounded-full ${dotClass}`} />
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          {label}
        </span>
      </div>
      <div className="text-[14px] font-semibold truncate text-[#1d1d1f] dark:text-white">
        {value}
      </div>
    </div>
  );
}

function ActionPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] text-[#0a84ff] transition-colors">
      {icon}
      <span className="text-[11px] font-semibold">{label}</span>
    </button>
  );
}

export default function Tracking() {
  const { id } = useParams();
  const { data: auth, isLoading } = useGetCurrentUser();

  if (isLoading) return <div className="p-8 text-center">Loading…</div>;

  if (auth?.user) {
    return (
      <AppShell>
        <TrackingView trackingNumber={id} />
      </AppShell>
    );
  }

  return (
    <PublicLayout>
      <div className="p-0">
        <TrackingView trackingNumber={id} />
      </div>
    </PublicLayout>
  );
}
