import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw, ArrowLeft } from 'lucide-react'

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

// Mock data - em produção viria de uma API
const getProduct = async (id: string) => {
  const products = {
    '1': {
      id: 1,
      name: 'Smartphone Premium',
      price: 1299.99,
      originalPrice: 1499.99,
      images: [
        '/api/placeholder/600/600',
        '/api/placeholder/600/600',
        '/api/placeholder/600/600',
        '/api/placeholder/600/600',
      ],
      rating: 4.8,
      reviews: 124,
      category: 'Eletrônicos',
      badge: 'Oferta',
      description: 'Um smartphone premium com tecnologia de ponta, design elegante e performance excepcional para todas as suas necessidades.',
      features: [
        'Tela OLED de 6.7 polegadas',
        'Câmera tripla de 108MP',
        'Processador octa-core',
        '256GB de armazenamento',
        'Bateria de 5000mAh',
        'Carregamento rápido 65W',
        'Resistente à água IP68',
        '5G Ready'
      ],
      specifications: {
        'Dimensões': '162.6 x 75.2 x 8.2 mm',
        'Peso': '195g',
        'Tela': '6.7" OLED, 120Hz',
        'Processador': 'Snapdragon 8 Gen 2',
        'RAM': '12GB',
        'Armazenamento': '256GB',
        'Câmera': '108MP + 12MP + 12MP',
        'Bateria': '5000mAh',
        'Sistema': 'Android 14'
      },
      inStock: true,
      stockCount: 15
    }
  }
  
  return products[id as keyof typeof products] || null
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProduct(id)
  
  if (!product) {
    return {
      title: 'Produto não encontrado'
    }
  }
  
  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProduct(id)
  
  if (!product) {
    notFound()
  }
  
  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Início
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground">
            Produtos
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>
      
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="gap-2">
          <Link href="/products">
            <ArrowLeft className="h-4 w-4" />
            Voltar aos produtos
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={600}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-md border">
                <Image
                  src={image}
                  alt={`${product.name} - Imagem ${index + 1}`}
                  width={150}
                  height={150}
                  className="h-full w-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <div>
            {product.badge && (
              <Badge className="mb-2" variant={product.badge === 'Oferta' ? 'destructive' : 'secondary'}>
                {product.badge}
              </Badge>
            )}
            
            <h1 className="text-3xl font-bold tracking-tight">
              {product.name}
            </h1>
            
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} avaliações)
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">
                R$ {product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  R$ {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            {product.originalPrice && (
              <p className="text-sm text-green-600">
                Economia de R$ {(product.originalPrice - product.price).toFixed(2)}
              </p>
            )}
          </div>
          
          <p className="text-muted-foreground">
            {product.description}
          </p>
          
          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${
              product.inStock ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-sm">
              {product.inStock 
                ? `Em estoque (${product.stockCount} unidades)`
                : 'Fora de estoque'
              }
            </span>
          </div>
          
          {/* Actions */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <Button 
                size="lg" 
                className="flex-1"
                disabled={!product.inStock}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Adicionar ao carrinho
              </Button>
              
              <Button size="lg" variant="outline">
                <Heart className="h-4 w-4" />
              </Button>
              
              <Button size="lg" variant="outline">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            
            <Button variant="outline" size="lg" className="w-full">
              Comprar agora
            </Button>
          </div>
          
          {/* Benefits */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  <span className="text-sm">Frete grátis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm">Garantia 1 ano</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-primary" />
                  <span className="text-sm">Troca grátis</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="features">Características</TabsTrigger>
            <TabsTrigger value="specifications">Especificações</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="features" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Principais características</h3>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Especificações técnicas</h3>
                <div className="space-y-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-border last:border-0">
                      <span className="font-medium">{key}</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Avaliações dos clientes</h3>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Sistema de avaliações em desenvolvimento</p>
                  <p className="text-sm mt-2">{product.reviews} avaliações disponíveis</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}