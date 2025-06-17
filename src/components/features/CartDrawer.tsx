'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag,
  Truck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/stores/cart-store'
import { cn } from '@/lib/utils'

// Variantes de animação seguindo rules.md
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
  }
}

const drawerVariants = {
  hidden: { x: '100%' },
  visible: { 
    x: 0,
    transition: { 
      type: 'spring', 
      damping: 25, 
      stiffness: 500,
      duration: 0.4
    }
  },
  exit: { 
    x: '100%',
    transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
  }
}

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.05
    }
  }
}

const buttonHover = {
  scale: 1.02,
  transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
}

const buttonTap = {
  scale: 0.98,
  transition: { duration: 0.1, ease: [0.4, 0.0, 0.2, 1] }
}

interface CartItemProps {
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

function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return
    
    setIsUpdating(true)
    await new Promise(resolve => setTimeout(resolve, 200)) // Simula delay da API
    onUpdateQuantity(item.id, newQuantity)
    setIsUpdating(false)
  }

  const handleRemove = async () => {
    setIsUpdating(true)
    await new Promise(resolve => setTimeout(resolve, 150))
    onRemove(item.id)
  }

  return (
    <motion.div
      layout
      variants={itemVariants}
      className={cn(
        'flex gap-4 p-4 rounded-lg border bg-card transition-colors',
        isUpdating && 'opacity-50 pointer-events-none'
      )}
    >
      {/* Imagem do produto */}
      <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border'>
        <Image
          src={item.image || '/placeholder-product.jpg'}
          alt={item.name}
          fill
          className='object-cover'
          sizes='64px'
        />
      </div>

      {/* Informações do produto */}
      <div className='flex-1 space-y-2'>
        <div className='flex items-start justify-between'>
          <div>
            <h4 className='text-sm font-medium line-clamp-2'>{item.name}</h4>
            <p className='text-sm font-semibold text-green-600'>
              R$ {item.price.toFixed(2)}
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRemove}
            className='text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors'
            aria-label={`Remover ${item.name} do carrinho`}
          >
            <Trash2 className='h-4 w-4' />
          </motion.button>
        </div>

        {/* Controles de quantidade */}
        <div className='flex items-center gap-2'>
          <motion.button
            whileHover={buttonHover}
            whileTap={buttonTap}
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1 || isUpdating}
            className='h-8 w-8 rounded-md border flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            <Minus className='h-3 w-3' />
          </motion.button>
          
          <span className='w-8 text-center text-sm font-medium'>
            {item.quantity}
          </span>
          
          <motion.button
            whileHover={buttonHover}
            whileTap={buttonTap}
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isUpdating}
            className='h-8 w-8 rounded-md border flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            <Plus className='h-3 w-3' />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export function CartDrawer() {
  const {
    items,
    isOpen,
    toggleCart,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCartStore()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Previne scroll do body quando o drawer está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Previne hidratação mismatch
  if (!mounted) return null

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()
  const shipping = totalPrice > 200 ? 0 : 15.99
  const finalTotal = totalPrice + shipping
  const freeShippingThreshold = 200
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totalPrice)

  const cartContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            onClick={toggleCart}
            className='fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm'
            aria-hidden='true'
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            className='fixed right-0 top-0 z-[9999] h-full w-full max-w-md bg-background shadow-2xl border-l'
            role='dialog'
            aria-modal='true'
            aria-labelledby='cart-title'
          >
            <div className='flex h-full flex-col'>
              {/* Header */}
              <div className='flex items-center justify-between p-6 border-b'>
                <div className='flex items-center gap-2'>
                  <ShoppingBag className='h-5 w-5' />
                  <h2 id='cart-title' className='text-lg font-semibold'>
                    Carrinho
                  </h2>
                  {totalItems > 0 && (
                    <Badge variant='secondary' className='ml-2'>
                      {totalItems}
                    </Badge>
                  )}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleCart}
                  className='p-2 hover:bg-muted rounded-md transition-colors'
                  aria-label='Fechar carrinho'
                >
                  <X className='h-5 w-5' />
                </motion.button>
              </div>

              {/* Conteúdo */}
              <div className='flex-1 overflow-hidden'>
                {items.length === 0 ? (
                  /* Carrinho vazio */
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className='flex h-full flex-col items-center justify-center p-6 text-center'
                  >
                    <ShoppingBag className='h-16 w-16 text-muted-foreground/50 mb-4' />
                    <h3 className='text-lg font-medium mb-2'>Carrinho vazio</h3>
                    <p className='text-muted-foreground mb-6 text-sm'>
                      Adicione produtos incríveis ao seu carrinho
                    </p>
                    <Button onClick={toggleCart} className='w-full'>
                      Continuar comprando
                    </Button>
                  </motion.div>
                ) : (
                  /* Lista de itens */
                  <div className='flex h-full flex-col'>
                    {/* Progresso para frete grátis */}
                    {remainingForFreeShipping > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='p-4 bg-muted/50 border-b'
                      >
                        <div className='flex items-center gap-2 mb-2'>
                          <Truck className='h-4 w-4 text-green-600' />
                          <span className='text-sm font-medium'>
                            Faltam R$ {remainingForFreeShipping.toFixed(2)} para frete grátis!
                          </span>
                        </div>
                        <div className='w-full bg-muted rounded-full h-2'>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${Math.min(100, (totalPrice / freeShippingThreshold) * 100)}%` 
                            }}
                            transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
                            className='bg-green-600 h-2 rounded-full'
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Lista de produtos */}
                    <motion.div
                      variants={staggerContainer}
                      initial='hidden'
                      animate='visible'
                      className='flex-1 overflow-y-auto p-4 space-y-4'
                    >
                      <AnimatePresence mode='popLayout'>
                        {items.map((item) => (
                          <CartItem
                            key={item.id}
                            item={item}
                            onUpdateQuantity={updateQuantity}
                            onRemove={removeItem}
                          />
                        ))}
                      </AnimatePresence>
                    </motion.div>

                    {/* Footer com totais e ações */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className='border-t bg-background p-4 space-y-4'
                    >
                      {/* Resumo de preços */}
                      <div className='space-y-2'>
                        <div className='flex justify-between text-sm'>
                          <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'itens'})</span>
                          <span>R$ {totalPrice.toFixed(2)}</span>
                        </div>
                        
                        <div className='flex justify-between text-sm'>
                          <span className='flex items-center gap-1'>
                            <Truck className='h-3 w-3' />
                            Frete
                          </span>
                          <span className={cn(
                            shipping === 0 && 'text-green-600 font-medium'
                          )}>
                            {shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2)}`}
                          </span>
                        </div>
                        
                        <Separator />
                        
                        <div className='flex justify-between font-semibold'>
                          <span>Total</span>
                          <span className='text-green-600'>R$ {finalTotal.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className='space-y-2'>
                        <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                          <Button asChild className='w-full' size='lg'>
                            <Link href='/checkout' onClick={toggleCart}>
                              Finalizar compra
                              <ArrowRight className='ml-2 h-4 w-4' />
                            </Link>
                          </Button>
                        </motion.div>
                        
                        <div className='flex gap-2'>
                          <motion.div whileHover={buttonHover} whileTap={buttonTap} className='flex-1'>
                            <Button asChild variant='outline' className='w-full'>
                              <Link href='/cart' onClick={toggleCart}>
                                Ver carrinho
                              </Link>
                            </Button>
                          </motion.div>
                          
                          <motion.button
                            whileHover={buttonHover}
                            whileTap={buttonTap}
                            onClick={clearCart}
                            className='px-3 py-2 text-sm text-muted-foreground hover:text-destructive border rounded-md transition-colors'
                            aria-label='Limpar carrinho'
                          >
                            <Trash2 className='h-4 w-4' />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  // Renderiza usando portal para garantir que fique acima de tudo
  return mounted ? createPortal(cartContent, document.body) : null
}

export default CartDrawer