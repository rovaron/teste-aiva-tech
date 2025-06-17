import Link from 'next/link'
import { ArrowRight, ShoppingBag, Zap, Truck } from 'lucide-react'

export default function Home() {
  return (
    <div className='flex flex-col'>
      {/* Hero Section */}
      <section className='relative py-20 lg:py-32'>
        <div className='container'>
          <div className='mx-auto max-w-4xl text-center'>
            <h1 className='text-4xl font-bold tracking-tight sm:text-6xl'>
              Sua loja online <span className='text-primary'>moderna</span> e{' '}
              <span className='text-primary'>performática</span>
            </h1>
            <p className='text-muted-foreground mt-6 text-lg leading-8'>
              Desenvolvida com Next.js 15, TypeScript e as melhores práticas de
              performance. Server Components, ISR, e otimizações nativas para
              uma experiência excepcional.
            </p>
            <div className='mt-10 flex items-center justify-center gap-x-6'>
              <Link
                href='/products'
                className='bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-primary rounded-md px-6 py-3 text-sm font-semibold shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
              >
                Ver Produtos
                <ArrowRight className='ml-2 inline h-4 w-4' />
              </Link>
              <Link
                href='/about'
                className='text-foreground hover:text-primary text-sm leading-6 font-semibold transition-colors'
              >
                Saiba mais <span aria-hidden='true'>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='bg-muted/50 py-20'>
        <div className='container'>
          <div className='mx-auto max-w-2xl text-center'>
            <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
              Por que escolher nossa plataforma?
            </h2>
            <p className='text-muted-foreground mt-4 text-lg'>
              Tecnologia de ponta para uma experiência de compra superior
            </p>
          </div>

          <div className='mx-auto mt-16 max-w-5xl'>
            <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
              <div className='text-center'>
                <div className='bg-primary mx-auto flex h-12 w-12 items-center justify-center rounded-lg'>
                  <Zap className='text-primary-foreground h-6 w-6' />
                </div>
                <h3 className='mt-4 text-lg font-semibold'>Performance</h3>
                <p className='text-muted-foreground mt-2 text-sm'>
                  Carregamento ultra-rápido com SSR e ISR otimizados
                </p>
              </div>

              <div className='text-center'>
                <div className='bg-primary mx-auto flex h-12 w-12 items-center justify-center rounded-lg'>
                  <Zap className='text-primary-foreground h-6 w-6' />
                </div>
                <h3 className='mt-4 text-lg font-semibold'>Segurança</h3>
                <p className='text-muted-foreground mt-2 text-sm'>
                  Transações seguras e proteção de dados avançada
                </p>
              </div>

              <div className='text-center'>
                <div className='bg-primary mx-auto flex h-12 w-12 items-center justify-center rounded-lg'>
                  <Truck className='text-primary-foreground h-6 w-6' />
                </div>
                <h3 className='mt-4 text-lg font-semibold'>Entrega Rápida</h3>
                <p className='text-muted-foreground mt-2 text-sm'>
                  Entrega expressa em todo o território nacional
                </p>
              </div>

              <div className='text-center'>
                <div className='bg-primary mx-auto flex h-12 w-12 items-center justify-center rounded-lg'>
                  <ShoppingBag className='text-primary-foreground h-6 w-6' />
                </div>
                <h3 className='mt-4 text-lg font-semibold'>Experiência</h3>
                <p className='text-muted-foreground mt-2 text-sm'>
                  Interface moderna e intuitiva para todos os dispositivos
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className='py-20'>
        <div className='container'>
          <div className='mx-auto max-w-2xl text-center'>
            <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
              Tecnologias Utilizadas
            </h2>
            <p className='text-muted-foreground mt-4 text-lg'>
              Stack moderna focada em performance e developer experience
            </p>
          </div>

          <div className='mx-auto mt-16 max-w-4xl'>
            <div className='grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6'>
              {[
                'Next.js 15',
                'TypeScript',
                'Tailwind CSS',
                'Zustand',
                'Framer Motion',
                'Zod',
              ].map(tech => (
                <div
                  key={tech}
                  className='bg-card flex items-center justify-center rounded-lg border p-4 text-center text-sm font-medium'
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
