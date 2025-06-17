import { Product } from './types'
import { getProducts } from './api'

interface ApiProduct {
  id: number
  title: string
  slug: string
  price: number
  description: string
  images: string[]
  category: {
    id: number
    name: string
    image: string
    slug: string
  }
  creationAt: string
  updatedAt: string
}

const transformApiProduct = (apiProduct: ApiProduct): Product => {
  return {
    id: apiProduct.id,
    title: apiProduct.title,
    slug: apiProduct.slug,
    price: apiProduct.price,
    description: apiProduct.description,
    images:
      apiProduct.images.length > 0
        ? apiProduct.images
        : [
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop',
          ],
    category: apiProduct.category,
    creationAt: apiProduct.creationAt,
    updatedAt: apiProduct.updatedAt,
  }
}

/**
 * Busca produtos em destaque para uma categoria específica
 * Como a API não tem um endpoint específico para produtos em destaque,
 * vamos simular pegando os primeiros produtos da categoria com preço mais alto
 */
export async function getFeaturedProductsByCategory(
  categoryId: number,
  limit: number = 4
): Promise<Product[]> {
  try {
    // Busca mais produtos para poder filtrar os "em destaque"
    const apiProducts = await getProducts({
      categoryId: categoryId,
      limit: limit * 3, // Busca mais para ter opções
      offset: 0,
    })

    const transformedProducts = apiProducts.map(transformApiProduct)

    // Simula produtos em destaque baseado em critérios:
    // 1. Preço acima da média
    // 2. Produtos mais recentes
    // 3. Produtos com descrição mais completa
    const avgPrice =
      transformedProducts.length > 0
        ? transformedProducts.reduce(
            (sum: number, p: Product) => sum + p.price,
            0
          ) / transformedProducts.length
        : 0

    const featuredProducts = transformedProducts
      .filter((product: Product) => {
        // Critérios para ser "destaque":
        const hasGoodPrice = product.price >= avgPrice * 0.8 // Preço razoável
        const hasGoodDescription = product.description.length > 50 // Descrição detalhada
        const hasValidImages =
          product.images.length > 0 && product.images[0] !== ''

        return hasGoodPrice && hasGoodDescription && hasValidImages
      })
      .sort((a: Product, b: Product) => {
        // Ordena por uma combinação de preço e data de criação
        const scoreA =
          a.price * 0.7 + new Date(a.creationAt || '').getTime() * 0.3
        const scoreB =
          b.price * 0.7 + new Date(b.creationAt || '').getTime() * 0.3
        return scoreB - scoreA
      })
      .slice(0, limit)

    return featuredProducts
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}

/**
 * Busca produtos em destaque globais (de todas as categorias)
 */
export async function getFeaturedProducts(
  limit: number = 8
): Promise<Product[]> {
  try {
    const apiProducts = await getProducts({
      limit: limit * 2, // Busca mais para ter opções
      offset: 0,
    })

    const transformedProducts = apiProducts.map(transformApiProduct)
    const avgPrice =
      transformedProducts.reduce(
        (sum: number, p: Product) => sum + p.price,
        0
      ) / transformedProducts.length

    const featuredProducts = transformedProducts
      .filter((product: Product) => {
        const hasGoodPrice = product.price >= avgPrice
        const hasGoodDescription = product.description.length > 50
        const hasValidImages = product.images.length > 0

        return hasGoodPrice && hasGoodDescription && hasValidImages
      })
      .sort((a: Product, b: Product) => b.price - a.price) // Ordena por preço decrescente
      .slice(0, limit)

    return featuredProducts
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}
