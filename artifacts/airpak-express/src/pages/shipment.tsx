shipments_fix = '''import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/useTheme";
import {
  ArrowLeft, Package, Plus, Search, Filter, Download,
  MapPin, Calendar, Weight, Truck, CheckCircle, Clock,
  AlertTriangle, ChevronRight, LogOut, Home, Settings,
  Loader2, X, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AirpakLogo } from "@/components/AirpakLogo";

interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: string;
  service: string;
  weight: string;
  createdAt: string;
  estimatedDelivery: string;
  progress: number;
}

interface CreateShipmentForm {
  origin: string;
  destination: string;
  service: string;
  weight: string;
  description: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
}

export default function Shipments() {
  const [, navigate] = useLocation();
  const { resolvedTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  
  const [form, setForm] = useState<CreateShipmentForm>({
    origin: '',
    destination: '',
    service: 'express',
    weight: '',
    description: '',
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
  });

  // Check auth and load shipments
  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (!data.user) {
          navigate('/signin?redirect=/shipments');
          return;
        }
        setUser(data.user);
        
        return fetch('/api/shipments', { credentials: 'include' }).then(r => r.json());
      })
      .then(data => {
        if (data?.shipments) setShipments(data.shipments);
        setLoading(false);
      })
      .catch(err => {
        console.error('Shipments load error:', err);
        setError('Failed to load shipments');
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

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    
    try {
      const res = await fetch('/api/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Failed to create shipment');
        setCreating(false);
        return;
      }
      
      // Add new shipment to list
      setShipments(prev => [data.shipment, ...prev]);
      setShowCreateDialog(false);
      setForm({
        origin: '', destination: '', service: 'express', weight: '',
        description: '', recipientName: '', recipientEmail: '', recipientPhone: ''
      });
      
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const filteredShipments = shipments.filter(s => {
    const matchesSearch = 
      s.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.destination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.origin?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && ['pending', 'in_transit', 'processing'].includes(s.status);
    if (activeTab === 'delivered') return matchesSearch && s.status === 'delivered';
    if (activeTab === 'issues') return matchesSearch && s.status === 'exception';
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      delivered: 'bg-green-500/10 text-green-600 border-green-500/20',
      in_transit: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      processing: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      exception: 'bg-red-500/10 text-red-600 border-red-500/20',
    };
    return variants[status?.toLowerCase()] || 'bg-muted text-muted-foreground';
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_transit': return <Truck className="h-4 w-4 text-blue-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'exception': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Package className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading shipments...</p>
        </div>
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
            <Link href="/">
              <AirpakLogo className="h-8" />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <Home className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Shipments</h1>
            <p className="text-muted-foreground">Manage and track all your shipments</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Shipment
          </Button>
        </div>
        
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 text-destructive">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search shipments..."
              className="pl-10"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All ({shipments.length})</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {filteredShipments.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No shipments found</h3>
                  <p className="text-muted-foreground mt-1">
                    {searchQuery ? 'Try adjusting your search' : 'Create your first shipment to get started'}
                  </p>
                  {!searchQuery && (
                    <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Create Shipment
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredShipments.map(shipment => (
                  <Card 
                    key={shipment.id} 
                    className="hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/tracking?search=${shipment.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            {getStatusIcon(shipment.status)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium font-mono text-sm">{shipment.id}</span>
                              <Badge variant="outline" className={getStatusBadge(shipment.status)}>
                                {shipment.status?.replace('_', ' ')}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {shipment.origin} → {shipment.destination}
                              </span>
                              <span className="flex items-center gap-1">
                                <Weight className="h-3 w-3" />
                                {shipment.weight}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(shipment.createdAt).toLocaleDateString()}
                              </span>
                              <span>Est. delivery: {shipment.estimatedDelivery}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Create Shipment Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Shipment</DialogTitle>
            <DialogDescription>
              Enter shipment details to generate a new Airpak Waybill
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateShipment} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Origin *</Label>
                <Input 
                  id="origin" 
                  placeholder="e.g., London, UK"
                  value={form.origin}
                  onChange={e => setForm({...form, origin: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination *</Label>
                <Input 
                  id="destination" 
                  placeholder="e.g., Tokyo, Japan"
                  value={form.destination}
                  onChange={e => setForm({...form, destination: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service">Service *</Label>
                <select 
                  id="service"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={form.service}
                  onChange={e => setForm({...form, service: e.target.value})}
                >
                  <option value="express">Airpak Express (1-2 days)</option>
                  <option value="standard">Airpak Standard (3-5 days)</option>
                  <option value="economy">Airpak Economy (5-10 days)</option>
                  <option value="freight">Airpak Freight (10+ days)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input 
                  id="weight" 
                  type="number"
                  step="0.1"
                  placeholder="e.g., 2.5"
                  value={form.weight}
                  onChange={e => setForm({...form, weight: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Package Description</Label>
              <Input 
                id="description" 
                placeholder="Brief description of contents"
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
              />
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-3">Recipient Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipientName">Recipient Name *</Label>
                  <Input 
                    id="recipientName" 
                    placeholder="Full name"
                    value={form.recipientName}
                    onChange={e => setForm({...form, recipientName: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipientEmail">Recipient Email</Label>
                  <Input 
                    id="recipientEmail" 
                    type="email"
                    placeholder="email@example.com"
                    value={form.recipientEmail}
                    onChange={e => setForm({...form, recipientEmail: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="recipientPhone">Recipient Phone</Label>
                <Input 
                  id="recipientPhone" 
                  type="tel"
                  placeholder="+44 7700 900000"
                  value={form.recipientPhone}
                  onChange={e => setForm({...form, recipientPhone: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>
                ) : (
                  <><Plus className="mr-2 h-4 w-4" /> Create Shipment</>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
'''

with open('/mnt/agents/output/airpak-repair/Shipments.tsx', 'w') as f:
    f.write(shipments_fix)

