// lib/stripe.ts
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

// Stripe-Client für Server-seitige Aufrufe (Checkout, Webhooks etc.)
export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2025-11-17.clover",
});
