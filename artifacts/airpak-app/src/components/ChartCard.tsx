import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  config: ChartConfig;
  className?: string;
  action?: React.ReactNode;
  children: React.ReactElement;
}

export function ChartCard({ title, description, config, className, action, children }: ChartCardProps) {
  return (
    <Card className={cn("border-none shadow-sm", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {action}
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-72 w-full">
          {children}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default ChartCard;
