// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <main className="space-y-12 py-10">
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

          <p className="text-sm text-muted-foreground">
            Deterministic. Explainable. Built for competitive play.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link href="/dashboard/calculator">Open Calculator</Link>
            </Button>

            <Button variant="secondary" asChild>
              <Link href="#pricing">Pricing</Link>
            </Button>

            <Link
              href="/sign-in"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            No tracking. Dark-only. Built for speed.
          </p>
        </div>

        {/* Visual slot (later: hero image asset) */}
        <Card className="border-border">
          <CardContent className="p-4 md:p-6">
            <div
              className="aspect-[16/9] w-full rounded-md border border-border bg-muted/20"
              aria-hidden="true"
            />
            <p className="mt-3 text-xs text-muted-foreground">
              Hero visual placeholder (cyan-green energy shield).
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Value + How it works */}
      <section className="grid gap-4 md:grid-cols-2 md:items-start">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>What you get</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="list-disc space-y-2 pl-5">
              <li>Clean input → clear output</li>
              <li>Saved plans &amp; history (Pro)</li>
              <li>Subscription managed in Stripe portal</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>How it works</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ol className="list-decimal space-y-2 pl-5">
              <li>Enter your &amp; enemy boosts &amp; capacities.</li>
              <li>Pick Mode (Damage or Safety).</li>
              <li>Calculate → apply ratios &amp; tiers.</li>
            </ol>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Features */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Fast</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Minimal UI. No clutter. Optimized for repeat use.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accurate</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Deterministic calculation path and stable defaults.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Secure</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Auth via Clerk. Billing via Stripe. Monitoring via Sentry.
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section>
        <Card className="border-border">
          <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between md:p-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight">
                Ready to out-optimize your opponents?
              </h2>
              <p className="text-sm text-muted-foreground">
                Deterministic. Explainable. Built for competitive play.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <Button asChild>
                <Link href="/dashboard/calculator">Open Calculator</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="#pricing">Pricing</Link>
              </Button>
            </div>
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
            <ul className="list-disc space-y-2 pl-5">
              <li>Full calculator access</li>
              <li>Save plans + history</li>
              <li>Manage subscription via portal</li>
            </ul>

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