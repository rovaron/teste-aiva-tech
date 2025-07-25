'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/stores/cart-store'
import { cn } from '@/lib/utils'
import { isValidImageUrl } from '@/lib/utils' // Adicionar importação

// Variantes de animação seguindo rules.md
const dropdownVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 500,
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: 0.15, ease: [0.4, 0.0, 0.2, 1] },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] },
  },
}

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}

interface MiniCartProps {
  isOpen: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLButtonElement>
}

interface MiniCartItemProps {
  item: {
    id: string
    name: string
    slug: string
    price: number
    quantity: number
    image?: string
  }
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

function MiniCartItem({ item, onUpdateQuantity, onRemove }: MiniCartItemProps) {
  return (
    <motion.div
      variants={itemVariants}
      className='hover:bg-muted/50 flex gap-3 rounded-md p-3 transition-colors'
    >
      {/* Imagem do produto */}
      <div className='relative h-12 w-12 flex-shrink-0 overflow-hidden rounded border'>
        <Image
          src={isValidImageUrl(item.image)} // Aplicar validação, removendo o placeholder antigo
          alt={item.name}
          fill
          className='object-cover'
          sizes='48px'
        />
      </div>

      {/* Informações do produto */}
      <div className='min-w-0 flex-1'>
        <h4 className='line-clamp-1 text-sm font-medium'>{item.name}</h4>
        <div className='mt-1 flex items-center justify-between'>
          <span className='text-sm font-semibold text-green-600'>
            R$ {item.price.toFixed(2)}
          </span>

          {/* Controles de quantidade */}
          <div className='flex items-center gap-1'>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className='hover:bg-muted flex h-6 w-6 items-center justify-center rounded border transition-colors disabled:cursor-not-allowed disabled:opacity-50'
            >
              <Minus className='h-3 w-3' />
            </button>

            <span className='w-6 text-center text-xs font-medium'>
              {item.quantity}
            </span>

            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className='hover:bg-muted flex h-6 w-6 items-center justify-center rounded border transition-colors'
            >
              <Plus className='h-3 w-3' />
            </button>

            <button
              onClick={() => onRemove(item.id)}
              className='hover:bg-destructive hover:text-destructive-foreground ml-1 flex h-6 w-6 items-center justify-center rounded border transition-colors'
            >
              <Trash2 className='h-3 w-3' />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function MiniCart({
  isOpen,
  onClose,
  triggerRef: _triggerRef,
}: MiniCartProps) {
  const {
    items,
    updateQuantity,
    removeItem,
    toggleCart,
    getTotalItems,
    getTotalPrice,
  } = useCartStore()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Previne hidratação mismatch
  if (!mounted) return null

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()
  const maxItemsToShow = 3
  const displayItems = items.slice(0, maxItemsToShow)
  const hasMoreItems = items.length > maxItemsToShow

  const handleViewCart = () => {
    onClose()
    toggleCart()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay invisível para fechar ao clicar fora */}
          <div
            className='fixed inset-0 z-40'
            onClick={onClose}
            aria-hidden='true'
          />

          {/* Mini Cart Dropdown */}
          <motion.div
            variants={dropdownVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            className={cn(
              'absolute right-0 z-50 w-80 max-w-sm',
              'bg-background rounded-lg border shadow-lg',
              'max-h-96 overflow-hidden'
            )}
            style={{
              top: 'calc(100% + 8px)',
              transformOrigin: 'top right',
            }}
          >
            {items.length === 0 ? (
              /* Carrinho vazio */
              <div className='p-6 text-center'>
                <ShoppingBag className='text-muted-foreground/50 mx-auto mb-3 h-12 w-12' />
                <h3 className='mb-1 font-medium'>Carrinho vazio</h3>
                <p className='text-muted-foreground mb-4 text-sm'>
                  Adicione produtos para começar
                </p>
                <Button onClick={onClose} size='sm' className='w-full'>
                  Continuar comprando
                </Button>
              </div>
            ) : (
              /* Lista de itens */
              <div className='p-4'>
                {/* Header */}
                <div className='mb-3 flex items-center justify-between'>
                  <h3 className='font-semibold'>Carrinho</h3>
                  <span className='text-muted-foreground text-sm'>
                    {totalItems} {totalItems === 1 ? 'item' : 'itens'}
                  </span>
                </div>

                {/* Lista de produtos */}
                <motion.div
                  variants={staggerContainer}
                  initial='hidden'
                  animate='visible'
                  className='max-h-48 space-y-2 overflow-y-auto'
                >
                  {displayItems.map(item => (
                    <MiniCartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </motion.div>

                {/* Indicador de mais itens */}
                {hasMoreItems && (
                  <div className='py-2 text-center'>
                    <span className='text-muted-foreground text-xs'>
                      +{items.length - maxItemsToShow}{' '}
                      {items.length - maxItemsToShow === 1 ? 'item' : 'itens'} a
                      mais
                    </span>
                  </div>
                )}

                <Separator className='my-3' />

                {/* Total */}
                <div className='mb-3 flex items-center justify-between'>
                  <span className='font-medium'>Total:</span>
                  <span className='font-semibold text-green-600'>
                    R$ {totalPrice.toFixed(2)}
                  </span>
                </div>

                {/* Ações */}
                <div className='space-y-2'>
                  <Button onClick={handleViewCart} className='w-full' size='sm'>
                    Ver carrinho completo
                    <ArrowRight className='ml-2 h-3 w-3' />
                  </Button>

                  <Button
                    asChild
                    variant='outline'
                    className='w-full'
                    size='sm'
                  >
                    <Link href='/checkout' onClick={onClose}>
                      Finalizar compra
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MiniCart
