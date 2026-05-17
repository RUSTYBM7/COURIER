import { Link } from "wouter";
import { Facebook, Linkedin, Instagram, Phone, Mail, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-[#1a1a1a] text-gray-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex flex-col leading-none mb-4">
            <span className="font-['Caveat_Brush'] text-3xl text-[#E11D2A]">Airpak<sup className="text-xs">®</sup></span>
            <span className="text-xs font-semibold tracking-wide text-white mt-0.5">Airpak Express</span>
          </div>
          <p className="text-sm leading-relaxed">
            Trusted international shipping & courier services. Over 30 years of experience delivering across Singapore and the world.
          </p>
          <div className="flex gap-3 mt-5">
            <a href="https://www.facebook.com/AirpakExpressSG/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E11D2A] transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="https://www.linkedin.com/company/airpak-express/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E11D2A] transition-colors">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E11D2A] transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Services</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/services#domestic" className="hover:text-[#E11D2A]">Domestic Delivery</Link></li>
            <li><Link href="/services#international" className="hover:text-[#E11D2A]">International Shipping</Link></li>
            <li><Link href="/services#express" className="hover:text-[#E11D2A]">Express Courier</Link></li>
            <li><Link href="/services#freight" className="hover:text-[#E11D2A]">Freight Forwarding</Link></li>
            <li><Link href="/services#enterprise" className="hover:text-[#E11D2A]">Enterprise Solutions</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/aboutus" className="hover:text-[#E11D2A]">About Us</Link></li>
            <li><Link href="/careers" className="hover:text-[#E11D2A]">Careers</Link></li>
            <li><Link href="/media-centre" className="hover:text-[#E11D2A]">Media Centre</Link></li>
            <li><Link href="/contact" className="hover:text-[#E11D2A]">Contact</Link></li>
            <li><Link href="/faq" className="hover:text-[#E11D2A]">FAQ</Link></li>
            <li><Link href="/privacy" className="hover:text-[#E11D2A]">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-[#E11D2A]">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Get in Touch</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 text-[#E11D2A] flex-shrink-0" />
              <span>5 Changi North Way<br />Singapore 498771</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-[#E11D2A] flex-shrink-0" />
              <a href="tel:+6562508588" className="hover:text-[#E11D2A]">+65 6250 8588</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#E11D2A] flex-shrink-0" />
              <a href="mailto:enquiry@airpak-express.site" className="hover:text-[#E11D2A]">enquiry@airpak-express.site</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-400">
          <div>&copy; {new Date().getFullYear()} Airpak Express Pte Ltd. All rights reserved.</div>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-[#E11D2A]">Privacy</Link>
            <Link href="/terms" className="hover:text-[#E11D2A]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
