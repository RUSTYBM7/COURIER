import { Link } from "wouter";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";

function NavLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link href={href} className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-xs leading-snug text-muted-foreground mt-1">{desc}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="h-16 flex items-center justify-between px-6 border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <img src="/app/brand/airpak-logo.svg" alt="Airpak Express" className="h-8 hidden md:block" />
          <img src="/app/brand/airpak-mark.svg" alt="Airpak" className="h-8 md:hidden" />
        </Link>
        <div className="flex items-center gap-4">
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Services</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[420px] gap-2 p-3 md:grid-cols-2">
                    <NavLink href="/services" title="Overview" desc="All our shipping services" />
                    <NavLink href="/services/domestic" title="Domestic" desc="Same-day & next-day UK" />
                    <NavLink href="/services/international" title="International" desc="200+ countries" />
                    <NavLink href="/services/express" title="Express" desc="Time-critical priority" />
                    <NavLink href="/services/freight" title="Freight" desc="Pallets and bulk" />
                    <NavLink href="/calculator" title="Calculator" desc="Instant rate quote" />
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Company</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[360px] gap-2 p-3 md:grid-cols-2">
                    <NavLink href="/about" title="About" desc="Our Welsh story" />
                    <NavLink href="/careers" title="Careers" desc="Join the team" />
                    <NavLink href="/press" title="Press" desc="Releases & media" />
                    <NavLink href="/news" title="News" desc="Latest updates" />
                    <NavLink href="/sustainability" title="Sustainability" desc="Path to net zero" />
                    <NavLink href="/branches" title="Branches" desc="Hubs worldwide" />
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Support</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[360px] gap-2 p-3 md:grid-cols-2">
                    <NavLink href="/help" title="Help centre" desc="Browse articles" />
                    <NavLink href="/faq" title="FAQ" desc="Common questions" />
                    <NavLink href="/contact" title="Contact" desc="Talk to us" />
                    <NavLink href="/developers" title="Developers" desc="API & webhooks" />
                    <NavLink href="/business" title="For business" desc="Account services" />
                    <NavLink href="/coverage" title="Coverage" desc="Where we deliver" />
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/tracking" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary">Tracking</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <Link href="/signin">
            <Button variant="outline" className="rounded-full">Sign in</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t py-12 px-6 bg-card">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <img src="/app/brand/airpak-logo.svg" alt="Airpak Express" className="h-6 mb-4 grayscale" />
            <p className="text-sm text-muted-foreground">
              Unit 7, Wales International Hub<br />
              Cardiff Bay, CF10 5AL<br />
              United Kingdom<br /><br />
              +44 29 2011 3344<br />
              support@airpak-express.site
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Services</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li><Link href="/services/domestic" className="hover:text-primary">Domestic</Link></li>
              <li><Link href="/services/international" className="hover:text-primary">International</Link></li>
              <li><Link href="/services/express" className="hover:text-primary">Express</Link></li>
              <li><Link href="/services/freight" className="hover:text-primary">Freight</Link></li>
              <li><Link href="/calculator" className="hover:text-primary">Calculator</Link></li>
              <li><Link href="/coverage" className="hover:text-primary">Coverage</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li><Link href="/about" className="hover:text-primary">About</Link></li>
              <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
              <li><Link href="/news" className="hover:text-primary">News</Link></li>
              <li><Link href="/press" className="hover:text-primary">Press</Link></li>
              <li><Link href="/sustainability" className="hover:text-primary">Sustainability</Link></li>
              <li><Link href="/branches" className="hover:text-primary">Branches</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Support</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li><Link href="/help" className="hover:text-primary">Help centre</Link></li>
              <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
              <li><Link href="/developers" className="hover:text-primary">Developers</Link></li>
              <li><Link href="/business" className="hover:text-primary">For business</Link></li>
              <li><Link href="/tracking" className="hover:text-primary">Tracking</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t flex flex-col md:flex-row justify-between gap-3 text-sm text-muted-foreground">
          <div>&copy; {new Date().getFullYear()} Airpak Express. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-primary">Terms</Link>
            <Link href="/privacy" className="hover:text-primary">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
