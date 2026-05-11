import { NextRequest, NextResponse } from 'next/server';
import { getProducts, CATEGORIES } from '@/lib/products';
import { ProductCategory, ProductFilters } from '@/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get('category') as ProductCategory | null;
  const search = searchParams.get('search') ?? undefined;
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const sortBy = searchParams.get('sortBy') as ProductFilters['sortBy'] | null;
  const page = Number(searchParams.get('page') ?? '1');
  const pageSize = Number(searchParams.get('pageSize') ?? '8');

  const filters: ProductFilters = {
    ...(category ? { category } : {}),
    ...(search ? { search } : {}),
    ...(minPrice !== undefined ? { minPrice } : {}),
    ...(maxPrice !== undefined ? { maxPrice } : {}),
    ...(sortBy ? { sortBy } : {}),
  };

  const result = getProducts(filters, page, pageSize);

  return NextResponse.json({
    ...result,
    categories: CATEGORIES,
  });
}
