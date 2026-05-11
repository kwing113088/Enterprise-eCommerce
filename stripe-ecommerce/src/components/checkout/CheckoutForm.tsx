'use client';

import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  AddressElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/products';

interface CheckoutFormProps {
  paymentIntentId: string;
  amount: number;
}

type Step = 'address' | 'payment' | 'review';

export default function CheckoutForm({ paymentIntentId, amount }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { summary, state: cartState, clearCart } = useCart();
  const toast = useToast();

  const [step, setStep] = useState<Step>('address');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [addressComplete, setAddressComplete] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const steps: { id: Step; label: string; icon: string }[] = [
    { id: 'address', label: 'Shipping', icon: '📦' },
    { id: 'payment', label: 'Payment', icon: '💳' },
    { id: 'review', label: 'Review', icon: '✅' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  const handleNextStep = () => {
    if (step === 'address') setStep('payment');
    else if (step === 'payment') setStep('review');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage(null);

    // Confirm all element inputs
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message ?? 'Validation failed');
      setLoading(false);
      return;
    }

    const returnUrl = `${window.location.origin}/order-confirmation?payment_intent=${paymentIntentId}`;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
        receipt_email: email || undefined,
      },
    });

    if (error) {
      const msg =
        error.type === 'card_error' || error.type === 'validation_error'
          ? error.message ?? 'Payment failed'
          : 'An unexpected error occurred. Please try again.';
      setErrorMessage(msg);
      toast.error(msg ?? 'Payment failed');
    }
    // On success, Stripe redirects to return_url — no need to handle here

    setLoading(false);
  };

  const stripeAppearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#6c63ff',
      colorBackground: '#0d1526',
      colorText: '#f1f5f9',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, sans-serif',
      borderRadius: '8px',
      colorTextSecondary: '#94a3b8',
      colorTextPlaceholder: '#64748b',
      colorIconTab: '#94a3b8',
      colorIconTabSelected: '#6c63ff',
    },
    rules: {
      '.Input': {
        border: '1px solid rgba(255,255,255,0.08)',
        backgroundColor: '#111827',
        color: '#f1f5f9',
        boxShadow: 'none',
      },
      '.Input:focus': {
        border: '1px solid #6c63ff',
        boxShadow: '0 0 0 3px rgba(108,99,255,0.2)',
      },
      '.Label': { color: '#94a3b8', fontWeight: '500' },
      '.Tab': { backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)' },
      '.Tab:hover': { backgroundColor: '#1a2236' },
      '.Tab--selected': { backgroundColor: '#1a2236', borderColor: '#6c63ff' },
    },
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Step Indicator */}
      <div style={{ display: 'flex', marginBottom: 'var(--space-8)', position: 'relative' }}>
        {/* Progress line */}
        <div style={{
          position: 'absolute', top: 20, left: '10%', right: '10%',
          height: 2, background: 'var(--color-border)',
        }} />
        <div style={{
          position: 'absolute', top: 20, left: '10%',
          width: `${(currentStepIndex / (steps.length - 1)) * 80}%`,
          height: 2,
          background: 'linear-gradient(90deg, var(--color-accent), var(--color-accent-light))',
          transition: 'width 0.5s ease',
        }} />

        {steps.map((s, i) => {
          const isActive = s.id === step;
          const isDone = i < currentStepIndex;
          return (
            <div key={s.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', position: 'relative' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: isDone ? 'var(--color-success)' : isActive ? 'var(--color-accent)' : 'var(--color-bg-elevated)',
                border: `2px solid ${isDone ? 'var(--color-success)' : isActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', fontWeight: 700,
                transition: 'all 0.3s ease',
                boxShadow: isActive ? '0 0 0 4px var(--color-accent-glow)' : 'none',
                zIndex: 1,
              }}>
                {isDone ? '✓' : s.icon}
              </div>
              <span style={{
                fontSize: 'var(--text-xs)', fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--color-text-primary)' : isDone ? 'var(--color-success)' : 'var(--color-text-muted)',
              }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step: Address */}
      {step === 'address' && (
        <div className="animate-fadeInUp">
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-5)' }}>
            📦 Shipping Information
          </h3>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label className="label" htmlFor="checkout-email">Email address</label>
            <input
              id="checkout-email"
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
              Order confirmation will be sent to this address
            </p>
          </div>

          <AddressElement
            options={{ mode: 'shipping', allowedCountries: ['US', 'CA', 'GB', 'AU'] }}
            onChange={(e) => setAddressComplete(e.complete)}
          />

          <button
            type="button"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: 'var(--space-6)' }}
            onClick={handleNextStep}
            disabled={!addressComplete}
            id="checkout-next-payment"
          >
            Continue to Payment →
          </button>
        </div>
      )}

      {/* Step: Payment */}
      {step === 'payment' && (
        <div className="animate-fadeInUp">
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
            💳 Payment Details
          </h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-5)' }}>
            All transactions are secured and encrypted.
          </p>

          {/* Test cards hint */}
          <div style={{
            background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)',
            borderRadius: 'var(--radius-lg)', padding: 'var(--space-3) var(--space-4)',
            marginBottom: 'var(--space-5)',
          }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-info)', fontWeight: 600, marginBottom: 4 }}>
              🧪 Test Mode — Use these cards:
            </p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
              ✅ Success: <code style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 6px', borderRadius: 4 }}>4242 4242 4242 4242</code><br />
              🔐 3D Secure: <code style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 6px', borderRadius: 4 }}>4000 0027 6000 3184</code><br />
              ❌ Decline: <code style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 6px', borderRadius: 4 }}>4000 0000 0000 0002</code><br />
              Any future expiry date · Any CVC · Any ZIP
            </p>
          </div>

          <PaymentElement
            id="stripe-payment-element"
            onChange={(e) => setPaymentComplete(e.complete)}
            options={{ layout: 'tabs' }}
          />

          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setStep('address')}
              style={{ flex: 1 }}
            >
              ← Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{ flex: 2 }}
              onClick={handleNextStep}
              disabled={!paymentComplete}
              id="checkout-next-review"
            >
              Review Order →
            </button>
          </div>
        </div>
      )}

      {/* Step: Review */}
      {step === 'review' && (
        <div className="animate-fadeInUp">
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-5)' }}>
            ✅ Review Your Order
          </h3>

          {/* Items */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            {cartState.items.map((item) => (
              <div key={item.product.id} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                padding: 'var(--space-3) 0',
                borderBottom: '1px solid var(--color-border)',
              }}>
                <img src={item.product.images[0]} alt={item.product.name}
                  style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{item.product.name}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Qty: {item.quantity}</p>
                </div>
                <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{formatPrice(item.product.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
            {[
              ['Subtotal', formatPrice(summary.subtotal)],
              ['Tax (8%)', formatPrice(summary.tax)],
              ['Shipping', summary.shipping === 0 ? 'FREE ✓' : formatPrice(summary.shipping)],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                <span>{label}</span><span style={{ color: value === 'FREE ✓' ? 'var(--color-success)' : undefined }}>{value}</span>
              </div>
            ))}
            <div className="divider" style={{ margin: 'var(--space-3) 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 'var(--text-lg)' }}>
              <span>Total</span><span className="gradient-text">{formatPrice(amount)}</span>
            </div>
          </div>

          {/* Error */}
          {errorMessage && (
            <div style={{
              background: 'var(--color-danger-bg)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)',
              fontSize: 'var(--text-sm)', color: 'var(--color-danger)',
              marginBottom: 'var(--space-4)',
            }}>
              ❌ {errorMessage}
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setStep('payment')} style={{ flex: 1 }}>
              ← Back
            </button>
            <button
              type="submit"
              id="checkout-pay-btn"
              className="btn btn-primary btn-lg"
              style={{ flex: 2, position: 'relative' }}
              disabled={loading || !stripe || !elements}
            >
              {loading ? (
                <><span className="spinner" /> Processing…</>
              ) : (
                `🔒 Pay ${formatPrice(amount)}`
              )}
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>
            🔒 Secured by Stripe · 256-bit SSL encryption
          </p>
        </div>
      )}
    </form>
  );
}
