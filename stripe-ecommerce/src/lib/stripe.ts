import Stripe from 'stripe';
import { loadStripe, Stripe as StripeClient } from '@stripe/stripe-js';

// ─── Server-Side Stripe Instance ──────────────────────────────────────────────
// Singleton pattern to avoid creating multiple instances in dev (hot reload)

let stripeServer: Stripe;

export function getStripeServer(): Stripe {
  if (!stripeServer) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        'STRIPE_SECRET_KEY is not set. Please add it to your .env.local file.'
      );
    }
    stripeServer = new Stripe(key, {
      apiVersion: '2026-04-22.dahlia',
      typescript: true,
    });
  }
  return stripeServer;
}

// ─── Client-Side Stripe Promise ───────────────────────────────────────────────
// loadStripe is cached internally by the Stripe.js SDK

let stripeClientPromise: Promise<StripeClient | null> | null = null;

export function getStripeClient(): Promise<StripeClient | null> {
  if (!stripeClientPromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.warn(
        'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Payment UI will not load.'
      );
      return Promise.resolve(null);
    }
    stripeClientPromise = loadStripe(key);
  }
  return stripeClientPromise;
}

// ─── Idempotency Key Generator ────────────────────────────────────────────────

export function generateIdempotencyKey(cartHash: string): string {
  return `cart_${cartHash}_${Date.now()}`;
}

// ─── Cart Hash for Idempotency ────────────────────────────────────────────────

export function hashCart(
  items: Array<{ productId: string; quantity: number }>
): string {
  const sorted = [...items].sort((a, b) =>
    a.productId.localeCompare(b.productId)
  );
  return Buffer.from(JSON.stringify(sorted)).toString('base64').slice(0, 32);
}
