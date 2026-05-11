import { Order as AppOrder, PaymentStatus, CartItem, CartSummary } from '@/types';
import { prisma } from './prisma';
import { getProductById } from './products';

// ─── Order ID Generator ───────────────────────────────────────────────────────

function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

// Map from Prisma Order to our app's Order type
function mapPrismaOrderToAppOrder(prismaOrder: any): AppOrder {
  const items: CartItem[] = prismaOrder.items.map((item: any) => {
    // Attempt to hydrate full product data from our mock catalog
    const product = getProductById(item.productId) || {
      id: item.productId,
      name: item.name,
      description: 'Product unavailable',
      shortDescription: '',
      price: item.price,
      images: [],
      category: 'electronics' as any,
      tags: [],
      rating: 0,
      reviewCount: 0,
      stock: 0,
      sku: 'UNKNOWN',
    };

    return {
      product,
      quantity: item.quantity,
    };
  });

  return {
    id: prismaOrder.id,
    paymentIntentId: prismaOrder.paymentIntentId,
    status: prismaOrder.status as PaymentStatus,
    createdAt: prismaOrder.createdAt.toISOString(),
    updatedAt: prismaOrder.updatedAt.toISOString(),
    customerEmail: prismaOrder.customerEmail ?? undefined,
    summary: {
      subtotal: prismaOrder.subtotal,
      tax: prismaOrder.tax,
      shipping: prismaOrder.shipping,
      total: prismaOrder.total,
      itemCount: prismaOrder.itemCount,
    },
    items,
  };
}

// ─── CRUD Operations ──────────────────────────────────────────────────────────

export async function createOrder(params: {
  paymentIntentId: string;
  items: CartItem[];
  summary: CartSummary;
  customerEmail?: string;
}): Promise<AppOrder> {
  const id = generateOrderId();

  const prismaOrder = await prisma.order.create({
    data: {
      id,
      paymentIntentId: params.paymentIntentId,
      status: 'pending',
      subtotal: params.summary.subtotal,
      tax: params.summary.tax,
      shipping: params.summary.shipping,
      total: params.summary.total,
      itemCount: params.summary.itemCount,
      customerEmail: params.customerEmail,
      items: {
        create: params.items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
        })),
      },
    },
    include: {
      items: true,
    },
  });

  return mapPrismaOrderToAppOrder(prismaOrder);
}

export async function getOrderById(id: string): Promise<AppOrder | undefined> {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) return undefined;
  return mapPrismaOrderToAppOrder(order);
}

export async function getOrderByPaymentIntentId(
  paymentIntentId: string
): Promise<AppOrder | undefined> {
  const order = await prisma.order.findUnique({
    where: { paymentIntentId },
    include: { items: true },
  });

  if (!order) return undefined;
  return mapPrismaOrderToAppOrder(order);
}

export async function updateOrderStatus(
  paymentIntentId: string,
  status: PaymentStatus
): Promise<AppOrder | undefined> {
  // First check if it exists
  const existing = await prisma.order.findUnique({
    where: { paymentIntentId },
  });

  if (!existing) return undefined;

  const order = await prisma.order.update({
    where: { paymentIntentId },
    data: { status },
    include: { items: true },
  });

  return mapPrismaOrderToAppOrder(order);
}

export async function getAllOrders(): Promise<AppOrder[]> {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  });

  return orders.map(mapPrismaOrderToAppOrder);
}

// ─── Payment Status State Machine ─────────────────────────────────────────────

const VALID_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  pending: ['processing', 'failed', 'canceled'],
  processing: ['succeeded', 'failed'],
  succeeded: ['refunded'],
  failed: [],
  canceled: [],
  refunded: [],
};

export function canTransition(from: PaymentStatus, to: PaymentStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}
