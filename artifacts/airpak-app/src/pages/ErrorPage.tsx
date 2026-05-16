import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertOctagon } from "lucide-react";
import { Link } from "wouter";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <Card className="max-w-md w-full glass-card">
        <CardContent className="p-10 text-center space-y-4">
          <AlertOctagon className="h-12 w-12 text-destructive mx-auto" />
          <h1 className="text-3xl font-bold">Something went wrong.</h1>
          <p className="text-muted-foreground">
            An unexpected error occurred. Our team has been notified — please try again.
          </p>
          <div className="flex justify-center gap-2">
            <Button asChild variant="outline"><Link href="/">Home</Link></Button>
            <Button onClick={() => window.location.reload()}>Reload</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
