'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className='container flex min-h-[400px] flex-col items-center justify-center py-8'>
      <div className='mx-auto max-w-md text-center'>
        <div className='bg-destructive/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full'>
          <AlertTriangle className='text-destructive h-8 w-8' />
        </div>

        <h1 className='mb-4 text-2xl font-bold tracking-tight'>
          Algo deu errado!
        </h1>

        <p className='text-muted-foreground mb-6'>
          Ocorreu um erro inesperado. Tente novamente ou entre em contato com o
          suporte se o problema persistir.
        </p>

        <div className='flex flex-col gap-3 sm:flex-row sm:justify-center'>
          <Button onClick={reset} className='flex items-center gap-2'>
            <RefreshCw className='h-4 w-4' />
            Tentar novamente
          </Button>

          <Button
            variant='outline'
            onClick={() => (window.location.href = '/')}
          >
            Voltar ao início
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className='mt-6 text-left'>
            <summary className='text-muted-foreground cursor-pointer text-sm'>
              Detalhes do erro (desenvolvimento)
            </summary>
            <pre className='bg-muted mt-2 overflow-auto rounded p-4 text-xs'>
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
