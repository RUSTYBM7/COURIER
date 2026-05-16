import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  domestic: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30",
  international: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
  express: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30",
  freight: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30",
};

export function ServiceBadge({ service, className }: { service: string; className?: string }) {
  return (
    <Badge variant="outline" className={cn("capitalize border", map[service] ?? "", className)}>
      {service}
    </Badge>
  );
}

export default ServiceBadge;
