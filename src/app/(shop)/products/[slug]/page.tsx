import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  ArrowLeft,
  Eye,
  Clock,
} from 'lucide-react'
import { getProduct, getProducts, getProductBySlug } from '@/lib/api'
import { AddToCartButton, FloatingAddToCart } from '@/components/features/AddToCartButton'


interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

interface ApiProduct {
  id: number
  title: string
  slug: string
  price: number
  description: string
  images: string[]
  category: {
    id: number
    name: string
    image: string
    slug: string
  }
  creationAt: string
  updatedAt: string
}

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  images: string[]
  rating: number
  reviews: number
  category: string
  badge?: string
  description: string
  features: string[]
  specifications: Record<string, string>
  inStock: boolean
  stockCount: number
  views?: number
  lastUpdated?: string
  relatedProducts?: number[]
  slug: string
}

// Transform API product to our Product interface
const transformApiProduct = (apiProduct: ApiProduct): Product => {
  // Generate mock data for fields not available in API
  const mockRating = 4.0 + Math.random() * 1.0 // Random rating between 4.0-5.0
  const mockReviews = Math.floor(Math.random() * 500) + 50 // Random reviews 50-550
  const mockStockCount = Math.floor(Math.random() * 50) + 1 // Random stock 1-50
  const mockViews = Math.floor(Math.random() * 2000) + 100 // Random views 100-2100
  
  // Generate features based on category
  const generateFeatures = (categoryName: string): string[] => {
    const featureMap: Record<string, string[]> = {
      'Electronics': [
        'High-quality materials',
        'Advanced technology',
        'Energy efficient',
        'Durable construction',
        'User-friendly design'
      ],
      'Clothes': [
        'Premium fabric',
        'Comfortable fit',
        'Machine washable',
        'Breathable material',
        'Stylish design'
      ],
      'Furniture': [
        'Solid construction',
        'Easy assembly',
        'Space-saving design',
        'Durable materials',
        'Modern style'
      ]
    }
    return featureMap[categoryName] || featureMap['Electronics']
  }
  
  // Generate specifications based on category
  const generateSpecifications = (categoryName: string): Record<string, string> => {
    const specMap: Record<string, Record<string, string>> = {
      'Electronics': {
        'Brand': 'Premium Brand',
        'Warranty': '2 years',
        'Power': 'AC/DC',
        'Dimensions': '25 x 15 x 10 cm'
      },
      'Clothes': {
        'Material': '100% Cotton',
        'Care': 'Machine wash cold',
        'Fit': 'Regular',
        'Origin': 'Made in USA'
      },
      'Furniture': {
        'Material': 'Solid Wood',
        'Assembly': 'Required',
        'Weight': '15 kg',
        'Finish': 'Natural'
      }
    }
    return specMap[categoryName] || specMap['Electronics']
  }
  
  return {
    id: apiProduct.id,
    name: apiProduct.title,
    slug: apiProduct.slug,
    price: apiProduct.price,
    originalPrice: apiProduct.price * 1.2, // Mock original price (20% higher)
    images: apiProduct.images.length > 0 ? apiProduct.images : [
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop'
    ],
    rating: Math.round(mockRating * 10) / 10,
    reviews: mockReviews,
    category: apiProduct.category.name,
    badge: apiProduct.price < 100 ? 'Oferta' : undefined,
    description: apiProduct.description,
    features: generateFeatures(apiProduct.category.name),
    specifications: generateSpecifications(apiProduct.category.name),
    inStock: true,
    stockCount: mockStockCount,
    views: mockViews,
    lastUpdated: apiProduct.updatedAt,
    relatedProducts: [] // Will be populated separately
  }
}

// Fetch product from API using slug
const getProductData = async (slug: string): Promise<Product | null> => {
  try {
    const apiProduct: ApiProduct = await getProductBySlug(slug)
    return transformApiProduct(apiProduct)
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}
// Fetch related products from API
const getRelatedProducts = async (categoryId: number, currentProductId: number): Promise<Product[]> => {
  try {
    const products: ApiProduct[] = await getProducts({ categoryId: categoryId.toString(), limit: 4 })
    return products
      .filter(p => p.id !== currentProductId)
      .slice(0, 3)
      .map(transformApiProduct)
  } catch (error) {
    console.error('Error fetching related products:', error)
    return []
  }
}


// ISR: Gera páginas estáticas para produtos populares
export async function generateStaticParams() {
  try {
    // Fetch first 10 products for static generation
    const products: ApiProduct[] = await getProducts({ limit: 10 })
    return products.map((product) => ({
      slug: product.slug || `product-${product.id}`,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    // Fallback to some default slugs
    return [
      { slug: 'classic-red-pullover-hoodie' },
      { slug: 'classic-heather-gray-hoodie' },
      { slug: 'classic-grey-hooded-sweatshirt' }
    ]
  }
}

// ISR: Revalida a página a cada 60 segundos
export const revalidate = 60

// SEO otimizado com dados estruturados
export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductData(slug)

  if (!product) {
    return {
      title: 'Produto não encontrado | Loja Premium',
      description: 'O produto que você está procurando não foi encontrado.',
    }
  }

  const price = product.originalPrice
    ? `${product.originalPrice.toFixed(2)} - ${product.price.toFixed(2)}`
    : product.price.toFixed(2)

  return {
    title: `${product.name} | Loja Premium`,
    description: `${product.description.slice(0, 160)}...`,
    keywords: [
      product.name,
      product.category,
      'eletrônicos',
      'loja online',
      'oferta',
      'promoção'
    ].join(', '),
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{
        url: product.images[0],
        width: 600,
        height: 600,
        alt: product.name,
      }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [product.images[0]],
    },
    other: {
      'product:price:amount': product.price.toString(),
      'product:price:currency': 'BRL',
      'product:availability': product.inStock ? 'in stock' : 'out of stock',
      'product:condition': 'new',
      'product:retailer_item_id': product.id.toString(),
    },
  }
}

// Componente de Loading para imagens
function ImageSkeleton() {
  return (
    <div className='aspect-square animate-pulse rounded-lg bg-gray-200' />
  )
}

// Componente otimizado para galeria de imagens
function ProductImageGallery({ product }: { product: Product }) {
  return (
    <div className='space-y-4'>
      <div className='aspect-square overflow-hidden rounded-lg border'>
        <Image
          src={product.images[0]}
          alt={product.name}
          width={600}
          height={600}
          className='h-full w-full object-cover transition-transform hover:scale-105'
          priority
          placeholder='blur'
          blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
        />
      </div>

      <div className='grid grid-cols-4 gap-2'>
        {product.images.map((image, index) => (
          <div
            key={index}
            className='aspect-square overflow-hidden rounded-md border'
          >
            <Image
              src={image}
              alt={`${product.name} - Imagem ${index + 1}`}
              width={150}
              height={150}
              className='h-full w-full cursor-pointer object-cover transition-opacity hover:opacity-80'
              loading='lazy'
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// Componente para estatísticas do produto
function ProductStats({ product }: { product: Product }) {
  return (
    <div className='grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4'>
      <div className='flex items-center gap-2'>
        <Eye className='h-4 w-4 text-gray-500' />
        <span className='text-sm text-gray-600'>
          {product.views?.toLocaleString()} visualizações
        </span>
      </div>
      <div className='flex items-center gap-2'>
        <Clock className='h-4 w-4 text-gray-500' />
        <span className='text-sm text-gray-600'>
          Atualizado hoje
        </span>
      </div>
    </div>
  )
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductData(slug)

  if (!product) {
    notFound()
  }

  // Fetch related products based on the same category
  // Since we don't have category ID in our transformed product, we'll fetch from a default category
  const relatedProducts = await getRelatedProducts(1, product.id)

  return (
    <div className='container py-8'>
      {/* Breadcrumb */}
      <div className='mb-6'>
        <div className='text-muted-foreground flex items-center gap-2 text-sm'>
          <Link href='/' className='hover:text-foreground'>
            Início
          </Link>
          <span>/</span>
          <Link href='/products' className='hover:text-foreground'>
            Produtos
          </Link>
          <span>/</span>
          <span className='text-foreground'>{product.name}</span>
        </div>
      </div>

      {/* Back Button */}
      <div className='mb-6'>
        <Button variant='ghost' asChild className='gap-2'>
          <Link href='/products'>
            <ArrowLeft className='h-4 w-4' />
            Voltar aos produtos
          </Link>
        </Button>
      </div>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        {/* Product Images */}
        <Suspense fallback={<ImageSkeleton />}>
          <ProductImageGallery product={product} />
        </Suspense>

        {/* Product Info */}
        <div className='space-y-6'>
          <div>
            {product.badge && (
              <Badge
                className='mb-2'
                variant={
                  product.badge === 'Oferta' ? 'destructive' : 'secondary'
                }
              >
                {product.badge}
              </Badge>
            )}

            <h1 className='text-3xl font-bold tracking-tight'>
              {product.name}
            </h1>

            <div className='mt-2 flex items-center gap-2'>
              <div className='flex items-center gap-1'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                      }`}
                  />
                ))}
              </div>
              <span className='text-muted-foreground text-sm'>
                {product.rating} ({product.reviews} avaliações)
              </span>
            </div>
          </div>

          {/* Product Stats */}
          <ProductStats product={product} />

          <div className='space-y-2'>
            <div className='flex items-center gap-3'>
              <span className='text-3xl font-bold text-green-600'>
                R$ {product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className='text-muted-foreground text-xl line-through'>
                  R$ {product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.originalPrice && (
                <Badge variant='destructive' className='text-xs'>
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </Badge>
              )}
            </div>

            {product.originalPrice && (
              <p className='text-sm text-green-600 font-medium'>
                Economia de R${' '}
                {(product.originalPrice - product.price).toFixed(2)}
              </p>
            )}
          </div>

          <p className='text-muted-foreground'>{product.description}</p>

          {/* Stock Status */}
          <div className='flex items-center gap-2'>
            <div
              className={`h-2 w-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'
                }`}
            />
            <span className='text-sm'>
              {product.inStock
                ? `Em estoque (${product.stockCount} unidades)`
                : 'Fora de estoque'}
            </span>
          </div>

          {/* Actions */}
          <div className='space-y-3'>
            <div className='flex gap-3'>
              <AddToCartButton
                product={{
                  id: product.id,
                  title: product.name,
                  slug: product.slug,
                  price: product.price,
                  description: product.description,
                  images: product.images,
                  category: {
                    id: 1,
                    name: product.category,
                    slug: product.category.toLowerCase().replace(/\s+/g, '-'),
                    image: ''
                  }
                }}
                size='lg'
                className='flex-1'
                fullWidth
              />

              <Button size='lg' variant='outline'>
                <Heart className='h-4 w-4' />
              </Button>

              <Button size='lg' variant='outline'>
                <Share2 className='h-4 w-4' />
              </Button>
            </div>

            <Button variant='outline' size='lg' className='w-full'>
              Comprar agora
            </Button>
          </div>

          {/* Floating Add to Cart for Mobile */}
          <FloatingAddToCart
            product={{
              id: product.id,
              title: product.name,
              slug: product.slug,
              price: product.price,
              description: product.description,
              images: product.images,
              category: {
                id: 1,
                name: product.category,
                slug: product.category.toLowerCase().replace(/\s+/g, '-'),
                image: ''
              }
            }}
          />

          {/* Benefits */}
          <Card>
            <CardContent className='p-4'>
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
                <div className='flex items-center gap-2'>
                  <Truck className='text-primary h-4 w-4' />
                  <span className='text-sm'>Frete grátis</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Shield className='text-primary h-4 w-4' />
                  <span className='text-sm'>Garantia 1 ano</span>
                </div>
                <div className='flex items-center gap-2'>
                  <RotateCcw className='text-primary h-4 w-4' />
                  <span className='text-sm'>Troca grátis</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className='mt-12'>
        <Tabs defaultValue='features' className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='features'>Características</TabsTrigger>
            <TabsTrigger value='specifications'>Especificações</TabsTrigger>
            <TabsTrigger value='reviews'>Avaliações</TabsTrigger>
          </TabsList>

          <TabsContent value='features' className='mt-6'>
            <Card>
              <CardContent className='p-6'>
                <h3 className='mb-4 text-lg font-semibold'>
                  Principais características
                </h3>
                <ul className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                  {product.features.map((feature, index) => (
                    <li key={index} className='flex items-center gap-2'>
                      <div className='bg-primary h-1.5 w-1.5 rounded-full' />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='specifications' className='mt-6'>
            <Card>
              <CardContent className='p-6'>
                <h3 className='mb-4 text-lg font-semibold'>
                  Especificações técnicas
                </h3>
                <div className='space-y-3'>
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className='border-border flex justify-between border-b py-2 last:border-0'
                      >
                        <span className='font-medium'>{key}</span>
                        <span className='text-muted-foreground'>{value}</span>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='reviews' className='mt-6'>
            <Card>
              <CardContent className='p-6'>
                <h3 className='mb-4 text-lg font-semibold'>
                  Avaliações dos clientes
                </h3>
                <div className='text-muted-foreground py-8 text-center'>
                  <p>Sistema de avaliações em desenvolvimento</p>
                  <p className='mt-2 text-sm'>
                    {product.reviews} avaliações disponíveis
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Produtos Relacionados */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className='mt-16'>
          <h2 className='mb-6 text-2xl font-bold'>Produtos Relacionados</h2>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {relatedProducts.slice(0, 3).map((relatedProduct) => (
              <Suspense key={relatedProduct.id} fallback={<ProductCardSkeleton />}>
                <RelatedProductCard productSlug={relatedProduct.slug} />
              </Suspense>
            ))}
          </div>
        </div>
      )}

      {/* JSON-LD para SEO */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            image: product.images,
            brand: {
              '@type': 'Brand',
              name: 'Loja Premium',
            },
            offers: {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'BRL',
              availability: product.inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              seller: {
                '@type': 'Organization',
                name: 'Loja Premium',
              },
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: product.rating,
              reviewCount: product.reviews,
            },
          }),
        }}
      />
    </div>
  )
}

// Componente para skeleton de card de produto
function ProductCardSkeleton() {
  return (
    <Card>
      <div className='aspect-square animate-pulse bg-gray-200' />
      <CardContent className='p-4'>
        <div className='space-y-2'>
          <div className='h-4 animate-pulse rounded bg-gray-200' />
          <div className='h-4 w-2/3 animate-pulse rounded bg-gray-200' />
          <div className='h-6 w-1/2 animate-pulse rounded bg-gray-200' />
        </div>
      </CardContent>
    </Card>
  )
}

// Componente para produto relacionado
async function RelatedProductCard({ productSlug }: { productSlug: string }) {
  const product = await getProductData(productSlug)

  if (!product) return null

  return (
    <Card className='group overflow-hidden transition-shadow hover:shadow-lg'>
      <div className='aspect-square overflow-hidden'>
        <Image
          src={product.images[0]}
          alt={product.name}
          width={300}
          height={300}
          className='h-full w-full object-cover transition-transform group-hover:scale-105'
          loading='lazy'
        />
      </div>
      <CardContent className='p-4'>
        <h3 className='font-semibold line-clamp-2'>{product.name}</h3>
        <div className='mt-2 flex items-center gap-2'>
          <span className='text-lg font-bold text-green-600'>
            R$ {product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className='text-sm text-gray-500 line-through'>
              R$ {product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <Button asChild className='mt-3 w-full'>
          <Link href={`/products/${product.slug}`}>
            Ver Produto
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
