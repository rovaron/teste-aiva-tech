import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Grid, List, Star, ShoppingCart } from 'lucide-react'

export const metadata = {
  title: 'Produtos',
  description: 'Explore nossa coleção completa de produtos com a melhor qualidade.',
}

// Mock data - em produção viria de uma API
const products = [
  {
    id: 1,
    name: 'Smartphone Premium',
    price: 1299.99,
    originalPrice: 1499.99,
    image: '/api/placeholder/300/300',
    rating: 4.8,
    reviews: 124,
    category: 'Eletrônicos',
    badge: 'Oferta',
  },
  {
    id: 2,
    name: 'Notebook Gamer',
    price: 2499.99,
    image: '/api/placeholder/300/300',
    rating: 4.9,
    reviews: 89,
    category: 'Computadores',
    badge: 'Novo',
  },
  {
    id: 3,
    name: 'Fone Bluetooth',
    price: 299.99,
    originalPrice: 399.99,
    image: '/api/placeholder/300/300',
    rating: 4.6,
    reviews: 256,
    category: 'Áudio',
    badge: 'Desconto',
  },
  {
    id: 4,
    name: 'Smartwatch Sport',
    price: 599.99,
    image: '/api/placeholder/300/300',
    rating: 4.7,
    reviews: 178,
    category: 'Wearables',
  },
  {
    id: 5,
    name: 'Câmera Digital',
    price: 1899.99,
    image: '/api/placeholder/300/300',
    rating: 4.9,
    reviews: 67,
    category: 'Fotografia',
    badge: 'Premium',
  },
  {
    id: 6,
    name: 'Tablet Pro',
    price: 899.99,
    originalPrice: 1099.99,
    image: '/api/placeholder/300/300',
    rating: 4.5,
    reviews: 143,
    category: 'Tablets',
    badge: 'Oferta',
  },
]

export default function ProductsPage() {
  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Nossos Produtos
        </h1>
        <p className="text-muted-foreground">
          Descubra nossa coleção completa com {products.length} produtos incríveis
        </p>
      </div>
      
      {/* Filters and Search */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              className="pl-10"
            />
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                <SelectItem value="electronics">Eletrônicos</SelectItem>
                <SelectItem value="computers">Computadores</SelectItem>
                <SelectItem value="audio">Áudio</SelectItem>
                <SelectItem value="wearables">Wearables</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="featured">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Destaque</SelectItem>
                <SelectItem value="price-low">Menor preço</SelectItem>
                <SelectItem value="price-high">Maior preço</SelectItem>
                <SelectItem value="rating">Melhor avaliado</SelectItem>
                <SelectItem value="newest">Mais recente</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Card key={product.id} className="group overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {product.badge && (
                  <Badge 
                    className="absolute top-2 left-2" 
                    variant={product.badge === 'Oferta' ? 'destructive' : 'secondary'}
                  >
                    {product.badge}
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{product.rating}</span>
                  <span>({product.reviews})</span>
                </div>
                
                <h3 className="font-semibold line-clamp-2">
                  <Link 
                    href={`/products/${product.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {product.name}
                  </Link>
                </h3>
                
                <p className="text-sm text-muted-foreground">
                  {product.category}
                </p>
                
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">
                    R$ {product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      R$ {product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="p-4 pt-0">
              <Button className="w-full" size="sm">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Adicionar ao carrinho
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Load More */}
      <div className="mt-12 text-center">
        <Button variant="outline" size="lg">
          Carregar mais produtos
        </Button>
      </div>
    </div>
  )
}