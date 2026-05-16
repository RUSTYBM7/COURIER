import { Switch, Route, Router as WouterRouter } from "wouter";
import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/components/i18n-provider";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
});

// Core
const Landing  = lazy(() => import("@/pages/Landing"));
const SignIn   = lazy(() => import("@/pages/SignIn"));
const SignUp   = lazy(() => import("@/pages/SignUp"));
const ResetPw  = lazy(() => import("@/pages/ResetPassword"));
const Dashboard= lazy(() => import("@/pages/Dashboard"));
const Tracking = lazy(() => import("@/pages/Tracking"));
const ShipNow  = lazy(() => import("@/pages/ShipNow"));
const Shipments= lazy(() => import("@/pages/Shipments"));
const Messages = lazy(() => import("@/pages/Messages"));
const Payment  = lazy(() => import("@/pages/Payment"));
const Settings = lazy(() => import("@/pages/Settings"));
const Admin    = lazy(() => import("@/pages/Admin"));
const Faq      = lazy(() => import("@/pages/Faq"));
const Contact  = lazy(() => import("@/pages/Contact"));
const About    = lazy(() => import("@/pages/About"));
const Terms    = lazy(() => import("@/pages/Terms"));
const Privacy  = lazy(() => import("@/pages/Privacy"));

// Customer / authenticated
const ShipmentDetail = lazy(() => import("@/pages/ShipmentDetail"));
const ShipmentLabel  = lazy(() => import("@/pages/ShipmentLabel"));
const Addresses      = lazy(() => import("@/pages/Addresses"));
const AddressNew     = lazy(() => import("@/pages/AddressNew"));
const AddressEdit    = lazy(() => import("@/pages/AddressEdit"));
const Pickup         = lazy(() => import("@/pages/Pickup"));
const PickupHistory  = lazy(() => import("@/pages/PickupHistory"));
const Wallet         = lazy(() => import("@/pages/Wallet"));
const Invoices       = lazy(() => import("@/pages/Invoices"));
const InvoiceDetail  = lazy(() => import("@/pages/InvoiceDetail"));
const Notifications  = lazy(() => import("@/pages/Notifications"));
const Profile        = lazy(() => import("@/pages/Profile"));
const SecuritySettings     = lazy(() => import("@/pages/SecuritySettings"));
const NotificationSettings = lazy(() => import("@/pages/NotificationSettings"));
const Refer          = lazy(() => import("@/pages/Refer"));
const Chat           = lazy(() => import("@/pages/Chat"));
const Onboarding     = lazy(() => import("@/pages/Onboarding"));

// Marketing / public
const Services             = lazy(() => import("@/pages/Services"));
const ServiceDomestic      = lazy(() => import("@/pages/ServiceDomestic"));
const ServiceInternational = lazy(() => import("@/pages/ServiceInternational"));
const ServiceExpress       = lazy(() => import("@/pages/ServiceExpress"));
const ServiceFreight       = lazy(() => import("@/pages/ServiceFreight"));
const Calculator           = lazy(() => import("@/pages/Calculator"));
const Coverage             = lazy(() => import("@/pages/Coverage"));
const Branches             = lazy(() => import("@/pages/Branches"));
const Business             = lazy(() => import("@/pages/Business"));
const Developers           = lazy(() => import("@/pages/Developers"));
const News                 = lazy(() => import("@/pages/News"));
const NewsArticle          = lazy(() => import("@/pages/NewsArticle"));
const Careers              = lazy(() => import("@/pages/Careers"));
const Press                = lazy(() => import("@/pages/Press"));
const Sustainability       = lazy(() => import("@/pages/Sustainability"));
const Help                 = lazy(() => import("@/pages/Help"));
const HelpArticle          = lazy(() => import("@/pages/HelpArticle"));

// Admin / system
const AdminUserDetail = lazy(() => import("@/pages/AdminUserDetail"));
const AdminReports    = lazy(() => import("@/pages/AdminReports"));
const AdminCouriers   = lazy(() => import("@/pages/AdminCouriers"));
const AdminSettings   = lazy(() => import("@/pages/AdminSettings"));
const Maintenance     = lazy(() => import("@/pages/Maintenance"));
const ErrorPage       = lazy(() => import("@/pages/ErrorPage"));

function Fallback() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
      <div className="flex items-center gap-3">
        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-sm text-muted-foreground">Loading…</span>
      </div>
    </div>
  );
}

function Routes() {
  return (
    <Suspense fallback={<Fallback />}>
      <Switch>
        {/* Core */}
        <Route path="/"          component={Landing} />
        <Route path="/signin"    component={SignIn} />
        <Route path="/signup"    component={SignUp} />
        <Route path="/reset"     component={ResetPw} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/tracking"  component={Tracking} />
        <Route path="/tracking/:id" component={Tracking} />
        <Route path="/shipnow"   component={ShipNow} />
        <Route path="/shipments" component={Shipments} />
        <Route path="/shipments/:id" component={ShipmentDetail} />
        <Route path="/shipments/:id/label" component={ShipmentLabel} />
        <Route path="/messages"  component={Messages} />
        <Route path="/chat"      component={Chat} />
        <Route path="/payment"   component={Payment} />
        <Route path="/wallet"    component={Wallet} />
        <Route path="/invoices"  component={Invoices} />
        <Route path="/invoices/:id" component={InvoiceDetail} />
        <Route path="/addresses" component={Addresses} />
        <Route path="/addresses/new" component={AddressNew} />
        <Route path="/addresses/:id" component={AddressEdit} />
        <Route path="/pickup"    component={Pickup} />
        <Route path="/pickup/history" component={PickupHistory} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/profile"   component={Profile} />
        <Route path="/refer"     component={Refer} />
        <Route path="/settings"  component={Settings} />
        <Route path="/settings/security" component={SecuritySettings} />
        <Route path="/settings/notifications" component={NotificationSettings} />

        {/* Marketing */}
        <Route path="/services"  component={Services} />
        <Route path="/services/domestic" component={ServiceDomestic} />
        <Route path="/services/international" component={ServiceInternational} />
        <Route path="/services/express" component={ServiceExpress} />
        <Route path="/services/freight" component={ServiceFreight} />
        <Route path="/calculator" component={Calculator} />
        <Route path="/coverage"  component={Coverage} />
        <Route path="/branches"  component={Branches} />
        <Route path="/business"  component={Business} />
        <Route path="/developers" component={Developers} />
        <Route path="/news"      component={News} />
        <Route path="/news/:slug" component={NewsArticle} />
        <Route path="/careers"   component={Careers} />
        <Route path="/press"     component={Press} />
        <Route path="/sustainability" component={Sustainability} />
        <Route path="/help"      component={Help} />
        <Route path="/help/:slug" component={HelpArticle} />
        <Route path="/faq"       component={Faq} />
        <Route path="/contact"   component={Contact} />
        <Route path="/about"     component={About} />
        <Route path="/terms"     component={Terms} />
        <Route path="/privacy"   component={Privacy} />

        {/* Admin */}
        <Route path="/admin"     component={Admin} />
        <Route path="/admin/users/:id" component={AdminUserDetail} />
        <Route path="/admin/reports" component={AdminReports} />
        <Route path="/admin/couriers" component={AdminCouriers} />
        <Route path="/admin/settings" component={AdminSettings} />

        {/* System */}
        <Route path="/maintenance" component={Maintenance} />
        <Route path="/error"     component={ErrorPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="airpak-theme">
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider delayDuration={200}>
            <a href="#main" className="skip-nav">Skip to main content</a>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Routes />
            </WouterRouter>
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </QueryClientProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
