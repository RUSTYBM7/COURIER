tracking_fix = '''import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/useTheme";
import {
  Search, ArrowLeft, Package, Truck, MapPin, Clock, CheckCircle,
  AlertTriangle, ChevronRight, Home, User, LogOut, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AirpakLogo } from "@/components/AirpakLogo";

interface TrackingEvent {
  status: string;
  location: string;
  timestamp: string;
  completed: boolean;
}

interface TrackingResult {
  id: string;
  status: string;
  origin: string;
  destination: string;
  service: string;
  weight: string;
  estimatedDelivery: string;
  progress: number;
  currentLocation: string;
  events: TrackingEvent[];
}

export default function Tracking() {
  const [, navigate] = useLocation();
  const { resolvedTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check auth (optional for tracking - public tracking should work)
  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => setUser(data.user || null))
      .catch(() => {});
    
    // Check URL params for search
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setQuery(searchParam);
      handleSearch(null, searchParam);
    }
  }, []);

  async function handleSearch(e: React.FormEvent | null, overrideQuery?: string) {
    if (e) e.preventDefault();
    
    const searchQuery = overrideQuery || query;
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError("");
    setResult(null);
    setNotFound(false);
    
    try {
      const res = await fetch(`/api/tracking/${encodeURIComponent(searchQuery.trim().toUpperCase())}`, {
        credentials: 'include'
      });
      
      if (res.status === 404) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Tracking lookup failed');
        setLoading(false);
        return;
      }
      
      const data = await res.json();
      setResult(data.shipment);
      
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST', credentials: 'include' });
      window.localStorage.removeItem('airpak_user');
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_transit': return <Truck className="h-5 w-5 text-blue-500" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'exception': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Package className="h-5 w-5 text-muted-foreground" />;
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link href="/">
              <AirpakLogo className="h-8" />
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                  <Home className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => navigate('/signin')}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold">Track Your Shipment</h1>
          <p className="text-muted-foreground">Enter your Airpak Waybill (AWB) number or reference</p>
        </div>
        
        <form onSubmit={(e) => handleSearch(e)} className="flex gap-2 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="e.g., APX-2026-001234"
              className="pl-10"
              value={query}
              onChange={e => setQuery(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading || !query.trim()}>
            {loading ? 'Searching...' : 'Track'}
          </Button>
        </form>
        
        {error && (
          <Card className="mb-6 border-red-500/20">
            <CardContent className="pt-6 flex items-center gap-3 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <p>{error}</p>
            </CardContent>
          </Card>
        )}
        
        {notFound && (
          <Card className="mb-6">
            <CardContent className="pt-6 text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Shipment not found</h3>
              <p className="text-muted-foreground mt-1">
                We couldn't find a shipment with tracking number <strong>{query}</strong>
              </p>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p>Double-check your tracking number and try again.</p>
                <p>Tracking numbers typically look like: <code className="bg-muted px-1 py-0.5 rounded">APX-2026-XXXXXX</code></p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {result && (
          <div className="space-y-6">
            {/* Shipment Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tracking Number</p>
                    <p className="text-xl font-bold">{result.id}</p>
                  </div>
                  <Badge variant="outline" className={getStatusBadge(result.status)}>
                    {result.status?.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">From</p>
                    <p className="font-medium">{result.origin}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">To</p>
                    <p className="font-medium">{result.destination}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Service</p>
                    <p className="font-medium">{result.service}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Est. Delivery</p>
                    <p className="font-medium">{result.estimatedDelivery}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{result.progress}%</span>
                  </div>
                  <Progress value={result.progress} className="h-2" />
                </div>
                
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Current location:</span>
                  <span className="font-medium">{result.currentLocation}</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Shipment History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.events?.map((event, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                      event.completed ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'
                    }`}>
                      {event.completed ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{event.status}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                        <span>•</span>
                        <span>{event.timestamp}</span>
                      </div>
                    </div>
                  </div>
                )) || (
                  <p className="text-muted-foreground text-center py-4">No tracking events available</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Empty State */}
        {!result && !notFound && !loading && !error && (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Enter a tracking number</h3>
              <p className="text-muted-foreground mt-1">
                Track your shipment in real-time with Airpak Express
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Badge variant="secondary">APX-2026-001234</Badge>
                <Badge variant="secondary">APX-2026-005678</Badge>
                <Badge variant="secondary">APX-2026-009012</Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
'''

with open('/mnt/agents/output/airpak-repair/Tracking.tsx', 'w') as f:
    f.write(tracking_fix)

