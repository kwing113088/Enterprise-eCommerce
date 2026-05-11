'use client';

import React, { useState } from 'react';
import { notFound } from 'next/navigation';
import { getProductById, PRODUCTS, formatPrice, getDiscount } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = React.use(params);
  const product = getProductById(id);
  if (!product) notFound();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { addItem, isInCart, openCart } = useCart();
  const toast = useToast();
  const inCart = isInCart(product.id);

  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const discount = product.originalPrice
    ? getDiscount(product.price, product.originalPrice)
    : 0;

  const handleAddToCart = () => {
    if (adding) return;
    setAdding(true);
    for (let i = 0; i < quantity; i++) addItem(product);
    toast.success(`${product.name} (×${quantity}) added to cart!`);
    setTimeout(() => {
      setAdding(false);
      openCart();
    }, 500);
  };

  return (
    <div style={{ paddingTop: 'var(--space-8)' }}>
      <div className="container">
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-8)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          <Link href="/" style={{ color: 'var(--color-accent-light)' }}>Home</Link>
          <span>/</span>
          <Link href={`/?category=${product.category}`} style={{ color: 'var(--color-accent-light)', textTransform: 'capitalize' }}>{product.category}</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</span>
        </nav>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-12)', marginBottom: 'var(--space-16)' }}>
          {/* Images */}
          <div className="animate-fadeIn">
            <div style={{ aspectRatio: '1', overflow: 'hidden', borderRadius: 'var(--radius-2xl)', background: 'var(--color-bg-elevated)', marginBottom: 'var(--space-4)', border: '1px solid var(--color-border)' }}>
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s ease' }}
              />
            </div>
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    id={`product-thumb-${i}`}
                    style={{
                      width: 80, height: 80, borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden', border: `2px solid ${selectedImage === i ? 'var(--color-accent)' : 'var(--color-border)'}`,
                      transition: 'border-color var(--transition-fast)',
                      cursor: 'pointer', flexShrink: 0,
                      boxShadow: selectedImage === i ? '0 0 0 2px var(--color-accent-glow)' : 'none',
                    }}
                  >
                    <img src={img} alt={`View ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="animate-fadeInUp">
            {product.badge && (
              <span className={`badge badge-gold`} style={{ marginBottom: 'var(--space-3)' }}>
                {product.badge}
              </span>
            )}

            <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, marginBottom: 'var(--space-3)', lineHeight: 1.15 }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
              <div className="stars">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</div>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                {product.rating} · {product.reviewCount.toLocaleString()} reviews
              </span>
              <span style={{ color: 'var(--color-border)' }}>|</span>
              <span style={{ fontSize: 'var(--text-sm)', color: product.stock > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {product.stock > 0 ? `✓ In Stock (${product.stock})` : '✗ Out of Stock'}
              </span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              <span style={{ fontSize: 'var(--text-4xl)', fontWeight: 800 }} className="gradient-text">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="price-original" style={{ fontSize: 'var(--text-xl)' }}>{formatPrice(product.originalPrice)}</span>
                  <span className="price-discount">Save {discount}%</span>
                </>
              )}
            </div>

            {/* Description */}
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-6)' }}>
              {product.description}
            </p>

            {/* SKU */}
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
              SKU: <code style={{ background: 'var(--color-bg-elevated)', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>{product.sku}</code>
            </p>

            {/* Quantity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
              <label className="label" style={{ margin: 0 }}>Quantity:</label>
              <div className="qty-selector">
                <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span className="qty-value">{quantity}</span>
                <button className="qty-btn" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock}>+</button>
              </div>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                = {formatPrice(product.price * quantity)}
              </span>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <button
                id={`product-add-to-cart-${product.id}`}
                onClick={handleAddToCart}
                className={`btn btn-lg ${inCart ? 'btn-success' : 'btn-primary'}`}
                style={{ flex: 2, minWidth: 180 }}
                disabled={product.stock === 0 || adding}
              >
                {adding ? '✓ Added!' : inCart ? `✓ In Cart · Add More` : '🛒 Add to Cart'}
              </button>
              <Link href="/checkout" className="btn btn-secondary btn-lg" style={{ flex: 1, minWidth: 120, textAlign: 'center' }}>
                Buy Now
              </Link>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-6)' }}>
              {product.tags.map((tag) => (
                <span key={tag} className="badge badge-muted">#{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
            <div className="section-eyebrow">More in {product.category}</div>
            <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-8)' }}>
              You Might Also Like
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-6)' }}>
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
