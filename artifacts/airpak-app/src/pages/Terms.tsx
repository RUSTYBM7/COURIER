import { PublicLayout } from "@/components/PublicLayout";

export default function Terms() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: October 2023</p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using the Airpak Express application and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>

          <h2>2. Description of Service</h2>
          <p>Airpak Express provides parcel and freight courier services, including booking, tracking, and management interfaces. We reserve the right to modify or discontinue the service with or without notice.</p>

          <h2>3. User Account</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account.</p>

          <h2>4. Shipping Policies</h2>
          <ul>
            <li>Items must be properly packaged according to our guidelines.</li>
            <li>Prohibited items (hazardous materials, illegal substances) will not be accepted.</li>
            <li>Declared weights and dimensions must be accurate. Discrepancies may result in additional charges.</li>
          </ul>

          <h2>5. Liability and Insurance</h2>
          <p>Our liability for lost or damaged shipments is limited to standard industry coverage unless additional insurance is purchased at the time of booking. We are not liable for delays caused by circumstances beyond our control (force majeure, customs delays).</p>
        </div>
      </div>
    </PublicLayout>
  );
}
