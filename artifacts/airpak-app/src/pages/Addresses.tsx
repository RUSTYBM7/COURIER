import * as React from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MapPin, Plus, Trash2, Pencil, Building2 } from "lucide-react";
import { Link } from "wouter";

const COUNTRIES = ["United Kingdom", "United States", "Germany", "France", "UAE", "Singapore", "Malaysia", "China", "Australia"] as const;

export interface Address {
  id: string;
  label: string;
  name: string;
  street: string;
  city: string;
  postcode: string;
  country: string;
  phone: string;
  notes?: string;
}

const SEED: Address[] = [
  { id: "a1", label: "Home", name: "Jane Smith", street: "10 Riverside Walk", city: "Cardiff", postcode: "CF10 5AL", country: "United Kingdom", phone: "+44 29 2011 3344" },
  { id: "a2", label: "Office", name: "Airpak Ltd", street: "120 Bishopsgate", city: "London", postcode: "EC2N 4AG", country: "United Kingdom", phone: "+44 20 7946 0123" },
  { id: "a3", label: "Warehouse", name: "Northern Hub", street: "Unit 4, Trafford Park", city: "Manchester", postcode: "M17 1WT", country: "United Kingdom", phone: "+44 161 555 0199" },
];

const schema = z.object({
  label: z.string().min(1, "Required"),
  name: z.string().min(1, "Required"),
  street: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  postcode: z.string().min(1, "Required"),
  country: z.string().min(1, "Required"),
  phone: z.string().min(4, "Required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function Addresses() {
  const [items, setItems] = React.useState<Address[]>(SEED);
  const [open, setOpen] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      label: "",
      name: "",
      street: "",
      city: "",
      postcode: "",
      country: "United Kingdom",
      phone: "",
      notes: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    const id = "a" + Date.now();
    setItems((prev) => [...prev, { id, ...values }]);
    toast.success("Address saved");
    form.reset();
    setOpen(false);
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
    toast.success("Address removed");
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Address book</h1>
            <p className="text-sm text-muted-foreground">Manage saved pickup and delivery addresses.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/addresses/new">
                <Plus className="mr-2 h-4 w-4" /> Full form
              </Link>
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add address
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>New address</SheetTitle>
                  <SheetDescription>Add a saved address to your book.</SheetDescription>
                </SheetHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <FormField name="label" control={form.control} render={({ field }) => (
                      <FormItem><FormLabel>Label</FormLabel><FormControl><Input placeholder="Home" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField name="name" control={form.control} render={({ field }) => (
                      <FormItem><FormLabel>Recipient</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField name="street" control={form.control} render={({ field }) => (
                      <FormItem><FormLabel>Street</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-3">
                      <FormField name="city" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField name="postcode" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Postcode</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                    <FormField name="country" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Country" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>{COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField name="phone" control={form.control} render={({ field }) => (
                      <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField name="notes" control={form.control} render={({ field }) => (
                      <FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <SheetFooter>
                      <SheetClose asChild><Button variant="ghost" type="button">Cancel</Button></SheetClose>
                      <Button type="submit">Save address</Button>
                    </SheetFooter>
                  </form>
                </Form>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No saved addresses"
            description="Add an address to speed up future shipments."
            actionLabel="Add address"
            onAction={() => setOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((a) => (
              <HoverCard key={a.id} openDelay={150}>
                <HoverCardTrigger asChild>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{a.label}</CardTitle>
                        <Badge variant="outline" className="capitalize">{a.country}</Badge>
                      </div>
                      <CardDescription>{a.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm text-muted-foreground">
                      <p className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5" /> {a.street}, {a.city} {a.postcode}</p>
                      <p>{a.phone}</p>
                      <div className="mt-3 flex gap-2">
                        <Button asChild size="sm" variant="outline" className="h-8">
                          <Link href={`/addresses/${a.id}`}><Pencil className="mr-1 h-3.5 w-3.5" /> Edit</Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="h-8 text-red-600 hover:text-red-700">
                              <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete address?</AlertDialogTitle>
                              <AlertDialogDescription>This will permanently remove "{a.label}".</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => remove(a.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                </HoverCardTrigger>
                <HoverCardContent className="w-72 text-sm">
                  <p className="font-semibold">{a.name}</p>
                  <p className="text-muted-foreground">{a.street}</p>
                  <p className="text-muted-foreground">{a.city} {a.postcode}, {a.country}</p>
                  <p className="text-muted-foreground mt-2">{a.phone}</p>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
