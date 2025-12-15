// app/api/cancel/confirm/route.ts
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

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

async function findActiveSubByEmail(email: string): Promise<{
  customerId: string;
  sub: Stripe.Subscription;
} | null> {
  const customers = await stripe.customers.list({ email, limit: 10 });

  const wanted = new Set<Stripe.Subscription.Status>([
    "active",
    "trialing",
    "past_due",
    "unpaid",
  ]);

  for (const cust of customers.data) {
    const subs = await stripe.subscriptions.list({
      customer: cust.id,
      status: "all",
      limit: 20,
      expand: ["data.items.data.price"],
    });

    const sub = subs.data.find((s) => wanted.has(s.status));
    if (sub) return { customerId: cust.id, sub };
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const token = body?.token;

    if (typeof token !== "string" || token.trim().length === 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const parts = token.split(".");
    if (parts.length !== 2) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const [id, emailHash] = parts;
    if (!id || !emailHash) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const row = await prisma.cancelRequest.findFirst({
      where: { id, emailHash },
      select: { id: true, email: true, confirmedAt: true, processedAt: true },
    });

    if (!row) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const now = new Date();

    if (!row.confirmedAt) {
      await prisma.cancelRequest.update({
        where: { id: row.id },
        data: { confirmedAt: now },
      });
    }

    // Idempotent: wenn bereits verarbeitet, fertig
    if (row.processedAt) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Stripe: Abo finden + Kündigung zum Periodenende setzen
    try {
      const hit = await findActiveSubByEmail(row.email);

      if (hit) {
        const updated = await stripe.subscriptions.update(hit.sub.id, {
          cancel_at_period_end: true,
        });

        await prisma.userSettings.updateMany({
          where: { stripeCustomerId: hit.customerId },
          data: {
            stripeSubscriptionId: updated.id,
            stripeSubscriptionStatus: updated.status,
            stripeCurrentPeriodEnd: minPeriodEndFromItems(updated),
            stripeCancelAtPeriodEnd: updated.cancel_at_period_end,
            stripeCancelAt: toDateFromUnixSeconds(updated.cancel_at),
            stripeCanceledAt: toDateFromUnixSeconds(updated.canceled_at),
          },
        });
      }

      await prisma.cancelRequest.update({
        where: { id: row.id },
        data: { processedAt: now },
      });
    } catch (e) {
      console.error("[cancel/confirm] stripe error", e);
      // kein Leak; nicht als processed markieren, damit ein Retry via Link möglich bleibt
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[cancel/confirm] error", err);
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}
