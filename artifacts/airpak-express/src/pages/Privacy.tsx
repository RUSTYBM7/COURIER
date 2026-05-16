import { AppNav } from "@/components/AppNav";

export default function Privacy() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--apple-bg)" }}>
      <AppNav variant="public" />
      <main id="main-content" style={{ maxWidth: 800, margin: "0 auto", padding: "calc(var(--nav-height) + 40px) 24px 80px" }}>
        <h1 style={{ fontSize: "var(--text-5xl)", fontWeight: "var(--font-bold)", marginBottom: 8, letterSpacing: "-0.02em" }}>Privacy Policy</h1>
        <p style={{ color: "var(--apple-label-secondary)", marginBottom: 48 }}>Last updated: January 2026 · GDPR Compliant · ICO Registered</p>

        {[
          { title: "1. Information We Collect", body: "We collect information you provide directly (name, email, address, payment details), information generated through your use of our services (shipment history, tracking data, device information), and information from third parties (address verification services, payment processors)." },
          { title: "2. How We Use Your Information", body: "We use your data to: process and fulfill shipments, communicate about your orders, improve our services, comply with legal obligations, prevent fraud, and send marketing communications where you have consented. We do not sell your personal data to third parties." },
          { title: "3. Legal Basis for Processing (GDPR)", body: "We process your data under the following legal bases: contract performance (processing orders), legitimate interests (security, fraud prevention, service improvement), legal obligation (customs compliance, tax records), and consent (marketing emails). You may withdraw consent at any time." },
          { title: "4. Data Sharing", body: "We share data with: delivery partners and couriers (to fulfill shipments), payment processors (Stripe, PayPal), customs and government authorities (as legally required), and cloud service providers (AWS, Google Cloud) under data processing agreements. All third parties are bound by GDPR-compliant contracts." },
          { title: "5. Data Retention", body: "We retain personal data for: active accounts (as long as your account exists plus 7 years for financial records), shipment records (7 years for customs compliance), marketing preferences (until withdrawn), and security logs (90 days). You may request deletion of non-legally required data at any time." },
          { title: "6. Your Rights (GDPR)", body: "Under GDPR, you have rights to: access your data, rectify inaccurate data, erase your data ('right to be forgotten'), restrict processing, data portability, object to processing, and not be subject to automated decision-making. Contact privacy@airpak-express.site to exercise these rights." },
          { title: "7. Cookies", body: "We use essential cookies (required for the service to function), performance cookies (analytics, anonymized), and preference cookies (theme, language settings). You can manage cookie preferences in your browser settings or through our cookie consent banner." },
          { title: "8. International Transfers", body: "Some data may be transferred outside the UK/EEA to countries without equivalent data protection laws. Where this occurs, we use Standard Contractual Clauses (SCCs) approved by the European Commission to ensure adequate protection." },
          { title: "9. Security", body: "We implement industry-standard security measures including TLS 1.3 encryption, AES-256 data encryption at rest, multi-factor authentication, regular security audits, and penetration testing. Despite these measures, no system is 100% secure." },
          { title: "10. Contact & DPO", body: "Our Data Protection Officer can be reached at dpo@airpak-express.site. For general privacy questions: privacy@airpak-express.site. To file a complaint with the UK supervisory authority: Information Commissioner's Office (ICO), ico.org.uk." },
        ].map(section => (
          <section key={section.title} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--font-semibold)", marginBottom: 12, color: "var(--apple-label)" }}>{section.title}</h2>
            <p style={{ color: "var(--apple-label-secondary)", lineHeight: 1.7, fontSize: "var(--text-md)" }}>{section.body}</p>
          </section>
        ))}
      </main>
    </div>
  );
}
