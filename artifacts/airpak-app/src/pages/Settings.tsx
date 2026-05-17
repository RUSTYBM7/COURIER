import { useState, useEffect, useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  useGetMySettings,
  useUpdateMySettings,
  useGetCurrentUser,
} from "@workspace/api-client-react";
import { useTheme } from "@/components/theme-provider";
import { useI18n } from "@/components/i18n-provider";
import { toast } from "sonner";
import {
  Loader2,
  User,
  Bell,
  Paintbrush,
  Globe,
  Shield,
  CreditCard,
  HelpCircle,
  ChevronRight,
  Search,
  Check,
} from "lucide-react";

type SectionId =
  | "profile"
  | "appearance"
  | "notifications"
  | "language"
  | "security"
  | "billing"
  | "help";

const sections: { id: SectionId; label: string; icon: typeof User; color: string }[] = [
  { id: "profile",       label: "Profile",       icon: User,        color: "bg-[#0a84ff]" },
  { id: "appearance",    label: "Appearance",    icon: Paintbrush,  color: "bg-[#bf5af2]" },
  { id: "notifications", label: "Notifications", icon: Bell,        color: "bg-[#ff453a]" },
  { id: "language",      label: "Language & Region", icon: Globe,   color: "bg-[#32d74b]" },
  { id: "security",      label: "Security",      icon: Shield,      color: "bg-[#5e5ce6]" },
  { id: "billing",       label: "Billing",       icon: CreditCard,  color: "bg-[#ff9f0a]" },
  { id: "help",          label: "Help & Support", icon: HelpCircle, color: "bg-[#64d2ff]" },
];

export default function Settings() {
  const { data: settings, isLoading } = useGetMySettings();
  const { data: auth } = useGetCurrentUser();
  const updateSettings = useUpdateMySettings();
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useI18n();

  const [active, setActive] = useState<SectionId>("profile");
  const [query, setQuery] = useState("");
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);

  useEffect(() => {
    if (settings) {
      setNotifyEmail(settings.notifyEmail);
      setNotifyPush(settings.notifyPush);
      if (settings.theme && settings.theme !== theme) setTheme(settings.theme as any);
      if (settings.language && settings.language !== lang) setLang(settings.language as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const filtered = useMemo(
    () =>
      sections.filter((s) =>
        s.label.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query],
  );

  const handleSave = () => {
    updateSettings.mutate(
      {
        data: {
          theme: theme as any,
          language: lang as any,
          notifyEmail,
          notifyPush,
        },
      },
      {
        onSuccess: () => toast.success("Settings saved"),
        onError: (err) =>
          toast.error(
            (err.data as { error?: string } | null)?.error ??
              err.message ??
              "Failed to save settings",
          ),
      },
    );
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading settings…
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="-m-4 md:-m-8 h-[calc(100vh-3.5rem-1px)] flex bg-[#f2f2f7] dark:bg-[#1c1c1e]">
        {/* Sidebar */}
        <aside className="w-[280px] shrink-0 border-r border-black/5 dark:border-white/5 bg-white/70 dark:bg-[#2c2c2e]/60 backdrop-blur-xl flex flex-col">
          <div className="p-4 pb-3">
            <h1 className="text-[22px] font-bold tracking-tight text-[#1d1d1f] dark:text-white">
              Settings
            </h1>
            <div className="relative mt-3">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="pl-8 h-8 rounded-lg bg-black/5 dark:bg-white/10 border-0 focus-visible:ring-1 focus-visible:ring-[#0a84ff] text-sm"
              />
            </div>
          </div>

          <div className="px-2 pb-2 flex items-center gap-3 mx-2 rounded-xl bg-white dark:bg-[#3a3a3c] shadow-sm">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[#ff5a4d] to-[#CD2727] grid place-items-center text-white font-semibold m-2">
              {auth?.user?.name?.charAt(0) ?? "A"}
            </div>
            <div className="min-w-0 flex-1 py-2 pr-3">
              <div className="text-sm font-semibold truncate text-[#1d1d1f] dark:text-white">
                {auth?.user?.name ?? "Guest"}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {auth?.user?.email ?? "—"}
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground mr-3" />
          </div>

          <nav className="flex-1 overflow-y-auto p-2 mt-1">
            {filtered.map((s) => {
              const Icon = s.icon;
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-lg transition-colors text-left ${
                    isActive
                      ? "bg-[#0a84ff] text-white"
                      : "hover:bg-black/5 dark:hover:bg-white/10 text-[#1d1d1f] dark:text-white"
                  }`}
                >
                  <span
                    className={`grid place-items-center h-7 w-7 rounded-md ${s.color} text-white shadow-sm`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-[14px] font-medium">{s.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Detail panel */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-8 py-10">
            {active === "profile" && (
              <DetailSection title="Profile" subtitle="Manage your personal information.">
                <Row
                  label="Name"
                  control={
                    <span className="text-sm font-medium">
                      {auth?.user?.name ?? "—"}
                    </span>
                  }
                />
                <Row
                  label="Email"
                  control={
                    <span className="text-sm text-muted-foreground">
                      {auth?.user?.email ?? "—"}
                    </span>
                  }
                />
                <Row
                  label="Role"
                  control={
                    <Badge variant="secondary" className="capitalize">
                      {auth?.user?.role ?? "customer"}
                    </Badge>
                  }
                />
              </DetailSection>
            )}

            {active === "appearance" && (
              <DetailSection title="Appearance" subtitle="Match the system or pick a side.">
                <Row
                  label="Theme"
                  control={
                    <Select value={theme} onValueChange={(v) => setTheme(v as any)}>
                      <SelectTrigger className="w-[180px] rounded-lg">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  }
                />
                <Row
                  label="Accent"
                  control={
                    <div className="flex items-center gap-2">
                      {["#CD2727", "#0a84ff", "#bf5af2", "#32d74b", "#ff9f0a"].map(
                        (c) => (
                          <span
                            key={c}
                            className="h-6 w-6 rounded-full ring-2 ring-white shadow"
                            style={{ background: c }}
                          />
                        ),
                      )}
                    </div>
                  }
                />
              </DetailSection>
            )}

            {active === "notifications" && (
              <DetailSection title="Notifications" subtitle="Decide how Airpak reaches you.">
                <Row
                  label="Email"
                  hint="Receive tracking updates by email"
                  control={
                    <Switch checked={notifyEmail} onCheckedChange={setNotifyEmail} />
                  }
                />
                <Row
                  label="Push"
                  hint="Get alerts on this device"
                  control={
                    <Switch checked={notifyPush} onCheckedChange={setNotifyPush} />
                  }
                />
              </DetailSection>
            )}

            {active === "language" && (
              <DetailSection title="Language & Region" subtitle="Localize the app to your audience.">
                <Row
                  label="Language"
                  control={
                    <Select value={lang} onValueChange={(v) => setLang(v as any)}>
                      <SelectTrigger className="w-[200px] rounded-lg">
                        <SelectValue placeholder="Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English (EN)</SelectItem>
                        <SelectItem value="zh">中文 (ZH)</SelectItem>
                        <SelectItem value="ms">Bahasa Melayu (MS)</SelectItem>
                        <SelectItem value="ar">العربية (AR)</SelectItem>
                      </SelectContent>
                    </Select>
                  }
                />
              </DetailSection>
            )}

            {active === "security" && (
              <DetailSection title="Security" subtitle="Account protection and access.">
                <Row label="Two-factor authentication" hint="Add an extra layer of security" control={<Switch defaultChecked />} />
                <Row label="Active sessions" hint="1 device signed in" control={<Button size="sm" variant="ghost">Manage</Button>} />
              </DetailSection>
            )}

            {active === "billing" && (
              <DetailSection title="Billing" subtitle="Plan, invoices and payment methods.">
                <Row label="Plan" control={<Badge>Business</Badge>} />
                <Row label="Next invoice" control={<span className="text-sm text-muted-foreground">£0.00 · —</span>} />
              </DetailSection>
            )}

            {active === "help" && (
              <DetailSection title="Help & Support" subtitle="We're here when you need us.">
                <Row label="Support email" control={<a className="text-sm text-[#0a84ff]" href="mailto:support@airpak-express.site">support@airpak-express.site</a>} />
                <Row label="Status" control={<span className="text-sm flex items-center gap-1.5 text-emerald-600"><Check className="h-3.5 w-3.5"/> All systems normal</span>} />
              </DetailSection>
            )}

            <div className="flex justify-end mt-8">
              <Button
                onClick={handleSave}
                disabled={updateSettings.isPending}
                className="rounded-full px-6 bg-[#0a84ff] hover:bg-[#0a84ff]/90"
              >
                {updateSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
            </div>
          </div>
        </main>
      </div>
    </AppShell>
  );
}

function DetailSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-[28px] font-bold tracking-tight text-[#1d1d1f] dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[13px] text-muted-foreground mt-1">{subtitle}</p>
      )}
      <Card className="mt-5 rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-[#2c2c2e] shadow-none">
        <CardContent className="p-0 divide-y divide-black/5 dark:divide-white/5">
          {children}
        </CardContent>
      </Card>
    </section>
  );
}

function Row({
  label,
  hint,
  control,
}: {
  label: string;
  hint?: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <div className="min-w-0">
        <Label className="text-[14px] font-medium text-[#1d1d1f] dark:text-white">
          {label}
        </Label>
        {hint && <div className="text-[12px] text-muted-foreground mt-0.5">{hint}</div>}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}
