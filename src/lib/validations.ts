import { z } from 'zod'

// External API Product Schemas (for escuelajs API)
export const CreateProductSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  price: z.number().min(0, 'Price must be positive'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  categoryId: z
    .number()
    .int()
    .positive('Category ID must be a positive integer'),
  images: z
    .array(z.string().url('Invalid image URL'))
    .min(1, 'At least one image is required'),
})

export const UpdateProductSchema = CreateProductSchema.partial().extend({
  id: z.number().int().positive('Product ID must be a positive integer'),
})

export const ProductIdSchema = z.object({
  id: z.string().transform(val => {
    const num = parseInt(val, 10)
    if (isNaN(num) || num <= 0) {
      throw new Error('Invalid product ID')
    }
    return num
  }),
})

// External API Category Schemas
export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(100, 'Name too long'),
  image: z.string().url('Invalid image URL'),
})

export const UpdateCategorySchema = CreateCategorySchema.partial().extend({
  id: z.number().int().positive('Category ID must be a positive integer'),
})

export const CategoryIdSchema = z.object({
  id: z.string().transform(val => {
    const num = parseInt(val, 10)
    if (isNaN(num) || num <= 0) {
      throw new Error('Invalid category ID')
    }
    return num
  }),
})

// External API Auth Schemas
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  avatar: z.string().url('Invalid avatar URL').optional(),
})

// External API Cart Schemas
export const AddToCartSchema = z.object({
  productId: z.number().int().positive('Product ID must be a positive integer'),
  quantity: z
    .number()
    .int()
    .min(1, 'Quantity must be at least 1')
    .max(99, 'Quantity too high'),
})

export const UpdateCartItemSchema = z.object({
  productId: z.number().int().positive('Product ID must be a positive integer'),
  quantity: z
    .number()
    .int()
    .min(0, 'Quantity must be non-negative')
    .max(99, 'Quantity too high'),
})

export const RemoveFromCartSchema = z.object({
  productId: z.number().int().positive('Product ID must be a positive integer'),
})

// External API Search and Filter Schemas
export const ProductFiltersSchema = z.object({
  title: z.string().optional(),
  price_min: z
    .string()
    .transform(val => {
      if (!val) return undefined
      const num = parseFloat(val)
      return isNaN(num) ? undefined : num
    })
    .optional(),
  price_max: z
    .string()
    .transform(val => {
      if (!val) return undefined
      const num = parseFloat(val)
      return isNaN(num) ? undefined : num
    })
    .optional(),
  categoryId: z
    .string()
    .transform(val => {
      if (!val) return undefined
      const num = parseInt(val, 10)
      return isNaN(num) ? undefined : num
    })
    .optional(),
  offset: z
    .string()
    .transform(val => {
      if (!val) return undefined
      const num = parseInt(val, 10)
      return isNaN(num) || num < 0 ? undefined : num
    })
    .optional(),
  limit: z
    .string()
    .transform(val => {
      if (!val) return undefined
      const num = parseInt(val, 10)
      return isNaN(num) || num <= 0 || num > 100 ? undefined : num
    })
    .optional(),
})

export const SearchQuerySchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(255, 'Query too long'),
})

// User validations
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  avatar: z.string().url().optional(),
  role: z.enum(['user', 'admin']).default('user'),
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  })

// Product validations
export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z
    .string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  price: z.number().positive('Preço deve ser positivo'),
  images: z
    .array(z.string().url())
    .min(1, 'Pelo menos uma imagem é obrigatória'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  stock: z.number().int().min(0, 'Estoque não pode ser negativo'),
  featured: z.boolean().default(false),
  slug: z.string().min(1, 'Slug é obrigatório'),
})

export const createProductSchema = productSchema.omit({ id: true, slug: true })
export const updateProductSchema = createProductSchema.partial()

// Category validations
export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório'),
  description: z.string().optional(),
  image: z.string().url().optional(),
  parentId: z.string().uuid().optional(),
})

export const createCategorySchema = categorySchema.omit({
  id: true,
  slug: true,
})
export const updateCategorySchema = createCategorySchema.partial()

// Order validations
export const addressSchema = z.object({
  street: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  state: z.string().min(2, 'Estado deve ter pelo menos 2 caracteres'),
  zipCode: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
  country: z.string().min(2, 'País deve ter pelo menos 2 caracteres'),
})

export const orderItemSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().positive('Quantidade deve ser positiva'),
  price: z.number().positive('Preço deve ser positivo'),
})

export const orderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  items: z.array(orderItemSchema).min(1, 'Pedido deve ter pelo menos um item'),
  total: z.number().positive('Total deve ser positivo'),
  status: z.enum([
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ]),
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
})

export const createOrderSchema = orderSchema.omit({ id: true, status: true })

// Search and pagination validations
export const searchParamsSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  sortBy: z.enum(['name', 'price', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
})

// Cart validations
export const cartItemSchema = z.object({
  id: z.string().min(1, 'ID é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório'),
  price: z.number().positive('Preço deve ser positivo'),
  quantity: z.number().int().positive('Quantidade deve ser positiva'),
  image: z.string().url().optional(),
})

// Contact form validation
export const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  subject: z.string().min(5, 'Assunto deve ter pelo menos 5 caracteres'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
})

// Newsletter validation
export const newsletterSchema = z.object({
  email: z.string().email('Email inválido'),
})

// Type exports for External API
export type CreateProductInput = z.infer<typeof CreateProductSchema>
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type RegisterInput = z.infer<typeof RegisterSchema>
export type AddToCartInput = z.infer<typeof AddToCartSchema>
export type UpdateCartItemInput = z.infer<typeof UpdateCartItemSchema>
export type ProductFiltersInput = z.infer<typeof ProductFiltersSchema>
export type SearchQueryInput = z.infer<typeof SearchQuerySchema>

// Type exports for Internal schemas
export type User = z.infer<typeof userSchema>
export type LoginInputInternal = z.infer<typeof loginSchema>
export type RegisterInputInternal = z.infer<typeof registerSchema>
export type Product = z.infer<typeof productSchema>
export type CreateProductInputInternal = z.infer<typeof createProductSchema>
export type UpdateProductInputInternal = z.infer<typeof updateProductSchema>
export type Category = z.infer<typeof categorySchema>
export type CreateCategoryInputInternal = z.infer<typeof createCategorySchema>
export type UpdateCategoryInputInternal = z.infer<typeof updateCategorySchema>
export type Address = z.infer<typeof addressSchema>
export type OrderItem = z.infer<typeof orderItemSchema>
export type Order = z.infer<typeof orderSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type SearchParams = z.infer<typeof searchParamsSchema>
export type CartItem = z.infer<typeof cartItemSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type NewsletterInput = z.infer<typeof newsletterSchema>
