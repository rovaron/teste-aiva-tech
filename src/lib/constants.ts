// Application constants

export const APP_CONFIG = {
  name: 'Store',
  description:
    'Loja online moderna com Next.js 15, TypeScript e performance otimizada',
  url: 'https://store.example.com',
  author: 'Store Team',
  social: {
    twitter: '@store',
    github: 'https://github.com/store',
    instagram: 'https://instagram.com/store',
  },
} as const

export const ROUTES = {
  home: '/',
  products: '/products',
  categories: '/categories',
  cart: '/cart',
  checkout: '/checkout',
  account: '/account',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
  },
  admin: {
    dashboard: '/admin',
    products: '/admin/products',
    orders: '/admin/orders',
    users: '/admin/users',
  },
} as const

export const API_ENDPOINTS = {
  products: '/api/products',
  categories: '/api/categories',
  orders: '/api/orders',
  users: '/api/users',
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
  },
} as const

export const PAGINATION = {
  defaultLimit: 12,
  maxLimit: 100,
  defaultPage: 1,
} as const

export const CACHE_TAGS = {
  products: 'products',
  categories: 'categories',
  orders: 'orders',
  users: 'users',
} as const

export const CACHE_REVALIDATE = {
  products: 3600, // 1 hour
  categories: 86400, // 24 hours
  homepage: 1800, // 30 minutes
  static: 31536000, // 1 year
} as const

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const
