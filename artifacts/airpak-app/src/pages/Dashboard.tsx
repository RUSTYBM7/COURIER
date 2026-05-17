import { AppShell } from "@/components/AppShell";
import { DashboardMenu } from "@/components/DashboardMenu";
import { useGetDashboardSummary, useGetDashboardActivity, useListShipments } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Activity, CreditCard, AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: summary } = useGetDashboardSummary();
  const { data: activity } = useGetDashboardActivity();
  const { data: recentShipments } = useListShipments();

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <DashboardMenu />
        </div>

        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-card-sm border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Shipments</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summary.activeShipments}</div>
              </CardContent>
            </Card>
            <Card className="glass-card-sm border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">In Transit</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-500">{summary.inTransit}</div>
              </CardContent>
            </Card>
            <Card className="glass-card-sm border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Exceptions</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">{summary.exceptions}</div>
              </CardContent>
            </Card>
            <Card className="glass-card-sm border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">£{summary.spentGbp.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            <h2 className="text-xl font-semibold">Recent Shipments</h2>
            <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
              <div className="divide-y">
                {recentShipments?.slice(0, 5).map((shipment) => (
                  <Link key={shipment.id} href={`/tracking/${shipment.trackingNumber}`}>
                    <span className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">{shipment.trackingNumber}</p>
                        <p className="text-sm text-muted-foreground">{shipment.origin} → {shipment.destination}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                          {shipment.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </span>
                  </Link>
                ))}
                {!recentShipments?.length && (
                  <div className="p-8 text-center text-muted-foreground">
                    No recent shipments
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Activity</h2>
            <div className="bg-card rounded-2xl border shadow-sm p-4 space-y-6">
              {activity?.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="mt-1">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {!activity?.length && (
                <div className="text-center text-sm text-muted-foreground py-4">No recent activity</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
