'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useSession, signIn, signOut } from 'next-auth/react';
import { formatPrice } from '@/lib/products';

export default function Navbar() {
  const { state, summary, toggleCart, openCart } = useCart();
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav
        className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 800,
          height: 'var(--nav-height)',
          transition: 'all var(--transition-base)',
          background: scrolled
            ? 'rgba(7, 11, 20, 0.95)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
        }}
      >
        <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', boxShadow: '0 4px 15px var(--color-accent-glow)',
            }}>⚡</div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)' }}>
              Nova<span className="gradient-text">Shop</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }} className="desktop-nav">
            {[
              { href: '/', label: 'Home' },
              { href: '/?category=electronics', label: 'Electronics' },
              { href: '/?category=fashion', label: 'Fashion' },
              { href: '/?category=home', label: 'Home & Office' },
              { href: '/orders', label: 'Orders' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: 'var(--color-text-secondary)',
                  fontWeight: 500,
                  fontSize: 'var(--text-sm)',
                  transition: 'color var(--transition-fast)',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {/* Cart Button */}
            <button
              id="cart-toggle-btn"
              onClick={openCart}
              style={{
                position: 'relative',
                display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                padding: '0.5rem 1rem',
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--color-text-primary)',
                fontWeight: 600,
                fontSize: 'var(--text-sm)',
                transition: 'all var(--transition-fast)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-accent)';
                e.currentTarget.style.background = 'var(--color-bg-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.background = 'var(--color-bg-elevated)';
              }}
              aria-label={`Open cart — ${summary.itemCount} items`}
            >
              <span style={{ fontSize: '1.1rem' }}>🛒</span>
              <span>{formatPrice(summary.total)}</span>
              {summary.itemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -6, right: -6,
                  background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  width: 20, height: 20,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'cartBounce 0.4s ease',
                  border: '2px solid var(--color-bg-primary)',
                }}>
                  {summary.itemCount}
                </span>
              )}
            </button>

            {/* Checkout CTA */}
            {summary.itemCount > 0 && (
              <Link href="/checkout" className="btn btn-primary btn-sm">
                Checkout
              </Link>
            )}

            {/* Auth Button */}
            {status === 'loading' ? (
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-bg-elevated)', animation: 'pulse 2s infinite' }} />
            ) : session?.user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <img 
                  src={session.user.image || 'https://github.com/identicons/default.png'} 
                  alt={session.user.name || 'User Avatar'} 
                  style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid var(--color-border)', cursor: 'pointer' }}
                  onClick={() => signOut()}
                  title="Click to sign out"
                />
              </div>
            ) : (
              <button onClick={() => signIn('github')} className="btn btn-secondary btn-sm" style={{ padding: '0.4rem 1rem' }}>
                Log in
              </button>
            )}
          </div>
        </div>
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </>
  );
}
