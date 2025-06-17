'use client'

import { login } from '@/actions/auth'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)

    try {
      const result = await login(formData)

      if (result?.error) {
        toast.error('Erro no login', {
          description: result.error,
        })
      } else if (result?.success) {
        toast.success('Login realizado com sucesso!', {
          description: 'Redirecionando...',
        })

        // Redirecionar para a página principal após login bem-sucedido
        setTimeout(() => {
          router.push('/')
          router.refresh()
        }, 1000)
      } else {
        toast.error('Erro inesperado', {
          description: 'Resposta inválida do servidor.',
        })
      }
    } catch (_error) {
      toast.error('Erro inesperado', {
        description: 'Ocorreu um erro durante o login. Tente novamente.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='container py-12'>
      <div className='mx-auto max-w-md space-y-6'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Login
          </h1>
          <p className='mt-2 text-gray-600 dark:text-gray-400'>
            Faça login em sua conta para acessar nossa plataforma
          </p>
        </div>

        <form action={handleSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='email'
              className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
            >
              Email
            </label>
            <input
              id='email'
              name='email'
              type='email'
              required
              disabled={isLoading}
              placeholder='seu@email.com'
              className='w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
            >
              Senha
            </label>
            <input
              id='password'
              name='password'
              type='password'
              required
              disabled={isLoading}
              placeholder='••••••••'
              className='w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            />
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isLoading ? (
              <div className='flex items-center'>
                <svg
                  className='mr-3 -ml-1 h-5 w-5 animate-spin text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Entrando...
              </div>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className='text-center text-sm text-gray-600 dark:text-gray-400'>
          <p>Credenciais de teste:</p>
          <p className='mt-1 font-mono text-xs'>
            Email: john@mail.com
            <br />
            Senha: changeme
          </p>
        </div>
      </div>
    </div>
  )
}
