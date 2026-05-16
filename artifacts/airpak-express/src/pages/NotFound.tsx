import { Link } from "wouter";
import { AirpakLogo } from "@/components/AirpakLogo";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--apple-bg)" }}>
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <AirpakLogo size={48} />
        <h1 style={{ fontSize: "var(--text-9xl)", fontWeight: "var(--font-black)", color: "var(--apple-blue)", margin: "16px 0 8px", letterSpacing: "-0.04em" }}>404</h1>
        <h2 style={{ fontSize: "var(--text-4xl)", fontWeight: "var(--font-bold)", color: "var(--apple-label)", marginBottom: 8 }}>Page Not Found</h2>
        <p style={{ color: "var(--apple-label-secondary)", marginBottom: 32 }}>The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/" className="btn-primary">Go Home</Link>
      </div>
    </div>
  );
}
