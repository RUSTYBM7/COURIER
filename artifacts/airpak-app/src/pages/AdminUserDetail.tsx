import { useRoute, Link } from "wouter";
import { AppShell } from "@/components/AppShell";
import { useAdminListUsers, useAdminListShipments } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { toast } from "sonner";

export default function AdminUserDetail() {
  const [, params] = useRoute("/admin/users/:id");
  const id = Number(params?.id);
  const { data: users, isLoading } = useAdminListUsers();
  const { data: shipments } = useAdminListShipments();
  const user = users?.find((u) => u.id === id);
  const userShipments = (shipments ?? []).filter((s) => s.userId === id);

  return (
    <AppShell>
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link href="/admin">Admin</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink asChild><Link href="/admin">Users</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>{user?.name ?? `#${id}`}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {isLoading && <Skeleton className="h-40" />}
        {user && (
          <>
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16"><AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                  <div className="flex-1">
                    <CardTitle>{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="outline" size="sm">Reset password</Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Send password reset?</AlertDialogTitle>
                      <AlertDialogDescription>The user will receive a magic link to reset their password.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => toast.success("Reset link sent")}>Send</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="destructive" size="sm">Suspend</Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Suspend this user?</AlertDialogTitle>
                      <AlertDialogDescription>They won't be able to sign in or book new shipments.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => toast.success("User suspended")}>Suspend</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>

            <Tabs defaultValue="profile">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="shipments">Shipments ({userShipments.length})</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
              </TabsList>
              <TabsContent value="profile">
                <Card>
                  <CardContent className="grid grid-cols-2 gap-4 pt-6 text-sm">
                    <div><div className="text-muted-foreground">User ID</div><div>{user.id}</div></div>
                    <div><div className="text-muted-foreground">Joined</div><div>{new Date(user.createdAt).toLocaleDateString()}</div></div>
                    <div><div className="text-muted-foreground">Email</div><div>{user.email}</div></div>
                    <div><div className="text-muted-foreground">Role</div><div className="capitalize">{user.role}</div></div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="shipments">
                <Card>
                  <CardContent className="pt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tracking #</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Route</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Cost</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userShipments.map((s) => (
                          <TableRow key={s.id}>
                            <TableCell className="font-mono">{s.trackingNumber}</TableCell>
                            <TableCell><Badge variant="secondary">{s.service}</Badge></TableCell>
                            <TableCell className="text-xs">{s.origin} → {s.destination}</TableCell>
                            <TableCell><Badge>{s.status.replace("_", " ")}</Badge></TableCell>
                            <TableCell className="text-right">£{s.costGbp.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="payments">
                <Card><CardContent className="p-6 text-sm text-muted-foreground">No standalone payments view yet.</CardContent></Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </AppShell>
  );
}
