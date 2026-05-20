import { useState } from "react";
import DashboardShell01 from "@/components/blocks/dashboard-shell-01";
import DashboardFooter01 from "@/components/blocks/dashboard-footer-01";
import StatisticsCard01 from "@/components/blocks/statistics-card-01";
import { DashboardDialog02 } from "@/components/blocks/dashboard-dialog-02";
import {
  Users, Shield, Activity, TrendingUp, Search, Filter,
  MoreHorizontal, UserCheck, UserX, ChevronLeft, ChevronRight,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

type Role = "admin" | "manager" | "user";

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: "active" | "suspended";
  joined: string;
  shipments: number;
  avatar?: string;
}

const USERS: UserRow[] = [
  { id: 1, name: "Alex Johnson", email: "alex@company.com", role: "admin", status: "active", joined: "Jan 2024", shipments: 247 },
  { id: 2, name: "Sarah Chen", email: "sarah@ecommerce.co", role: "manager", status: "active", joined: "Feb 2024", shipments: 182 },
  { id: 3, name: "Marcus Williams", email: "m.williams@corp.io", role: "user", status: "active", joined: "Mar 2024", shipments: 95 },
  { id: 4, name: "Priya Nair", email: "priya@imports.sg", role: "manager", status: "active", joined: "Apr 2024", shipments: 314 },
  { id: 5, name: "James Osei", email: "j.osei@logistics.gh", role: "user", status: "suspended", joined: "May 2024", shipments: 12 },
  { id: 6, name: "Emma Laurent", email: "emma@boutique.fr", role: "user", status: "active", joined: "Jun 2024", shipments: 67 },
  { id: 7, name: "Raj Patel", email: "raj@techstartup.in", role: "user", status: "active", joined: "Jul 2024", shipments: 41 },
  { id: 8, name: "Yuki Tanaka", email: "yuki@tanaka.jp", role: "manager", status: "active", joined: "Aug 2024", shipments: 203 },
];

const PAGE_SIZE = 5;

const ROLE_CONFIG: Record<Role, { color: string; bg: string; label: string }> = {
  admin: { color: "#a855f7", bg: "rgba(168,85,247,0.12)", label: "Admin" },
  manager: { color: "#3b82f6", bg: "rgba(59,130,246,0.12)", label: "Manager" },
  user: { color: "rgba(255,255,255,0.5)", bg: "rgba(255,255,255,0.06)", label: "User" },
};

function InitialsAvatar({ name }: { name: string }) {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div style={{
      width: 36, height: 36, borderRadius: "50%",
      background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "white", fontWeight: 600, fontSize: 12, flexShrink: 0
    }}>
      {initials}
    </div>
  );
}

function UserTableRow({ user, onToggle, onEdit }: {
  user: UserRow;
  onToggle: (id: number) => void;
  onEdit: (user: UserRow) => void;
}) {
  const rc = ROLE_CONFIG[user.role];
  return (
    <TableRow
      style={{ transition: "background 0.1s" }}
      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      <TableCell style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <InitialsAvatar name={user.name} />
          <span style={{ fontWeight: 500, fontSize: 14 }}>{user.name}</span>
        </div>
      </TableCell>
      <TableCell style={{ padding: "14px 16px", fontSize: 14, color: "rgba(255,255,255,0.5)" }}>{user.email}</TableCell>
      <TableCell style={{ padding: "14px 16px" }}>
        <Badge style={{ background: rc.bg, color: rc.color, fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>
          {rc.label}
        </Badge>
      </TableCell>
      <TableCell style={{ padding: "14px 16px" }}>
        <Badge style={{
          background: user.status === "active" ? "rgba(52,199,89,0.12)" : "rgba(255,59,48,0.12)",
          color: user.status === "active" ? "#34c759" : "#ff3b30",
          fontSize: 12, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor" }} />
          {user.status === "active" ? "Active" : "Suspended"}
        </Badge>
      </TableCell>
      <TableCell style={{ padding: "14px 16px", fontSize: 14, color: "rgba(255,255,255,0.4)" }}>{user.joined}</TableCell>
      <TableCell style={{ padding: "14px 16px", fontSize: 14, fontWeight: 500 }}>{user.shipments}</TableCell>
      <TableCell style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => onToggle(user.id)}
            style={{
              display: "flex", alignItems: "center", gap: 4, fontSize: 12,
              padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer",
              background: "rgba(255,255,255,0.06)", color: user.status === "active" ? "#ff9f0a" : "#34c759",
              transition: "all 0.15s"
            }}
          >
            {user.status === "active" ? <UserX size={13} /> : <UserCheck size={13} />}
            {user.status === "active" ? "Suspend" : "Activate"}
          </button>
          <button
            onClick={() => onEdit(user)}
            style={{
              display: "flex", alignItems: "center", gap: 4, fontSize: 12,
              padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer",
              background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)",
              transition: "all 0.15s"
            }}
          >
            <MoreHorizontal size={13} /> Edit
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function Admin() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<UserRow[]>(USERS);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleStatus(id: number) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u));
  }

  function handleEditUser(user: UserRow) {
    setSelectedUser(user);
  }

  function handleDeleteUser(id: number) {
    setUsers(prev => prev.filter(u => u.id !== id));
    setSelectedUser(null);
  }

  const pageContent = (
    <div style={{ padding: 32 }}>
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4, color: "white" }}>User Management</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Manage accounts, roles, and permissions across the platform</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Button
            variant="outline"
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.04)" }}
          >
            <Download size={14} /> Export
          </Button>
          <Button
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, background: "white", color: "black" }}
          >
            <Users size={14} /> Invite User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <section aria-label="Admin statistics" className="mb-8">
        <StatisticsCard01 />
      </section>

      {/* Users Table */}
      <section aria-label="Users table" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" }}>
        {/* Filters */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} aria-hidden="true" />
            <Input
              type="search"
              placeholder="Search users…"
              aria-label="Search users"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ paddingLeft: 32, height: 36, fontSize: 14, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
            />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {(["all", "admin", "manager", "user"] as const).map(r => (
              <button
                key={r}
                onClick={() => { setRoleFilter(r); setPage(1); }}
                style={{
                  padding: "5px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                  border: "1px solid", cursor: "pointer", transition: "all 0.15s",
                  textTransform: "capitalize",
                  background: roleFilter === r ? "white" : "rgba(255,255,255,0.06)",
                  borderColor: roleFilter === r ? "white" : "rgba(255,255,255,0.12)",
                  color: roleFilter === r ? "black" : "rgba(255,255,255,0.6)",
                }}
              >{r}</button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <Table aria-label="Users list">
            <TableHeader>
              <TableRow style={{ background: "rgba(255,255,255,0.02)" }}>
                {["User", "Email", "Role", "Status", "Joined", "Shipments", "Actions"].map(h => (
                  <TableHead key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap", background: "rgba(255,255,255,0.02)" }}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>No users found</TableCell>
                </TableRow>
              )}
              {paginated.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  onToggle={toggleStatus}
                  onEdit={handleEditUser}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} users
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", cursor: page === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  style={{
                    width: 32, height: 32, borderRadius: 8, border: "none", cursor: "pointer",
                    fontSize: 13,
                    background: page === i + 1 ? "white" : "rgba(255,255,255,0.06)",
                    color: page === i + 1 ? "black" : "rgba(255,255,255,0.6)",
                  }}
                >{i + 1}</button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", cursor: page === totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Inline edit/delete dialogs */}
      {selectedUser && (
        <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", zIndex: 1000, padding: 20 }}>
          <div style={{ width: "100%", maxWidth: 380, background: "rgba(20,20,20,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 18, fontWeight: 600, color: "white", marginBottom: 4 }}>Edit User</p>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>{selectedUser.name}</p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18 }}
              >×</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {(["admin", "manager", "user"] as Role[]).map(role => {
                const rc = ROLE_CONFIG[role];
                const isSelected = selectedUser.role === role;
                return (
                  <button
                    key={role}
                    onClick={() => setSelectedUser({ ...selectedUser, role })}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 10,
                      border: isSelected ? `2px solid ${rc.color}` : "1.5px solid rgba(255,255,255,0.1)",
                      background: isSelected ? rc.bg : "transparent",
                      cursor: "pointer", textAlign: "left",
                    }}
                  >
                    <span style={{ flex: 1, fontSize: 15, fontWeight: 500, textTransform: "capitalize", color: isSelected ? rc.color : "rgba(255,255,255,0.7)" }}>{rc.label}</span>
                    {isSelected && <Shield size={16} color={rc.color} />}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => {
                  setUsers(prev => prev.map(u => u.id === selectedUser.id ? selectedUser : u));
                  setSelectedUser(null);
                }}
                style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", background: "white", color: "black", fontWeight: 600, cursor: "pointer" }}
              >Save Changes</button>
              <button
                onClick={() => {
                  handleDeleteUser(selectedUser.id);
                }}
                style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "1px solid rgba(255,59,48,0.4)", background: "rgba(255,59,48,0.1)", color: "#ff3b30", fontWeight: 600, cursor: "pointer" }}
              >Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <DashboardShell01>{pageContent}</DashboardShell01>
      <DashboardFooter01 />
    </>
  );
}