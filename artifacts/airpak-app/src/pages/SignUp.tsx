import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useSignUp } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [_, setLocation] = useLocation();
  const signUp = useSignUp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signUp.mutate(
      { data: { name, email, password } },
      {
        onSuccess: () => {
          toast.success("Account created successfully");
          setLocation("/dashboard");
        },
        onError: (err) => {
          toast.error((err.data as { error?: string } | null)?.error ?? err.message ?? "Failed to sign up");
        },
      }
    );
  };

  return (
    <PublicLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4 bg-muted/30">
        <Card className="w-full max-w-sm glass-card border-none shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
            <CardDescription>
              Enter your details below to create your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full rounded-full" disabled={signUp.isPending}>
                {signUp.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create account
              </Button>
              <div className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link href="/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PublicLayout>
  );
}
