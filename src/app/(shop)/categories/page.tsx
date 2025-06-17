import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getCategories } from '@/lib/api'
import { isValidImageUrl } from '@/lib/utils' // Adicionar importação

export const metadata: Metadata = {
  title: 'Categorias',
  description:
    'Explore todas as categorias de produtos disponíveis em nossa loja.',
}

interface ApiCategory {
  id: number
  name: string
  slug: string
  image: string
  creationAt?: string
  updatedAt?: string
}

// Transform API category to display format
const transformApiCategory = (apiCategory: ApiCategory) => {
  return {
    id: apiCategory.id,
    name: apiCategory.name,
    slug: apiCategory.slug,
    image: apiCategory.image,
    description: `Explore produtos da categoria ${apiCategory.name}`,
  }
}
export default async function CategoriesPage() {
  let categories: ApiCategory[] = []
  let error: string | null = null

  try {
    categories = await getCategories()
  } catch (err) {
    error = 'Erro ao carregar categorias. Tente novamente mais tarde.'
    console.error('Error fetching categories:', err)
  }

  const transformedCategories = categories.map(transformApiCategory)

  if (error) {
    return (
      <div className='container py-12'>
        <div className='mx-auto max-w-4xl text-center'>
          <h1 className='mb-6 text-4xl font-bold tracking-tight sm:text-5xl'>
            Categorias
          </h1>
          <p className='text-muted-foreground text-lg'>{error}</p>
          <Button asChild className='mt-6'>
            <Link href='/'>Voltar ao Início</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='container py-12'>
      {/* Hero Section */}
      <div className='mx-auto mb-16 max-w-4xl text-center'>
        <Badge variant='outline' className='mb-4'>
          Categorias
        </Badge>
        <h1 className='mb-6 text-4xl font-bold tracking-tight sm:text-5xl'>
          Explore Nossas <span className='text-primary'>Categorias</span>
        </h1>
        <p className='text-muted-foreground text-lg leading-8'>
          Encontre exatamente o que você procura navegando por nossas categorias
          organizadas. Temos produtos para todos os gostos e necessidades.
        </p>
      </div>

      {/* Categories Grid */}
      <div className='mb-16'>
        <div className='mb-8'>
          <h2 className='mb-2 text-2xl font-bold tracking-tight'>
            Todas as Categorias
          </h2>
          <p className='text-muted-foreground'>
            Navegue por todas as nossas categorias disponíveis
          </p>
        </div>

        {transformedCategories.length === 0 ? (
          <div className='py-12 text-center'>
            <p className='text-muted-foreground text-lg'>
              Nenhuma categoria encontrada.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {transformedCategories.map(category => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className='group'
              >
                <Card className='h-full overflow-hidden transition-all duration-300 hover:shadow-lg'>
                  <div className='relative aspect-video overflow-hidden'>
                    <Image
                      src={isValidImageUrl(category.image)} // Aplicar validação
                      alt={category.name}
                      fill
                      className='object-cover transition-transform duration-300 group-hover:scale-105'
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
                    />
                  </div>
                  <CardContent className='p-6'>
                    <h3 className='group-hover:text-primary mb-2 text-lg font-semibold transition-colors'>
                      {category.name}
                    </h3>
                    <p className='text-muted-foreground text-sm'>
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className='bg-muted/50 mt-16 rounded-lg p-12 text-center'>
        <h2 className='mb-4 text-2xl font-bold tracking-tight'>
          Não encontrou o que procura?
        </h2>
        <p className='text-muted-foreground mx-auto mb-6 max-w-2xl'>
          Entre em contato conosco! Nossa equipe está sempre pronta para ajudar
          você a encontrar exatamente o que precisa.
        </p>
        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
          <Button asChild>
            <Link href='/contact'>Fale Conosco</Link>
          </Button>
          <Button asChild variant='outline'>
            <Link href='/products'>Ver Todos os Produtos</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
