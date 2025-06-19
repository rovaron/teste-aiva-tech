import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { getCategories, getCategoryBySlug, getProducts } from '@/lib/api'
import { Product, Category } from '@/lib/types'
import { isValidImageUrl } from '@/lib/utils'
import type { Metadata } from 'next'

// Interface para produto da API
interface ApiProduct {
  id: number
  title: string
  slug: string
  price: number
  description: string
  images: string[]
  category: Category
  creationAt: string
  updatedAt: string
}

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

// Simple product card component
function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className='block'>
      <div className='overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800'>
        <div className='relative h-48 overflow-hidden'>
          <Image
            src={isValidImageUrl(product.images[0])}
            alt={product.title}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>
        <div className='p-4'>
          <h3 className='mb-2 line-clamp-1 text-lg font-semibold text-gray-900 dark:text-white'>
            {product.title}
          </h3>
          <p className='mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-300'>
            {product.description}
          </p>
          <div className='flex items-center justify-between'>
            <p className='text-xl font-bold text-blue-600 dark:text-blue-400'>
              R$ {product.price.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Simple product grid component
function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500'>Nenhum produto encontrado nesta categoria.</p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
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
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const category = await getCategoryBySlug(slug)
    
    return {
      title: `${category.name} - Loja Online`,
      description: `Explore nossa seleção de produtos em ${category.name}.`,
    }
  } catch (_error) {
     return {
       title: 'Categoria não encontrada',
       description: 'A categoria solicitada não foi encontrada.',
     }
   }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params

  let category: Category
  let products: Product[] = []

  try {
    category = await getCategoryBySlug(slug)
  } catch (_error) {
    notFound()
  }

  try {
    const apiProducts = await getProducts({
      categoryId: category.id,
      limit: 20,
      offset: 0,
    })
    
    products = apiProducts.map((apiProduct: ApiProduct) => ({
       id: apiProduct.id,
       title: apiProduct.title,
       slug: apiProduct.slug,
       price: apiProduct.price,
       description: apiProduct.description,
       images: apiProduct.images.length > 0 ? apiProduct.images : [
         'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop'
       ],
       category: apiProduct.category,
       creationAt: apiProduct.creationAt,
       updatedAt: apiProduct.updatedAt,
     }))
  } catch (error) {
    console.error('Error loading products:', error)
  }

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
              src={isValidImageUrl(category.image)}
              alt={category.name}
              width={64}
              height={64}
              className='h-full w-full object-cover'
              priority
            />
          </div>
          <div>
            <h1 className='text-3xl font-bold'>{category.name}</h1>
            <div className='mt-2'>
              <Badge variant='secondary'>
                {products.length} produtos
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Product Grid */}
      <ProductGrid products={products} />
    </div>
  )
}
