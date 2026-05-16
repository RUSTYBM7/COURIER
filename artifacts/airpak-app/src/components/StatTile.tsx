import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

interface StatTileProps {
  title: string;
  value: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: number;
  trendLabel?: string;
  className?: string;
}

export function StatTile({ title, value, icon: Icon, trend, trendLabel, className }: StatTileProps) {
  const isUp = (trend ?? 0) >= 0;
  return (
    <Card className={cn("glass-card-sm border-none shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {trend !== undefined ? (
          <div className={cn("mt-1 inline-flex items-center gap-1 text-xs", isUp ? "text-emerald-600" : "text-red-600")}>
            {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>
              {isUp ? "+" : ""}
              {trend}%{trendLabel ? ` ${trendLabel}` : ""}
            </span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default StatTile;
