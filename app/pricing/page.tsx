import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { UpgradeToProButton } from "@/components/UpgradeToProButton";
import { ManageSubscriptionButton } from "@/components/ManageSubscriptionButton";

export const metadata = {
  title: "Pricing – TroopTac.pro",
  description: "PvP March Calculator pricing",
};

export default async function PricingPage() {
  const surfaceCard = "bg-muted/20 border-border/60 shadow-lg";

  const { userId } = await auth();
  const user = userId
    ? await prisma.userSettings.findUnique({ where: { id: userId } })
    : null;

  const isPro = user?.isPro ?? false;

  return (
    <main className="space-y-10 py-8">
      <section className="space-y-3">
        <Badge variant="secondary">TroopTac.pro</Badge>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Pricing
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          One plan. Clear value. Cancel anytime.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 md:items-start">
        <Card className={surfaceCard}>
          <CardHeader>
            <CardTitle>Pro</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <ul className="list-disc space-y-1 pl-5">
              <li>Full calculator access</li>
              <li>Save plans + history</li>
              <li>Subscription managed in Stripe portal</li>
            </ul>

            <div className="space-y-2">
              {!userId ? (
                <Button asChild className="w-full">
                  <Link href="/sign-in">Sign in to subscribe</Link>
                </Button>
              ) : isPro ? (
                <ManageSubscriptionButton />
              ) : (
                <UpgradeToProButton />
              )}

              <Button asChild variant="secondary" className="w-full">
                <Link href="/dashboard/settings">Go to Account</Link>
              </Button>

              <p className="text-xs text-muted-foreground">
                You’ll be redirected to Stripe Checkout to complete payment.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className={surfaceCard}>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="list-disc space-y-1 pl-5">
                <li>Cancel anytime in your Account.</li>
                <li>No tracking on the marketing site.</li>
                <li>Secure auth and billing (Clerk + Stripe).</li>
              </ul>
            </CardContent>
          </Card>

          <Separator />

          <div className="text-sm text-muted-foreground">
            Prefer to start right away?{" "}
            <Link href="/dashboard/calculator" className="hover:underline">
              Open Calculator →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
