import { AppShell } from "@/components/AppShell";
import { Link, useLocation } from "wouter";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const COUNTRIES = ["United Kingdom", "United States", "Germany", "France", "UAE", "Singapore", "Malaysia", "China", "Australia"];

const schema = z.object({
  label: z.string().min(1),
  name: z.string().min(1),
  street: z.string().min(1),
  city: z.string().min(1),
  postcode: z.string().min(1),
  country: z.string().min(1),
  phone: z.string().min(4),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function AddressNew() {
  const initial: Partial<FormValues> = {};
  const title = "New address";
  const description = "Add a new pickup or delivery address.";
  const [, navigate] = useLocation();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      label: initial?.label ?? "",
      name: initial?.name ?? "",
      street: initial?.street ?? "",
      city: initial?.city ?? "",
      postcode: initial?.postcode ?? "",
      country: initial?.country ?? "United Kingdom",
      phone: initial?.phone ?? "",
      notes: initial?.notes ?? "",
    },
  });

  const onSubmit = (_values: FormValues) => {
    toast.success("Address saved");
    navigate("/addresses");
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-3xl">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link href="/dashboard">Dashboard</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link href="/addresses">Addresses</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>{title}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField name="label" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Label</FormLabel><FormControl><Input placeholder="Home, Office..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="name" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Full name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="street" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Street address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
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
                <div className="flex gap-2 pt-2">
                  <Button type="submit">Save address</Button>
                  <Button asChild type="button" variant="outline"><Link href="/addresses">Cancel</Link></Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
