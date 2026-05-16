import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = string;

const map: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  picked_up: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
  in_transit: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
  out_for_delivery: "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30",
  delivered: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  exception: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30",
  cancelled: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300 border-zinc-500/30",
};

export function ShipmentStatusBadge({ status, className }: { status: Status; className?: string }) {
  const variantClass = map[status] ?? "bg-muted text-foreground";
  return (
    <Badge variant="outline" className={cn("capitalize border", variantClass, className)}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export default ShipmentStatusBadge;
