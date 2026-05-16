import { useState } from "react";
import { Link } from "wouter";
import { useRequestPasswordReset } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const resetPassword = useRequestPasswordReset();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetPassword.mutate(
      { data: { email } },
      {
        onSuccess: () => {
          setIsSubmitted(true);
        },
        onError: (err) => {
          toast.error((err.data as { error?: string } | null)?.error ?? err.message ?? "Failed to request password reset");
        },
      }
    );
  };

  return (
    <PublicLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4 bg-muted/30">
        <Card className="w-full max-w-sm glass-card border-none shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Reset password</CardTitle>
            <CardDescription>
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          {!isSubmitted ? (
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
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full rounded-full" disabled={resetPassword.isPending}>
                  {resetPassword.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send reset link
                </Button>
                <div className="text-sm text-center text-muted-foreground">
                  Remember your password?{" "}
                  <Link href="/signin" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="space-y-4 pt-4 text-center">
              <div className="bg-primary/10 text-primary p-4 rounded-xl text-sm font-medium">
                If an account exists for {email}, you will receive a reset link shortly.
              </div>
              <Button asChild variant="outline" className="w-full rounded-full">
                <Link href="/signin">Return to sign in</Link>
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    </PublicLayout>
  );
}
