import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import { Link } from "wouter";

export default function Maintenance() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <Card className="max-w-md w-full glass-card">
        <CardContent className="p-10 text-center space-y-4">
          <Wrench className="h-12 w-12 text-primary mx-auto" />
          <h1 className="text-3xl font-bold">We're upgrading.</h1>
          <p className="text-muted-foreground">
            Airpak Express is performing scheduled maintenance. We'll be back online shortly.
          </p>
          <Button asChild><Link href="/">Try again</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}
