import { PublicLayout } from "@/components/PublicLayout";

export default function Privacy() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: October 2023</p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us when using our services:</p>
          <ul>
            <li>Contact information (name, email, phone number)</li>
            <li>Shipping addresses (origin and destination)</li>
            <li>Payment information (processed securely through our payment providers)</li>
            <li>Account credentials</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our shipping services</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices, updates, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
          </ul>

          <h2>3. Data Sharing and Disclosure</h2>
          <p>We may share your information with:</p>
          <ul>
            <li>Logistics partners and carriers necessary to fulfill your shipments</li>
            <li>Customs authorities when legally required for international shipping</li>
            <li>Service providers who perform services on our behalf (e.g., payment processing)</li>
          </ul>

          <h2>4. Security</h2>
          <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.</p>

          <h2>5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at privacy@airpak-express.site.</p>
        </div>
      </div>
    </PublicLayout>
  );
}
