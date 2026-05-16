import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const iconUrl =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 32' width='32' height='40'><path fill='#E11D2A' d='M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z'/><circle cx='12' cy='12' r='5' fill='white'/></svg>`
  );

const markerIcon = L.icon({
  iconUrl,
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -36],
});

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

export function TrackingMap({
  lat,
  lng,
  label,
  zoom = 5,
  className,
}: {
  lat: number;
  lng: number;
  label?: string;
  zoom?: number;
  className?: string;
}) {
  return (
    <div
      className={
        "relative w-full overflow-hidden rounded-2xl border bg-card " + (className ?? "h-80")
      }
    >
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={markerIcon}>
          {label ? <Popup>{label}</Popup> : null}
        </Marker>
        <Recenter lat={lat} lng={lng} />
      </MapContainer>
    </div>
  );
}

export default TrackingMap;
