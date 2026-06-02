import type { Metadata, Viewport } from "next";
import { Inter, Caveat_Brush } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const caveatBrush = Caveat_Brush({ 
  weight: "400", 
  subsets: ["latin"],
  variable: "--font-caveat-brush"
});

export const metadata: Metadata = {
  title: "Airpak Express - International Courier & Shipping Services",
  description: "Trusted international shipping & courier services. Over 30 years of experience delivering across Singapore and the world.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${caveatBrush.variable} bg-background`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
