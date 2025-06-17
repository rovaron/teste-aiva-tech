export const API_BASE = 'https://api.escuelajs.co/api/v1'

export interface ProductFilters {
  title?: string
  price?: number
  price_min?: number
  price_max?: number
  categoryId?: number
  categorySlug?: string
  offset?: number
  limit?: number
}

export async function getProducts(filters?: ProductFilters) {
  const searchParams = new URLSearchParams()

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString())
      }
    })
  }

  const url = `${API_BASE}/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

  const res = await fetch(url, {
    next: {
      revalidate: 3600,
      tags: ['products'],
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function getProduct(id: string) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    next: {
      revalidate: 3600,
      tags: [`product-${id}`],
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function getProductBySlug(slug: string) {
  const res = await fetch(`${API_BASE}/products/slug/${slug}`, {
    next: {
      revalidate: 3600,
      tags: [`product-slug-${slug}`],
    },
  })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch product by slug: ${res.status} ${res.statusText}`
    )
  }

  return res.json()
}

export async function getCategories() {
  const res = await fetch(`${API_BASE}/categories`, {
    next: {
      revalidate: 7200,
      tags: ['categories'],
    },
  })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch categories: ${res.status} ${res.statusText}`
    )
  }

  return res.json()
}

export async function getCategory(id: string) {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    next: {
      revalidate: 3600,
      tags: [`category-${id}`],
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch category: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function getCategoryBySlug(slug: string) {
  const res = await fetch(`${API_BASE}/categories/slug/${slug}`, {
    next: {
      revalidate: 3600,
      tags: [`category-slug-${slug}`],
    },
  })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch category by slug: ${res.status} ${res.statusText}`
    )
  }

  return res.json()
}

export async function getProductsByCategory(categoryId: string) {
  const res = await fetch(`${API_BASE}/categories/${categoryId}/products`, {
    next: {
      revalidate: 3600,
      tags: [`category-${categoryId}-products`],
    },
  })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch products by category: ${res.status} ${res.statusText}`
    )
  }

  return res.json()
}

export async function searchProducts(query: string) {
  const res = await fetch(
    `${API_BASE}/products/?title=${encodeURIComponent(query)}`,
    {
      next: {
        revalidate: 1800,
        tags: ['products', 'search'],
      },
    }
  )

  if (!res.ok) {
    throw new Error(
      `Failed to search products: ${res.status} ${res.statusText}`
    )
  }

  return res.json()
}
