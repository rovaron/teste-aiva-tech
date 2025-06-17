'use client'

import Link from 'next/link'
import { Search, Menu, User, LogOut } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useUIStore } from '@/stores/ui-store'
import { logout } from '@/actions/auth'
import { useEffect, useState } from 'react'
import { CartDrawer } from '@/components/features/CartDrawer'
import { CartIndicator } from '@/components/features/CartIndicator'

interface User {
  id: number
  name: string
  email: string
  role: string
  avatar: string
}

export function Header() {
  const { toggleSidebar, searchQuery, setSearchQuery } = useUIStore()
  const [user, setUser] = useState<User | null>(null)
  const [_isLoading, setIsLoading] = useState(true)

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
        <div className='mx-4 hidden max-w-sm flex-1 items-center space-x-2 md:flex'>
          <div className='relative w-full'>
            <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
            <input
              type='search'
              placeholder='Buscar produtos...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-8 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
            />
          </div>
        </div>

        {/* Actions */}
        <div className='flex items-center space-x-2'>
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
    </header>
  )
}
