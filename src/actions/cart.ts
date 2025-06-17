'use server'

import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import {
  AddToCartSchema,
  UpdateCartItemSchema,
  RemoveFromCartSchema,
} from '@/lib/validations'
import { getProduct } from '@/lib/api'
import type { CartItem } from '@/lib/types'

const CART_COOKIE_NAME = 'shopping-cart'

// Helper function to get cart from cookies
async function getCartFromCookies(): Promise<CartItem[]> {
  try {
    const cookieStore = await cookies()
    const cartCookie = cookieStore.get(CART_COOKIE_NAME)?.value

    if (!cartCookie) {
      return []
    }

    return JSON.parse(cartCookie)
  } catch (error) {
    console.error('Error parsing cart from cookies:', error)
    return []
  }
}

// Helper function to save cart to cookies
async function saveCartToCookies(cart: CartItem[]) {
  try {
    const cookieStore = await cookies()
    cookieStore.set(CART_COOKIE_NAME, JSON.stringify(cart), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
  } catch (error) {
    console.error('Error saving cart to cookies:', error)
  }
}

// Helper function to calculate cart totals
function calculateCartTotals(cart: CartItem[]) {
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0)
  const total = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  return { itemCount, total }
}

export async function getCartAction() {
  try {
    const cart = await getCartFromCookies()
    const { itemCount, total } = calculateCartTotals(cart)

    return {
      success: true,
      data: {
        items: cart,
        itemCount,
        total,
      },
    }
  } catch (error) {
    console.error('Get cart error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get cart',
      data: null,
    }
  }
}

export async function addToCartAction(formData: FormData) {
  try {
    const rawData = {
      productId: parseInt(formData.get('productId') as string),
      quantity: parseInt(formData.get('quantity') as string) || 1,
    }

    const validatedData = AddToCartSchema.parse(rawData)

    // Get product details
    const product = await getProduct(validatedData.productId.toString())
    if (!product) {
      return {
        success: false,
        error: 'Product not found',
      }
    }

    const cart = await getCartFromCookies()

    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(
      item => item.product.id === validatedData.productId
    )

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      cart[existingItemIndex].quantity += validatedData.quantity
    } else {
      // Add new item to cart
      cart.push({
        product,
        quantity: validatedData.quantity,
      })
    }

    await saveCartToCookies(cart)
    revalidateTag('cart')

    const { itemCount, total } = calculateCartTotals(cart)

    return {
      success: true,
      data: {
        items: cart,
        itemCount,
        total,
      },
    }
  } catch (error) {
    console.error('Add to cart error:', error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to add item to cart',
    }
  }
}

export async function updateCartItemAction(formData: FormData) {
  try {
    const rawData = {
      productId: parseInt(formData.get('productId') as string),
      quantity: parseInt(formData.get('quantity') as string),
    }

    const validatedData = UpdateCartItemSchema.parse(rawData)
    const cart = await getCartFromCookies()

    const itemIndex = cart.findIndex(
      item => item.product.id === validatedData.productId
    )

    if (itemIndex === -1) {
      return {
        success: false,
        error: 'Item not found in cart',
      }
    }

    if (validatedData.quantity === 0) {
      // Remove item if quantity is 0
      cart.splice(itemIndex, 1)
    } else {
      // Update quantity
      cart[itemIndex].quantity = validatedData.quantity
    }

    await saveCartToCookies(cart)
    revalidateTag('cart')

    const { itemCount, total } = calculateCartTotals(cart)

    return {
      success: true,
      data: {
        items: cart,
        itemCount,
        total,
      },
    }
  } catch (error) {
    console.error('Update cart item error:', error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to update cart item',
    }
  }
}

export async function removeFromCartAction(formData: FormData) {
  try {
    const rawData = {
      productId: parseInt(formData.get('productId') as string),
    }

    const validatedData = RemoveFromCartSchema.parse(rawData)
    const cart = await getCartFromCookies()

    const filteredCart = cart.filter(
      item => item.product.id !== validatedData.productId
    )

    await saveCartToCookies(filteredCart)
    revalidateTag('cart')

    const { itemCount, total } = calculateCartTotals(filteredCart)

    return {
      success: true,
      data: {
        items: filteredCart,
        itemCount,
        total,
      },
    }
  } catch (error) {
    console.error('Remove from cart error:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to remove item from cart',
    }
  }
}

export async function clearCartAction() {
  try {
    await saveCartToCookies([])
    revalidateTag('cart')

    return {
      success: true,
      data: {
        items: [],
        itemCount: 0,
        total: 0,
      },
    }
  } catch (error) {
    console.error('Clear cart error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to clear cart',
    }
  }
}

export async function getCartItemCountAction() {
  try {
    const cart = await getCartFromCookies()
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0)

    return {
      success: true,
      data: itemCount,
    }
  } catch (error) {
    console.error('Get cart item count error:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get cart item count',
      data: 0,
    }
  }
}

export async function getCartTotalAction() {
  try {
    const cart = await getCartFromCookies()
    const total = cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )

    return {
      success: true,
      data: total,
    }
  } catch (error) {
    console.error('Get cart total error:', error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to get cart total',
      data: 0,
    }
  }
}
