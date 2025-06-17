import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { InfiniteProductGrid } from '@/components/features/InfiniteProductGrid'
import { ProductGridSkeleton } from '@/components/ui/ProductGridSkeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Star } from 'lucide-react'
import { getCategories, getCategoryBySlug } from '@/lib/api'
import { getFeaturedProductsByCategory } from '@/lib/featured-products'
import { Product, Category } from '@/lib/types'

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    page?: string
    sort?: string
  }>
}

// Fetch category data using slug
const getCategoryData = async (slug: string): Promise<Category | null> => {
  try {
    const category: Category = await getCategoryBySlug(slug)
    return category
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
}

// Fetch featured products for category
const getCategoryFeaturedProducts = async (
  categoryId: number
): Promise<Product[]> => {
  try {
    return await getFeaturedProductsByCategory(categoryId, 4)
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}

// Generate static params for categories
export async function generateStaticParams() {
  try {
    const categories: Category[] = await getCategories()
    return categories.map(category => ({
      slug: category.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return [{ slug: 'clothes' }, { slug: 'electronics' }, { slug: 'furniture' }]
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryData(slug)

  if (!category) {
    return {
      title: 'Categoria não encontrada',
      description: 'A categoria solicitada não foi encontrada.',
    }
  }

  return {
    title: `${category.name} - Loja Online`,
    description: `Explore nossa seleção de produtos em ${category.name}. Encontre os melhores produtos com qualidade garantida.`,
    openGraph: {
      title: `${category.name} - Loja Online`,
      description: `Explore nossa seleção de produtos em ${category.name}`,
      type: 'website',
      images: [
        {
          url: category.image,
          width: 1200,
          height: 630,
          alt: category.name,
        },
      ],
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params

  const category = await getCategoryData(slug)

  if (!category) {
    notFound()
  }

  const featuredProducts = await getCategoryFeaturedProducts(category.id)

  return (
    <div className='container py-8'>
      {/* Breadcrumb */}
      <div className='mb-6'>
        <div className='text-muted-foreground flex items-center gap-2 text-sm'>
          <Link href='/' className='hover:text-foreground'>
            Início
          </Link>
          <span>/</span>
          <Link href='/categories' className='hover:text-foreground'>
            Categorias
          </Link>
          <span>/</span>
          <span className='text-foreground'>{category.name}</span>
        </div>
      </div>

      {/* Back Button */}
      <div className='mb-6'>
        <Button variant='ghost' asChild>
          <Link href='/categories'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Voltar para Categorias
          </Link>
        </Button>
      </div>

      {/* Category Header */}
      <div className='mb-8'>
        <div className='mb-4 flex items-center gap-4'>
          <div className='h-16 w-16 overflow-hidden rounded-lg'>
            <Image
              src={category.image}
              alt={category.name}
              width={64}
              height={64}
              className='h-full w-full object-cover'
              priority
            />
          </div>
          <div>
            <h1 className='text-3xl font-bold'>{category.name}</h1>
            <div className='mt-2 flex items-center gap-2'>
              <Badge variant='secondary'>Categoria completa</Badge>
              {featuredProducts.length > 0 && (
                <Badge
                  variant='outline'
                  className='border-yellow-600 text-yellow-600'
                >
                  <Star className='mr-1 h-3 w-3 fill-current' />
                  {featuredProducts.length} em destaque
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Infinite Product Grid with Featured Products */}
      <div className='mb-8'>
        <Suspense fallback={<ProductGridSkeleton />}>
          <InfiniteProductGrid
            categoryId={category.id}
            featuredProducts={featuredProducts}
          />
        </Suspense>
      </div>
    </div>
  )
}
