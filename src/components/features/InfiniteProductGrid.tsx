'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence } from 'framer-motion'
import { FixedSizeGrid as Grid } from 'react-window'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../ui/button'
import { RefreshCw, AlertCircle } from 'lucide-react'
import { Product } from '@/lib/types'
import { getProducts } from '@/lib/api'
import { cn, isValidImageUrl } from '@/lib/utils'
import { QuickAddButton } from './AddToCartButton'

interface InfiniteProductGridProps {
  categoryId: number
  featuredProducts?: Product[]
  className?: string
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

const transformApiProduct = (apiProduct: ApiProduct): Product => {
  return {
    id: apiProduct.id,
    title: apiProduct.title,
    slug: apiProduct.slug,
    price: apiProduct.price,
    description: apiProduct.description,
    images:
      apiProduct.images.length > 0
        ? apiProduct.images
        : [
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop',
          ],
    category: apiProduct.category,
    creationAt: apiProduct.creationAt,
    updatedAt: apiProduct.updatedAt,
  }
}

const ITEMS_PER_PAGE = 20
const GRID_ITEM_HEIGHT = 400
const GRID_ITEM_WIDTH = 300
const GRID_GAP = 24

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0.0, 0.2, 1],
    },
  },
}

// ProductCard component
const cardVariants = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
}

const imageVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.1 },
}

function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      variants={cardVariants}
      initial='rest'
      whileHover={cardVariants.hover}
      className='group relative'
      style={{ viewTransitionName: `product-${product.id}` }}
    >
      <Link href={`/products/${product.slug}`} className='block'>
        <div className='overflow-hidden rounded-lg bg-white shadow-md transition-shadow dark:bg-gray-800'>
          <div className='relative h-48 overflow-hidden'>
            <motion.div
              variants={imageVariants}
              transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
              className='h-full w-full'
            >
              <Image
                src={isValidImageUrl(product.images[0])}
                alt={product.title}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                loading='lazy'
              />
            </motion.div>

            {/* Quick add button overlay */}
            <QuickAddButton product={product} />
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
              {product.category && (
                <span className='rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400'>
                  {product.category.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function InfiniteProductGrid({
  categoryId,
  featuredProducts = [],
  className,
}: InfiniteProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [page, setPage] = useState(1)
  const [containerWidth, setContainerWidth] = useState(1200)

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: '100px',
  })

  // Calculate grid dimensions
  const columnCount = Math.floor(
    (containerWidth - GRID_GAP) / (GRID_ITEM_WIDTH + GRID_GAP)
  )
  const adjustedColumnCount = Math.max(1, Math.min(columnCount, 4))

  // Combine featured and regular products
  const allProducts = useMemo(() => {
    const featuredIds = new Set(featuredProducts.map(p => p.id))
    const uniqueProducts = products.filter(p => !featuredIds.has(p.id))
    return [...featuredProducts, ...uniqueProducts]
  }, [featuredProducts, products])

  const loadProducts = useCallback(
    async (pageNum: number, reset = false) => {
      if (loading) return

      setLoading(true)
      setError(null)

      try {
        const offset = (pageNum - 1) * ITEMS_PER_PAGE
        const apiProducts = await getProducts({
          categoryId: categoryId,
          limit: ITEMS_PER_PAGE,
          offset,
        })

        const transformedProducts = apiProducts.map(transformApiProduct)

        if (reset) {
          setProducts(transformedProducts)
        } else {
          setProducts(prev => [...prev, ...transformedProducts])
        }

        setHasNextPage(transformedProducts.length === ITEMS_PER_PAGE)
        setPage(pageNum + 1)
      } catch (err) {
        setError('Erro ao carregar produtos. Tente novamente.')
        console.error('Error loading products:', err)
      } finally {
        setLoading(false)
      }
    },
    [categoryId, loading]
  )

  // Load initial products
  useEffect(() => {
    loadProducts(1, true)
  }, [categoryId, loadProducts])

  // Load more when in view
  useEffect(() => {
    if (inView && hasNextPage && !loading) {
      loadProducts(page)
    }
  }, [inView, hasNextPage, loading, page, loadProducts])

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      const container = document.querySelector('[data-infinite-grid]')
      if (container) {
        setContainerWidth(container.clientWidth)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const GridItem = ({
    columnIndex,
    rowIndex,
    style,
  }: {
    columnIndex: number
    rowIndex: number
    style: React.CSSProperties
  }) => {
    const index = rowIndex * adjustedColumnCount + columnIndex
    const product = allProducts[index]

    if (!product) return null

    const isFeatured = featuredProducts.some(fp => fp.id === product.id)

    return (
      <div style={style}>
        <div className='p-3'>
          <motion.div
            variants={itemVariants}
            initial='hidden'
            animate='visible'
            className='relative'
          >
            {isFeatured && (
              <div className='absolute -top-2 -right-2 z-10'>
                <div className='rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-2 py-1 text-xs font-bold text-white shadow-lg'>
                  ⭐ Destaque
                </div>
              </div>
            )}
            <ProductCard product={product} />
          </motion.div>
        </div>
      </div>
    )
  }

  const rowCount = Math.ceil(allProducts.length / adjustedColumnCount)
  const gridHeight = Math.min(rowCount * GRID_ITEM_HEIGHT, 800)

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'flex flex-col items-center justify-center py-12 text-center',
          className
        )}
      >
        <AlertCircle className='text-destructive mb-4 h-12 w-12' />
        <h3 className='mb-2 text-lg font-semibold'>
          Erro ao carregar produtos
        </h3>
        <p className='text-muted-foreground mb-4'>{error}</p>
        <Button onClick={() => loadProducts(1, true)} variant='outline'>
          <RefreshCw className='mr-2 h-4 w-4' />
          Tentar novamente
        </Button>
      </motion.div>
    )
  }

  return (
    <div className={cn('w-full', className)} data-infinite-grid>
      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='mb-8'
        >
          <div className='mb-6'>
            <h2 className='mb-2 text-2xl font-bold'>Produtos em Destaque</h2>
            <div className='h-1 w-20 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500' />
          </div>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {featuredProducts.map(product => (
              <motion.div key={product.id} variants={itemVariants}>
                <div className='relative'>
                  <div className='absolute -top-2 -right-2 z-10'>
                    <div className='rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-2 py-1 text-xs font-bold text-white shadow-lg'>
                      ⭐ Destaque
                    </div>
                  </div>
                  <ProductCard product={product} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* All Products Section */}
      <div className='mb-6'>
        <h2 className='mb-2 text-2xl font-bold'>
          {featuredProducts.length > 0 ? 'Todos os Produtos' : 'Produtos'}
        </h2>
        <div className='h-1 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600' />
      </div>

      {allProducts.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
        >
          <Grid
            columnCount={adjustedColumnCount}
            columnWidth={GRID_ITEM_WIDTH + GRID_GAP}
            height={gridHeight}
            rowCount={rowCount}
            rowHeight={GRID_ITEM_HEIGHT}
            width={containerWidth}
            className='scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'
          >
            {GridItem}
          </Grid>
        </motion.div>
      )}

      {/* Loading indicator */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='flex justify-center py-8'
          >
            <div className='flex items-center gap-3'>
              <RefreshCw className='text-primary h-5 w-5 animate-spin' />
              <span className='text-muted-foreground'>
                Carregando produtos...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Load more trigger */}
      {hasNextPage && !loading && (
        <div ref={loadMoreRef} className='h-10 w-full' />
      )}

      {/* No more products indicator */}
      {!hasNextPage && allProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='text-muted-foreground py-8 text-center'
        >
          <div className='bg-muted inline-flex items-center gap-2 rounded-full px-4 py-2'>
            <span>Todos os produtos foram carregados</span>
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {!loading && allProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='py-12 text-center'
        >
          <h3 className='mb-2 text-lg font-semibold'>
            Nenhum produto encontrado
          </h3>
          <p className='text-muted-foreground'>
            Não há produtos disponíveis nesta categoria no momento.
          </p>
        </motion.div>
      )}
    </div>
  )
}
