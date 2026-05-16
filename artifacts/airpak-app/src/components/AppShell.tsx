import { useLocation, Link } from "wouter";
import { useGetCurrentUser, useSignOut } from "@workspace/api-client-react";
import { useTheme } from "./theme-provider";
import { useI18n } from "./i18n-provider";
import { 
  Home, 
  Send, 
  Package, 
  MapPin, 
  MessageSquare, 
  CreditCard, 
  Settings, 
  Shield,
  LogOut,
  Sun,
  Moon,
  Activity,
  Truck,
  SlidersHorizontal
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useEffect } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: auth, isLoading } = useGetCurrentUser();
  const signOut = useSignOut();
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useI18n();

  useEffect(() => {
    if (!isLoading && !auth?.user) {
      setLocation("/signin");
    }
  }, [auth, isLoading, setLocation]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!auth?.user) {
    return null; // Will redirect
  }

  const handleSignOut = () => {
    signOut.mutate(undefined, {
      onSuccess: () => setLocation("/signin"),
    });
  };

  const navItems = [
    { href: "/dashboard", label: t("dashboard"), icon: Home },
    { href: "/shipnow", label: t("shipNow"), icon: Send },
    { href: "/shipments", label: t("shipments"), icon: Package },
    { href: "/tracking", label: t("tracking"), icon: MapPin },
    { href: "/messages", label: t("messages"), icon: MessageSquare },
    { href: "/payment", label: t("payments"), icon: CreditCard },
    { href: "/settings", label: t("settings"), icon: Settings },
  ];

  if (auth.user.role === "admin") {
    navItems.push({ href: "/admin", label: t("admin"), icon: Shield });
    navItems.push({ href: "/admin/reports", label: "Reports", icon: Activity });
    navItems.push({ href: "/admin/couriers", label: "Couriers", icon: Truck });
    navItems.push({ href: "/admin/settings", label: "Admin Settings", icon: SlidersHorizontal });
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card">
        <div className="h-14 flex items-center px-4 border-b">
          <Link href="/dashboard" className="flex items-center gap-2">
            <img src="/app/brand/airpak-mark.svg" alt="Airpak" className="h-8" />
            <span className="font-bold text-lg">Airpak Express</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <span className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-primary/10 text-primary" : "hover:bg-accent text-muted-foreground"}`}>
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-14 flex items-center justify-between px-4 border-b bg-background/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 md:hidden">
            <img src="/app/brand/airpak-mark.svg" alt="Airpak" className="h-8" />
            <span className="font-bold text-lg">Airpak</span>
          </div>
          <div className="hidden md:block font-semibold">
            {navItems.find(i => location.startsWith(i.href))?.label || "Airpak Express"}
          </div>

          <div className="flex items-center gap-2">
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value as any)}
              className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer"
            >
              <option value="en">EN</option>
              <option value="zh">ZH</option>
              <option value="ms">MS</option>
              <option value="ar">AR</option>
            </select>

            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={auth.user.avatarUrl || ""} alt={auth.user.name} />
                    <AvatarFallback>{auth.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{auth.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{auth.user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLocation("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t("settings")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("signOut")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden flex items-center justify-around h-16 border-t bg-background sticky bottom-0 z-10 pb-safe">
        {[
          { href: "/dashboard", icon: Home },
          { href: "/shipnow", icon: Send },
          { href: "/tracking", icon: MapPin },
          { href: "/messages", icon: MessageSquare },
          { href: "/settings", icon: Settings },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = location.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <span className={`flex flex-col items-center justify-center w-full h-full p-2 ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                <Icon className="h-6 w-6" />
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
