'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/products';

export default function CartDrawer() {
  const { state, summary, removeItem, updateQuantity, closeCart } = useCart();
  const { isOpen, items } = state;

  // Trap focus and handle ESC
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeCart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeCart]);

  // Prevent body scroll when open
  React.useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="overlay" onClick={closeCart} aria-label="Close cart" />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        style={{
          position: 'fixed',
          top: 0, right: 0, bottom: 0,
          width: 'min(440px, 100vw)',
          background: 'var(--color-bg-secondary)',
          borderLeft: '1px solid var(--color-border)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'var(--space-6)',
          borderBottom: '1px solid var(--color-border)',
          flexShrink: 0,
        }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 2 }}>
              Shopping Cart
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              {summary.itemCount} {summary.itemCount === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            id="cart-close-btn"
            onClick={closeCart}
            className="btn btn-ghost btn-icon"
            aria-label="Close cart"
            style={{ fontSize: '1.5rem', lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-4)' }}>
          {items.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-16) var(--space-6)' }}>
              <div className="empty-state-icon">🛒</div>
              <p className="empty-state-title">Your cart is empty</p>
              <p className="empty-state-desc">Add some products to get started!</p>
              <button onClick={closeCart} className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {items.map((item, idx) => (
                <div
                  key={item.product.id}
                  className="card"
                  style={{
                    padding: 'var(--space-4)',
                    display: 'flex', gap: 'var(--space-3)',
                    animation: `fadeInUp 0.3s ease ${idx * 60}ms both`,
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  {/* Image */}
                  <div style={{
                    width: 72, height: 72, flexShrink: 0,
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    background: 'var(--color-bg-elevated)',
                  }}>
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontWeight: 600,
                      fontSize: 'var(--text-sm)',
                      marginBottom: 4,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {item.product.name}
                    </p>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent-light)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                      {formatPrice(item.product.price)}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Qty selector */}
                      <div className="qty-selector">
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >−</button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          aria-label="Increase quantity"
                        >+</button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          aria-label={`Remove ${item.product.name}`}
                          style={{
                            color: 'var(--color-text-muted)',
                            fontSize: '1rem',
                            transition: 'color var(--transition-fast)',
                            padding: 4,
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-danger)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Footer */}
        {items.length > 0 && (
          <div style={{
            padding: 'var(--space-5)',
            borderTop: '1px solid var(--color-border)',
            background: 'var(--color-bg-card)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                <span>Subtotal</span><span>{formatPrice(summary.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                <span>Tax (8%)</span><span>{formatPrice(summary.tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                <span>Shipping</span>
                <span style={{ color: summary.shipping === 0 ? 'var(--color-success)' : undefined }}>
                  {summary.shipping === 0 ? 'FREE ✓' : formatPrice(summary.shipping)}
                </span>
              </div>
              {summary.shipping > 0 && (
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  Add {formatPrice(10000 - summary.subtotal)} more for free shipping
                </p>
              )}
              <div className="divider" style={{ margin: 'var(--space-2) 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 'var(--text-lg)' }}>
                <span>Total</span><span className="gradient-text">{formatPrice(summary.total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn btn-primary btn-lg"
              id="cart-checkout-btn"
              style={{ width: '100%', textAlign: 'center' }}
            >
              🔒 Secure Checkout
            </Link>

            <button
              onClick={closeCart}
              className="btn btn-ghost"
              style={{ width: '100%', marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)' }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
