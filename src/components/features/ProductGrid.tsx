'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Product } from '@/lib/types'
import { QuickAddButton } from './AddToCartButton'

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div
      className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
      data-testid='product-grid'
    >
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

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
                src={product.images[0]}
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
