'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { searchProducts } from '@/lib/api'
import { useDebounce } from '@/hooks/useDebounce'
import { Input } from '@/components/ui/input'
import type { Product } from '@/lib/types'

interface ProductOption {
  value: string
  label: string
  product: Product
}

interface ProductSearchProps {
  className?: string
  placeholder?: string
}

export function ProductSearch({ 
  className = '',
  placeholder = 'Buscar produtos...'
}: ProductSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState<ProductOption[]>([])

  // Debounce da busca para evitar muitas requisições
  const debouncedSearchTerm = useDebounce(inputValue, 300)

  // Função para buscar produtos
  const loadOptions = useCallback(async (query: string) => {
    if (query.length < 3) {
      setOptions([])
      return
    }

    setIsLoading(true)
    try {
      const products = await searchProducts(query)
      const productOptions: ProductOption[] = products.map((product: Product) => ({
        value: product.slug,
        label: product.title,
        product
      }))
      setOptions(productOptions)
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      setOptions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Executar busca quando o termo debounced mudar
  useMemo(() => {
    if (debouncedSearchTerm) {
      loadOptions(debouncedSearchTerm)
    } else {
      setOptions([])
    }
  }, [debouncedSearchTerm, loadOptions])

  // Função para lidar com a seleção de um produto
  const handleSelect = (option: ProductOption | null) => {
    if (option) {
      // Navegar para a página do produto usando slug
      router.push(`/products/${option.product.slug}`)
      // Limpar o input
      setInputValue('')
      setOptions([])
    }
  }

  // Sincronizar input com URL ao carregar
  useEffect(() => {
    const urlSearch = searchParams.get('search')
    if (urlSearch && urlSearch !== inputValue) {
      setInputValue(urlSearch)
    }
  }, [searchParams, inputValue])

  // Função para lidar com mudança no input
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue)
    // Não atualiza URL automaticamente, apenas mostra preview
  }

  // Função para lidar com Enter (busca geral)
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && inputValue.length >= 3) {
      // Navegar para página de produtos com busca
      router.push(`/products?search=${encodeURIComponent(inputValue)}`)
      // Manter o valor no input, apenas fechar as opções
      setOptions([])
    }
  }

  // Componente customizado para exibir opções
  const _formatOptionLabel = (option: ProductOption) => (
    <div className="flex items-center space-x-3 py-1">
      {option.product.images?.[0] && (
        <Image
          src={option.product.images[0]}
          alt={option.product.title}
          width={32}
          height={32}
          className="h-8 w-8 rounded object-cover"
        />
      )}
      <div className="flex-1">
        <div className="font-medium text-sm">{option.product.title}</div>
        <div className="text-xs text-muted-foreground">
          R$ {option.product.price.toFixed(2)}
        </div>
      </div>
    </div>
  )



  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
        <Input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 h-10"
        />
      </div>
      
      {/* Menu de opções */}
      {inputValue.length >= 3 && (options.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg">
          {isLoading ? (
            <div className="p-3 text-sm text-muted-foreground">
              Buscando produtos...
            </div>
          ) : options.length > 0 ? (
            <div className="max-h-60 overflow-y-auto">
              {options.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer border-b border-border last:border-b-0"
                  onClick={() => handleSelect(option)}
                >
                  {option.product.images?.[0] && (
                    <Image
                      src={option.product.images[0]}
                      alt={option.product.title}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-sm">{option.product.title}</div>
                    <div className="text-xs text-muted-foreground">
                      R$ {option.product.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 text-sm text-muted-foreground">
              Nenhum produto encontrado
            </div>
          )}
        </div>
      )}
    </div>
  )
}