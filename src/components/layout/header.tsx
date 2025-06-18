'use client'

import Link from 'next/link'
import { Menu, User, LogOut, Search } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useUIStore } from '@/stores/ui-store'
import { logout } from '@/actions/auth'
import { useEffect, useState } from 'react'
import { CartDrawer } from '@/components/features/CartDrawer'
import { CartIndicator } from '@/components/features/CartIndicator'
import { ProductSearch } from '@/components/features/ProductSearch'
import { MobileProductSearch } from '@/components/features/MobileProductSearch'

interface User {
  id: number
  name: string
  email: string
  role: string
  avatar: string
}

export function Header() {
  const { toggleSidebar } = useUIStore()
  const [user, setUser] = useState<User | null>(null)
  const [_isLoading, setIsLoading] = useState(true)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  useEffect(() => {
    // Verificar se há usuário logado através da API
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/profile', {
          credentials: 'include', // Incluir cookies HTTP-only
        })

        if (response.ok) {
          const userData = await response.json()
          setUser({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            avatar: userData.avatar || '',
          })
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        setUser(null)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  return (
    <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur'>
      <div className='container flex h-16 items-center justify-between'>
        {/* Logo and Mobile Menu */}
        <div className='flex items-center gap-4'>
          <button
            onClick={toggleSidebar}
            className='focus-visible:ring-ring ring-offset-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 md:hidden'
          >
            <Menu className='h-5 w-5' />
            <span className='sr-only'>Toggle menu</span>
          </button>

          <Link href='/' className='flex items-center space-x-2'>
            <span className='text-xl font-bold'>Store</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className='hidden items-center space-x-6 md:flex'>
          <Link
            href='/products'
            className='hover:text-primary text-sm font-medium transition-colors'
          >
            Produtos
          </Link>
          <Link
            href='/categories'
            className='hover:text-primary text-sm font-medium transition-colors'
          >
            Categorias
          </Link>
          <Link
            href='/about'
            className='hover:text-primary text-sm font-medium transition-colors'
          >
            Sobre
          </Link>
          <Link
            href='/contact'
            className='hover:text-primary text-sm font-medium transition-colors'
          >
            Contato
          </Link>
        </nav>

        {/* Search Bar */}
        <div className='mx-4 hidden max-w-sm flex-1 md:flex'>
          <ProductSearch className='w-full' />
        </div>

        {/* Actions */}
        <div className='flex items-center space-x-2'>
          {/* Mobile Search Button */}
          <button
            onClick={() => setIsMobileSearchOpen(true)}
            className='focus-visible:ring-ring ring-offset-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 md:hidden'
          >
            <Search className='h-5 w-5' />
            <span className='sr-only'>Buscar</span>
          </button>

          <ThemeToggle />

          <CartIndicator showLabel />

          {user ? (
            <div className='flex items-center space-x-2'>
              <span className='hidden text-sm md:block'>Olá, {user.name}</span>
              <Link
                href='/account'
                className='focus-visible:ring-ring ring-offset-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50'
              >
                <User className='h-5 w-5' />
                <span className='sr-only'>Conta</span>
              </Link>
              <form action={logout}>
                <button
                  type='submit'
                  className='focus-visible:ring-ring ring-offset-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50'
                >
                  <LogOut className='h-5 w-5' />
                  <span className='sr-only'>Logout</span>
                </button>
              </form>
            </div>
          ) : (
            <Link
              href='/login'
              className='focus-visible:ring-ring ring-offset-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50'
            >
              <User className='h-5 w-5' />
              <span className='sr-only'>Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer />
      
      {/* Mobile Search */}
      <MobileProductSearch 
        isOpen={isMobileSearchOpen} 
        onClose={() => setIsMobileSearchOpen(false)} 
      />
    </header>
  )
}
