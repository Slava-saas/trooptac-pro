// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

// Wichtig: Node-Runtime (Stripe SDK braucht Node, kein Edge)
export const runtime = "nodejs";

function isProFromStatus(status: Stripe.Subscription.Status | null | undefined) {
  return status === "active" || status === "trialing";
}

function toDateFromUnixSeconds(sec: number | null | undefined) {
  return typeof sec === "number" ? new Date(sec * 1000) : null;
}

function minPeriodEndFromItems(sub: Stripe.Subscription) {
  const ends = sub.items?.data
    ?.map((i) => i.current_period_end)
    .filter((x): x is number => typeof x === "number");

  if (!ends || ends.length === 0) return null;
  return toDateFromUnixSeconds(Math.min(...ends));
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // NICHT im Module-Scope werfen (bricht `next build` beim Collecting Page Data)
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!endpointSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const body = await req.text(); // Raw body für Stripe
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const customer =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id;

      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;

      const userId = session.metadata?.userId;

      // Wir verknüpfen userId <-> customer/subscription (nur hier haben wir userId sicher)
      if (userId && customer) {
        let subStatus: Stripe.Subscription.Status | null = null;
        let currentPeriodEnd: Date | null = null;
        let cancelAtPeriodEnd: boolean | null = null;
        let cancelAt: Date | null = null;
        let canceledAt: Date | null = null;

        // Subscription optional sicher nachladen für Status + current_period_end
        if (subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          subStatus = sub.status;
          currentPeriodEnd = minPeriodEndFromItems(sub);
          cancelAtPeriodEnd = sub.cancel_at_period_end ?? null;
          cancelAt = toDateFromUnixSeconds(sub.cancel_at);
          canceledAt = toDateFromUnixSeconds(sub.canceled_at);
        }

        await prisma.userSettings.upsert({
          where: { id: userId },
          update: {
            stripeCustomerId: customer,
            stripeSubscriptionId: subscriptionId ?? null,
            stripeSubscriptionStatus: subStatus,
            stripeCurrentPeriodEnd: currentPeriodEnd,
            stripeCancelAtPeriodEnd: cancelAtPeriodEnd,
            stripeCancelAt: cancelAt,
            stripeCanceledAt: canceledAt,
            isPro: isProFromStatus(subStatus),
          },
          create: {
            id: userId,
            stripeCustomerId: customer,
            stripeSubscriptionId: subscriptionId ?? null,
            stripeSubscriptionStatus: subStatus,
            stripeCurrentPeriodEnd: currentPeriodEnd,
            stripeCancelAtPeriodEnd: cancelAtPeriodEnd,
            stripeCancelAt: cancelAt,
            stripeCanceledAt: canceledAt,
            isPro: isProFromStatus(subStatus),
          },
        });
      }
    }

    if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as Stripe.Subscription;

      const customer =
        typeof sub.customer === "string" ? sub.customer : sub.customer?.id;

      if (customer) {
        await prisma.userSettings.updateMany({
          where: { stripeCustomerId: customer },
          data: {
            stripeSubscriptionId: sub.id,
            stripeSubscriptionStatus: sub.status,
            stripeCurrentPeriodEnd: minPeriodEndFromItems(sub),
            stripeCancelAtPeriodEnd: sub.cancel_at_period_end,
            stripeCancelAt: toDateFromUnixSeconds(sub.cancel_at),
            stripeCanceledAt: toDateFromUnixSeconds(sub.canceled_at),
            isPro: isProFromStatus(sub.status),
          },
        });
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;

      const customer =
        typeof sub.customer === "string" ? sub.customer : sub.customer?.id;

      if (customer) {
        await prisma.userSettings.updateMany({
          where: { stripeCustomerId: customer },
          data: {
            stripeSubscriptionId: sub.id,
            stripeSubscriptionStatus: sub.status,
            stripeCurrentPeriodEnd: minPeriodEndFromItems(sub),
            stripeCancelAtPeriodEnd: sub.cancel_at_period_end,
            stripeCancelAt: toDateFromUnixSeconds(sub.cancel_at),
            stripeCanceledAt: toDateFromUnixSeconds(sub.canceled_at),
            isPro: false,
          },
        });
      }
    }
  } catch (err) {
    console.error("[webhook] Handler error", event.type, err);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }

  return NextResponse.json({ status: "success" }, { status: 200 });
}

