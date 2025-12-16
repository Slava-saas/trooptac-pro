import { getBaseUrl } from "@/lib/getBaseUrl";
// app/api/stripe/portal/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

// Stripe SDK braucht Node (nicht Edge)
export const runtime = "nodejs";

export async function POST(req: Request) {
  const APP_URL = getBaseUrl(req);

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.userSettings.findUnique({ where: { id: userId } });

  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: "No customer ID" }, { status: 400 });
  }

  try {
    const stripe = getStripe();

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${APP_URL}/dashboard/settings`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    console.error("Stripe portal error", err);
    return NextResponse.json({ error: "Portal session error" }, { status: 500 });
  }
}

