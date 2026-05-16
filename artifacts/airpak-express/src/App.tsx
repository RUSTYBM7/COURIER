import { Switch, Route, Router as WouterRouter } from "wouter";
import { Suspense, lazy } from "react";

const SignIn = lazy(() => import("@/pages/SignIn"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Tracking = lazy(() => import("@/pages/Tracking"));
const Settings = lazy(() => import("@/pages/Settings"));
const Payment = lazy(() => import("@/pages/Payment"));
const Chat = lazy(() => import("@/pages/Chat"));
const Admin = lazy(() => import("@/pages/Admin"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const Terms = lazy(() => import("@/pages/Terms"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Home = lazy(() => import("@/pages/Home"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function LoadingFallback() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--apple-bg)" }}>
      <div style={{ textAlign: "center" }}>
        <svg width="40" height="40" viewBox="0 0 32 32" fill="none" style={{ margin: "0 auto 16px" }}>
          <rect width="32" height="32" rx="6" fill="#007AFF"/>
          <path d="M8 16h16M16 8v16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="16" cy="16" r="6" fill="none" stroke="white" strokeWidth="2"/>
        </svg>
        <p style={{ color: "var(--apple-label-secondary)", fontSize: "14px" }}>Loading…</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/tracking" component={Tracking} />
        <Route path="/settings" component={Settings} />
        <Route path="/payment" component={Payment} />
        <Route path="/chat" component={Chat} />
        <Route path="/admin" component={Admin} />
        <Route path="/faq" component={FAQ} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <>
      <a href="#main-content" className="skip-nav">Skip to main content</a>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </>
  );
}

export default App;
