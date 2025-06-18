'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { addToCartAction } from '@/actions/cart'
import { useCartStore } from '@/stores/cart-store'
import { Product } from '@/lib/types'
import { cn } from '@/lib/utils'

interface AddToCartButtonProps {
  product: Product
  quantity?: number
  variant?: 'default' | 'outline' | 'secondary'
  size?: 'default' | 'sm' | 'lg'
  className?: string
  showIcon?: boolean
  fullWidth?: boolean
}

const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  pressed: { scale: 0.98 },
  success: { scale: 1.05 },
}

const iconVariants = {
  rest: { rotate: 0, scale: 1 },
  hover: { rotate: -10, scale: 1.1 },
  pressed: { rotate: 0, scale: 0.9 },
  success: { rotate: 360, scale: 1.2 },
}

const cartBounce = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 0.6,
      ease: [0.4, 0.0, 0.2, 1],
    },
  },
}

export function AddToCartButton({
  product,
  quantity = 1,
  variant = 'default',
  size = 'default',
  className,
  showIcon = true,
  fullWidth = false,
}: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [isSuccess, setIsSuccess] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { addItem, toggleCart: _toggleCart } = useCartStore()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isPending || isSuccess) return

    startTransition(async () => {
      try {
        // Optimistic update to store
        addItem({
          id: product.id.toString(),
          name: product.title,
          slug: product.slug,
          price: product.price,
          image: product.images[0],
        })

        // Server action for persistence
        const formData = new FormData()
        formData.append('productId', product.id.toString())
        formData.append('quantity', quantity.toString())

        const result = await addToCartAction(formData)

        if (result.success) {
          setIsSuccess(true)

          // Haptic feedback on mobile
          if ('vibrate' in navigator) {
            navigator.vibrate(50)
          }

          // Reset success state after animation
          setTimeout(() => {
            setIsSuccess(false)
          }, 2000)
        } else {
          console.error('Failed to add to cart:', result.error)
        }
      } catch (error) {
        console.error('Add to cart error:', error)
      }
    })
  }

  const buttonState = isPending
    ? 'pressed'
    : isSuccess
      ? 'success'
      : isHovered
        ? 'hover'
        : 'rest'
  const iconState = isPending
    ? 'pressed'
    : isSuccess
      ? 'success'
      : isHovered
        ? 'hover'
        : 'rest'

  return (
    <motion.div
      variants={cartBounce}
      animate={isSuccess ? 'animate' : 'rest'}
      className={cn('relative', fullWidth && 'w-full')}
    >
      <Button
        onClick={handleAddToCart}
        disabled={isPending || isSuccess}
        variant={variant}
        size={size}
        className={cn(
          'relative overflow-hidden transition-all duration-200',
          fullWidth && 'w-full',
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        asChild
      >
        <motion.button
          variants={buttonVariants}
          animate={buttonState}
          whileTap={buttonVariants.pressed}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <AnimatePresence mode='wait'>
            {isPending ? (
              <motion.div
                key='loading'
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className='flex items-center gap-2'
              >
                <Loader2 className='h-4 w-4 animate-spin' />
                <span>Adicionando...</span>
              </motion.div>
            ) : isSuccess ? (
              <motion.div
                key='success'
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
                className='flex items-center gap-2'
              >
                <Check className='h-4 w-4' />
                <span>Adicionado!</span>
              </motion.div>
            ) : (
              <motion.div
                key='default'
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className='flex items-center gap-2'
              >
                {showIcon && (
                  <motion.div
                    variants={iconVariants}
                    animate={iconState}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <ShoppingCart className='h-4 w-4' />
                  </motion.div>
                )}
                <span>Adicionar ao Carrinho</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success ripple effect */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className='absolute inset-0 rounded-md bg-green-500'
                style={{ zIndex: -1 }}
              />
            )}
          </AnimatePresence>
        </motion.button>
      </Button>
    </motion.div>
  )
}

// Quick add variant for product grids
export function QuickAddButton({
  product,
  className,
}: {
  product: Product
  className?: string
}) {
  return (
    <AddToCartButton
      product={product}
      variant='outline'
      size='sm'
      showIcon={true}
      className={cn(
        'absolute right-4 bottom-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100',
        className
      )}
    />
  )
}

// Floating add to cart for product pages
export function FloatingAddToCart({
  product,
  quantity = 1,
}: {
  product: Product
  quantity?: number
}) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className='fixed right-4 bottom-4 left-4 z-50 md:hidden'
    >
      <AddToCartButton
        product={product}
        quantity={quantity}
        size='lg'
        fullWidth
        className='shadow-lg'
      />
    </motion.div>
  )
}
