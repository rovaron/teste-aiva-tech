import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ProductGrid } from '@/components/features/ProductGrid'
import { ProductGridSkeleton } from '@/components/ui/ProductGridSkeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { getProducts, getCategories, getCategory, getCategoryBySlug, getProductsByCategory } from '@/lib/api'
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

// Transform API product to our Product interface (same as in product page)
const transformApiProduct = (apiProduct: any): Product => {
  return {
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
    updatedAt: apiProduct.updatedAt
  }
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

// Fetch products for category
const getCategoryProducts = async (categoryId: number, page: number = 1): Promise<Product[]> => {
  try {
    const offset = (page - 1) * 12
    const products = await getProducts({ 
      categoryId: categoryId.toString(), 
      limit: 12, 
      offset 
    })
    return products.map(transformApiProduct)
  } catch (error) {
    console.error('Error fetching category products:', error)
    return []
  }
}

// Generate static params for categories
export async function generateStaticParams() {
  try {
    const categories: Category[] = await getCategories()
    return categories.map((category) => ({
      slug: category.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return [
      { slug: 'clothes' },
      { slug: 'electronics' },
      { slug: 'furniture' }
    ]
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryData(slug)
  
  if (!category) {
    return {
      title: 'Categoria não encontrada',
      description: 'A categoria solicitada não foi encontrada.'
    }
  }
  
  return {
    title: `${category.name} - Loja Online`,
    description: `Explore nossa seleção de produtos em ${category.name}. Encontre os melhores produtos com qualidade garantida.`,
    openGraph: {
      title: `${category.name} - Loja Online`,
      description: `Explore nossa seleção de produtos em ${category.name}`,
      type: 'website',
      images: [{
        url: category.image,
        width: 1200,
        height: 630,
        alt: category.name
      }]
    }
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const { page = '1', sort } = await searchParams
  
  const category = await getCategoryData(slug)
  
  if (!category) {
    notFound()
  }
  
  const currentPage = parseInt(page)
  const products = await getCategoryProducts(category.id, currentPage)
  
  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Link href="/" className="hover:text-foreground">
            Início
          </Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-foreground">
            Categorias
          </Link>
          <span>/</span>
          <span className="text-foreground">{category.name}</span>
        </div>
      </div>
      
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/categories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Categorias
          </Link>
        </Button>
      </div>
      
      {/* Category Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden">
            <img 
              src={category.image} 
              alt={category.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <Badge variant="secondary" className="mt-2">
              {products.length} produtos
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="mb-8">
        {products.length > 0 ? (
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid products={products} />
          </Suspense>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Não há produtos disponíveis nesta categoria no momento.
            </p>
            <Button asChild>
              <Link href="/products">
                Ver Todos os Produtos
              </Link>
            </Button>
          </div>
        )}
      </div>
      
      {/* Pagination could be added here */}
    </div>
  )
}