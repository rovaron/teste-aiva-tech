import { ProductGrid } from '@/components/features/ProductGrid'
import { ProductFilters } from '@/components/features/ProductFilters'
import { ProductGridSkeleton } from '@/components/ui/ProductGridSkeleton'
import { getProducts, getCategories } from '@/lib/api'
import { Suspense } from 'react'

interface SearchParams {
  category?: string
  search?: string
  page?: string
  sort?: string
}

export const metadata = {
  title: 'Products',
  description: 'Browse our complete collection of high-quality products.',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const resolvedSearchParams = await searchParams

  const filters = {
    categoryId: resolvedSearchParams.category
      ? Number(resolvedSearchParams.category)
      : undefined,
    title: resolvedSearchParams.search,
    offset: ((Number(resolvedSearchParams.page) || 1) - 1) * 12,
    limit: 12,
  }

  // Initial data via Server Component
  const [products, categories] = await Promise.all([
    getProducts(filters),
    getCategories(),
  ])

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex gap-8'>
        <aside className='w-64'>
          <Suspense fallback={<div className='h-32 w-full animate-pulse rounded-md bg-muted' />}>
            <ProductFilters categories={categories} />
          </Suspense>
        </aside>

        <main className='flex-1'>
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid products={products} />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
