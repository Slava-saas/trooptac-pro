// app/cancel/page.tsx
import CancelRequestForm from "./ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CancelPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Cancel subscription</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Request a confirmation link. If an active subscription exists for the email, cancellation will be scheduled for period end.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Abo kündigen</CardTitle>
          <CardDescription>Kündigung Ihres Abonnements (gemäß § 312k BGB) – ohne Login.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Gib die E-Mail-Adresse ein, mit der du das Abonnement abgeschlossen hast. Du erhältst einen Bestätigungslink per E-Mail.
          </p>
          <CancelRequestForm />
          <p className="text-xs text-muted-foreground">
            Alternativ: contact@trooptac.pro (formlos per E-Mail).
          </p>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>English translation</CardTitle>
          <CardDescription>Cancel your subscription without login.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Enter the email used for your subscription. We’ll send a confirmation link. Cancellation is scheduled for the end of the current billing period.
          </p>
          <p className="text-xs text-muted-foreground">
            Alternative: contact@trooptac.pro (email).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
