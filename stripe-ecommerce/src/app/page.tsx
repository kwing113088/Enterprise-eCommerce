'use client';

import React, { useState, useMemo } from 'react';
import ProductCard from '@/components/products/ProductCard';
import { PRODUCTS, CATEGORIES, getFeaturedProducts } from '@/lib/products';
import { ProductCategory, ProductFilters, Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/products';
import Link from 'next/link';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ProductCategory | ''>('');
  const [sortBy, setSortBy] = useState<ProductFilters['sortBy']>('newest');
  const { openCart } = useCart();
  const featured = getFeaturedProducts();

  const filtered = useMemo(() => {
    let results = [...PRODUCTS];
    if (category) results = results.filter((p) => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }
    switch (sortBy) {
      case 'price-asc': results.sort((a, b) => a.price - b.price); break;
      case 'price-desc': results.sort((a, b) => b.price - a.price); break;
      case 'rating': results.sort((a, b) => b.rating - a.rating); break;
    }
    return results;
  }, [search, category, sortBy]);

  return (
    <>
      {/* ── Hero ── */}
      <section style={{
        minHeight: '90vh', display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(108,99,255,0.25) 0%, transparent 70%)',
      }}>
        {/* Decorative orbs */}
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)',
          top: -100, right: -100, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
          bottom: -50, left: -50, pointerEvents: 'none',
        }} />

        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1, paddingTop: 'var(--space-20)', paddingBottom: 'var(--space-20)' }}>
          <div className="section-eyebrow animate-fadeInDown" style={{ justifyContent: 'center' }}>
            <span>⚡</span> Premium Shopping Experience
          </div>

          <h1 className="animate-fadeInUp" style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 900, lineHeight: 1.05,
            marginBottom: 'var(--space-6)',
            animationDelay: '100ms',
          }}>
            Shop the Future,{' '}
            <span className="gradient-text">Today</span>
          </h1>

          <p className="animate-fadeInUp" style={{
            fontSize: 'var(--text-xl)', color: 'var(--color-text-secondary)',
            maxWidth: 600, margin: '0 auto var(--space-10)',
            lineHeight: 1.7,
            animationDelay: '200ms',
          }}>
            Curated premium products delivered to your door. From cutting-edge electronics to timeless fashion — all in one place.
          </p>

          <div className="animate-fadeInUp" style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap', animationDelay: '300ms' }}>
            <a href="#catalog" className="btn btn-primary btn-lg" id="hero-shop-btn">
              Shop Now ↓
            </a>
            <Link href="/orders" className="btn btn-secondary btn-lg">
              Track Orders
            </Link>
          </div>

          {/* Stats */}
          <div className="animate-fadeInUp" style={{
            display: 'flex', gap: 'var(--space-10)', justifyContent: 'center', flexWrap: 'wrap',
            marginTop: 'var(--space-16)',
            animationDelay: '400ms',
          }}>
            {[
              { label: 'Products', value: '12+' },
              { label: 'Happy Customers', value: '50K+' },
              { label: 'Secure Payments', value: '100%' },
              { label: 'Free Returns', value: '30 Days' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 4 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section style={{ padding: 'var(--space-16) 0', background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <div className="section-eyebrow" style={{ marginBottom: 'var(--space-6)' }}>
            🏷 Browse by Category
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--space-3)' }} className="stagger-children">
            {[{ value: '', label: 'All Items', emoji: '🌟' }, ...CATEGORIES].map((cat) => (
              <button
                key={cat.value}
                id={`category-${cat.value || 'all'}`}
                onClick={() => setCategory(cat.value as ProductCategory | '')}
                className="card"
                style={{
                  padding: 'var(--space-4)',
                  textAlign: 'center', cursor: 'pointer',
                  border: `1px solid ${category === cat.value ? 'var(--color-border-accent)' : 'var(--color-border)'}`,
                  background: category === cat.value ? 'rgba(108,99,255,0.1)' : 'var(--color-bg-card)',
                  transition: 'all var(--transition-fast)',
                  animation: 'fadeInUp 0.4s ease both',
                }}
              >
                <div style={{ fontSize: '1.75rem', marginBottom: 'var(--space-2)' }}>{cat.emoji}</div>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: category === cat.value ? 'var(--color-accent-light)' : 'var(--color-text-secondary)' }}>
                  {cat.label}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product Catalog ── */}
      <section id="catalog" style={{ padding: 'var(--space-16) 0' }}>
        <div className="container">
          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-8)', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div className="input-group">
                <span className="input-icon" style={{ left: '1rem' }}>🔍</span>
                <input
                  id="product-search-input"
                  type="search"
                  className="input"
                  placeholder="Search products…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>
            <select
              id="sort-select"
              className="input select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as ProductFilters['sortBy'])}
              style={{ width: 180 }}
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
              {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <p className="empty-state-title">No products found</p>
              <p className="empty-state-desc">Try adjusting your search or filters.</p>
              <button className="btn btn-secondary" onClick={() => { setSearch(''); setCategory(''); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--space-6)',
            }}>
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Trust Badges ── */}
      <section style={{ padding: 'var(--space-16) 0', background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-6)' }}>
            {[
              { icon: '🔒', title: 'Secure Payments', desc: '256-bit SSL + Stripe encryption' },
              { icon: '🚀', title: 'Fast Delivery', desc: '2-5 business days nationwide' },
              { icon: '↩️', title: '30-Day Returns', desc: 'Hassle-free return policy' },
              { icon: '🎧', title: '24/7 Support', desc: 'Always here to help you' },
            ].map((item) => (
              <div key={item.title} className="card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>{item.icon}</div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>{item.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
