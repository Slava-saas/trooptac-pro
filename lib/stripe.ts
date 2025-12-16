// lib/stripe.ts
import Stripe from "stripe";

let _stripe: Stripe | null = null;

// Lazy init: kein Throw beim Import (wichtig für `next build` / Deploy Preview)
// Throw erst, wenn ein Request wirklich Stripe nutzt.
export function getStripe() {
  if (_stripe) return _stripe;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");

  _stripe = new Stripe(key, {
    apiVersion: "2025-11-17.clover",
  });

  return _stripe;
}
