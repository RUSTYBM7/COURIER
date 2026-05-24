reset_fix = '''import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/useTheme";
import {
  ArrowLeft, Moon, Sun, Loader2, CheckCircle, AlertTriangle,
  Mail, Lock, Eye, EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AirpakLogo } from "@/components/AirpakLogo";

export default function ResetPassword() {
  const [, navigate] = useLocation();
  const { toggle, resolvedTheme } = useTheme();
  
  // Step 1: Request reset email
  const [email, setEmail] = useState("");
  
  // Step 2: Enter new password (with token from URL)
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [step, setStep] = useState<'request' | 'success' | 'reset' | 'complete'>('request');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check for token in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      setToken(urlToken);
      setStep('reset');
    }
  }, []);

  // Request password reset email
  async function handleRequestReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!email || !email.includes('@')) {
      setError("Please enter a valid email address.");
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/reset-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      
      // Always show success to prevent email enumeration
      setStep('success');
      setSuccess('If an account exists with this email, you will receive password reset instructions shortly.');
      
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Reset password with token
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!token) {
      setError("Invalid or expired reset link. Please request a new one.");
      return;
    }
    
    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Failed to reset password. The link may have expired.');
        setLoading(false);
        return;
      }
      
      setStep('complete');
      setSuccess('Your password has been reset successfully.');
      
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center justify-between">
            <AirpakLogo className="h-8" />
            <Button variant="ghost" size="icon" onClick={toggle}>
              {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
          
          {step === 'request' && (
            <>
              <div className="text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">Forgot password?</h1>
                <p className="text-muted-foreground">
                  No worries, we'll send you reset instructions.
                </p>
              </div>
              
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <p>{error}</p>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="you@company.com"
                      className="pl-10"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>
              
              <Button variant="ghost" className="w-full" onClick={() => navigate('/signin')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to sign in
              </Button>
            </>
          )}
          
          {step === 'success' && (
            <>
              <div className="text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold">Check your email</h1>
                <p className="text-muted-foreground">
                  {success}
                </p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
                <p>Didn't receive the email?</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Check your spam folder</li>
                  <li>Verify your email address is correct</li>
                  <li>Wait a few minutes and try again</li>
                </ul>
              </div>
              
              <Button variant="outline" className="w-full" onClick={() => setStep('request')}>
                Try another email
              </Button>
              
              <Button variant="ghost" className="w-full" onClick={() => navigate('/signin')}>
                Back to sign in
              </Button>
            </>
          )}
          
          {step === 'reset' && (
            <>
              <div className="text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">Set new password</h1>
                <p className="text-muted-foreground">
                  Your new password must be different from previous passwords.
                </p>
              </div>
              
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <p>{error}</p>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="newPassword" 
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 8 characters"
                      className="pl-10"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      disabled={loading}
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="confirmPassword" 
                      type={showPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      className="pl-10"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...</>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>
            </>
          )}
          
          {step === 'complete' && (
            <>
              <div className="text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold">Password reset!</h1>
                <p className="text-muted-foreground">
                  {success} You can now sign in with your new password.
                </p>
              </div>
              
              <Button className="w-full" onClick={() => navigate('/signin')}>
                Sign In
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
'''

with open('/mnt/agents/output/airpak-repair/ResetPassword.tsx', 'w') as f:
    f.write(reset_fix)

