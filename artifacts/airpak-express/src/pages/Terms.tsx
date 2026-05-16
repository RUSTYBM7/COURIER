import { AppNav } from "@/components/AppNav";

export default function Terms() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--apple-bg)" }}>
      <AppNav variant="public" />
      <main id="main-content" style={{ paddingTop: "var(--nav-height)", maxWidth: 800, margin: "0 auto", padding: "calc(var(--nav-height) + 40px) 24px 80px" }}>
        <h1 style={{ fontSize: "var(--text-5xl)", fontWeight: "var(--font-bold)", marginBottom: 8, letterSpacing: "-0.02em" }}>Terms of Service</h1>
        <p style={{ color: "var(--apple-label-secondary)", marginBottom: 48 }}>Last updated: January 2026 · Airpak Express Ltd, Cardiff Bay, Wales</p>

        {[
          { title: "1. Acceptance of Terms", body: "By accessing or using the Airpak Express platform at airpak-express.site, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, you may not use our services." },
          { title: "2. Services", body: "Airpak Express provides courier, logistics, and parcel delivery services including domestic and international shipping, real-time tracking, and related digital tools. We reserve the right to modify, suspend, or discontinue any service at any time with reasonable notice." },
          { title: "3. User Accounts", body: "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. Each user may maintain only one account; duplicate accounts may be suspended." },
          { title: "4. Prohibited Items", body: "You may not ship: hazardous materials, illegal drugs, firearms or ammunition, counterfeit goods, live animals (without approved veterinary documentation), human remains, currency exceeding legal limits, or any items prohibited by applicable law or destination country regulations." },
          { title: "5. Liability & Claims", body: "Airpak Express liability for lost or damaged shipments is limited to the declared value of the goods or £100 (whichever is lower) unless additional insurance is purchased. Claims must be filed within 30 days of the scheduled delivery date. We are not liable for indirect, consequential, or special damages." },
          { title: "6. Payment Terms", body: "Payment is due at the time of shipment creation. We accept major credit/debit cards, PayPal, and bank transfers. Business accounts may qualify for monthly invoicing. Disputed charges must be raised within 60 days of the invoice date." },
          { title: "7. Privacy", body: "Your use of our services is also governed by our Privacy Policy (available at airpak-express.site/privacy), which is incorporated into these Terms by reference. We process personal data in accordance with GDPR and applicable UK data protection laws." },
          { title: "8. Intellectual Property", body: "All content, trademarks, and intellectual property on the Airpak Express platform are owned by Airpak Express Ltd or its licensors. You may not reproduce, distribute, or create derivative works without prior written consent." },
          { title: "9. Governing Law", body: "These Terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of Cardiff, Wales, United Kingdom." },
          { title: "10. Contact", body: "For questions about these Terms, contact us at legal@airpak-express.site or write to: Airpak Express Ltd, Unit 7, Wales International Hub, Cardiff Bay, Wales CF10 5AL, United Kingdom." },
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
