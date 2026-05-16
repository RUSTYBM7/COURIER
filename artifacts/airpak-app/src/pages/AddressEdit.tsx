import { useParams, Link, useLocation } from "wouter";
import { AppShell } from "@/components/AppShell";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";

const SEED: Record<string, { label: string; name: string; street: string; city: string; postcode: string; country: string; phone: string }> = {
  a1: { label: "Home", name: "Jane Smith", street: "10 Riverside Walk", city: "Cardiff", postcode: "CF10 5AL", country: "United Kingdom", phone: "+44 29 2011 3344" },
  a2: { label: "Office", name: "Airpak Ltd", street: "120 Bishopsgate", city: "London", postcode: "EC2N 4AG", country: "United Kingdom", phone: "+44 20 7946 0123" },
  a3: { label: "Warehouse", name: "Northern Hub", street: "Unit 4, Trafford Park", city: "Manchester", postcode: "M17 1WT", country: "United Kingdom", phone: "+44 161 555 0199" },
};

export default function AddressEdit() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const initial = SEED[params.id] ?? { label: "", name: "", street: "", city: "", postcode: "", country: "United Kingdom", phone: "" };
  const [form, setForm] = useState(initial);

  function save(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Address updated");
    navigate("/addresses");
  }

  return (
    <AppShell>
      <div className="space-y-6 max-w-3xl">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link href="/addresses">Addresses</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Edit "{initial.label || params.id}"</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Card>
          <CardHeader>
            <CardTitle>Edit address</CardTitle>
            <CardDescription>Update details and save changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={save} className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2"><Label>Label</Label><Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} /></div>
              <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Street</Label><Textarea value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} /></div>
              <div className="space-y-2"><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
              <div className="space-y-2"><Label>Postcode</Label><Input value={form.postcode} onChange={(e) => setForm({ ...form, postcode: e.target.value })} /></div>
              <div className="space-y-2 md:col-span-2">
                <Label>Country</Label>
                <Select value={form.country} onValueChange={(v) => setForm({ ...form, country: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["United Kingdom", "Germany", "France", "Spain", "United States", "United Arab Emirates", "Singapore", "Malaysia", "China", "Australia"].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 flex gap-2 justify-end">
                <Button type="button" variant="outline" asChild><Link href="/addresses">Cancel</Link></Button>
                <Button type="submit">Save changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
