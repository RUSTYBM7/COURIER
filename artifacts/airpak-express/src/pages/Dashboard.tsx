dashboard_fix = '''import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/useTheme";
import {
  Package, Truck, Clock, TrendingUp, Search, Plus,
  Bell, Settings, LogOut, ChevronRight, MapPin, Shield,
  AlertTriangle, CheckCircle, Clock3, ArrowUpRight, ArrowDownRight,
  Menu, X, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AirpakLogo } from "@/components/AirpakLogo";

// Types
interface Shipment {
  id: string;
  destination: string;
  status: string;
  date: string;
  weight: string;
  service: string;
  progress: number;
}

interface DashboardStats {
  totalPackages: number;
  packagesChange: string;
  inTransit: number;
  inTransitChange: string;
  delivered: number;
  deliveredChange: string;
  totalSpent: string;
  spentChange: string;
}

interface ActivityItem {
  type: string;
  message: string;
  time: string;
  icon: string;
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { resolvedTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [welcome, setWelcome] = useState(false);

  // Check auth and load data
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('welcome') === 'true') {
      setWelcome(true);
      setTimeout(() => setWelcome(false), 5000);
    }

    // Check auth
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(authData => {
        if (!authData.user) {
          navigate('/signin');
          return;
        }
        setUser(authData.user);
        
        // Load dashboard data
        return Promise.all([
          fetch('/api/dashboard/summary', { credentials: 'include' }).then(r => r.json()),
          fetch('/api/dashboard/activity', { credentials: 'include' }).then(r => r.json()),
          fetch('/api/shipments?limit=5', { credentials: 'include' }).then(r => r.json())
        ]);
      })
      .then(([summaryData, activityData, shipmentsData]) => {
        if (summaryData) setStats(summaryData);
        if (activityData) setActivity(activityData.activity || []);
        if (shipmentsData) setShipments(shipmentsData.shipments || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Dashboard load error:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/signout', { 
        method: 'POST', 
        credentials: 'include' 
      });
      window.localStorage.removeItem('airpak_user');
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tracking?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_transit': return <Truck className="h-4 w-4 text-blue-500" />;
      case 'pending': return <Clock3 className="h-4 w-4 text-yellow-500" />;
      case 'exception': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Package className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      delivered: 'bg-green-500/10 text-green-600 border-green-500/20',
      in_transit: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      exception: 'bg-red-500/10 text-red-600 border-red-500/20',
    };
    return variants[status?.toLowerCase()] || 'bg-muted text-muted-foreground';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'shipment': return <Package className="h-4 w-4" />;
      case 'delivery': return <CheckCircle className="h-4 w-4" />;
      case 'alert': return <AlertTriangle className="h-4 w-4" />;
      case 'payment': return <TrendingUp className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
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
            <h2 className="text-xl font-semibold">Error Loading Dashboard</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Welcome Toast */}
      {welcome && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top">
          <CheckCircle className="h-5 w-5" />
          <span>Welcome to Airpak! Your account is ready.</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link href="/">
              <AirpakLogo className="h-8" />
            </Link>
          </div>
          
          <form onSubmit={handleSearch} className="hidden md:flex items-center max-w-md flex-1 mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Track shipment by AWB or reference..."
                className="pl-10"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
              <Settings className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2 ml-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <span className="hidden md:block text-sm font-medium">{user?.name || 'User'}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t px-4 py-4 space-y-4">
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Track shipment..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            <div className="flex flex-col gap-2">
              <Button variant="ghost" className="justify-start" onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}>
                <Package className="mr-2 h-4 w-4" /> Dashboard
              </Button>
              <Button variant="ghost" className="justify-start" onClick={() => { navigate('/tracking'); setMobileMenuOpen(false); }}>
                <Search className="mr-2 h-4 w-4" /> Tracking
              </Button>
              <Button variant="ghost" className="justify-start" onClick={() => { navigate('/payment'); setMobileMenuOpen(false); }}>
                <TrendingUp className="mr-2 h-4 w-4" /> Payments
              </Button>
              <Button variant="ghost" className="justify-start" onClick={() => { navigate('/settings'); setMobileMenuOpen(false); }}>
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Packages</p>
                  <p className="text-2xl font-bold">{stats?.totalPackages || 0}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <ArrowUpRight className="h-3 w-3 text-green-500" />
                <span className="text-green-600">{stats?.packagesChange || '+0'}</span>
                <span className="text-muted-foreground">this month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">In Transit</p>
                  <p className="text-2xl font-bold">{stats?.inTransit || 0}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-yellow-500" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <ArrowUpRight className="h-3 w-3 text-green-500" />
                <span className="text-green-600">{stats?.inTransitChange || '+0'}</span>
                <span className="text-muted-foreground">this month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Delivered</p>
                  <p className="text-2xl font-bold">{stats?.delivered || 0}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <ArrowUpRight className="h-3 w-3 text-green-500" />
                <span className="text-green-600">{stats?.deliveredChange || '+0'}</span>
                <span className="text-muted-foreground">this month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">{stats?.totalSpent || '£0.00'}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <ArrowDownRight className="h-3 w-3 text-red-500" />
                <span className="text-red-600">{stats?.spentChange || '0%'}</span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipments */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Shipments</h2>
              <Button onClick={() => navigate('/shipments')}>
                <Plus className="mr-2 h-4 w-4" /> New Shipment
              </Button>
            </div>
            
            {shipments.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No shipments yet</h3>
                  <p className="text-muted-foreground mt-1">Create your first shipment to get started</p>
                  <Button className="mt-4" onClick={() => navigate('/shipments')}>
                    <Plus className="mr-2 h-4 w-4" /> Create Shipment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {shipments.map((shipment) => (
                  <Card key={shipment.id} className="hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/tracking?search=${shipment.id}`)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mt-1">
                            {getStatusIcon(shipment.status)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{shipment.id}</span>
                              <Badge variant="outline" className={getStatusBadge(shipment.status)}>
                                {shipment.status?.replace('_', ' ')}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3" />
                              {shipment.destination}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span>{shipment.service}</span>
                              <span>{shipment.weight}</span>
                              <span>{shipment.date}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="mt-3">
                        <Progress value={shipment.progress || 0} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Processing</span>
                          <span>{shipment.progress || 0}%</span>
                          <span>Delivered</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Activity</h2>
            
            {activity.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-8">
                  <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No recent activity</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-4 space-y-4">
                  {activity.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        {getActivityIcon(item.type)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm">{item.message}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/tracking')}>
                  <Search className="mr-2 h-4 w-4" /> Track Shipment
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/payment')}>
                  <TrendingUp className="mr-2 h-4 w-4" /> View Payments
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/settings')}>
                  <Shield className="mr-2 h-4 w-4" /> Account Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
'''

with open('/mnt/agents/output/airpak-repair/Dashboard.tsx', 'w') as f:
    f.write(dashboard_fix)

