'use client';

import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripeClient } from '@/lib/stripe';
import { useCart } from '@/context/CartContext';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { formatPrice } from '@/lib/products';
import Link from 'next/link';
import type { Appearance } from '@stripe/stripe-js';

type CheckoutState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; clientSecret: string; paymentIntentId: string; amount: number }
  | { status: 'error'; message: string }
  | { status: 'empty' };

const stripePromise = getStripeClient();

const STRIPE_APPEARANCE: Appearance = {
  theme: 'night',
  variables: {
    colorPrimary: '#6c63ff',
    colorBackground: '#0d1526',
    colorText: '#f1f5f9',
    colorDanger: '#ef4444',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '8px',
  },
};

export default function CheckoutPage() {
  const { state: cartState, summary } = useCart();
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({ status: 'idle' });

  const hasItems = cartState.items.length > 0;

  useEffect(() => {
    if (!hasItems) {
      setCheckoutState({ status: 'empty' });
      return;
    }

    const createIntent = async () => {
      setCheckoutState({ status: 'loading' });
      try {
        const payload = {
          items: cartState.items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
          currency: 'usd',
        };

        const res = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          setCheckoutState({ status: 'error', message: data.error ?? 'Failed to initialize checkout' });
          return;
        }

        setCheckoutState({
          status: 'ready',
          clientSecret: data.clientSecret,
          paymentIntentId: data.paymentIntentId,
          amount: data.amount,
        });
      } catch (err) {
        setCheckoutState({
          status: 'error',
          message: 'Network error. Please check your connection and try again.',
        });
      }
    };

    createIntent();
  }, [hasItems, cartState.items]);

  return (
    <div style={{ padding: 'var(--space-8) 0 var(--space-16)' }}>
      <div className="container">
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: 'var(--space-8)', textAlign: 'center' }}>
            <div className="section-eyebrow" style={{ justifyContent: 'center' }}>🔒 Secure Checkout</div>
            <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800 }}>Complete Your Order</h1>
            <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
              Powered by Stripe — your payment info is never stored on our servers
            </p>
          </div>

          {/* Empty Cart */}
          {checkoutState.status === 'empty' && (
            <div className="empty-state">
              <div className="empty-state-icon">🛒</div>
              <p className="empty-state-title">Your cart is empty</p>
              <p className="empty-state-desc">Add products to your cart before checking out.</p>
              <Link href="/" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>Browse Products</Link>
            </div>
          )}

          {/* Loading */}
          {checkoutState.status === 'loading' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-20)' }}>
              <div className="spinner spinner-accent spinner-lg" />
              <p style={{ color: 'var(--color-text-secondary)' }}>Preparing secure checkout…</p>
            </div>
          )}

          {/* Error */}
          {checkoutState.status === 'error' && (
            <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
              <div style={{
                background: 'var(--color-danger-bg)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>❌</div>
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-danger)', marginBottom: 'var(--space-3)' }}>
                  Checkout Failed
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
                  {checkoutState.message}
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
                  <button className="btn btn-primary" onClick={() => setCheckoutState({ status: 'idle' })}>
                    Try Again
                  </button>
                  <Link href="/" className="btn btn-secondary">Back to Shop</Link>
                </div>
              </div>
              <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                  ⚙️ Setup Required
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                  Add your Stripe keys to <code style={{ background: 'var(--color-bg-elevated)', padding: '1px 6px', borderRadius: 4 }}>.env.local</code>:<br />
                  <code style={{ color: 'var(--color-accent-light)' }}>STRIPE_SECRET_KEY=sk_test_...</code><br />
                  <code style={{ color: 'var(--color-accent-light)' }}>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...</code>
                </p>
              </div>
            </div>
          )}

          {/* Ready — Stripe Elements */}
          {checkoutState.status === 'ready' && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret: checkoutState.clientSecret,
                appearance: STRIPE_APPEARANCE,
                loader: 'auto',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--space-8)', alignItems: 'start' }}>
                {/* Form */}
                <div className="card" style={{ padding: 'var(--space-8)' }}>
                  <CheckoutForm
                    paymentIntentId={checkoutState.paymentIntentId}
                    amount={checkoutState.amount}
                  />
                </div>

                {/* Order Summary Sidebar */}
                <div style={{ width: 300, flexShrink: 0 }}>
                  <div className="card" style={{ padding: 'var(--space-6)' }}>
                    <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-5)' }}>
                      Order Summary
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
                      {cartState.items.map((item) => (
                        <div key={item.product.id} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                          <div style={{ position: 'relative', flexShrink: 0 }}>
                            <img src={item.product.images[0]} alt={item.product.name}
                              style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                            <span style={{
                              position: 'absolute', top: -6, right: -6,
                              background: 'var(--color-accent)', color: 'white',
                              fontSize: '0.6rem', fontWeight: 700, width: 18, height: 18,
                              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>{item.quantity}</span>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.product.name}
                            </p>
                          </div>
                          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, flexShrink: 0 }}>
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="divider" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
                      {[['Subtotal', formatPrice(summary.subtotal)], ['Tax (8%)', formatPrice(summary.tax)], ['Shipping', summary.shipping === 0 ? 'FREE' : formatPrice(summary.shipping)]].map(([l, v]) => (
                        <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                          <span>{l}</span><span style={{ color: v === 'FREE' ? 'var(--color-success)' : undefined }}>{v}</span>
                        </div>
                      ))}
                      <div className="divider" style={{ margin: 'var(--space-2) 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 'var(--text-xl)' }}>
                        <span>Total</span><span className="gradient-text">{formatPrice(checkoutState.amount)}</span>
                      </div>
                    </div>
                    <div style={{ marginTop: 'var(--space-5)', padding: 'var(--space-3)', background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>🔒 Secured by Stripe</p>
                    </div>
                  </div>
                </div>
              </div>
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}
