// app/api/stripe/checkout/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.STRIPE_PRICE_ID) {
    return NextResponse.json(
      { error: "Missing STRIPE_PRICE_ID" },
      { status: 500 },
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
      success_url: `${APP_URL}/dashboard/settings?checkoutSuccess=true`,
      cancel_url: `${APP_URL}/dashboard/settings?checkoutCanceled=true`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "No checkout URL from Stripe" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error", error);
    return NextResponse.json(
      { error: "Stripe session error" },
      { status: 500 },
    );
  }
}
