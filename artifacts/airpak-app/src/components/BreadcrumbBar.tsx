import * as React from "react";
import { Link, useLocation } from "wouter";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  shipnow: "Ship Now",
  shipments: "Shipments",
  tracking: "Tracking",
  messages: "Messages",
  payment: "Payment",
  settings: "Settings",
  admin: "Admin",
  users: "Users",
  reports: "Reports",
  couriers: "Couriers",
  addresses: "Addresses",
  new: "New",
  pickup: "Pickup",
  history: "History",
  wallet: "Wallet",
  invoices: "Invoices",
  notifications: "Notifications",
  profile: "Profile",
  security: "Security",
  refer: "Refer",
  chat: "Chat",
  onboarding: "Onboarding",
  services: "Services",
  domestic: "Domestic",
  international: "International",
  express: "Express",
  freight: "Freight",
  calculator: "Calculator",
  coverage: "Coverage",
  branches: "Branches",
  business: "Business",
  developers: "Developers",
  news: "News",
  careers: "Careers",
  press: "Press",
  sustainability: "Sustainability",
  help: "Help",
  faq: "FAQ",
  contact: "Contact",
  about: "About",
  terms: "Terms",
  privacy: "Privacy",
  label: "Label",
  maintenance: "Maintenance",
  error: "Error",
};

function humanize(seg: string) {
  if (labelMap[seg]) return labelMap[seg];
  if (/^\d+$/.test(seg)) return `#${seg}`;
  return decodeURIComponent(seg).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function BreadcrumbBar({ className }: { className?: string }) {
  const [location] = useLocation();
  const parts = location.split("/").filter(Boolean);
  if (parts.length === 0) return null;

  const crumbs = parts.map((part, idx) => {
    const href = "/" + parts.slice(0, idx + 1).join("/");
    return { href, label: humanize(part), isLast: idx === parts.length - 1 };
  });

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {crumbs.map((c) => (
          <React.Fragment key={c.href}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {c.isLast ? (
                <BreadcrumbPage>{c.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={c.href}>{c.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadcrumbBar;
