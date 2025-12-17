// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <main className="space-y-12 py-6">
      {/* Hero */}
      <section className="grid gap-6 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          <Badge variant="secondary">TroopTac.pro</Badge>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            March-Calculator for PvP players.
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Build, compare and optimize marches with a fast, focused workflow.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard/calculator">Open Calculator</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            No tracking. Dark-only. Built for speed.
          </p>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>What you get</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div>• Clean input → clear output</div>
            <div>• Saved plans & history (Pro)</div>
            <div>• Subscription managed in Stripe portal</div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Features */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Fast</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Minimal UI. No clutter. Optimized for repeat use.
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Accurate</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Deterministic calculation path and stable defaults.
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Secure</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Auth via Clerk. Billing via Stripe. Monitoring via Sentry.
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Pricing teaser */}
      <section className="grid gap-4 md:grid-cols-2 md:items-center" id="pricing">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Pricing</h2>
          <p className="text-sm text-muted-foreground">
            One plan. Clear value. Cancel anytime.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div>• Full calculator access</div>
            <div>• Save plans + history</div>
            <div>• Manage subscription via portal</div>

            <div className="pt-2">
              <Button asChild className="w-full">
                <Link href="/dashboard/settings">Go to Account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
