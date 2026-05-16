import { AppShell } from "@/components/AppShell";
import { useGetAdminStats } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const STATUS_COLORS: Record<string, string> = {
  pending: "var(--muted-foreground)",
  picked_up: "var(--primary)",
  in_transit: "var(--primary)",
  out_for_delivery: "#f59e0b",
  delivered: "#10b981",
  exception: "#ef4444",
};

export default function AdminReports() {
  const { data, isLoading } = useGetAdminStats();

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground">Network performance at a glance.</p>
        </div>
        {isLoading && <Skeleton className="h-96" />}
        {data && (
          <Tabs defaultValue="revenue">
            <TabsList>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="status">Status mix</TabsTrigger>
              <TabsTrigger value="trend">Trend</TabsTrigger>
            </TabsList>
            <TabsContent value="revenue">
              <Card>
                <CardHeader>
                  <CardTitle>Daily revenue (last 7 days)</CardTitle>
                  <CardDescription>Total: £{data.revenueGbp.toFixed(2)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{ amountGbp: { label: "Revenue (£)", color: "var(--primary)" } }} className="h-[320px] w-full">
                    <BarChart data={data.recentRevenue}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="day" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="amountGbp" fill="var(--color-amountGbp)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="status">
              <Card>
                <CardHeader>
                  <CardTitle>Shipment status mix</CardTitle>
                  <CardDescription>{data.shipments} shipments tracked.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[320px] w-full">
                    <PieChart>
                      <Pie data={data.statusBreakdown} dataKey="count" nameKey="status" innerRadius={60} outerRadius={110} paddingAngle={3}>
                        {data.statusBreakdown.map((s) => (
                          <Cell key={s.status} fill={STATUS_COLORS[s.status] ?? "var(--muted)"} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="trend">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue trend</CardTitle>
                  <CardDescription>Smoothed line view.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{ amountGbp: { label: "Revenue (£)", color: "var(--primary)" } }} className="h-[320px] w-full">
                    <LineChart data={data.recentRevenue}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="day" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="amountGbp" stroke="var(--color-amountGbp)" strokeWidth={2.5} dot={{ r: 3 }} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AppShell>
  );
}
