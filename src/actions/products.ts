'use server'

import { revalidateTag, revalidatePath } from 'next/cache'
import { CreateProductSchema, UpdateProductSchema, ProductIdSchema } from '@/lib/validations'
import { getProducts, getProduct, getCategories, searchProducts, API_BASE } from '@/lib/api'
import { getUserFromAPI, getAccessToken } from './auth'
// Removed unused import
import type { Product } from '@/lib/types'

export async function getProductsAction(filters?: Record<string, string | number | boolean>) {
  try {
    const products = await getProducts(filters)
    return {
      success: true,
      data: products,
    }
  } catch (error) {
    console.error('Get products error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch products',
      data: null,
    }
  }
}

export async function getProductAction(id: string) {
  try {
    const validatedId = ProductIdSchema.parse({ id })
    const product = await getProduct(validatedId.id.toString())
    return {
      success: true,
      data: product,
    }
  } catch (error) {
    console.error('Get product error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch product',
      data: null,
    }
  }
}

export async function getCategoriesAction() {
  try {
    const categories = await getCategories()
    return {
      success: true,
      data: categories,
    }
  } catch (error) {
    console.error('Get categories error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch categories',
      data: null,
    }
  }
}

export async function searchProductsAction(query: string) {
  try {
    if (!query.trim()) {
      return {
        success: true,
        data: [],
      }
    }

    const products = await searchProducts(query)
    return {
      success: true,
      data: products,
    }
  } catch (error) {
    console.error('Search products error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search products',
      data: null,
    }
  }
}

export async function createProductAction(formData: FormData) {
  try {
    const user = await getUserFromAPI()
    if (!user) {
      return {
        success: false,
        error: 'Authentication required',
      }
    }

    const rawData = {
      title: formData.get('title') as string,
      price: parseFloat(formData.get('price') as string),
      description: formData.get('description') as string,
      categoryId: parseInt(formData.get('categoryId') as string),
      images: JSON.parse(formData.get('images') as string || '[]'),
    }

    const validatedData = CreateProductSchema.parse(rawData)

    const accessToken = await getAccessToken()
    if (!accessToken) {
      return {
        success: false,
        error: 'Access token not found',
      }
    }

    const response = await fetch(`${API_BASE}/products/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(validatedData),
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.message || 'Failed to create product',
      }
    }

    const product: Product = await response.json()

    // Revalidate relevant caches
    revalidateTag('products')
    revalidatePath('/products')
    revalidatePath('/admin/products')

    return {
      success: true,
      data: product,
    }
  } catch (error) {
    console.error('Create product error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create product',
    }
  }
}

export async function updateProductAction(formData: FormData) {
  try {
    const user = await getUserFromAPI()
    if (!user) {
      return {
        success: false,
        error: 'Authentication required',
      }
    }

    const rawData = {
      id: parseInt(formData.get('id') as string),
      title: formData.get('title') as string,
      price: parseFloat(formData.get('price') as string),
      description: formData.get('description') as string,
      categoryId: parseInt(formData.get('categoryId') as string),
      images: JSON.parse(formData.get('images') as string || '[]'),
    }

    const validatedData = UpdateProductSchema.parse(rawData)
    const { id, ...updateData } = validatedData

    const accessToken = await getAccessToken()
    if (!accessToken) {
      return {
        success: false,
        error: 'Access token not found',
      }
    }

    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.message || 'Failed to update product',
      }
    }

    const product: Product = await response.json()

    // Revalidate relevant caches
    revalidateTag('products')
    revalidateTag(`product-${id}`)
    revalidatePath('/products')
    revalidatePath(`/products/${id}`)
    revalidatePath('/admin/products')

    return {
      success: true,
      data: product,
    }
  } catch (error) {
    console.error('Update product error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update product',
    }
  }
}

export async function deleteProductAction(id: string) {
  try {
    const user = await getUserFromAPI()
    if (!user) {
      return {
        success: false,
        error: 'Authentication required',
      }
    }

    const validatedId = ProductIdSchema.parse({ id })
    const productId = validatedId.id

    const accessToken = await getAccessToken()
    if (!accessToken) {
      return {
        success: false,
        error: 'Access token not found',
      }
    }

    const response = await fetch(`${API_BASE}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.message || 'Failed to delete product',
      }
    }

    // Revalidate relevant caches
    revalidateTag('products')
    revalidateTag(`product-${productId}`)
    revalidatePath('/products')
    revalidatePath('/admin/products')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Delete product error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete product',
    }
  }
}

export async function getProductsByCategory(categoryId: string) {
  try {
    const validatedId = ProductIdSchema.parse({ id: categoryId })
    const products = await getProducts({ categoryId: validatedId.id.toString() })
    return {
      success: true,
      data: products,
    }
  } catch (error) {
    console.error('Get products by category error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch products by category',
      data: null,
    }
  }
}

export async function getFeaturedProducts() {
  try {
    // Get first 8 products as featured (API doesn't have featured flag)
    const products = await getProducts({ limit: '8' })
    return {
      success: true,
      data: products,
    }
  } catch (error) {
    console.error('Get featured products error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch featured products',
      data: null,
    }
  }
}