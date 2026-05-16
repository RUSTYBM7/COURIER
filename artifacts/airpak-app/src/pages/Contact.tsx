import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you shortly.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our team is here to help with your shipments, technical support, and business inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Headquarters</h3>
                  <p className="text-muted-foreground mt-1 leading-relaxed">
                    Unit 7, Wales International Hub<br />
                    Cardiff Bay, CF10 5AL<br />
                    United Kingdom
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Phone</h3>
                  <p className="text-muted-foreground mt-1">+44 29 2011 3344</p>
                  <p className="text-xs text-muted-foreground mt-1">Available 24/7</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p className="text-muted-foreground mt-1">support@airpak-express.com</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Hours</h3>
                  <p className="text-muted-foreground mt-1">Mon - Fri: 8am - 8pm GMT<br />Sat - Sun: 9am - 5pm GMT</p>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-2xl overflow-hidden h-[300px] border shadow-inner flex items-center justify-center">
              <span className="text-muted-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Cardiff Bay Hub Location
              </span>
            </div>
          </div>

          <div className="bg-card rounded-3xl p-8 border shadow-sm glass">
            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" className="min-h-[150px] resize-none" required />
              </div>
              <Button type="submit" size="lg" className="w-full rounded-full">Send Message</Button>
            </form>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
