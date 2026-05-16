import { useState } from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, MapPin } from "lucide-react";

const JOBS = [
  { title: "Operations Lead", dept: "Operations", location: "Cardiff Bay", type: "Full-time" },
  { title: "Senior Backend Engineer", dept: "Engineering", location: "Cardiff Bay / Remote UK", type: "Full-time" },
  { title: "Customer Concierge", dept: "Support", location: "Cardiff Bay", type: "Full-time" },
  { title: "Courier (HGV C+E)", dept: "Operations", location: "Cardiff Bay", type: "Full-time" },
  { title: "Product Designer", dept: "Design", location: "Remote EU", type: "Full-time" },
  { title: "Customs Broker", dept: "Compliance", location: "Cardiff Bay", type: "Full-time" },
  { title: "Account Executive", dept: "Sales", location: "London", type: "Full-time" },
  { title: "Data Analyst", dept: "Analytics", location: "Cardiff Bay / Remote UK", type: "Full-time" },
];

const DEPTS = ["All", "Operations", "Engineering", "Support", "Design", "Compliance", "Sales", "Analytics"];

export default function Careers() {
  const [dept, setDept] = useState("All");
  const filtered = dept === "All" ? JOBS : JOBS.filter((j) => j.dept === dept);

  return (
    <PublicLayout>
      <section className="mx-auto max-w-5xl px-6 py-16 space-y-8">
        <header className="text-center space-y-3">
          <Badge variant="secondary" className="mx-auto"><Briefcase className="h-3 w-3 mr-1" /> {JOBS.length} open roles</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Build the future of logistics in Wales.</h1>
          <p className="text-muted-foreground">We hire kind people with strong opinions, loosely held.</p>
        </header>
        <div className="flex justify-end">
          <Select value={dept} onValueChange={setDept}>
            <SelectTrigger className="w-[220px]"><SelectValue placeholder="Department" /></SelectTrigger>
            <SelectContent>
              {DEPTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((j) => (
            <Card key={j.title} className="glass-card">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">{j.title}</CardTitle>
                    <CardDescription className="flex items-center gap-3 mt-1">
                      <Badge variant="secondary">{j.dept}</Badge>
                      <span className="flex items-center gap-1 text-xs"><MapPin className="h-3 w-3" /> {j.location}</span>
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{j.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">View role</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
