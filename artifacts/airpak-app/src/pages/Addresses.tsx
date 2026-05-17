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

const COUNTRIES = [
  "United Kingdom", "Ireland", "France", "Germany", "Netherlands", "Spain", "Italy", "Portugal", "Sweden",
  "United States", "Canada", "Mexico", "Brazil",
  "UAE", "Saudi Arabia", "Turkey", "Israel", "South Africa",
  "China", "Hong Kong", "Japan", "South Korea", "Singapore", "Malaysia", "Indonesia", "Thailand", "Vietnam", "India",
  "Australia", "New Zealand",
] as const;

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
  // United Kingdom
  { id: "a1",  label: "Home",       name: "Jane Smith",       street: "10 Riverside Walk",              city: "Cardiff",     postcode: "CF10 5AL",  country: "United Kingdom",  phone: "+44 29 2011 3344" },
  { id: "a2",  label: "Office",     name: "Airpak Ltd",       street: "120 Bishopsgate",                city: "London",      postcode: "EC2N 4AG",  country: "United Kingdom",  phone: "+44 20 7946 0123" },
  { id: "a3",  label: "Warehouse",  name: "Northern Hub",     street: "Unit 4, Trafford Park",          city: "Manchester",  postcode: "M17 1WT",   country: "United Kingdom",  phone: "+44 161 555 0199" },
  { id: "a4",  label: "Studio",     name: "Aoife O'Connor",   street: "42 Grafton Street",              city: "Dublin",      postcode: "D02 X285",  country: "Ireland",         phone: "+353 1 555 0144" },
  // Europe
  { id: "a5",  label: "Paris HQ",   name: "Émilie Laurent",   street: "18 Rue de Rivoli",               city: "Paris",       postcode: "75004",     country: "France",          phone: "+33 1 42 33 4455" },
  { id: "a6",  label: "Berlin Lab", name: "Lukas Becker",     street: "Friedrichstraße 90",             city: "Berlin",      postcode: "10117",     country: "Germany",         phone: "+49 30 5550 8821" },
  { id: "a7",  label: "Amsterdam",  name: "Sanne de Vries",   street: "Herengracht 502",                city: "Amsterdam",   postcode: "1017 CB",   country: "Netherlands",     phone: "+31 20 555 0173" },
  { id: "a8",  label: "Madrid",     name: "Carlos Ramírez",   street: "Calle de Alcalá 21",             city: "Madrid",      postcode: "28014",     country: "Spain",           phone: "+34 91 555 0019" },
  { id: "a9",  label: "Milan",      name: "Giulia Rossi",     street: "Via Montenapoleone 8",           city: "Milan",       postcode: "20121",     country: "Italy",           phone: "+39 02 5550 1188" },
  // Americas
  { id: "a10", label: "NY Office",  name: "Michael Brooks",   street: "350 5th Ave, Suite 4200",        city: "New York",    postcode: "10118",     country: "United States",   phone: "+1 212 555 0173" },
  { id: "a11", label: "SF Hub",     name: "Priya Patel",      street: "535 Mission St, Floor 14",       city: "San Francisco", postcode: "94105",   country: "United States",   phone: "+1 415 555 0102" },
  { id: "a12", label: "Toronto",    name: "Liam Tremblay",    street: "200 Bay St, Suite 3800",         city: "Toronto",     postcode: "M5J 2J3",   country: "Canada",          phone: "+1 416 555 0145" },
  { id: "a13", label: "CDMX",       name: "Sofía Hernández",  street: "Av. Paseo de la Reforma 250",    city: "Mexico City", postcode: "06600",     country: "Mexico",          phone: "+52 55 5555 0167" },
  { id: "a14", label: "São Paulo",  name: "Rafael Oliveira",  street: "Av. Paulista 1578",              city: "São Paulo",   postcode: "01310-200", country: "Brazil",          phone: "+55 11 5555 0123" },
  // Middle East / Africa
  { id: "a15", label: "Dubai HQ",   name: "Omar Al-Farsi",    street: "Sheikh Zayed Rd, Tower 1, 38F",  city: "Dubai",       postcode: "00000",     country: "UAE",             phone: "+971 4 555 0188" },
  { id: "a16", label: "Riyadh",     name: "Layla Al-Saud",    street: "King Fahd Rd, Olaya District",   city: "Riyadh",      postcode: "12244",     country: "Saudi Arabia",    phone: "+966 11 555 0199" },
  { id: "a17", label: "Istanbul",   name: "Mehmet Yılmaz",    street: "Bağdat Caddesi 142",             city: "Istanbul",    postcode: "34728",     country: "Turkey",          phone: "+90 216 555 0144" },
  { id: "a18", label: "Cape Town",  name: "Naledi Mokoena",   street: "12 Long Street",                 city: "Cape Town",   postcode: "8001",      country: "South Africa",    phone: "+27 21 555 0177" },
  // Asia-Pacific
  { id: "a19", label: "Shanghai",   name: "Wei Chen",         street: "1376 Nanjing West Rd, Jing'an",  city: "Shanghai",    postcode: "200040",    country: "China",           phone: "+86 21 5555 0123" },
  { id: "a20", label: "HK Office",  name: "Karen Wong",       street: "8 Connaught Pl, Central",        city: "Hong Kong",   postcode: "00000",     country: "Hong Kong",       phone: "+852 5555 0144" },
  { id: "a21", label: "Tokyo",      name: "Haruto Tanaka",    street: "Marunouchi 2-7-2, Chiyoda",      city: "Tokyo",       postcode: "100-0005",  country: "Japan",           phone: "+81 3 5555 0188" },
  { id: "a22", label: "Seoul",      name: "Min-jun Park",     street: "Gangnam-daero 396",              city: "Seoul",       postcode: "06236",     country: "South Korea",     phone: "+82 2 5555 0199" },
  { id: "a23", label: "Singapore",  name: "Aisha Lim",        street: "1 Raffles Place, Tower 1, #44",  city: "Singapore",   postcode: "048616",    country: "Singapore",       phone: "+65 6555 0123" },
  { id: "a24", label: "KL Office",  name: "Aiman bin Ismail", street: "Jalan Ampang, KLCC Suite 22-8",  city: "Kuala Lumpur", postcode: "50088",    country: "Malaysia",        phone: "+60 3 5555 0144" },
  { id: "a25", label: "Bangkok",    name: "Niran Suwan",      street: "Sukhumvit Rd, Soi 21, Floor 30", city: "Bangkok",     postcode: "10110",     country: "Thailand",        phone: "+66 2 555 0177" },
  { id: "a26", label: "Mumbai",     name: "Ananya Iyer",      street: "Bandra Kurla Complex, Tower 2",  city: "Mumbai",      postcode: "400051",    country: "India",           phone: "+91 22 5555 0188" },
  { id: "a27", label: "Sydney",     name: "Olivia Bennett",   street: "1 Martin Place, Level 25",       city: "Sydney",      postcode: "2000",      country: "Australia",       phone: "+61 2 5555 0173" },
  { id: "a28", label: "Auckland",   name: "James Walker",     street: "23 Customs Street East",         city: "Auckland",    postcode: "1010",      country: "New Zealand",     phone: "+64 9 555 0144" },
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
