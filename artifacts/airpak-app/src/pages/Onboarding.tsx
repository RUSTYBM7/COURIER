import * as React from "react";
import { useLocation } from "wouter";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowRight, Camera, CheckCircle2 } from "lucide-react";

const STEPS = [
  { id: "step-1", label: "Profile" },
  { id: "step-2", label: "Address" },
  { id: "step-3", label: "Preferences" },
];

export default function Onboarding() {
  const [, navigate] = useLocation();
  const [step, setStep] = React.useState(0);
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const [avatar, setAvatar] = React.useState<string | null>(null);
  const [name, setName] = React.useState("");
  const [street, setStreet] = React.useState("");
  const [service, setService] = React.useState("domestic");
  const [language, setLanguage] = React.useState("en");

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const finish = () => {
    toast.success("Welcome to Airpak!");
    navigate("/dashboard");
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome aboard</h1>
          <p className="text-sm text-muted-foreground">Let's set up your account in a few quick steps.</p>
        </div>

        <div className="space-y-3">
          <Progress value={((step + 1) / STEPS.length) * 100} />
          <ol className="flex items-center justify-between gap-2">
            {STEPS.map((s, i) => (
              <li key={s.id} className="flex-1 flex items-center gap-2">
                <div className={"flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold " + (i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                  {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <span className={"text-sm " + (i <= step ? "font-medium" : "text-muted-foreground")}>{s.label}</span>
              </li>
            ))}
          </ol>
        </div>

        <Card>
          <Tabs value={STEPS[step].id}>
            <TabsContent value="step-1">
              <CardHeader>
                <CardTitle>Tell us about you</CardTitle>
                <CardDescription>Your name and avatar.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={avatar ?? undefined} />
                    <AvatarFallback>{name.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
                    <Camera className="mr-2 h-4 w-4" /> Upload photo
                  </Button>
                  <Input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0]; if (f) setAvatar(URL.createObjectURL(f));
                  }} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="step-2">
              <CardHeader>
                <CardTitle>Where do you ship from?</CardTitle>
                <CardDescription>Add your default pickup address.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street address</Label>
                  <Textarea id="street" rows={3} value={street} onChange={(e) => setStreet(e.target.value)} />
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="step-3">
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Choose your defaults.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Preferred service</Label>
                  <Select value={service} onValueChange={setService}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="domestic">Domestic</SelectItem>
                      <SelectItem value="international">International</SelectItem>
                      <SelectItem value="express">Express</SelectItem>
                      <SelectItem value="freight">Freight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="ms">Bahasa Melayu</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>

          <CardContent className="flex items-center justify-between pt-2">
            <Button variant="ghost" onClick={prev} disabled={step === 0}>Back</Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={next}>Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
            ) : (
              <Button onClick={finish}>Finish</Button>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
