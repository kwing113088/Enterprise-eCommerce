import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow Unsplash images for demo product photos
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },

  // Stripe webhook route must receive raw body
  async headers() {
    return [
      {
        source: '/api/webhooks/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://stripe.com' },
        ],
      },
    ];
  },
};

export default nextConfig;
