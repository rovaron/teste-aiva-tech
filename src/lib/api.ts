export const API_BASE = 'https://api.escuelajs.co/api/v1';

export interface ProductFilters {
  title?: string;
  price_min?: string;
  price_max?: string;
  categoryId?: string;
  offset?: string;
  limit?: string;
}

export async function getProducts(filters?: ProductFilters) {
  const searchParams = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        searchParams.append(key, value);
      }
    });
  }
  
  const url = `${API_BASE}/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  
  const res = await fetch(url, {
    next: {
      revalidate: 3600,
      tags: ['products']
    }
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
  }
  
  return res.json();
}

export async function getProduct(id: string) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    next: {
      revalidate: 3600,
      tags: [`product-${id}`]
    }
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}`);
  }
  
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${API_BASE}/categories`, {
    next: { 
      revalidate: 7200,
      tags: ['categories']
    }
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
  }
  
  return res.json();
}

export async function getCategory(id: string) {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    next: {
      revalidate: 3600,
      tags: [`category-${id}`]
    }
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch category: ${res.status} ${res.statusText}`);
  }
  
  return res.json();
}

export async function searchProducts(query: string) {
  const res = await fetch(`${API_BASE}/products/?title=${encodeURIComponent(query)}`, {
    next: {
      revalidate: 1800,
      tags: ['products', 'search']
    }
  });
  
  if (!res.ok) {
    throw new Error(`Failed to search products: ${res.status} ${res.statusText}`);
  }
  
  return res.json();
}