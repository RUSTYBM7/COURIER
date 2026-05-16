import * as React from "react";
import { Link } from "wouter";
import { AppShell } from "@/components/AppShell";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { EmptyState } from "@/components/EmptyState";
import { toast } from "sonner";
import { ArrowUpDown, Download, FileText } from "lucide-react";

interface Invoice {
  id: string;
  number: string;
  date: string;
  customer: string;
  amount: number;
  status: "paid" | "due" | "overdue" | "draft";
}

const SEED: Invoice[] = Array.from({ length: 24 }).map((_, i) => ({
  id: "inv-" + i,
  number: "INV-" + (2024000 + i),
  date: new Date(Date.now() - i * 86400000 * 2).toISOString(),
  customer: ["Acme Ltd", "Northwind", "Globex", "Initech"][i % 4],
  amount: Math.round((50 + i * 17.5) * 100) / 100,
  status: (["paid", "due", "overdue", "draft"] as const)[i % 4],
}));

const statusColor: Record<Invoice["status"], string> = {
  paid: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  due: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  overdue: "bg-red-500/15 text-red-700 border-red-500/30",
  draft: "bg-zinc-500/15 text-zinc-700 border-zinc-500/30",
};

export default function Invoices() {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<string>("all");
  const [sortKey, setSortKey] = React.useState<keyof Invoice>("date");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [page, setPage] = React.useState(1);
  const perPage = 8;

  const filtered = React.useMemo(() => {
    let rows = SEED.filter((r) => {
      const matchQ = !query || r.number.toLowerCase().includes(query.toLowerCase()) || r.customer.toLowerCase().includes(query.toLowerCase());
      const matchS = status === "all" || r.status === status;
      return matchQ && matchS;
    });
    rows.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }, [query, status, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageRows = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (k: keyof Invoice) => {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setSortDir("asc"); }
  };

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? new Set(pageRows.map((r) => r.id)) : new Set());
  };

  const toggleOne = (id: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id); else next.delete(id);
      return next;
    });
  };

  const bulkDownload = () => {
    if (selected.size === 0) {
      toast.error("Select at least one invoice");
      return;
    }
    toast.success(`Downloading ${selected.size} invoice(s)`);
    setSelected(new Set());
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
          <p className="text-sm text-muted-foreground">View and download invoices.</p>
        </div>

        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <CardTitle className="text-base">All invoices</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Input placeholder="Search invoice or customer..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-64" />
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="due">Due</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={bulkDownload} variant="outline"><Download className="mr-2 h-4 w-4" /> Download ({selected.size})</Button>
            </div>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <EmptyState icon={FileText} title="No invoices" description="Try adjusting your filters." />
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox
                          checked={pageRows.every((r) => selected.has(r.id)) && pageRows.length > 0}
                          onCheckedChange={(c) => toggleAll(!!c)}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" size="sm" onClick={() => toggleSort("number")}>Invoice <ArrowUpDown className="ml-1 h-3 w-3" /></Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" size="sm" onClick={() => toggleSort("date")}>Date <ArrowUpDown className="ml-1 h-3 w-3" /></Button>
                      </TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => toggleSort("amount")}>Amount <ArrowUpDown className="ml-1 h-3 w-3" /></Button>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageRows.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>
                          <Checkbox checked={selected.has(r.id)} onCheckedChange={(c) => toggleOne(r.id, !!c)} />
                        </TableCell>
                        <TableCell className="font-mono text-xs">{r.number}</TableCell>
                        <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                        <TableCell>{r.customer}</TableCell>
                        <TableCell className="text-right">£{r.amount.toFixed(2)}</TableCell>
                        <TableCell><Badge variant="outline" className={statusColor[r.status] + " capitalize"}>{r.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/invoices/${r.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }} />
                      </PaginationItem>
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink href="#" isActive={page === i + 1} onClick={(e) => { e.preventDefault(); setPage(i + 1); }}>{i + 1}</PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }} />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
