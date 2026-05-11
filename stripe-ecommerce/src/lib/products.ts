import { Product, ProductCategory, ProductFilters, PaginatedResponse } from '@/types';

export const PRODUCTS: Product[] = [
  {
    id: 'prod_001',
    name: 'ProMax Wireless Headphones',
    description: 'Experience audio perfection with our flagship ProMax Wireless Headphones. Featuring 40mm dynamic drivers, active noise cancellation, and 30-hour battery life, these headphones redefine premium sound. The ergonomic over-ear design provides all-day comfort while the foldable mechanism makes them perfect for travel.',
    shortDescription: 'Premium ANC headphones with 30hr battery',
    price: 29999,
    originalPrice: 39999,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80',
    ],
    category: 'electronics',
    tags: ['headphones', 'wireless', 'anc', 'audio'],
    rating: 4.8,
    reviewCount: 2341,
    stock: 45,
    sku: 'ELEC-HP-001',
    featured: true,
    badge: 'Sale',
  },
  {
    id: 'prod_002',
    name: 'Lumina Smart Watch Series X',
    description: 'The Lumina Smart Watch Series X is the ultimate health companion. Track your fitness goals with precision using the built-in GPS, heart rate monitor, SpO2 sensor, and ECG. The always-on AMOLED display looks stunning in any lighting condition, while the titanium case ensures durability.',
    shortDescription: 'Advanced smartwatch with health tracking',
    price: 49999,
    originalPrice: 59999,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80',
    ],
    category: 'electronics',
    tags: ['smartwatch', 'fitness', 'health', 'gps'],
    rating: 4.7,
    reviewCount: 1876,
    stock: 28,
    sku: 'ELEC-SW-002',
    featured: true,
    badge: 'Hot',
  },
  {
    id: 'prod_003',
    name: 'Aura Mechanical Keyboard',
    description: 'Built for the serious typist and gamer, the Aura Mechanical Keyboard features premium Cherry MX switches, per-key RGB lighting with 16.8 million colors, and a durable aluminum frame. The compact tenkeyless layout saves desk space without sacrificing functionality.',
    shortDescription: 'Tenkeyless mechanical keyboard with RGB',
    price: 15999,
    images: [
      'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
    ],
    category: 'electronics',
    tags: ['keyboard', 'mechanical', 'gaming', 'rgb'],
    rating: 4.6,
    reviewCount: 943,
    stock: 62,
    sku: 'ELEC-KB-003',
    badge: 'New',
  },
  {
    id: 'prod_004',
    name: 'ZenPro Portable Speaker',
    description: 'Take your music anywhere with the ZenPro Portable Speaker. Delivering 360-degree immersive sound from a compact form factor, this speaker is IPX7 waterproof, has 20-hour battery life, and can wirelessly pair two speakers for stereo sound. Perfect for outdoor adventures.',
    shortDescription: '360° sound, IPX7 waterproof, 20hr battery',
    price: 8999,
    originalPrice: 11999,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80',
    ],
    category: 'electronics',
    tags: ['speaker', 'bluetooth', 'waterproof', 'portable'],
    rating: 4.5,
    reviewCount: 1234,
    stock: 89,
    sku: 'ELEC-SP-004',
    badge: 'Sale',
  },
  {
    id: 'prod_005',
    name: 'UrbanFlex Sneakers',
    description: 'Where street style meets performance engineering. The UrbanFlex Sneakers feature a responsive foam midsole for all-day comfort, a breathable mesh upper, and a durable rubber outsole for versatile traction. Available in multiple colorways to match your unique style.',
    shortDescription: 'Performance sneakers with responsive foam',
    price: 12999,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
    ],
    category: 'fashion',
    tags: ['sneakers', 'shoes', 'fashion', 'urban'],
    rating: 4.4,
    reviewCount: 567,
    stock: 134,
    sku: 'FASH-SN-005',
    featured: true,
  },
  {
    id: 'prod_006',
    name: 'Eclipse Minimalist Watch',
    description: 'The Eclipse Minimalist Watch embodies the philosophy that true elegance lies in simplicity. The slim 8mm profile houses a precision Swiss movement, a sapphire crystal face, and a genuine Italian leather strap. Water resistant to 50 meters.',
    shortDescription: 'Swiss movement minimalist timepiece',
    price: 34999,
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80',
      'https://images.unsplash.com/photo-1459356979461-dae1b8dcb702?w=600&q=80',
    ],
    category: 'fashion',
    tags: ['watch', 'minimalist', 'swiss', 'leather'],
    rating: 4.9,
    reviewCount: 289,
    stock: 15,
    sku: 'FASH-WA-006',
    badge: 'Premium',
  },
  {
    id: 'prod_007',
    name: 'NovaDrip Coffee Maker',
    description: 'The NovaDrip transforms your morning ritual. Featuring precision temperature control, bloom pre-infusion, and programmable scheduling, it extracts the perfect cup every time. The built-in grinder and thermal carafe keep your coffee fresh and hot for hours.',
    shortDescription: 'Precision pour-over coffee maker with grinder',
    price: 24999,
    originalPrice: 29999,
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
    ],
    category: 'home',
    tags: ['coffee', 'kitchen', 'appliance', 'brewing'],
    rating: 4.7,
    reviewCount: 1102,
    stock: 41,
    sku: 'HOME-CF-007',
    badge: 'Sale',
  },
  {
    id: 'prod_008',
    name: 'AeroLift Standing Desk',
    description: 'Transform your workspace with the AeroLift Electric Standing Desk. The dual-motor lifting system smoothly adjusts from 24" to 50" with a touch of a button. The 55" x 28" workspace offers ample room, while the memory presets remember your preferred heights.',
    shortDescription: 'Electric height-adjustable standing desk',
    price: 89999,
    images: [
      'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600&q=80',
      'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80',
    ],
    category: 'home',
    tags: ['desk', 'standing', 'ergonomic', 'office'],
    rating: 4.6,
    reviewCount: 445,
    stock: 12,
    sku: 'HOME-DK-008',
    badge: 'Premium',
  },
  {
    id: 'prod_009',
    name: 'Vortex Pro Gaming Chair',
    description: 'Engineered for marathon gaming sessions, the Vortex Pro Gaming Chair features 4D adjustable armrests, a recline range of 90°-165°, lumbar support pillow, and a breathable mesh back. The racing-inspired design looks as aggressive as it performs.',
    shortDescription: 'Ergonomic gaming chair with 4D armrests',
    price: 45999,
    originalPrice: 54999,
    images: [
      'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
    ],
    category: 'home',
    tags: ['gaming', 'chair', 'ergonomic', 'office'],
    rating: 4.5,
    reviewCount: 782,
    stock: 23,
    sku: 'HOME-CH-009',
    badge: 'Sale',
  },
  {
    id: 'prod_010',
    name: 'FlexCore Yoga Mat',
    description: 'The FlexCore Yoga Mat is crafted from premium natural rubber with a polyurethane top layer for unmatched grip in all conditions. The 6mm thickness provides joint cushioning without compromising stability. Alignment lines help perfect your poses.',
    shortDescription: 'Natural rubber yoga mat with alignment lines',
    price: 7999,
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
    ],
    category: 'sports',
    tags: ['yoga', 'fitness', 'mat', 'wellness'],
    rating: 4.8,
    reviewCount: 2109,
    stock: 200,
    sku: 'SPRT-YM-010',
    featured: true,
  },
  {
    id: 'prod_011',
    name: 'RadianceGlow Serum',
    description: 'Formulated with 15% Vitamin C, hyaluronic acid, and niacinamide, the RadianceGlow Serum targets dark spots, hydrates deeply, and strengthens the skin barrier. Dermatologist-tested, fragrance-free, and suitable for all skin types including sensitive.',
    shortDescription: 'Brightening Vitamin C + hyaluronic serum',
    price: 5999,
    originalPrice: 7999,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80',
    ],
    category: 'beauty',
    tags: ['skincare', 'serum', 'vitamin-c', 'beauty'],
    rating: 4.7,
    reviewCount: 3421,
    stock: 156,
    sku: 'BEAU-SR-011',
    badge: 'Best Seller',
  },
  {
    id: 'prod_012',
    name: 'Atomic Habits — Special Ed.',
    description: 'This special edition of James Clear\'s #1 New York Times bestseller comes with exclusive bonus content including a 50-page workbook, habit tracker, and author annotations throughout the text. Perfect for anyone looking to build better habits and break bad ones.',
    shortDescription: 'James Clear\'s bestseller — Special Edition',
    price: 3499,
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80',
    ],
    category: 'books',
    tags: ['book', 'habits', 'productivity', 'self-help'],
    rating: 4.9,
    reviewCount: 8732,
    stock: 500,
    sku: 'BOOK-AH-012',
    badge: 'New',
  },
];

// ─── Product Lookup ───────────────────────────────────────────────────────────

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByIds(ids: string[]): Product[] {
  return ids.map((id) => getProductById(id)).filter(Boolean) as Product[];
}

// ─── Filtered + Paginated Products ───────────────────────────────────────────

export function getProducts(
  filters: ProductFilters = {},
  page = 1,
  pageSize = 8
): PaginatedResponse<Product> {
  let results = [...PRODUCTS];

  if (filters.category) {
    results = results.filter((p) => p.category === filters.category);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
    );
  }

  if (filters.minPrice !== undefined) {
    results = results.filter((p) => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    results = results.filter((p) => p.price <= filters.maxPrice!);
  }

  switch (filters.sortBy) {
    case 'price-asc':
      results.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      results.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      results.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
    default:
      break;
  }

  const total = results.length;
  const start = (page - 1) * pageSize;
  const data = results.slice(start, start + pageSize);

  return { data, total, page, pageSize, hasMore: start + pageSize < total };
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

export const CATEGORIES: { value: ProductCategory; label: string; emoji: string }[] = [
  { value: 'electronics', label: 'Electronics', emoji: '⚡' },
  { value: 'fashion', label: 'Fashion', emoji: '👗' },
  { value: 'home', label: 'Home & Office', emoji: '🏠' },
  { value: 'sports', label: 'Sports', emoji: '🏃' },
  { value: 'beauty', label: 'Beauty', emoji: '✨' },
  { value: 'books', label: 'Books', emoji: '📚' },
];

// ─── Formatting Helpers ───────────────────────────────────────────────────────

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export function getDiscount(price: number, originalPrice: number): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
