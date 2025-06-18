'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Search, X } from 'lucide-react'
import { searchProducts } from '@/lib/api'
import { useDebounce } from '@/hooks/useDebounce'
import type { Product } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'

interface ProductOption {
  value: string
  label: string
  product: Product
}

interface MobileProductSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileProductSearch({ isOpen, onClose }: MobileProductSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState<ProductOption[]>([])

  // Sincronizar com URL na inicialização
  useEffect(() => {
    const searchParam = searchParams.get('search') || ''
    setInputValue(searchParam)
  }, [searchParams])

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
  const handleSelect = (product: Product) => {
    // Navegar para a página do produto usando slug
    router.push(`/products/${product.slug}`)
    // Limpar o input e fechar
    setInputValue('')
    setOptions([])
    onClose()
  }

  // Função para lidar com mudança no input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    // Não atualiza URL automaticamente, apenas mostra preview
  }

  // Função para lidar com Enter (busca geral)
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && inputValue.length >= 3) {
      // Navegar para página de produtos com busca
      router.push(`/products?search=${encodeURIComponent(inputValue)}`)
      setInputValue('')
      setOptions([])
      onClose()
    }
  }

  // Limpar busca
  const handleClear = () => {
    setInputValue('')
    setOptions([])
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="bg-background border-b p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header da busca */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Buscar produtos..."
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border pl-10 pr-10 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  autoFocus
                />
                {inputValue && (
                  <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors rounded-sm p-0.5 hover:bg-accent"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors rounded-sm p-1 hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Resultados */}
            <div className="max-h-96 overflow-y-auto">
              {inputValue.length > 0 && inputValue.length < 3 && (
                <p className="text-sm text-muted-foreground p-4 text-center">
                  Digite pelo menos 3 caracteres para buscar
                </p>
              )}

              {isLoading && (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="ml-2 text-sm text-muted-foreground">Buscando produtos...</span>
                </div>
              )}

              {inputValue.length >= 3 && !isLoading && options.length === 0 && (
                <p className="text-sm text-muted-foreground p-4 text-center">
                  Nenhum produto encontrado
                </p>
              )}

              {options.length > 0 && (
                <div className="space-y-2">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(option.product)}
                      className="w-full flex items-center space-x-3 p-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {option.product.images?.[0] && (
                        <Image
                          src={option.product.images[0]}
                          alt={option.product.title}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{option.product.title}</div>
                        <div className="text-xs text-muted-foreground">
                          R$ {option.product.price.toFixed(2)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {inputValue.length >= 3 && (
                <div className="mt-4 pt-4 border-t">
                  <button
                    onClick={() => {
                      router.push(`/products?search=${encodeURIComponent(inputValue)}`)
                      onClose()
                    }}
                    className="w-full p-3 text-sm text-primary hover:bg-accent hover:text-accent-foreground rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    Ver todos os resultados para "{inputValue}"
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}