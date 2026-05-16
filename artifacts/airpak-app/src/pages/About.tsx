import { PublicLayout } from "@/components/PublicLayout";

export default function About() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
          Delivering trust,<br /><span className="text-primary">across the globe.</span>
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-muted-foreground leading-relaxed mb-12">
            Airpak Express was founded on a simple premise: logistics should be seamless, transparent, and reliable. From a single hub in Cardiff, Wales, we have grown into a global network serving businesses and individuals worldwide.
          </p>

          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" 
            alt="Airpak warehouse" 
            className="w-full rounded-3xl mb-12 object-cover h-[400px] border shadow-sm"
          />

          <h3>Our Mission</h3>
          <p>
            To connect the world through efficient, technology-driven logistics. We believe that every parcel carries not just items, but promises, deadlines, and opportunities.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12 not-prose">
            <div className="bg-card p-6 rounded-2xl border shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">150+</div>
              <div className="font-medium text-foreground">Countries Served</div>
            </div>
            <div className="bg-card p-6 rounded-2xl border shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="font-medium text-foreground">Global Support</div>
            </div>
            <div className="bg-card p-6 rounded-2xl border shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <div className="font-medium text-foreground">On-Time Delivery</div>
            </div>
          </div>

          <h3>Technology First</h3>
          <p>
            We've invested heavily in building an intuitive, iOS-grade platform that puts tracking, booking, and management right at your fingertips. No clunky enterprise software — just clean, fast interfaces that work.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
