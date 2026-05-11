import { NextRequest, NextResponse } from 'next/server';
import { getStripeServer } from '@/lib/stripe';
import { updateOrderStatus, getOrderByPaymentIntentId } from '@/lib/orders';
import { PaymentStatus } from '@/types';

// Disable body parsing — Stripe needs the raw body to verify signatures
export const runtime = 'nodejs';

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const body = await req.text(); // raw body for signature verification
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    console.warn('[webhook] Missing Stripe-Signature header');
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  if (!STRIPE_WEBHOOK_SECRET) {
    console.warn('[webhook] STRIPE_WEBHOOK_SECRET not configured — skipping verification in dev');
    // In dev without CLI, process event without verification
  }

  let event;
  const stripe = getStripeServer();

  try {
    if (STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    } else {
      // Dev fallback: parse without verification (NOT for production)
      event = JSON.parse(body);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[webhook] Signature verification failed: ${message}`);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  // ── Handle Events ─────────────────────────────────────────────────────────
  try {
    switch (event.type) {
      case 'payment_intent.created': {
        const pi = event.data.object;
        console.log(`[webhook] PaymentIntent created: ${pi.id}`);
        break;
      }

      case 'payment_intent.processing': {
        const pi = event.data.object;
        console.log(`[webhook] PaymentIntent processing: ${pi.id}`);
        await updateOrderStatus(pi.id, 'processing' as PaymentStatus);
        break;
      }

      case 'payment_intent.succeeded': {
        const pi = event.data.object;
        console.log(`[webhook] ✅ PaymentIntent succeeded: ${pi.id} — $${(pi.amount / 100).toFixed(2)}`);
        const order = await updateOrderStatus(pi.id, 'succeeded' as PaymentStatus);
        if (order) {
          console.log(`[webhook] Order ${order.id} marked as succeeded`);
          // TODO: Send confirmation email, reduce inventory, etc.
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object;
        const failReason = pi.last_payment_error?.message ?? 'Unknown reason';
        console.error(`[webhook] ❌ PaymentIntent failed: ${pi.id} — ${failReason}`);
        await updateOrderStatus(pi.id, 'failed' as PaymentStatus);
        break;
      }

      case 'payment_intent.canceled': {
        const pi = event.data.object;
        console.log(`[webhook] PaymentIntent canceled: ${pi.id}`);
        await updateOrderStatus(pi.id, 'canceled' as PaymentStatus);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object;
        const piId = charge.payment_intent;
        if (piId) {
          console.log(`[webhook] Charge refunded for PI: ${piId}`);
          await updateOrderStatus(piId as string, 'refunded' as PaymentStatus);
        }
        break;
      }

      default:
        console.log(`[webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true, type: event.type });
  } catch (err) {
    console.error('[webhook] Handler error:', err);
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 });
  }
}
