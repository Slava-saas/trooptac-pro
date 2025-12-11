// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

// Wichtig: Node-Runtime (Stripe SDK braucht Node, kein Edge)
export const runtime = "nodejs";

// STRIPE_WEBHOOK_SECRET als non-null deklariert
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("STRIPE_WEBHOOK_SECRET is not set");
}

export async function POST(req: NextRequest) {
  console.log("[webhook] Incoming request");

  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    console.error("[webhook] Missing stripe-signature header");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await req.text(); // Raw body für Stripe
  console.log("[webhook] Raw body length:", body.length);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    console.log("[webhook] Event constructed:", event.type);
  } catch (err) {
    console.error("[webhook] Signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("[webhook] Handling checkout.session.completed", {
        id: session.id,
        customer: session.customer,
        metadata: session.metadata,
      });

      const customer =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id;

      const userId = session.metadata?.userId;

      if (userId && customer) {
        console.log("[webhook] Upserting userSettings to PRO", {
          userId,
          customer,
        });

        await prisma.userSettings.upsert({
          where: { id: userId },
          update: { isPro: true, stripeCustomerId: customer },
          create: { id: userId, isPro: true, stripeCustomerId: customer },
        });
      } else {
        console.warn("[webhook] Missing userId or customer in session", {
          userId,
          customer,
        });
      }
    } else if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;
      console.log("[webhook] Handling customer.subscription.deleted", {
        id: sub.id,
        customer: sub.customer,
      });

      const customer =
        typeof sub.customer === "string"
          ? sub.customer
          : sub.customer?.id;

      if (customer) {
        console.log("[webhook] Updating userSettings isPro=false", { customer });

        await prisma.userSettings.updateMany({
          where: { stripeCustomerId: customer },
          data: { isPro: false },
        });
      } else {
        console.warn("[webhook] No customer on subscription.deleted");
      }
    } else {
      console.log("[webhook] Ignoring event type", event.type);
    }
  } catch (err) {
    console.error("[webhook] Error processing event", event.type, err);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }

  console.log("[webhook] Done", event.type);
  return NextResponse.json({ status: "success" }, { status: 200 });
}
