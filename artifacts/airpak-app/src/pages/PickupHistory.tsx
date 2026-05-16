import * as React from "react";
import { AppShell } from "@/components/AppShell";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ArrowUpDown } from "lucide-react";

interface Row {
  id: string;
  date: string;
  slot: string;
  address: string;
  status: "scheduled" | "completed" | "missed" | "cancelled";
  parcels: number;
}

const SEED: Row[] = Array.from({ length: 23 }).map((_, i) => ({
  id: "PU-" + (1000 + i),
  date: new Date(Date.now() - i * 86400000).toISOString(),
  slot: ["08:00 – 10:00", "10:00 – 12:00", "14:00 – 16:00"][i % 3],
  address: ["Cardiff CF10 5AL", "London EC2N 4AG", "Manchester M17 1WT"][i % 3],
  status: (["completed", "scheduled", "missed", "cancelled"] as const)[i % 4],
  parcels: (i % 5) + 1,
}));

const statusColor: Record<Row["status"], string> = {
  scheduled: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  completed: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  missed: "bg-red-500/15 text-red-700 border-red-500/30",
  cancelled: "bg-zinc-500/15 text-zinc-700 border-zinc-500/30",
};

export default function PickupHistory() {
  const [sortKey, setSortKey] = React.useState<keyof Row>("date");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc");
  const [page, setPage] = React.useState(1);
  const perPage = 8;

  const sorted = React.useMemo(() => {
    const copy = [...SEED];
    copy.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / perPage);
  const pageRows = sorted.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (key: keyof Row) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pickup history</h1>
          <p className="text-sm text-muted-foreground">All scheduled and past pickups.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pickups</CardTitle>
            <CardDescription>Click a column to sort.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => toggleSort("id")}>
                      ID <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => toggleSort("date")}>
                      Date <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Slot</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => toggleSort("status")}>
                      Status <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Parcels</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                    <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                    <TableCell>{r.slot}</TableCell>
                    <TableCell>{r.address}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColor[r.status] + " capitalize"}>{r.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{r.parcels}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={page === i + 1}
                        onClick={(e) => { e.preventDefault(); setPage(i + 1); }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
