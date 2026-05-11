'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice, getDiscount } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const BADGE_COLORS: Record<string, string> = {
  'Sale':       'badge-danger',
  'New':        'badge-success',
  'Hot':        'badge-gold',
  'Premium':    'badge-accent',
  'Best Seller':'badge-gold',
};

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, isInCart } = useCart();
  const toast = useToast();
  const [hovered, setHovered] = React.useState(false);
  const [adding, setAdding] = React.useState(false);
  const inCart = isInCart(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (adding) return;

    setAdding(true);
    addItem(product);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAdding(false), 600);
  };

  const discount = product.originalPrice
    ? getDiscount(product.price, product.originalPrice)
    : 0;

  return (
    <Link
      href={`/products/${product.id}`}
      id={`product-card-${product.id}`}
      style={{ textDecoration: 'none' }}
    >
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: 'var(--color-bg-card)',
          border: `1px solid ${hovered ? 'var(--color-border-accent)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hovered ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
          animation: `fadeInUp 0.5s ease ${index * 70}ms both`,
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: 'var(--color-bg-elevated)' }}>
          <img
            src={product.images[0]}
            alt={product.name}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.5s ease',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
            }}
            loading="lazy"
          />

          {/* Badge */}
          {product.badge && (
            <div style={{ position: 'absolute', top: 'var(--space-3)', left: 'var(--space-3)' }}>
              <span className={`badge ${BADGE_COLORS[product.badge] ?? 'badge-accent'}`}>
                {product.badge}
              </span>
            </div>
          )}

          {/* Discount */}
          {discount > 0 && (
            <div style={{ position: 'absolute', top: 'var(--space-3)', right: 'var(--space-3)' }}>
              <span className="badge badge-danger">−{discount}%</span>
            </div>
          )}

          {/* Quick Add overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: hovered ? 1 : 0,
            transition: 'opacity var(--transition-base)',
          }}>
            <button
              id={`add-to-cart-${product.id}`}
              onClick={handleAddToCart}
              className={`btn ${inCart ? 'btn-success' : 'btn-primary'} btn-sm`}
              style={{ transform: hovered ? 'scale(1)' : 'scale(0.8)', transition: 'transform 0.3s ease' }}
              disabled={product.stock === 0 || adding}
              aria-label={`Add ${product.name} to cart`}
            >
              {adding ? '✓ Added!' : inCart ? '✓ In Cart' : '+ Add to Cart'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 'var(--space-4)' }}>
          {/* Category */}
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-1)' }}>
            {product.category}
          </p>

          {/* Name */}
          <h3 style={{
            fontSize: 'var(--text-base)', fontWeight: 600,
            marginBottom: 'var(--space-2)',
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            lineHeight: 1.4,
            color: 'var(--color-text-primary)',
          }}>
            {product.name}
          </h3>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
            <div className="stars" style={{ fontSize: '0.75rem' }}>
              {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
            </div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              {product.rating} ({product.reviewCount.toLocaleString()})
            </span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <span className="price-current" style={{ fontSize: 'var(--text-lg)' }}>{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="price-original">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          {/* Stock warning */}
          {product.stock > 0 && product.stock <= 10 && (
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-warning)', marginTop: 'var(--space-2)' }}>
              ⚠ Only {product.stock} left!
            </p>
          )}
          {product.stock === 0 && (
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-danger)', marginTop: 'var(--space-2)' }}>
              Out of stock
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
