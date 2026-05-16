import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  BarChart2, Package, Zap, Globe, ClipboardList,
  CreditCard, MessageCircle, ArrowLeft,
  ChevronLeft, ChevronRight,
} from "lucide-react";

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  external?: boolean;
}

const sidebarItems: SidebarItem[] = [
  { icon: <BarChart2 size={18} />, label: "Overview", href: "/dashboard" },
  { icon: <Package size={18} />, label: "My Packages", href: "/tracking" },
  { icon: <Zap size={18} />, label: "Express Shipments", href: "/tracking" },
  { icon: <Globe size={18} />, label: "International", href: "/tracking" },
  { icon: <ClipboardList size={18} />, label: "Order History", href: "/tracking" },
  { icon: <CreditCard size={18} />, label: "Billing", href: "/payment" },
];

const bottomItems: SidebarItem[] = [
  { icon: <MessageCircle size={18} />, label: "Support Chat", href: "/chat" },
  { icon: <ArrowLeft size={18} />, label: "Back to Site", href: "https://airpak-express.site/", external: true },
];

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => location === href;

  return (
    <>
      {isOpen && (
        <div className="mobile-menu-overlay open" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={`dashboard-sidebar${collapsed ? " collapsed" : ""}`}
        style={{
          position: "fixed",
          left: isOpen ? 0 : undefined,
          zIndex: 200,
          transition: "width 0.25s cubic-bezier(0.32, 0.72, 0, 1)",
          width: collapsed ? 64 : undefined,
        }}
        aria-label="App sidebar"
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "absolute", right: -12, top: 24, width: 24, height: 24,
            background: "var(--apple-bg-secondary)", border: "1px solid var(--apple-separator)",
            borderRadius: "50%", cursor: "pointer", zIndex: 1, color: "var(--apple-label-secondary)",
          }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column" }} aria-label="App navigation">
          {sidebarItems.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={`dashboard-sidebar-item${isActive(item.href) ? " active" : ""}`}
              title={collapsed ? item.label : undefined}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              <span aria-hidden="true">{item.icon}</span>
              {!collapsed && item.label}
            </Link>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        <nav aria-label="Sidebar footer">
          {bottomItems.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.href}
                className="dashboard-sidebar-item"
                title={collapsed ? item.label : undefined}
              >
                <span aria-hidden="true">{item.icon}</span>
                {!collapsed && item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={`dashboard-sidebar-item${isActive(item.href) ? " active" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <span aria-hidden="true">{item.icon}</span>
                {!collapsed && item.label}
              </Link>
            )
          )}
        </nav>
      </aside>
    </>
  );
}
