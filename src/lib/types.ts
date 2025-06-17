export interface Product {
  id: number
  title: string
  slug: string
  price: number
  description: string
  images: string[]
  category: Category
  creationAt?: string
  updatedAt?: string
}

export interface Category {
  id: number
  name: string
  slug: string
  image: string
  creationAt?: string
  updatedAt?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface User {
  id: number
  email: string
  password: string
  name: string
  role: 'customer' | 'admin'
  avatar: string
  creationAt?: string
  updatedAt?: string
}

export interface CreateProductData {
  title: string
  price: number
  description: string
  categoryId: number
  images: string[]
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: number
}

export interface CreateCategoryData {
  name: string
  image: string
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  id: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  avatar?: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
}

export interface ApiError {
  message: string
  statusCode?: number
  error?: string
}

export interface PaginationParams {
  offset?: number
  limit?: number
}

export interface ProductFilters extends PaginationParams {
  title?: string
  price_min?: number
  price_max?: number
  categoryId?: number
}

export interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

export interface UIState {
  cartOpen: boolean
  searchQuery: string
  filters: ProductFilters
  loading: boolean
  error: string | null
}
