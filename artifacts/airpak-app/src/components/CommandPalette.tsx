import * as React from "react";
import { useLocation } from "wouter";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  Search,
  LayoutDashboard,
  Send,
  Package,
  MapPin,
  MessageSquare,
  CreditCard,
  Settings,
  Shield,
  Home,
  Users,
  BarChart3,
  Truck,
  Calculator,
  Globe,
  Building2,
  Code,
  Newspaper,
  Briefcase,
  Megaphone,
  Leaf,
  HelpCircle,
  Phone,
  Info,
  FileText,
  Lock,
  Bell,
  User,
  Wallet,
  Gift,
  MessageCircle,
  Sparkles,
  CalendarClock,
  Receipt,
  Map,
} from "lucide-react";

interface Item {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords?: string;
}

const customer: Item[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Ship Now", href: "/shipnow", icon: Send },
  { label: "Shipments", href: "/shipments", icon: Package },
  { label: "Tracking", href: "/tracking", icon: MapPin },
  { label: "Addresses", href: "/addresses", icon: Map },
  { label: "Pickup", href: "/pickup", icon: CalendarClock },
  { label: "Pickup History", href: "/pickup/history", icon: CalendarClock },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Chat", href: "/chat", icon: MessageCircle },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Payment", href: "/payment", icon: CreditCard },
  { label: "Wallet", href: "/wallet", icon: Wallet },
  { label: "Invoices", href: "/invoices", icon: Receipt },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Refer & Earn", href: "/refer", icon: Gift },
  { label: "Onboarding", href: "/onboarding", icon: Sparkles },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Security Settings", href: "/settings/security", icon: Lock },
  { label: "Notification Settings", href: "/settings/notifications", icon: Bell },
];

const marketing: Item[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Services", href: "/services", icon: Truck },
  { label: "Domestic Service", href: "/services/domestic", icon: Truck },
  { label: "International Service", href: "/services/international", icon: Globe },
  { label: "Express Service", href: "/services/express", icon: Truck },
  { label: "Freight Service", href: "/services/freight", icon: Truck },
  { label: "Calculator", href: "/calculator", icon: Calculator },
  { label: "Coverage", href: "/coverage", icon: Globe },
  { label: "Branches", href: "/branches", icon: Building2 },
  { label: "Business", href: "/business", icon: Briefcase },
  { label: "Developers", href: "/developers", icon: Code },
  { label: "News", href: "/news", icon: Newspaper },
  { label: "Careers", href: "/careers", icon: Briefcase },
  { label: "Press", href: "/press", icon: Megaphone },
  { label: "Sustainability", href: "/sustainability", icon: Leaf },
  { label: "Help Center", href: "/help", icon: HelpCircle },
  { label: "FAQ", href: "/faq", icon: HelpCircle },
  { label: "Contact", href: "/contact", icon: Phone },
  { label: "About", href: "/about", icon: Info },
  { label: "Terms", href: "/terms", icon: FileText },
  { label: "Privacy", href: "/privacy", icon: FileText },
];

const admin: Item[] = [
  { label: "Admin Dashboard", href: "/admin", icon: Shield },
  { label: "Admin Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Admin Couriers", href: "/admin/couriers", icon: Truck },
  { label: "Admin Settings", href: "/admin/settings", icon: Settings },
  { label: "Admin Users", href: "/admin", icon: Users },
];

interface CommandPaletteContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const Ctx = React.createContext<CommandPaletteContextValue | null>(null);

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [, navigate] = useLocation();

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    navigate(href);
  };

  return (
    <Ctx.Provider value={{ open, setOpen }}>
      {children}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search pages, shipments, settings..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Customer">
            {customer.map((it) => {
              const Icon = it.icon;
              return (
                <CommandItem key={it.href} value={it.label + " " + it.href} onSelect={() => go(it.href)}>
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{it.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Marketing">
            {marketing.map((it) => {
              const Icon = it.icon;
              return (
                <CommandItem key={it.href} value={it.label + " " + it.href} onSelect={() => go(it.href)}>
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{it.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Admin">
            {admin.map((it) => {
              const Icon = it.icon;
              return (
                <CommandItem key={it.href + it.label} value={it.label + " " + it.href} onSelect={() => go(it.href)}>
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{it.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </Ctx.Provider>
  );
}

export function useCommandPalette() {
  const ctx = React.useContext(Ctx);
  return ctx;
}

export function CommandPaletteTrigger({ className }: { className?: string }) {
  const ctx = useCommandPalette();
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => ctx?.setOpen(true)}
      className={"gap-2 text-muted-foreground " + (className ?? "")}
    >
      <Search className="h-4 w-4" />
      <span className="hidden md:inline">Search</span>
      <KbdGroup className="ml-2 hidden md:inline-flex">
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </Button>
  );
}

export default CommandPaletteProvider;
