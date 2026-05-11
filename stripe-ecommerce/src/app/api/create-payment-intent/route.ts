import { NextRequest, NextResponse } from 'next/server';
import { getStripeServer, hashCart } from '@/lib/stripe';
import { getProductById, formatPrice } from '@/lib/products';
import { createOrder } from '@/lib/orders';
import { CreatePaymentIntentSchema } from '@/lib/validators';
import { CartItem, CartSummary } from '@/types';

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 10000;
const SHIPPING_COST = 999;

export async function POST(req: NextRequest) {
  try {
    // ── Parse & validate body ─────────────────────────────────────────────
    const body = await req.json();
    const parsed = CreatePaymentIntentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { items: requestItems, currency } = parsed.data;

    // ── Server-side price calculation (never trust client prices) ─────────
    const cartItems: CartItem[] = [];

    for (const { productId, quantity } of requestItems) {
      const product = getProductById(productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${productId}` },
          { status: 404 }
        );
      }
      if (product.stock < quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for "${product.name}". Available: ${product.stock}`,
          },
          { status: 422 }
        );
      }
      cartItems.push({ product, quantity });
    }

    // ── Calculate totals ──────────────────────────────────────────────────
    const subtotal = cartItems.reduce(
      (acc, i) => acc + i.product.price * i.quantity,
      0
    );
    const tax = Math.round(subtotal * TAX_RATE);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal + tax + shipping;

    const summary: CartSummary = {
      subtotal,
      tax,
      shipping,
      total,
      itemCount: cartItems.reduce((acc, i) => acc + i.quantity, 0),
    };

    // ── Create PaymentIntent with idempotency key ─────────────────────────
    const stripe = getStripeServer();
    const idempotencyKey = `pi_${hashCart(requestItems)}_${Math.floor(Date.now() / 60000)}`; // stable per minute

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: total,
        currency,
        automatic_payment_methods: { enabled: true },
        metadata: {
          itemCount: summary.itemCount.toString(),
          subtotal: formatPrice(subtotal),
          tax: formatPrice(tax),
          shipping: formatPrice(shipping),
          productIds: requestItems.map((i) => i.productId).join(','),
        },
      },
      { idempotencyKey }
    );

    // ── Create order record ───────────────────────────────────────────────
    await createOrder({
      paymentIntentId: paymentIntent.id,
      items: cartItems,
      summary,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: total,
    });
  } catch (err: unknown) {
    console.error('[create-payment-intent] Error:', err);

    if (err && typeof err === 'object' && 'type' in err) {
      const stripeErr = err as { type: string; message: string };
      // Handle Stripe-specific errors
      if (stripeErr.type === 'StripeInvalidRequestError') {
        return NextResponse.json({ error: stripeErr.message }, { status: 400 });
      }
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
