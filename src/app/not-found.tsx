import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container flex min-h-[600px] flex-col items-center justify-center py-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary/20">404</h1>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">
            Página não encontrada
          </h2>
          <p className="mt-4 text-muted-foreground">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="flex items-center gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Voltar ao início
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="flex items-center gap-2">
            <Link href="/products">
              <Search className="h-4 w-4" />
              Ver produtos
            </Link>
          </Button>
        </div>
        
        <div className="mt-8">
          <Button variant="ghost" asChild className="flex items-center gap-2">
            <Link href="javascript:history.back()">
              <ArrowLeft className="h-4 w-4" />
              Voltar à página anterior
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}