import { useState } from "react";
import { AppNav } from "@/components/AppNav";
import {
  Users, Shield, Activity, TrendingUp, Search, Filter,
  MoreHorizontal, UserCheck, UserX, ChevronLeft, ChevronRight,
  Download
} from "lucide-react";

type Role = "admin" | "manager" | "user";

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: "active" | "suspended";
  joined: string;
  shipments: number;
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

const STATS = [
  { icon: <Users size={20} />, label: "Total Users", value: "1,248", change: "+12 this week", color: "var(--apple-blue)" },
  { icon: <Activity size={20} />, label: "Active Today", value: "892", change: "71.5% of total", color: "var(--apple-green)" },
  { icon: <TrendingUp size={20} />, label: "New This Week", value: "48", change: "+23% vs last week", color: "var(--apple-orange)" },
  { icon: <Shield size={20} />, label: "Administrators", value: "12", change: "4 super admins", color: "var(--apple-purple)" },
];

const ROLE_CONFIG: Record<Role, { color: string; bg: string; label: string }> = {
  admin: { color: "var(--apple-purple)", bg: "rgba(175,82,222,0.12)", label: "Admin" },
  manager: { color: "var(--apple-blue)", bg: "rgba(0,122,255,0.12)", label: "Manager" },
  user: { color: "var(--apple-label-secondary)", bg: "var(--apple-fill)", label: "User" },
};

const PAGE_SIZE = 5;

export default function Admin() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");
  const [page, setPage] = useState(1);
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserRow | null>(null);
  const [users, setUsers] = useState<UserRow[]>(USERS);

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

  function changeRole(id: number, newRole: Role) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    setEditUser(null);
  }

  function confirmDelete(id: number) {
    setUsers(prev => prev.filter(u => u.id !== id));
    setDeleteUser(null);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--apple-bg)", display: "flex" }}>
      {/* Admin sidebar */}
      <aside style={{ width: 240, minWidth: 240, background: "var(--apple-bg-secondary)", borderRight: "1px solid var(--apple-separator)", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", zIndex: 10, overflowY: "auto" }} aria-label="Admin navigation">
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--apple-separator)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect width="32" height="32" rx="6" fill="#007AFF"/><path d="M8 16h16M16 8v16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><circle cx="16" cy="16" r="6" fill="none" stroke="white" strokeWidth="2"/></svg>
            <span style={{ fontWeight: "var(--font-bold)", fontSize: "var(--text-md)" }}>Admin Panel</span>
          </div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--apple-label-tertiary)" }}>airpak-express.site</div>
        </div>
        <nav style={{ padding: "12px 0" }}>
          {[
            { label: "Users", active: true, icon: <Users size={16} /> },
            { label: "Analytics", active: false, icon: <TrendingUp size={16} /> },
            { label: "Shipments", active: false, icon: <Activity size={16} /> },
            { label: "Security", active: false, icon: <Shield size={16} /> },
          ].map(item => (
            <div
              key={item.label}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
                background: item.active ? "var(--apple-fill)" : "transparent",
                color: item.active ? "var(--apple-blue)" : "var(--apple-label-secondary)",
                fontWeight: item.active ? "var(--font-semibold)" : "var(--font-regular)",
                fontSize: "var(--text-sm)", cursor: "pointer", borderRadius: "var(--radius-md)", margin: "0 8px",
              }}
            >
              <span aria-hidden="true">{item.icon}</span>{item.label}
            </div>
          ))}
        </nav>
        <div style={{ flex: 1 }} />
        <div style={{ padding: 16, borderTop: "1px solid var(--apple-separator)" }}>
          <a href="/" style={{ fontSize: "var(--text-sm)", color: "var(--apple-label-secondary)", textDecoration: "none" }}>← Back to Site</a>
        </div>
      </aside>

      <div style={{ flex: 1, overflow: "auto" }}>
        <header style={{ padding: "24px 32px 0", borderBottom: "1px solid var(--apple-separator)", background: "var(--apple-bg-secondary)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h1 style={{ fontSize: "var(--text-3xl)", fontWeight: "var(--font-bold)", marginBottom: 4 }}>User Management</h1>
              <p style={{ color: "var(--apple-label-secondary)", fontSize: "var(--text-sm)" }}>Manage accounts, roles, and permissions</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "var(--text-sm)" }} aria-label="Export users">
                <Download size={14} aria-hidden="true" /> Export
              </button>
              <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "var(--text-sm)" }}>
                <Users size={14} aria-hidden="true" /> Invite User
              </button>
            </div>
          </div>
        </header>

        <main id="main-content" style={{ padding: 32 }}>
          {/* Stats */}
          <section aria-label="Admin statistics" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
            {STATS.map(stat => (
              <div key={stat.label} className="glass-card-sm" style={{ padding: 20, borderRadius: "var(--radius-xl)" }} role="region" aria-label={stat.label}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${stat.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: stat.color }} aria-hidden="true">{stat.icon}</div>
                </div>
                <div style={{ fontSize: "var(--text-3xl)", fontWeight: "var(--font-black)", letterSpacing: "-0.02em", marginBottom: 2 }} aria-label={`${stat.label}: ${stat.value}`}>{stat.value}</div>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--apple-label-secondary)", marginBottom: 2 }}>{stat.label}</div>
                <div style={{ fontSize: "var(--text-xs)", color: stat.color }}>{stat.change}</div>
              </div>
            ))}
          </section>

          {/* Users Table */}
          <section aria-label="Users table" className="glass-card-sm" style={{ borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
            {/* Filters */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--apple-separator)", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--apple-label-tertiary)" }} aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Search users…"
                  aria-label="Search users"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="input"
                  style={{ paddingLeft: 32, height: 36, fontSize: "var(--text-sm)" }}
                />
              </div>
              <div style={{ display: "flex", gap: 6 }} role="radiogroup" aria-label="Filter by role">
                {(["all", "admin", "manager", "user"] as const).map(r => (
                  <button
                    key={r}
                    role="radio"
                    aria-checked={roleFilter === r}
                    onClick={() => { setRoleFilter(r); setPage(1); }}
                    className={roleFilter === r ? "btn-primary" : "btn-secondary"}
                    style={{ fontSize: "var(--text-sm)", padding: "5px 14px", textTransform: "capitalize" }}
                  >{r}</button>
                ))}
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }} aria-label="Users list">
                <thead>
                  <tr>
                    {["User", "Email", "Role", "Status", "Joined", "Shipments", "Actions"].map(h => (
                      <th key={h} scope="col" style={{ padding: "12px 16px", textAlign: "left", fontSize: "var(--text-xs)", fontWeight: "var(--font-semibold)", color: "var(--apple-label-secondary)", background: "var(--apple-fill-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 && (
                    <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "var(--apple-label-tertiary)" }}>No users found</td></tr>
                  )}
                  {paginated.map((user, i) => {
                    const rc = ROLE_CONFIG[user.role];
                    return (
                      <tr key={user.id} style={{ borderBottom: i < paginated.length - 1 ? "1px solid var(--apple-separator)" : "none" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "var(--apple-fill-tertiary)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, var(--apple-blue), var(--apple-indigo))", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "var(--font-bold)", fontSize: "var(--text-sm)", flexShrink: 0 }} aria-hidden="true">{user.name[0]}</div>
                            <span style={{ fontWeight: "var(--font-medium)", fontSize: "var(--text-sm)" }}>{user.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: "var(--text-sm)", color: "var(--apple-label-secondary)" }}>{user.email}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ padding: "3px 10px", borderRadius: 999, background: rc.bg, color: rc.color, fontSize: "var(--text-xs)", fontWeight: "var(--font-semibold)", textTransform: "capitalize" }}>{rc.label}</span>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ padding: "3px 10px", borderRadius: 999, background: user.status === "active" ? "rgba(52,199,89,0.12)" : "rgba(255,59,48,0.12)", color: user.status === "active" ? "var(--apple-green)" : "var(--apple-red)", fontSize: "var(--text-xs)", fontWeight: "var(--font-semibold)", display: "flex", alignItems: "center", gap: 4, width: "fit-content" }}>
                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor" }} aria-hidden="true" />
                            {user.status === "active" ? "Active" : "Suspended"}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: "var(--text-sm)", color: "var(--apple-label-secondary)" }}>{user.joined}</td>
                        <td style={{ padding: "14px 16px", fontSize: "var(--text-sm)", color: "var(--apple-label)", fontWeight: "var(--font-medium)" }}>{user.shipments}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              onClick={() => toggleStatus(user.id)}
                              className="btn-ghost"
                              style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", padding: "4px 10px", color: user.status === "active" ? "var(--apple-orange)" : "var(--apple-green)" }}
                              aria-label={user.status === "active" ? `Suspend ${user.name}` : `Activate ${user.name}`}
                            >
                              {user.status === "active" ? <UserX size={13} aria-hidden="true" /> : <UserCheck size={13} aria-hidden="true" />}
                              {user.status === "active" ? "Suspend" : "Activate"}
                            </button>
                            <button
                              onClick={() => setEditUser(user)}
                              className="btn-ghost"
                              style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", padding: "4px 10px" }}
                              aria-label={`Edit ${user.name}`}
                            >
                              <MoreHorizontal size={13} aria-hidden="true" /> Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ padding: "12px 20px", borderTop: "1px solid var(--apple-separator)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "var(--text-sm)", color: "var(--apple-label-secondary)" }}>
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} users
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn-secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} aria-label="Previous page" style={{ padding: "6px 10px" }}>
                    <ChevronLeft size={14} aria-hidden="true" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      aria-current={page === i + 1 ? "page" : undefined}
                      className={page === i + 1 ? "btn-primary" : "btn-secondary"}
                      style={{ width: 32, height: 32, padding: 0, fontSize: "var(--text-sm)" }}
                    >{i + 1}</button>
                  ))}
                  <button className="btn-secondary" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Next page" style={{ padding: "6px 10px" }}>
                    <ChevronRight size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Edit Role Modal */}
      {editUser && (
        <div role="dialog" aria-modal="true" aria-labelledby="edit-title" style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", zIndex: 1000, padding: 20 }}>
          <div className="glass-ultra" style={{ width: "100%", maxWidth: 380, padding: 28 }}>
            <h2 id="edit-title" style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--font-bold)", marginBottom: 4 }}>Edit User Role</h2>
            <p style={{ color: "var(--apple-label-secondary)", marginBottom: 20 }}>{editUser.name}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }} role="radiogroup" aria-label="Select role">
              {(["admin", "manager", "user"] as Role[]).map(role => {
                const rc = ROLE_CONFIG[role];
                return (
                  <button
                    key={role}
                    role="radio"
                    aria-checked={editUser.role === role}
                    onClick={() => setEditUser({ ...editUser, role })}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: "var(--radius-lg)",
                      border: editUser.role === role ? `2px solid ${rc.color}` : "1.5px solid var(--apple-separator)",
                      background: editUser.role === role ? rc.bg : "transparent",
                      cursor: "pointer", textAlign: "left",
                    }}
                  >
                    <span style={{ flex: 1, fontSize: "var(--text-md)", fontWeight: "var(--font-medium)", textTransform: "capitalize", color: editUser.role === role ? rc.color : "var(--apple-label)" }}>{rc.label}</span>
                    {editUser.role === role && <Shield size={16} color={rc.color} aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setEditUser(null)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => changeRole(editUser.id, editUser.role)}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
