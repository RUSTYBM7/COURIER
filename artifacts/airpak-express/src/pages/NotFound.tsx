notfound_fix = '''import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/useTheme";
import {
  ArrowLeft, Home, Search, Package, Moon, Sun
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AirpakLogo } from "@/components/AirpakLogo";

export default function NotFound() {
  const [, navigate] = useLocation();
  const { toggle, resolvedTheme } = useTheme();
  
  // Get current path to suggest alternatives
  const currentPath = window.location.pathname;
  const isTracking = currentPath.includes('track') || currentPath.includes('awb');
  const isAdmin = currentPath.includes('admin');
  const isAuth = currentPath.includes('login') || currentPath.includes('sign');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="pt-6 space-y-8">
          <div className="flex items-center justify-between">
            <Link href="/">
              <AirpakLogo className="h-8" />
            </Link>
            <Button variant="ghost" size="icon" onClick={toggle}>
              {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
          
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold text-muted-foreground/50">404</div>
            <h1 className="text-2xl font-bold">Page not found</h1>
            <p className="text-muted-foreground">
              We couldn't find <code className="bg-muted px-1.5 py-0.5 rounded text-sm">{currentPath}</code>. 
              The page may have moved or been removed.
            </p>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Popular destinations
            </h2>
            
            <div className="grid gap-2">
              {isTracking && (
                <Button variant="outline" className="justify-start h-auto py-3" onClick={() => navigate('/tracking')}>
                  <Search className="mr-3 h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Track a Shipment</p>
                    <p className="text-xs text-muted-foreground">Enter your AWB number</p>
                  </div>
                </Button>
              )}
              
              <Button variant="outline" className="justify-start h-auto py-3" onClick={() => navigate('/')}>
                <Home className="mr-3 h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Homepage</p>
                  <p className="text-xs text-muted-foreground">Return to Airpak Express</p>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-auto py-3" onClick={() => navigate('/dashboard')}>
                <Package className="mr-3 h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Dashboard</p>
                  <p className="text-xs text-muted-foreground">Manage your shipments</p>
                </div>
              </Button>
              
              {isAuth && (
                <Button variant="outline" className="justify-start h-auto py-3" onClick={() => navigate('/signin')}>
                  <ArrowLeft className="mr-3 h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Sign In</p>
                    <p className="text-xs text-muted-foreground">Access your account</p>
                  </div>
                </Button>
              )}
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Need help? <Link href="/contact" className="text-primary hover:underline">Contact support</Link></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
'''

with open('/mnt/agents/output/airpak-repair/NotFound.tsx', 'w') as f:
    f.write(notfound_fix)

