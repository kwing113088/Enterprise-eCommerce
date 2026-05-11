'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStripe } from '@stripe/react-stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { getStripeClient } from '@/lib/stripe';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/products';
import Link from 'next/link';
import type { PaymentIntent } from '@stripe/stripe-js';

const stripePromise = getStripeClient();

function OrderConfirmationContent() {
  const stripe = useStripe();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [status, setStatus] = useState<'loading' | 'succeeded' | 'failed' | 'processing'>('loading');

  const clientSecret = searchParams.get('payment_intent_client_secret');

  useEffect(() => {
    if (!stripe || !clientSecret) {
      setStatus('failed');
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) { setStatus('failed'); return; }
      setPaymentIntent(paymentIntent);
      switch (paymentIntent.status) {
        case 'succeeded':
          setStatus('succeeded');
          clearCart();
          break;
        case 'processing':
          setStatus('processing');
          break;
        default:
          setStatus('failed');
      }
    });
  }, [stripe, clientSecret, clearCart]);

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 'var(--space-4)' }}>
        <div className="spinner spinner-accent spinner-lg" />
        <p style={{ color: 'var(--color-text-secondary)' }}>Verifying your payment…</p>
      </div>
    );
  }

  if (status === 'succeeded') {
    const amount = paymentIntent?.amount ?? 0;
    const id = paymentIntent?.id ?? '';
    return (
      <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto', padding: 'var(--space-16) var(--space-6)' }}>
        {/* Success Animation */}
        <div style={{
          width: 120, height: 120, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto var(--space-8)',
          animation: 'scaleInBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          border: '2px solid rgba(16,185,129,0.3)',
        }}>
          <div style={{
            fontSize: '4rem',
            animation: 'scaleInBounce 0.5s 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both',
          }}>
            ✅
          </div>
        </div>

        <div className="animate-fadeInUp" style={{ animationDelay: '300ms' }}>
          <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 900, marginBottom: 'var(--space-3)' }}>
            Payment <span className="gradient-text">Successful!</span>
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-8)', lineHeight: 1.7 }}>
            Thank you for your order! Your payment of{' '}
            <strong style={{ color: 'var(--color-text-primary)' }}>{formatPrice(amount)}</strong>{' '}
            has been processed successfully.
          </p>
        </div>

        {/* Receipt Card */}
        <div className="card animate-fadeInUp" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-8)', textAlign: 'left', animationDelay: '400ms' }}>
          <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Order Details</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[
              ['Payment ID', id.slice(0, 20) + '…'],
              ['Amount', formatPrice(amount)],
              ['Status', '✅ Succeeded'],
              ['Date', new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
                <span style={{ fontWeight: 600, color: label === 'Status' ? 'var(--color-success)' : 'var(--color-text-primary)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fadeInUp" style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap', animationDelay: '500ms' }}>
          <Link href="/" id="confirmation-continue-shopping" className="btn btn-primary btn-lg">
            Continue Shopping
          </Link>
          <Link href="/orders" className="btn btn-secondary btn-lg">
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'processing') {
    return (
      <div style={{ textAlign: 'center', maxWidth: 500, margin: '0 auto', padding: 'var(--space-16) var(--space-6)' }}>
        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-6)', animation: 'pulse 2s infinite' }}>⏳</div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>Payment Processing</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)' }}>
          Your payment is being processed. This may take a moment. We&apos;ll notify you once confirmed.
        </p>
        <Link href="/orders" className="btn btn-primary">Check Order Status</Link>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', maxWidth: 500, margin: '0 auto', padding: 'var(--space-16) var(--space-6)' }}>
      <div style={{ fontSize: '4rem', marginBottom: 'var(--space-6)' }}>❌</div>
      <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-danger)', marginBottom: 'var(--space-4)' }}>Payment Failed</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)' }}>
        Something went wrong with your payment. Please try again or use a different payment method.
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
        <Link href="/checkout" className="btn btn-primary">Try Again</Link>
        <Link href="/" className="btn btn-secondary">Back to Shop</Link>
      </div>
    </div>
  );
}

function OrderConfirmationPageContent() {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get('payment_intent_client_secret');

  if (!clientSecret) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-20)' }}>
        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-6)' }}>🔍</div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>No Order Found</h1>
        <Link href="/" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 'var(--space-8)' }}>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <OrderConfirmationContent />
      </Elements>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 'var(--space-4)' }}>
        <div className="spinner spinner-accent spinner-lg" />
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading order details…</p>
      </div>
    }>
      <OrderConfirmationPageContent />
    </Suspense>
  );
}
