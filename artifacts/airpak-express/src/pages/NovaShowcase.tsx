import OnboardingFeed01 from "@/components/blocks/onboarding-feed-01"
import EmptyState01 from "@/components/blocks/empty-state-01"
import FormLayout02 from "@/components/blocks/form-layout-02"
import AccountSettings01 from "@/components/blocks/account-settings-01"
import TestimonialsComponent18 from "@/components/blocks/testimonials-component-18"
import SocialProof01 from "@/components/blocks/social-proof-01"
import Portfolio01 from "@/components/blocks/portfolio-01"
import LogoCloud01 from "@/components/blocks/logo-cloud-01"

export default function NovaShowcase() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-white font-semibold text-lg">Nova Blocks</div>
          <a
            href="/dashboard"
            className="text-white/60 text-sm hover:text-white transition-colors"
          >
            ← Back to App
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-32 pb-20 px-6 text-center border-b border-white/10">
        <div className="max-w-2xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full bg-white/6 border border-white/10 text-xs text-white/60 mb-6">
            8 Components · Geist Dark Theme · Radix UI
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4">
            Nova Design System
          </h1>
          <p className="text-white/60 text-base leading-relaxed">
            Airpak Express UI components — glass morphism, frosted panels, Geist dark palette
          </p>
        </div>
      </header>

      {/* Social Proof */}
      <section className="border-b border-white/10">
        <div className="px-6 py-3 border-b border-white/10 bg-white/4">
          <span className="text-xs text-white/40 font-medium tracking-widest uppercase">
            Social Proof — Stats Counter
          </span>
        </div>
        <SocialProof01 />
      </section>

      {/* Onboarding Feed */}
      <section className="border-b border-white/10">
        <div className="px-6 py-3 border-b border-white/10 bg-white/4">
          <span className="text-xs text-white/40 font-medium tracking-widest uppercase">
            Onboarding — Step Feed
          </span>
        </div>
        <OnboardingFeed01 />
      </section>

      {/* Form Layout */}
      <section className="border-b border-white/10">
        <div className="px-6 py-3 border-b border-white/10 bg-white/4">
          <span className="text-xs text-white/40 font-medium tracking-widest uppercase">
            Form — Shipment Booking
          </span>
        </div>
        <FormLayout02 />
      </section>

      {/* Empty State */}
      <section className="border-b border-white/10">
        <div className="px-6 py-3 border-b border-white/10 bg-white/4">
          <span className="text-xs text-white/40 font-medium tracking-widest uppercase">
            Empty State — No Shipments
          </span>
        </div>
        <EmptyState01 />
      </section>

      {/* Account Settings */}
      <section className="border-b border-white/10">
        <div className="px-6 py-3 border-b border-white/10 bg-white/4">
          <span className="text-xs text-white/40 font-medium tracking-widest uppercase">
            Account Settings — Tabs
          </span>
        </div>
        <AccountSettings01 />
      </section>

      {/* Testimonials */}
      <section className="border-b border-white/10">
        <div className="px-6 py-3 border-b border-white/10 bg-white/4">
          <span className="text-xs text-white/40 font-medium tracking-widest uppercase">
            Testimonials — 3-Column Cards
          </span>
        </div>
        <TestimonialsComponent18 />
      </section>

      {/* Portfolio / Services */}
      <section className="border-b border-white/10">
        <div className="px-6 py-3 border-b border-white/10 bg-white/4">
          <span className="text-xs text-white/40 font-medium tracking-widest uppercase">
            Portfolio — Services Grid
          </span>
        </div>
        <Portfolio01 />
      </section>

      {/* Logo Cloud */}
      <section className="border-b border-white/10">
        <div className="px-6 py-3 border-b border-white/10 bg-white/4">
          <span className="text-xs text-white/40 font-medium tracking-widest uppercase">
            Logo Cloud — Brand Partners
          </span>
        </div>
        <LogoCloud01 />
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center">
        <p className="text-white/30 text-xs">
          Airpak Express · Nova Design System · © 2025
        </p>
      </footer>
    </div>
  )
}