import { useParams, Link } from "wouter";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { toast } from "sonner";

interface LineItem { description: string; qty: number; unit: number; }

const LINES: LineItem[] = [
  { description: "Domestic Standard — 2.5kg", qty: 2, unit: 8.9 },
  { description: "International Express — 5kg", qty: 1, unit: 34.5 },
  { description: "Fuel surcharge", qty: 1, unit: 4.2 },
  { description: "Insurance coverage", qty: 1, unit: 6.0 },
];

export default function InvoiceDetail() {
  const params = useParams<{ id: string }>();
  const subtotal = LINES.reduce((s, l) => s + l.qty * l.unit, 0);
  const vat = subtotal * 0.2;
  const total = subtotal + vat;

  return (
    <AppShell>
      <div className="space-y-4 print:space-y-0">
        <div className="flex items-center justify-between print:hidden">
          <Button asChild variant="ghost" size="sm">
            <Link href="/invoices"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success("PDF downloaded")}><Download className="mr-2 h-4 w-4" /> Download</Button>
            <Button size="sm" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" /> Print</Button>
          </div>
        </div>
        <Card className="mx-auto max-w-3xl">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Invoice</CardTitle>
              <p className="text-sm text-muted-foreground font-mono">#{params.id?.toUpperCase()}</p>
            </div>
            <div className="text-right text-sm">
              <p className="font-semibold">Airpak Express</p>
              <p className="text-muted-foreground">Cardiff Bay, CF10 5AL</p>
              <p className="text-muted-foreground">VAT GB123456789</p>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Billed to</p>
                <p className="font-semibold mt-1">Acme Ltd</p>
                <p className="text-muted-foreground">10 Riverside Walk</p>
                <p className="text-muted-foreground">Cardiff CF10 5AL</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase text-muted-foreground">Issued</p>
                <p className="font-semibold mt-1">{new Date().toLocaleDateString()}</p>
                <p className="text-xs uppercase text-muted-foreground mt-3">Due</p>
                <p className="font-semibold mt-1">{new Date(Date.now() + 14 * 86400000).toLocaleDateString()}</p>
                <Badge variant="outline" className="mt-3 bg-amber-500/15 text-amber-700 border-amber-500/30">Due</Badge>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Unit</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LINES.map((l, i) => (
                  <TableRow key={i}>
                    <TableCell>{l.description}</TableCell>
                    <TableCell className="text-right">{l.qty}</TableCell>
                    <TableCell className="text-right">£{l.unit.toFixed(2)}</TableCell>
                    <TableCell className="text-right">£{(l.qty * l.unit).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="ml-auto w-full max-w-xs space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">VAT (20%)</span><span>£{vat.toFixed(2)}</span></div>
              <Separator />
              <div className="flex justify-between text-base font-semibold"><span>Total</span><span>£{total.toFixed(2)}</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
