import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Autenticação',
    default: 'Autenticação',
  },
  description: 'Faça login ou crie sua conta para acessar nossa plataforma.',
}

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='flex min-h-screen'>
      <div className='flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8'>
        <div className='mx-auto w-full'>{children}</div>
      </div>
    </div>
  )
}
