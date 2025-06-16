import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Smartphone, 
  Laptop, 
  Headphones, 
  Watch, 
  Camera, 
  Gamepad2,
  Shirt,
  Home,
  Book,
  Dumbbell,
  Car,
  Baby
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Categorias',
  description: 'Explore todas as categorias de produtos disponíveis em nossa loja.',
}

// Mock data - em produção viria de uma API
const categories = [
  {
    id: 1,
    name: 'Eletrônicos',
    description: 'Smartphones, tablets e acessórios',
    icon: Smartphone,
    productCount: 156,
    featured: true,
  },
  {
    id: 2,
    name: 'Computadores',
    description: 'Notebooks, desktops e periféricos',
    icon: Laptop,
    productCount: 89,
    featured: true,
  },
  {
    id: 3,
    name: 'Áudio',
    description: 'Fones, caixas de som e equipamentos',
    icon: Headphones,
    productCount: 67,
    featured: false,
  },
  {
    id: 4,
    name: 'Relógios',
    description: 'Smartwatches e relógios tradicionais',
    icon: Watch,
    productCount: 45,
    featured: false,
  },
  {
    id: 5,
    name: 'Câmeras',
    description: 'Câmeras digitais e acessórios',
    icon: Camera,
    productCount: 34,
    featured: false,
  },
  {
    id: 6,
    name: 'Games',
    description: 'Consoles, jogos e acessórios',
    icon: Gamepad2,
    productCount: 78,
    featured: true,
  },
  {
    id: 7,
    name: 'Moda',
    description: 'Roupas, calçados e acessórios',
    icon: Shirt,
    productCount: 234,
    featured: false,
  },
  {
    id: 8,
    name: 'Casa & Jardim',
    description: 'Decoração, móveis e utensílios',
    icon: Home,
    productCount: 123,
    featured: false,
  },
  {
    id: 9,
    name: 'Livros',
    description: 'Livros físicos e digitais',
    icon: Book,
    productCount: 456,
    featured: false,
  },
  {
    id: 10,
    name: 'Esportes',
    description: 'Equipamentos e roupas esportivas',
    icon: Dumbbell,
    productCount: 89,
    featured: false,
  },
  {
    id: 11,
    name: 'Automotivo',
    description: 'Peças e acessórios para veículos',
    icon: Car,
    productCount: 67,
    featured: false,
  },
  {
    id: 12,
    name: 'Bebês',
    description: 'Produtos para bebês e crianças',
    icon: Baby,
    productCount: 145,
    featured: false,
  },
]

export default function CategoriesPage() {
  const featuredCategories = categories.filter(cat => cat.featured)
  const allCategories = categories

  return (
    <div className="container py-12">
      {/* Hero Section */}
      <div className="mx-auto max-w-4xl text-center mb-16">
        <Badge variant="outline" className="mb-4">
          Categorias
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
          Explore Nossas <span className="text-primary">Categorias</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-8">
          Encontre exatamente o que você procura navegando por nossas categorias 
          organizadas. Temos produtos para todos os gostos e necessidades.
        </p>
      </div>

      {/* Featured Categories */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Categorias em Destaque
            </h2>
            <p className="text-muted-foreground">
              As categorias mais populares da nossa loja
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCategories.map((category) => {
            const IconComponent = category.icon
            return (
              <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardHeader className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors mb-4">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    {category.productCount} produtos disponíveis
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/products?category=${category.id}`}>
                      Ver Produtos
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* All Categories */}
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Todas as Categorias
          </h2>
          <p className="text-muted-foreground">
            Navegue por todas as nossas categorias disponíveis
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allCategories.map((category) => {
            const IconComponent = category.icon
            return (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="group"
              >
                <Card className="h-full hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {category.productCount} produtos
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center bg-muted/50 rounded-lg p-12">
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          Não encontrou o que procura?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Entre em contato conosco! Nossa equipe está sempre pronta para ajudar 
          você a encontrar exatamente o que precisa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/contact">
              Fale Conosco
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/products">
              Ver Todos os Produtos
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}