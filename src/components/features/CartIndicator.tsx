'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { cn } from '@/lib/utils'
import { MiniCart } from './MiniCart'

// Variantes de animação seguindo rules.md
const cartBounce = {
  idle: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1, ease: [0.4, 0.0, 0.2, 1] },
  },
  shake: {
    x: [0, -2, 2, -2, 2, 0],
    transition: { duration: 0.4, ease: [0.4, 0.0, 0.2, 1] },
  },
}

const badgeVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 500,
      duration: 0.3,
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] },
  },
  pulse: {
    scale: [1, 1.2, 1],
    transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] },
  },
}

interface CartIndicatorProps {
  className?: string
  showLabel?: boolean
}

export function CartIndicator({
  className,
  showLabel = false,
}: CartIndicatorProps) {
  const { getTotalItems, toggleCart } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [previousCount, setPreviousCount] = useState(0)
  const [shouldShake, setShouldShake] = useState(false)
  const [showMiniCart, setShowMiniCart] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null!)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const totalItems = mounted ? getTotalItems() : 0

  // Animação quando itens são adicionados
  useEffect(() => {
    if (mounted && totalItems > previousCount && previousCount > 0) {
      setShouldShake(true)
      const timer = setTimeout(() => setShouldShake(false), 400)
      return () => clearTimeout(timer)
    }
    setPreviousCount(totalItems)
  }, [totalItems, previousCount, mounted])

  // Handlers para o mini cart
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (totalItems > 0) {
      setShowMiniCart(true)
    }
  }

  const handleMouseLeave = () => {
    // Delay maior para evitar flickering
    timeoutRef.current = setTimeout(() => {
      setShowMiniCart(false)
    }, 300)
  }

  const handleClick = () => {
    setShowMiniCart(false)
    toggleCart()
  }

  // Cleanup do timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Previne hidratação mismatch
  if (!mounted) {
    return (
      <button
        className={cn(
          'relative inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors',
          'hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2',
          'focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
          className
        )}
        aria-label='Carrinho de compras'
      >
        <ShoppingCart className='h-5 w-5' />
        {showLabel && <span className='sr-only'>Carrinho</span>}
      </button>
    )
  }

  return (
    <div
      className='relative'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.button
        ref={buttonRef}
        variants={cartBounce}
        initial='idle'
        whileHover='hover'
        whileTap='tap'
        animate={shouldShake ? 'shake' : 'idle'}
        onClick={handleClick}
        className={cn(
          'relative inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors',
          'hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2',
          'focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
          className
        )}
        aria-label={`Carrinho de compras${totalItems > 0 ? ` - ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}` : ''}`}
      >
        <ShoppingCart className='h-5 w-5' />

        {/* Badge com contador */}
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.span
              key={totalItems} // Re-anima quando o número muda
              variants={badgeVariants}
              initial='hidden'
              animate={['visible', totalItems !== previousCount ? 'pulse' : '']}
              exit='exit'
              className={cn(
                'absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full',
                'bg-destructive text-destructive-foreground text-xs font-bold',
                'ring-background ring-2'
              )}
            >
              {totalItems > 99 ? '99+' : totalItems}
            </motion.span>
          )}
        </AnimatePresence>

        {showLabel && (
          <span className='sr-only'>
            {totalItems > 0
              ? `${totalItems} ${totalItems === 1 ? 'item' : 'itens'} no carrinho`
              : 'Carrinho vazio'}
          </span>
        )}
      </motion.button>

      {/* Mini Cart */}
      <MiniCart
        isOpen={showMiniCart}
        onClose={() => setShowMiniCart(false)}
        triggerRef={buttonRef}
      />
    </div>
  )
}

export default CartIndicator
