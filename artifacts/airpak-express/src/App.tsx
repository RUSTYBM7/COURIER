import { Switch, Route, Router as WouterRouter } from "wouter";
import { Suspense, lazy, useEffect } from "react";

const Home = lazy(() => import("@/pages/Home"));
const AboutUs = lazy(() => import("@/pages/AboutUs"));
const Services = lazy(() => import("@/pages/Services"));
const MediaCentre = lazy(() => import("@/pages/MediaCentre"));
const Contact = lazy(() => import("@/pages/Contact"));
const Careers = lazy(() => import("@/pages/Careers"));
const TrackShipment = lazy(() => import("@/pages/TrackShipment"));
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
const NovaShowcase = lazy(() => import("@/pages/NovaShowcase"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-white/60">Loading…</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/aboutus" component={AboutUs} />
        <Route path="/services" component={Services} />
        <Route path="/media-centre" component={MediaCentre} />
        <Route path="/contact" component={Contact} />
        <Route path="/careers" component={Careers} />
        <Route path="/track-shipment" component={TrackShipment} />
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
        <Route path="/nova" component={NovaShowcase} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

export default function App() {
  // Force dark (Geist black/white) theme
  useEffect(() => {
    document.body.classList.add("dark");
  }, []);

  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}
