import { PublicLayout } from "@/components/PublicLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const RELEASES = [
  { date: "2026-05-01", title: "Airpak opens 12,000 m² Cardiff Bay super-hub", region: "UK & Europe" },
  { date: "2026-04-18", title: "Overnight Berlin line launched", region: "Europe" },
  { date: "2026-03-29", title: "Sustainability report 2025", region: "Global" },
  { date: "2026-03-10", title: "Developer API v1 reaches GA", region: "Global" },
  { date: "2026-02-22", title: "KL hangar quadruples Southeast Asia capacity", region: "Asia" },
  { date: "2026-02-04", title: "Net 30 credit launched for Welsh SMEs", region: "UK" },
  { date: "2026-01-15", title: "Storm Eira resilience report", region: "UK" },
  { date: "2026-01-04", title: "Apple-styled customer app released", region: "Global" },
];

export default function Press() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-5xl px-6 py-16 space-y-8">
        <header className="text-center space-y-3">
          <Badge variant="secondary" className="mx-auto">Press room</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">News for journalists</h1>
          <p className="text-muted-foreground">Press releases, brand assets and the press team's direct line.</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Recent releases</CardTitle>
            <CardDescription>For interview requests, contact press@airpak-express.site</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead className="text-right">PDF</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RELEASES.map((r) => (
                  <TableRow key={r.title}>
                    <TableCell className="text-muted-foreground">{r.date}</TableCell>
                    <TableCell className="font-medium">{r.title}</TableCell>
                    <TableCell><Badge variant="secondary">{r.region}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline"><Download className="h-3 w-3 mr-1" /> PDF</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </PublicLayout>
  );
}
