'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { Product, ApiResponse } from '@/types/global'

// Validation schemas
const createProductSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z
    .string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  price: z.number().positive('Preço deve ser positivo'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  stock: z.number().int().min(0, 'Estoque não pode ser negativo'),
  images: z
    .array(z.string().url())
    .min(1, 'Pelo menos uma imagem é obrigatória'),
})

const updateProductSchema = createProductSchema.partial()

// Server Actions
export async function createProduct(
  formData: FormData
): Promise<ApiResponse<Product>> {
  try {
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      category: formData.get('category') as string,
      stock: Number(formData.get('stock')),
      images: JSON.parse(formData.get('images') as string),
    }

    const validatedData = createProductSchema.parse(data)

    // Simulate API call
    const product: Product = {
      id: crypto.randomUUID(),
      ...validatedData,
      featured: false,
      slug: validatedData.name.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Revalidate the products page
    revalidatePath('/products')
    revalidatePath('/admin/products')

    return {
      success: true,
      data: product,
      message: 'Produto criado com sucesso',
    }
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        error: error.errors[0].message,
      }
    }

    return {
      success: false,
      data: null,
      error: 'Erro interno do servidor',
    }
  }
}

export async function updateProduct(
  id: string,
  formData: FormData
): Promise<ApiResponse<Product>> {
  try {
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: formData.get('price') ? Number(formData.get('price')) : undefined,
      category: formData.get('category') as string,
      stock: formData.get('stock') ? Number(formData.get('stock')) : undefined,
      images: formData.get('images')
        ? JSON.parse(formData.get('images') as string)
        : undefined,
    }

    // Remove undefined values
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(
        ([, value]) => value !== undefined && value !== ''
      )
    )

    const validatedData = updateProductSchema.parse(cleanData)

    // Simulate API call
    const product: Product = {
      id,
      ...validatedData,
      featured: false,
      slug: validatedData.name?.toLowerCase().replace(/\s+/g, '-') || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Product

    // Revalidate relevant pages
    revalidatePath('/products')
    revalidatePath(`/products/${product.slug}`)
    revalidatePath('/admin/products')

    return {
      success: true,
      data: product,
      message: 'Produto atualizado com sucesso',
    }
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        error: error.errors[0].message,
      }
    }

    return {
      success: false,
      data: null,
      error: 'Erro interno do servidor',
    }
  }
}

export async function deleteProduct(_id: string): Promise<ApiResponse<null>> {
  try {
    // Simulate API call
    // await api.delete(`/products/${id}`)

    // Revalidate relevant pages
    revalidatePath('/products')
    revalidatePath('/admin/products')

    return {
      success: true,
      data: null,
      message: 'Produto deletado com sucesso',
    }
  } catch (_error) {
    return {
      success: false,
      data: null,
      error: 'Erro ao deletar produto',
    }
  }
}
