"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SidebarContextValue {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextValue>({
  collapsed: false,
  setCollapsed: () => {},
})

export function useSidebar() {
  return React.useContext(SidebarContext)
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

export function Sidebar({ className, collapsed: controlledCollapsed, onCollapsedChange, children, ...props }: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = React.useState(false)
  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed
  const setCollapsed = onCollapsedChange || setInternalCollapsed

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div
        className={cn(
          "flex h-full flex-col border-r bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-60",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

export function SidebarHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-2 border-b px-4 py-3", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1 overflow-y-auto py-2", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("border-t px-4 py-3", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarGroup({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-2 py-1", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarGroupLabel({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarGroupContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-0.5", className)} {...props}>
      {children}
    </div>
  )
}

interface SidebarItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  badge?: React.ReactNode
  active?: boolean
}

export function SidebarItem({ className, icon, badge, active, children, ...props }: SidebarItemProps) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
        className
      )}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="flex-1 text-left">{children}</span>
      {badge && <span className="ml-auto">{badge}</span>}
    </button>
  )
}

export function SidebarToggle({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { collapsed, setCollapsed } = useSidebar()

  return (
    <button
      onClick={() => setCollapsed(!collapsed)}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("transition-transform", collapsed ? "rotate-180" : "")}
      >
        <path d="=" />
        <path d="M9 18l6-6-6-6" />
      </svg>
      <span className="sr-only">Toggle sidebar</span>
    </button>
  )
}

export function SidebarTrigger({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setCollapsed } = useSidebar()
  return (
    <button
      onClick={() => setCollapsed(false)}
      className={cn("", className)}
      {...props}
    >
      <span className="sr-only">Open sidebar</span>
    </button>
  )
}