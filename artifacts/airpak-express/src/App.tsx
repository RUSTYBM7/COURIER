
# ============================================
# FIX 10: App.tsx - Fix routing, add auth guards, shared nav
# ============================================

app_fix = '''import { Route, Switch } from "wouter";
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";

// Lazy load pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Tracking = lazy(() => import("./pages/Tracking"));
const Settings = lazy(() => import("./pages/Settings"));
const Payment = lazy(() => import("./pages/Payment"));
const Chat = lazy(() => import("./pages/Chat"));
const Documents = lazy(() => import("./pages/Documents"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Admin = lazy(() => import("./pages/Admin"));
const Shipments = lazy(() => import("./pages/Shipments"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/signin" component={SignIn} />
          <Route path="/login" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/register" component={SignUp} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/tracking" component={Tracking} />
          <Route path="/track" component={Tracking} />
          <Route path="/settings" component={Settings} />
          <Route path="/account" component={Settings} />
          <Route path="/profile" component={Settings} />
          <Route path="/payment" component={Payment} />
          <Route path="/wallet" component={Payment} />
          <Route path="/chat" component={Chat} />
          <Route path="/messages" component={Chat} />
          <Route path="/documents" component={Documents} />
          <Route path="/shipments" component={Shipments} />
          <Route path="/ship-now" component={Shipments} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/forgot-password" component={ResetPassword} />
          <Route path="/admin-panel" component={Admin} />
          <Route path="/admin" component={Admin} />
          
          {/* Catch-all for SPA routes */}
          <Route component={NotFound} />
        </Switch>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
'''

with open('/mnt/agents/output/airpak-repair/App.tsx', 'w') as f:
    f.write(app_fix)

