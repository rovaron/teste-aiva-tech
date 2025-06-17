import Link from 'next/link'
import { Github, Twitter, Instagram, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className='bg-background border-t'>
      <div className='container py-12'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
          {/* Brand */}
          <div className='space-y-4'>
            <Link href='/' className='flex items-center space-x-2'>
              <span className='text-xl font-bold'>Store</span>
            </Link>
            <p className='text-muted-foreground max-w-xs text-sm'>
              Sua loja online de confiança. Produtos de qualidade com entrega
              rápida e segura.
            </p>
            <div className='flex space-x-4'>
              <Link
                href='#'
                className='text-muted-foreground hover:text-primary transition-colors'
              >
                <Github className='h-5 w-5' />
                <span className='sr-only'>GitHub</span>
              </Link>
              <Link
                href='#'
                className='text-muted-foreground hover:text-primary transition-colors'
              >
                <Twitter className='h-5 w-5' />
                <span className='sr-only'>Twitter</span>
              </Link>
              <Link
                href='#'
                className='text-muted-foreground hover:text-primary transition-colors'
              >
                <Instagram className='h-5 w-5' />
                <span className='sr-only'>Instagram</span>
              </Link>
              <Link
                href='#'
                className='text-muted-foreground hover:text-primary transition-colors'
              >
                <Mail className='h-5 w-5' />
                <span className='sr-only'>Email</span>
              </Link>
            </div>
          </div>

          {/* Products */}
          <div className='space-y-4'>
            <h3 className='font-semibold'>Produtos</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/products'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Todos os Produtos
                </Link>
              </li>
              <li>
                <Link
                  href='/products?featured=true'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Em Destaque
                </Link>
              </li>
              <li>
                <Link
                  href='/products?sale=true'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Promoções
                </Link>
              </li>
              <li>
                <Link
                  href='/categories'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Categorias
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className='space-y-4'>
            <h3 className='font-semibold'>Suporte</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/help'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link
                  href='/shipping'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Entrega
                </Link>
              </li>
              <li>
                <Link
                  href='/returns'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Devoluções
                </Link>
              </li>
              <li>
                <Link
                  href='/contact'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className='space-y-4'>
            <h3 className='font-semibold'>Legal</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/privacy'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link
                  href='/terms'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link
                  href='/cookies'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-8 flex flex-col items-center justify-between border-t pt-8 md:flex-row'>
          <p className='text-muted-foreground text-sm'>
            © 2024 Store. Todos os direitos reservados.
          </p>
          <p className='text-muted-foreground mt-2 text-sm md:mt-0'>
            Desenvolvido com Next.js e TypeScript
          </p>
        </div>
      </div>
    </footer>
  )
}
