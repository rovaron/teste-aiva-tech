'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    getTotalItems,
    getTotalPrice,
    clearCart,
  } = useCartStore()

  const isEmpty = items.length === 0
  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()
  const shipping = totalPrice > 200 ? 0 : 15.99
  const finalTotal = totalPrice + shipping

  if (isEmpty) {
    return (
      <div className='container py-8'>
        <div className='mx-auto max-w-2xl text-center'>
          <div className='mb-8'>
            <ShoppingBag className='text-muted-foreground/50 mx-auto h-24 w-24' />
            <h1 className='mt-4 text-3xl font-bold tracking-tight'>
              Seu carrinho está vazio
            </h1>
            <p className='text-muted-foreground mt-2'>
              Adicione alguns produtos incríveis ao seu carrinho para continuar.
            </p>
          </div>

          <div className='space-y-4'>
            <Button asChild size='lg' className='w-full sm:w-auto'>
              <Link href='/products'>Explorar produtos</Link>
            </Button>

            <div className='text-muted-foreground text-sm'>
              <p>Ou continue navegando em nossas categorias:</p>
              <div className='mt-2 flex flex-wrap justify-center gap-2'>
                <Link
                  href='/products?category=electronics'
                  className='text-primary hover:underline'
                >
                  Eletrônicos
                </Link>
                <span>•</span>
                <Link
                  href='/products?category=computers'
                  className='text-primary hover:underline'
                >
                  Computadores
                </Link>
                <span>•</span>
                <Link
                  href='/products?category=audio'
                  className='text-primary hover:underline'
                >
                  Áudio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='container py-8'>
      {/* Header */}
      <div className='mb-8'>
        <div className='mb-4 flex items-center gap-4'>
          <Button variant='ghost' asChild className='gap-2'>
            <Link href='/products'>
              <ArrowLeft className='h-4 w-4' />
              Continuar comprando
            </Link>
          </Button>
        </div>

        <h1 className='text-3xl font-bold tracking-tight'>
          Carrinho de compras
        </h1>
        <p className='text-muted-foreground'>
          {totalItems} {totalItems === 1 ? 'item' : 'itens'} no seu carrinho
        </p>
      </div>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        {/* Cart Items */}
        <div className='lg:col-span-2'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Itens do carrinho</CardTitle>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={clearCart}
                  className='text-destructive hover:text-destructive'
                >
                  <Trash2 className='mr-2 h-4 w-4' />
                  Limpar carrinho
                </Button>
              </div>
            </CardHeader>

            <CardContent className='space-y-4'>
              {items.map(item => (
                <div
                  key={item.id}
                  className='border-border flex gap-4 border-b py-4 last:border-0'
                >
                  <div className='relative h-20 w-20 overflow-hidden rounded-md border'>
                    <Image
                      src={item.image || '/placeholder.jpg'}
                      alt={item.name}
                      fill
                      className='object-cover'
                    />
                  </div>

                  <div className='flex-1 space-y-2'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <h3 className='line-clamp-1 font-semibold'>
                          <Link
                            href={`/products/${item.slug}`}
                            className='hover:text-primary transition-colors'
                          >
                            {item.name}
                          </Link>
                        </h3>
                        <p className='text-muted-foreground text-sm'>
                          R$ {item.price.toFixed(2)} cada
                        </p>
                      </div>

                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => removeItem(item.id)}
                        className='text-destructive hover:text-destructive'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>

                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(0, item.quantity - 1)
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className='h-3 w-3' />
                        </Button>

                        <Input
                          type='number'
                          value={item.quantity}
                          onChange={e => {
                            const value = parseInt(e.target.value) || 1
                            updateQuantity(item.id, Math.max(1, value))
                          }}
                          className='w-16 text-center'
                          min='1'
                        />

                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className='h-3 w-3' />
                        </Button>
                      </div>

                      <div className='text-right'>
                        <p className='font-semibold'>
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Resumo do pedido</CardTitle>
            </CardHeader>

            <CardContent className='space-y-4'>
              <div className='flex justify-between'>
                <span>
                  Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
                </span>
                <span>R$ {totalPrice.toFixed(2)}</span>
              </div>

              <div className='flex justify-between'>
                <span>Frete</span>
                <span>
                  {shipping === 0 ? (
                    <Badge variant='secondary'>Grátis</Badge>
                  ) : (
                    `R$ ${shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              {shipping > 0 && (
                <p className='text-muted-foreground text-sm'>
                  Frete grátis em compras acima de R$ 200,00
                </p>
              )}

              <Separator />

              <div className='flex justify-between text-lg font-semibold'>
                <span>Total</span>
                <span>R$ {finalTotal.toFixed(2)}</span>
              </div>
            </CardContent>

            <CardFooter className='flex-col space-y-3'>
              <Button className='w-full' size='lg'>
                Finalizar compra
              </Button>

              <Button variant='outline' className='w-full' size='lg'>
                <Tag className='mr-2 h-4 w-4' />
                Aplicar cupom
              </Button>
            </CardFooter>
          </Card>

          {/* Security Info */}
          <Card>
            <CardContent className='p-4'>
              <div className='space-y-3 text-sm'>
                <div className='flex items-center gap-2'>
                  <div className='h-2 w-2 rounded-full bg-green-500' />
                  <span>Compra 100% segura</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='h-2 w-2 rounded-full bg-green-500' />
                  <span>Garantia de entrega</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='h-2 w-2 rounded-full bg-green-500' />
                  <span>Suporte 24/7</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
