import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShipmentStatusBadge } from "@/components/ShipmentStatusBadge";
import { MapPin, Clock } from "lucide-react";

export interface TimelineEvent {
  id: number | string;
  status: string;
  message: string;
  location: string;
  createdAt: string;
}

export function TrackingTimeline({ events, maxHeight = 360 }: { events: TimelineEvent[]; maxHeight?: number }) {
  if (!events.length) {
    return (
      <Card className="p-6 text-sm text-muted-foreground text-center">No tracking events yet.</Card>
    );
  }
  return (
    <Card className="p-2">
      <ScrollArea style={{ height: maxHeight }} className="pr-2">
        <ol className="relative ml-3 border-l border-border space-y-4 py-2">
          {events.map((ev, idx) => (
            <li key={ev.id} className="ml-4">
              <span className="absolute -left-1.5 mt-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary ring-4 ring-background" />
              <div className="flex flex-col gap-1 rounded-lg p-2 hover:bg-muted/40 transition-colors">
                <div className="flex items-center gap-2">
                  <ShipmentStatusBadge status={ev.status} />
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(ev.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm">{ev.message}</p>
                {ev.location ? (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {ev.location}
                  </p>
                ) : null}
              </div>
              {idx < events.length - 1 ? <Separator className="my-2 opacity-40" /> : null}
            </li>
          ))}
        </ol>
      </ScrollArea>
    </Card>
  );
}

export default TrackingTimeline;
