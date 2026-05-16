import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useGetMySettings, useUpdateMySettings } from "@workspace/api-client-react";
import { useTheme } from "@/components/theme-provider";
import { useI18n } from "@/components/i18n-provider";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Settings() {
  const { data: settings, isLoading } = useGetMySettings();
  const updateSettings = useUpdateMySettings();
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useI18n();

  // Local state for toggles that syncs with server later
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);

  useEffect(() => {
    if (settings) {
      setNotifyEmail(settings.notifyEmail);
      setNotifyPush(settings.notifyPush);
      // Sync local context state if it drifted from server
      if (settings.theme && settings.theme !== theme) {
        setTheme(settings.theme as any);
      }
      if (settings.language && settings.language !== lang) {
        setLang(settings.language as any);
      }
    }
  }, [settings, setTheme, setLang]); // Depend on settings update

  const handleSave = () => {
    updateSettings.mutate(
      {
        data: {
          theme: theme as any,
          language: lang as any,
          notifyEmail,
          notifyPush
        }
      },
      {
        onSuccess: () => toast.success("Settings saved"),
        onError: (err) => toast.error((err.data as { error?: string } | null)?.error ?? err.message ?? "Failed to save settings")
      }
    );
  };

  if (isLoading) {
    return <AppShell><div className="p-8 text-center">Loading settings...</div></AppShell>;
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account preferences.</p>
        </div>

        <Card className="glass-card-sm border-none shadow-sm">
          <CardHeader>
            <CardTitle>Appearance & Regional</CardTitle>
            <CardDescription>Customize how Airpak Express looks and feels.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">Select light or dark mode</p>
              </div>
              <Select value={theme} onValueChange={(v) => setTheme(v as any)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="space-y-0.5">
                <Label>Language</Label>
                <p className="text-sm text-muted-foreground">Choose your preferred language</p>
              </div>
              <Select value={lang} onValueChange={(v) => setLang(v as any)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English (EN)</SelectItem>
                  <SelectItem value="zh">中文 (ZH)</SelectItem>
                  <SelectItem value="ms">Bahasa Melayu (MS)</SelectItem>
                  <SelectItem value="ar">العربية (AR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card-sm border-none shadow-sm">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choose what updates you want to receive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive tracking updates via email</p>
              </div>
              <Switch checked={notifyEmail} onCheckedChange={setNotifyEmail} />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates on your device</p>
              </div>
              <Switch checked={notifyPush} onCheckedChange={setNotifyPush} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={updateSettings.isPending} className="px-8 rounded-full">
            {updateSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
