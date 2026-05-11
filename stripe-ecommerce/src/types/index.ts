// ─── Product Types ────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number; // in cents
  originalPrice?: number; // in cents, for showing discounts
  images: string[];
  category: ProductCategory;
  tags: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  featured?: boolean;
  badge?: string; // e.g. "New", "Sale", "Hot"
}

export type ProductCategory =
  | 'electronics'
  | 'fashion'
  | 'home'
  | 'sports'
  | 'beauty'
  | 'books';

// ─── Cart Types ───────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

// ─── Order Types ──────────────────────────────────────────────────────────────

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'canceled'
  | 'refunded';

export interface Order {
  id: string;
  paymentIntentId: string;
  items: CartItem[];
  summary: CartSummary;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  customerEmail?: string;
  shippingAddress?: ShippingAddress;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// ─── Payment Types ────────────────────────────────────────────────────────────

export interface CreatePaymentIntentRequest {
  items: Array<{ productId: string; quantity: number }>;
  currency?: string;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
}

export interface PaymentIntentError {
  error: string;
  code?: string;
}

// ─── API Types ────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ─── Toast Types ──────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// ─── Filter Types ─────────────────────────────────────────────────────────────

export interface ProductFilters {
  category?: ProductCategory;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest';
}
