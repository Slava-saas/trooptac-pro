// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  // Modern "elevated" surfaces on dark backgrounds: subtle tinted surface + soft shadow.
  const surfaceCard = "bg-muted/20 border-border/60 shadow-lg";

  return (
    <main className="space-y-12 py-8">
      {/* Hero */}
      <section className="grid gap-6 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          <Badge variant="secondary">TroopTac.pro</Badge>

          {/* Kicker in accent blue (falls Token existiert). */}
          <p className="text-sm font-medium tracking-wide text-[color:var(--color-accent-fg,#58a6ff)]">
            Your unfair advantage
          </p>

          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            PvP March Calculator
          </h1>

          <p className="text-sm text-muted-foreground md:text-base">
            Set your march capacity. Enter the enemy formation. TroopTac infers the enemy capacity and
            returns an optimal march with a win prediction—fast, deterministic, battle-ready.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link href="/dashboard/calculator">Open Calculator</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:underline">
              See pricing →
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            No tracking. Dark-only. Built for speed.
          </p>
        </div>

        {/* Hero visual placeholder (replace with CG-art asset later) */}
        <Card className={surfaceCard} aria-hidden="true">
          <CardContent className="p-4">
            <div className="aspect-[16/9] w-full rounded-md border border-border bg-muted/20" />
            <p className="mt-3 text-xs text-muted-foreground">
              Planned hero visual: cyan-green energy shield (CG/Game-Art).
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Value */}
      <section className="grid gap-4 md:grid-cols-2">
        <Card className={surfaceCard}>
          <CardHeader>
            <CardTitle>What you get</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="list-disc space-y-1 pl-5">
              <li>Clean input → clear output</li>
              <li>Saved plans &amp; history (Pro)</li>
              <li>Subscription managed in Stripe portal</li>
            </ul>
          </CardContent>
        </Card>

        <Card className={surfaceCard}>
          <CardHeader>
            <CardTitle>Built for repeat use</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="list-disc space-y-1 pl-5">
              <li>Minimal UI. No clutter.</li>
              <li>Deterministic calculation path.</li>
              <li>Secure auth and billing (Clerk + Stripe).</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* How it works (nur Bullet-Points, keine Nummerierung) */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className={"flex flex-col " + surfaceCard}>
            <CardHeader>
              <CardTitle>Why TroopTac</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4 text-sm text-muted-foreground">
              <ul className="list-disc space-y-1 pl-5">
                <li>Deterministic results. No guesswork.</li>
                <li>Explainable output you can act on.</li>
                <li>Built for competitive play.</li>
              </ul>

              <Link href="#pricing" className="mt-auto text-sm hover:underline">
                Learn more →
              </Link>
            </CardContent>
          </Card>

          <Card className={"flex flex-col " + surfaceCard}>
            <CardHeader>
              <CardTitle>How you use it</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4 text-sm text-muted-foreground">
              <ul className="list-disc space-y-1 pl-5">
                <li>Enter your march capacity.</li>
                <li>Enter the enemy formation.</li>
                <li>Calculate → get an optimal march + win prediction.</li>
              </ul>

              <Link href="/dashboard/calculator" className="mt-auto text-sm hover:underline">
                Try it →
              </Link>
            </CardContent>
          </Card>

          <Card className={"flex flex-col " + surfaceCard}>
            <CardHeader>
              <CardTitle>What you get back</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4 text-sm text-muted-foreground">
              <ul className="list-disc space-y-1 pl-5">
                <li>Optimal march recommendation.</li>
                <li>Win prediction you can act on.</li>
                <li>Clean sections and stable defaults.</li>
              </ul>

              <Link href="/dashboard/calculator" className="mt-auto text-sm hover:underline">
                Open Calculator →
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <Card className={surfaceCard}>
        <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Ready to win more fights with less guessing?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Deterministic. Explainable. Built for competitive play.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link href="/dashboard/calculator">Open Calculator</Link>
            </Button>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:underline">
              See pricing →
            </Link>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Pricing teaser */}
      <section className="grid gap-4 md:grid-cols-2 md:items-center" id="pricing">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Pricing</h2>
          <p className="text-sm text-muted-foreground">
            One plan. Clear value. Cancel anytime.
          </p>
        </div>

        <Card className={surfaceCard}>
          <CardHeader>
            <CardTitle>Pro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ul className="list-disc space-y-1 pl-5">
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


