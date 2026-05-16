import * as React from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Laptop, Smartphone, ShieldCheck } from "lucide-react";

const schema = z.object({
  current: z.string().min(6, "Min 6 characters"),
  next: z.string().min(8, "Min 8 characters"),
  confirm: z.string().min(8, "Min 8 characters"),
}).refine((v) => v.next === v.confirm, { message: "Passwords do not match", path: ["confirm"] });

type FormValues = z.infer<typeof schema>;

interface Session { id: string; device: string; location: string; lastSeen: string; current?: boolean; }

const SESSIONS: Session[] = [
  { id: "s1", device: "Chrome on macOS", location: "Cardiff, UK", lastSeen: new Date().toISOString(), current: true },
  { id: "s2", device: "Safari on iPhone", location: "London, UK", lastSeen: new Date(Date.now() - 3600_000).toISOString() },
  { id: "s3", device: "Firefox on Windows", location: "Berlin, DE", lastSeen: new Date(Date.now() - 86400_000).toISOString() },
];

interface Device { id: string; name: string; type: "laptop" | "phone"; trusted: boolean; }

const DEVICES: Device[] = [
  { id: "d1", name: "MacBook Pro", type: "laptop", trusted: true },
  { id: "d2", name: "iPhone 15", type: "phone", trusted: true },
];

export default function SecuritySettings() {
  const [revoke, setRevoke] = React.useState<Session | null>(null);
  const [twoFa, setTwoFa] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { current: "", next: "", confirm: "" },
  });

  const onSave = (_v: FormValues) => {
    toast.success("Password changed");
    form.reset();
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Security</h1>
          <p className="text-sm text-muted-foreground">Manage your password, sessions, and 2FA.</p>
        </div>

        <Tabs defaultValue="password">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="2fa">2FA</TabsTrigger>
          </TabsList>

          <TabsContent value="password" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Change password</CardTitle>
                <CardDescription>Use a strong, unique password.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form className="space-y-4 max-w-md" onSubmit={form.handleSubmit(onSave)}>
                    <FormField name="current" control={form.control} render={({ field }) => (
                      <FormItem><FormLabel>Current password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField name="next" control={form.control} render={({ field }) => (
                      <FormItem><FormLabel>New password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField name="confirm" control={form.control} render={({ field }) => (
                      <FormItem><FormLabel>Confirm new password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="submit">Update password</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Active sessions</CardTitle>
                <CardDescription>Revoke any session you don't recognise.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Last seen</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SESSIONS.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>{s.device} {s.current ? <Badge variant="outline" className="ml-2">Current</Badge> : null}</TableCell>
                        <TableCell>{s.location}</TableCell>
                        <TableCell>{new Date(s.lastSeen).toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" disabled={s.current} onClick={() => setRevoke(s)}>Revoke</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Dialog open={!!revoke} onOpenChange={(o) => !o && setRevoke(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Revoke session?</DialogTitle>
                  <DialogDescription>Sign out {revoke?.device} ({revoke?.location}).</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setRevoke(null)}>Cancel</Button>
                  <Button onClick={() => { toast.success("Session revoked"); setRevoke(null); }}>Revoke</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="devices" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Trusted devices</CardTitle>
                <CardDescription>Devices we won't prompt for verification on.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {DEVICES.map((d) => (
                  <div key={d.id} className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-3">
                      {d.type === "laptop" ? <Laptop className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
                      <span className="font-medium">{d.name}</span>
                      {d.trusted ? <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30">Trusted</Badge> : null}
                    </div>
                    <Button size="sm" variant="outline" onClick={() => toast.success("Device removed")}>Remove</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="2fa" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Two-factor authentication</CardTitle>
                <CardDescription>Require a one-time code in addition to your password.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <Label htmlFor="2fa">Enable 2FA</Label>
                <Switch id="2fa" checked={twoFa} onCheckedChange={(v) => { setTwoFa(v); toast.success(v ? "2FA enabled" : "2FA disabled"); }} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
