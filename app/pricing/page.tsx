import Link from "next/link";
import type Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { UpgradeToProButton } from "@/components/UpgradeToProButton";
import { ManageSubscriptionButton } from "@/components/ManageSubscriptionButton";

export const runtime = "nodejs";

export const metadata = {
  title: "Pricing – TroopTac.pro",
  description: "PvP March Calculator pricing",
};

function formatMoney(cents: number, currency: string) {
  const cur = currency.toUpperCase();
  const locale = cur === "EUR" ? "de-DE" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: cur,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

function intervalLabel(i?: Stripe.Price.Recurring.Interval) {
  if (!i) return "month";
  if (i === "month") return "month";
  if (i === "year") return "year";
  return i;
}

function productNameFromPrice(price: Stripe.Price | null) {
  const p = price?.product;
  if (!p || typeof p === "string") return "TroopTac Pro";
  if ("deleted" in p) return "TroopTac Pro";
  return p.name;
}

export default async function PricingPage() {
  const surfaceCard = "bg-muted/20 border-border/60 shadow-lg";

  const { userId } = await auth();
  const user = userId
    ? await prisma.userSettings.findUnique({ where: { id: userId } })
    : null;
  const isPro = user?.isPro ?? false;

  const stripe = getStripe();
  let price: Stripe.Price | null = null;

  if (process.env.STRIPE_PRICE_ID) {
    try {
      price = await stripe.prices.retrieve(process.env.STRIPE_PRICE_ID, {
        expand: ["product"],
      });
    } catch {
      price = null;
    }
  }

  const productName = productNameFromPrice(price);
  const amountLabel =
    price?.unit_amount != null ? formatMoney(price.unit_amount, price.currency) : "7,00 €";
  const perLabel = intervalLabel(price?.recurring?.interval);

  return (
    <main className="space-y-10 py-10">
      <section className="space-y-3">
        <Badge variant="secondary">TroopTac.pro</Badge>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Pricing
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          One plan. Clear value. Cancel anytime.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 md:items-start">
        <Card className={surfaceCard}>
          <CardHeader className="space-y-2">
            <CardTitle>{productName}</CardTitle>

            <div className="space-y-1">
              <div className="flex items-end gap-2">
                <div className="text-4xl font-semibold tracking-tight">
                  {amountLabel}
                </div>
                <div className="pb-1 text-sm text-muted-foreground">/ {perLabel}</div>
              </div>

              <p className="text-xs text-muted-foreground">
                Subscription. Secure checkout by Stripe.
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 text-sm text-muted-foreground">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Includes
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Full calculator access</li>
                <li>Save Plans + History</li>
                <li>Subscription managed in Stripe portal</li>
              </ul>
            </div>

            <Separator />

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
                Cancel anytime in your Account.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className={surfaceCard}>
            <CardHeader>
              <CardTitle>Why Pro</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="list-disc space-y-1 pl-5">
                <li>Fast, focused workflow for repeat use</li>
                <li>Deterministic results you can act on</li>
                <li>Plans &amp; History for iteration speed</li>
              </ul>
            </CardContent>
          </Card>

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
