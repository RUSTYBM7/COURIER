admin_fix = '''import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/useTheme";
import {
  ArrowLeft, Shield, Users, Package, TrendingUp, AlertTriangle,
  LogOut, Loader2, Search, Filter, Download, RefreshCw,
  CheckCircle, Clock, Truck, MapPin, DollarSign, Activity,
  ChevronDown, ChevronUp, BarChart3, PieChart, LineChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AirpakLogo } from "@/components/AirpakLogo";

interface AdminStats {
  totalShipments: number;
  activeShipments: number;
  totalRevenue: string;
  totalUsers: number;
  newUsersToday: number;
  pendingIssues: number;
}

interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: string;
  company?: string;
  createdAt: string;
  status: string;
}

interface ShipmentRecord {
  id: string;
  sender: string;
  origin: string;
  destination: string;
  status: string;
  service: string;
  createdAt: string;
}

export default function Admin() {
  const [, navigate] = useLocation();
  const { resolvedTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Auth check - strict admin only
  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (!data.user) {
          navigate('/signin?redirect=/admin-panel');
          return;
        }
        if (data.user.role !== 'admin') {
          navigate('/dashboard?error=unauthorized');
          return;
        }
        setUser(data.user);
        
        // Load admin data
        return Promise.all([
          fetch('/api/admin/stats', { credentials: 'include' }).then(r => r.json()),
          fetch('/api/admin/users', { credentials: 'include' }).then(r => r.json()),
          fetch('/api/admin/shipments', { credentials: 'include' }).then(r => r.json())
        ]);
      })
      .then(([statsData, usersData, shipmentsData]) => {
        if (statsData) setStats(statsData);
        if (usersData) setUsers(usersData.users || []);
        if (shipmentsData) setShipments(shipmentsData.shipments || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Admin load error:', err);
        setError('Failed to load admin data');
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST', credentials: 'include' });
      window.localStorage.removeItem('airpak_user');
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: 'bg-green-500/10 text-green-600 border-green-500/20',
      delivered: 'bg-green-500/10 text-green-600 border-green-500/20',
      in_transit: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      exception: 'bg-red-500/10 text-red-600 border-red-500/20',
      suspended: 'bg-red-500/10 text-red-600 border-red-500/20',
    };
    return variants[status?.toLowerCase()] || 'bg-muted text-muted-foreground';
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredShipments = shipments.filter(s =>
    s.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.sender?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.destination?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">Access Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">Admin Panel</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:inline">
              {user?.name} (Administrator)
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Operations Overview</h1>
          <p className="text-muted-foreground">Monitor and manage Airpak Express operations</p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Shipments</p>
                  <p className="text-2xl font-bold">{stats?.totalShipments?.toLocaleString() || '0'}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Active Shipments</p>
                  <p className="text-2xl font-bold">{stats?.activeShipments?.toLocaleString() || '0'}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">{stats?.totalRevenue || '£0.00'}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{stats?.totalUsers?.toLocaleString() || '0'}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search users, shipments, or transactions..."
              className="pl-10"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="shipments">Shipments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>{stats?.newUsersToday || 0} new users today</CardDescription>
                </CardHeader>
                <CardContent>
                  {users.slice(0, 5).map(u => (
                    <div key={u.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                      </div>
                      <Badge variant="outline" className={getStatusBadge(u.status)}>
                        {u.status}
                      </Badge>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No users found</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Shipments</CardTitle>
                  <CardDescription>Latest shipment activity</CardDescription>
                </CardHeader>
                <CardContent>
                  {shipments.slice(0, 5).map(s => (
                    <div key={s.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div>
                        <p className="font-medium">{s.id}</p>
                        <p className="text-sm text-muted-foreground">{s.destination}</p>
                      </div>
                      <Badge variant="outline" className={getStatusBadge(s.status)}>
                        {s.status?.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                  {shipments.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No shipments found</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>Manage user accounts and permissions</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Name</th>
                        <th className="text-left py-3 px-2">Email</th>
                        <th className="text-left py-3 px-2">Company</th>
                        <th className="text-left py-3 px-2">Role</th>
                        <th className="text-left py-3 px-2">Status</th>
                        <th className="text-left py-3 px-2">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-2 font-medium">{u.name}</td>
                          <td className="py-3 px-2 text-muted-foreground">{u.email}</td>
                          <td className="py-3 px-2 text-muted-foreground">{u.company || '-'}</td>
                          <td className="py-3 px-2">
                            <Badge variant="outline">{u.role}</Badge>
                          </td>
                          <td className="py-3 px-2">
                            <Badge variant="outline" className={getStatusBadge(u.status)}>
                              {u.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-2 text-muted-foreground">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">No users match your search</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shipments">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Shipments</CardTitle>
                    <CardDescription>Monitor and manage all shipments</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">AWB</th>
                        <th className="text-left py-3 px-2">Sender</th>
                        <th className="text-left py-3 px-2">Origin</th>
                        <th className="text-left py-3 px-2">Destination</th>
                        <th className="text-left py-3 px-2">Service</th>
                        <th className="text-left py-3 px-2">Status</th>
                        <th className="text-left py-3 px-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredShipments.map(s => (
                        <tr key={s.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-2 font-medium">{s.id}</td>
                          <td className="py-3 px-2">{s.sender}</td>
                          <td className="py-3 px-2 text-muted-foreground">{s.origin}</td>
                          <td className="py-3 px-2 text-muted-foreground">{s.destination}</td>
                          <td className="py-3 px-2">
                            <Badge variant="outline">{s.service}</Badge>
                          </td>
                          <td className="py-3 px-2">
                            <Badge variant="outline" className={getStatusBadge(s.status)}>
                              {s.status?.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="py-3 px-2 text-muted-foreground">
                            {new Date(s.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredShipments.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">No shipments match your search</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue trends</CardDescription>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>Revenue analytics coming soon</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Shipment Distribution</CardTitle>
                  <CardDescription>By service type</CardDescription>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <PieChart className="h-12 w-12 mx-auto mb-2" />
                    <p>Distribution analytics coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
'''

with open('/mnt/agents/output/airpak-repair/Admin.tsx', 'w') as f:
    f.write(admin_fix)

