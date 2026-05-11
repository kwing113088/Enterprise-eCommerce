import React from 'react';
import { PaymentStatus } from '@/types';
import { formatPrice } from '@/lib/products';
import { getAllOrders } from '@/lib/orders';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const STATUS_CONFIG: Record<PaymentStatus, { label: string; class: string; icon: string }> = {
  pending:    { label: 'Pending',    class: 'badge status-pending',    icon: '⏳' },
  processing: { label: 'Processing', class: 'badge status-processing', icon: '🔄' },
  succeeded:  { label: 'Succeeded',  class: 'badge status-succeeded',  icon: '✅' },
  failed:     { label: 'Failed',     class: 'badge status-failed',     icon: '❌' },
  canceled:   { label: 'Canceled',   class: 'badge status-canceled',   icon: '🚫' },
  refunded:   { label: 'Refunded',   class: 'badge status-refunded',   icon: '↩️' },
};

export default async function OrdersPage() {
  const orders = await getAllOrders();

  return (
    <div style={{ padding: 'var(--space-8) 0 var(--space-16)' }}>
      <div className="container" style={{ maxWidth: 900 }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-10)' }}>
          <div className="section-eyebrow">📦 Your Account</div>
          <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Order History</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Track and manage your past orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <p className="empty-state-title">No orders yet</p>
            <p className="empty-state-desc">Your completed orders will appear here.</p>
            <Link href="/" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {orders.map((order, i) => {
              const cfg = STATUS_CONFIG[order.status];

              return (
                <details
                  key={order.id}
                  className="card"
                  style={{ padding: 0, overflow: 'hidden', animation: `fadeInUp 0.4s ease ${i * 80}ms both` }}
                >
                  <summary
                    style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                      padding: 'var(--space-5) var(--space-6)',
                      cursor: 'pointer', flexWrap: 'wrap',
                      listStyle: 'none',
                    }}
                  >
                    {/* Order ID */}
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 2 }}>Order ID</p>
                      <p style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--color-accent-light)' }}>{order.id}</p>
                    </div>

                    {/* Date */}
                    <div style={{ minWidth: 140 }}>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 2 }}>Date</p>
                      <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>

                    {/* Items count */}
                    <div style={{ minWidth: 80 }}>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 2 }}>Items</p>
                      <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{order.summary.itemCount}</p>
                    </div>

                    {/* Total */}
                    <div style={{ minWidth: 100 }}>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 2 }}>Total</p>
                      <p style={{ fontWeight: 700, fontSize: 'var(--text-base)' }}>{formatPrice(order.summary.total)}</p>
                    </div>

                    {/* Status */}
                    <span className={cfg.class} style={{ padding: '0.3rem 0.8rem' }}>
                      {cfg.icon} {cfg.label}
                    </span>
                    
                    <span style={{ color: 'var(--color-text-muted)', marginLeft: 'var(--space-2)' }}>▼</span>
                  </summary>

                  {/* Expanded Details */}
                  <div style={{
                    borderTop: '1px solid var(--color-border)',
                    padding: 'var(--space-5) var(--space-6)',
                    background: 'var(--color-bg-secondary)',
                  }}>
                    {/* Items */}
                    <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>
                      Order Items
                    </h3>
                    {order.items.map((item) => (
                      <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                        <img src={item.product.images[0] || 'https://via.placeholder.com/100'} alt={item.product.name}
                          style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{item.product.name}</p>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Qty: {item.quantity} × {formatPrice(item.product.price)}</p>
                        </div>
                        <p style={{ fontWeight: 700 }}>{formatPrice(item.product.price * item.quantity)}</p>
                      </div>
                    ))}

                    {/* Summary */}
                    <div className="divider" />
                    <div style={{ display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap' }}>
                      <div>
                        {[['Subtotal', formatPrice(order.summary.subtotal)], ['Tax', formatPrice(order.summary.tax)], ['Shipping', order.summary.shipping === 0 ? 'FREE' : formatPrice(order.summary.shipping)]].map(([l, v]) => (
                          <div key={l} style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                            <span style={{ minWidth: 80 }}>{l}</span><span style={{ fontWeight: 600, color: v === 'FREE' ? 'var(--color-success)' : 'var(--color-text-primary)' }}>{v}</span>
                          </div>
                        ))}
                        <div style={{ display: 'flex', gap: 'var(--space-4)', fontWeight: 700, fontSize: 'var(--text-base)', marginTop: 'var(--space-2)' }}>
                          <span style={{ minWidth: 80 }}>Total</span><span className="gradient-text">{formatPrice(order.summary.total)}</span>
                        </div>
                      </div>
                      <div>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 4 }}>Payment Intent</p>
                        <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-light)', background: 'var(--color-bg-elevated)', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>
                          {order.paymentIntentId}
                        </code>
                      </div>
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: 'var(--space-8)', textAlign: 'center' }}>
          <Link href="/" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
