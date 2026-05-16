import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useSignIn } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [_, setLocation] = useLocation();
  const signIn = useSignIn();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn.mutate(
      { data: { email, password } },
      {
        onSuccess: (data) => {
          toast.success("Welcome back");
          setLocation(data.user.role === "admin" ? "/admin" : "/dashboard");
        },
        onError: (err) => {
          toast.error((err.data as { error?: string } | null)?.error ?? err.message ?? "Failed to sign in");
        },
      }
    );
  };

  return (
    <PublicLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4 bg-muted/30">
        <Card className="w-full max-w-sm glass-card border-none shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Sign in</CardTitle>
            <CardDescription>
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/reset" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full rounded-full" disabled={signIn.isPending}>
                {signIn.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>
              <div className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
              <div className="mt-4 text-xs text-center text-muted-foreground p-3 bg-muted rounded-lg">
                <p>Demo creds:</p>
                <p>demo@airpak.com / demo1234</p>
                <p>admin@airpak.com / admin1234</p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PublicLayout>
  );
}
