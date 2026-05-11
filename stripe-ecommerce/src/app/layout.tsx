import type { Metadata } from 'next';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import Navbar from '@/components/layout/Navbar';
import CartDrawer from '@/components/layout/CartDrawer';
import { ToastContainer } from '@/components/ui/ToastContainer';
import '@/styles/globals.css';
import '@/styles/animations.css';
import '@/styles/components.css';

export const metadata: Metadata = {
  title: {
    default: 'NovaShop — Premium eCommerce',
    template: '%s | NovaShop',
  },
  description:
    'Discover premium products at NovaShop. Shop electronics, fashion, home & office, sports, beauty, and books with fast shipping and easy returns.',
  keywords: ['ecommerce', 'online shop', 'electronics', 'fashion', 'premium'],
  openGraph: {
    type: 'website',
    siteName: 'NovaShop',
    title: 'NovaShop — Premium eCommerce',
    description: 'Discover premium products with fast shipping and easy returns.',
  },
};

import AuthProvider from '@/context/AuthProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#070b14" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          <ToastProvider>
            <CartProvider>
              <Navbar />
              <CartDrawer />
              <main className="page-content">{children}</main>
              <ToastContainer />
            </CartProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
