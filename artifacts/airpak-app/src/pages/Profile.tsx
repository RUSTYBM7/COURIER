import * as React from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCurrentUser } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Camera } from "lucide-react";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function Profile() {
  const { data, isLoading } = useGetCurrentUser();
  const user = data?.user ?? null;
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: "",
    },
  });

  const onSubmit = (_v: FormValues) => {
    toast.success("Profile saved");
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarPreview(URL.createObjectURL(f));
    toast.success("Avatar updated");
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your personal information and preferences.</p>
        </div>

        {isLoading ? (
          <Skeleton className="h-96 rounded-2xl" />
        ) : (
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account details</CardTitle>
                  <CardDescription>Update your name, email and phone.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={avatarPreview ?? user?.avatarUrl ?? ""} />
                      <AvatarFallback>{(user?.name ?? "U").charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
                        <Camera className="mr-2 h-4 w-4" /> Change photo
                      </Button>
                      <Input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickFile} />
                      <p className="text-xs text-muted-foreground mt-1">PNG or JPG, up to 5MB.</p>
                    </div>
                  </div>
                  <Form {...form}>
                    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                      <FormField name="name" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField name="email" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField name="phone" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <Button type="submit">Save changes</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Personalise your experience.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { id: "tracking-updates", label: "Email me tracking updates" },
                    { id: "promos", label: "Send me promotions" },
                    { id: "weekly-digest", label: "Weekly digest" },
                  ].map((p) => (
                    <div key={p.id} className="flex items-center justify-between">
                      <Label htmlFor={p.id}>{p.label}</Label>
                      <Switch id={p.id} defaultChecked />
                    </div>
                  ))}
                  <Button onClick={() => toast.success("Preferences saved")}>Save</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent activity</CardTitle>
                  <CardDescription>Last few actions on this account.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                  {["Signed in from Cardiff", "Created shipment AE-100023", "Updated password"].map((a, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <span>{a}</span>
                      <span className="text-muted-foreground text-xs">{new Date(Date.now() - i * 3600_000).toLocaleString()}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AppShell>
  );
}
