import * as React from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Copy, Gift, Trophy } from "lucide-react";

const FRIENDS = [
  { id: "1", name: "Liam Carter", status: "joined", date: "2025-04-12" },
  { id: "2", name: "Aisha Khan", status: "shipped", date: "2025-04-18" },
  { id: "3", name: "Daniel Lopez", status: "joined", date: "2025-04-22" },
  { id: "4", name: "Mei Tan", status: "invited", date: "2025-05-01" },
];

const TIERS = [
  { label: "Silver", target: 3, color: "bg-zinc-500/15 text-zinc-700 border-zinc-500/30" },
  { label: "Gold", target: 6, color: "bg-amber-500/15 text-amber-700 border-amber-500/30" },
  { label: "Platinum", target: 10, color: "bg-violet-500/15 text-violet-700 border-violet-500/30" },
];

export default function Refer() {
  const link = "https://airpak-express.com/r/JANE-9F2C";
  const referrals = FRIENDS.filter((f) => f.status !== "invited").length;
  const goal = 10;

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Refer & earn</h1>
          <p className="text-sm text-muted-foreground">Get £10 credit for every friend who ships with Airpak.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Gift className="h-4 w-4" /> Your referral link</CardTitle>
            <CardDescription>Share this link with friends. They get £10 off, you get £10 credit.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input readOnly value={link} className="font-mono" />
              <Button onClick={() => { void navigator.clipboard.writeText(link); toast.success("Link copied to clipboard"); }}>
                <Copy className="mr-2 h-4 w-4" /> Copy
              </Button>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{referrals} of {goal} referrals</span>
                <span className="font-medium">£{(referrals * 10).toFixed(2)} earned</span>
              </div>
              <Progress value={(referrals / goal) * 100} />
            </div>
            <div className="flex flex-wrap gap-2">
              {TIERS.map((t) => (
                <Badge key={t.label} variant="outline" className={t.color + " gap-1"}>
                  <Trophy className="h-3 w-3" /> {t.label} · {t.target}+
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Referred friends</CardTitle>
            <CardDescription>Track your invites and shipments.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {FRIENDS.map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9"><AvatarFallback>{f.name.charAt(0)}</AvatarFallback></Avatar>
                  <div>
                    <p className="font-medium">{f.name}</p>
                    <p className="text-xs text-muted-foreground">Invited {new Date(f.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge variant="outline" className="capitalize">{f.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
