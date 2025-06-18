import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ProductSearch } from '../ProductSearch'
import { searchProducts } from '@/lib/api'
import { useDebounce } from '@/hooks/useDebounce'

// Mock das dependências
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn()
}))

jest.mock('@/lib/api', () => ({
  searchProducts: jest.fn()
}))

jest.mock('@/hooks/useDebounce', () => ({
  useDebounce: jest.fn()
}))

jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />
  }
})

const mockPush = jest.fn()
const mockGet = jest.fn()

const mockProducts = [
  {
    id: '1',
    title: 'Produto Teste',
    slug: 'produto-teste',
    price: 99.99,
    images: ['https://example.com/image.jpg']
  }
]

beforeEach(() => {
  jest.clearAllMocks()
  ;(useRouter as jest.Mock).mockReturnValue({
    push: mockPush
  })
  ;(useSearchParams as jest.Mock).mockReturnValue({
    get: mockGet
  })
  ;(useDebounce as jest.Mock).mockImplementation((value) => value)
  ;(searchProducts as jest.Mock).mockResolvedValue(mockProducts)
  mockGet.mockReturnValue(null)
})

describe('ProductSearch - Enter Key Behavior', () => {
  it('deve manter o valor no input após pressionar Enter', async () => {
    render(<ProductSearch />)
    
    const input = screen.getByPlaceholderText('Buscar produtos...')
    
    // Digita no input
    fireEvent.change(input, { target: { value: 'produto teste' } })
    
    // Pressiona Enter
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    
    // Verifica se o valor permanece no input
    expect(input).toHaveValue('produto teste')
  })

  it('deve navegar para página de resultados ao pressionar Enter', async () => {
    render(<ProductSearch />)
    
    const input = screen.getByPlaceholderText('Buscar produtos...')
    
    // Digita no input
    fireEvent.change(input, { target: { value: 'produto teste' } })
    
    // Pressiona Enter
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    
    // Verifica se a navegação foi chamada
    expect(mockPush).toHaveBeenCalledWith('/products?search=produto%20teste')
  })

  it('deve fechar as opções ao pressionar Enter', async () => {
    render(<ProductSearch />)
    
    const input = screen.getByPlaceholderText('Buscar produtos...')
    
    // Digita no input para mostrar opções
    fireEvent.change(input, { target: { value: 'produto' } })
    
    // Aguarda as opções aparecerem
    await waitFor(() => {
      expect(screen.getByText('Produto Teste')).toBeInTheDocument()
    })
    
    // Pressiona Enter
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    
    // Verifica se as opções foram fechadas
    await waitFor(() => {
      expect(screen.queryByText('Produto Teste')).not.toBeInTheDocument()
    })
  })

  it('não deve navegar se o input tiver menos de 3 caracteres', () => {
    render(<ProductSearch />)
    
    const input = screen.getByPlaceholderText('Buscar produtos...')
    
    // Digita apenas 2 caracteres
    fireEvent.change(input, { target: { value: 'ab' } })
    
    // Pressiona Enter
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    
    // Verifica se a navegação NÃO foi chamada
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('deve limpar input e opções ao clicar em uma opção', async () => {
    render(<ProductSearch />)
    
    const input = screen.getByPlaceholderText('Buscar produtos...')
    
    // Digita no input para mostrar opções
    fireEvent.change(input, { target: { value: 'produto' } })
    
    // Aguarda as opções aparecerem
    await waitFor(() => {
      expect(screen.getByText('Produto Teste')).toBeInTheDocument()
    })
    
    // Clica na opção
    fireEvent.click(screen.getByText('Produto Teste'))
    
    // Verifica se o input foi limpo
    expect(input).toHaveValue('')
    
    // Verifica se navegou para o produto
    expect(mockPush).toHaveBeenCalledWith('/products/produto-teste')
  })

  it('deve preservar valor do input mesmo após múltiplas buscas', async () => {
    render(<ProductSearch />)
    
    const input = screen.getByPlaceholderText('Buscar produtos...')
    
    // Primeira busca
    fireEvent.change(input, { target: { value: 'primeira busca' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    
    expect(input).toHaveValue('primeira busca')
    expect(mockPush).toHaveBeenCalledWith('/products?search=primeira%20busca')
    
    // Segunda busca modificando o valor
    fireEvent.change(input, { target: { value: 'segunda busca' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    
    expect(input).toHaveValue('segunda busca')
    expect(mockPush).toHaveBeenCalledWith('/products?search=segunda%20busca')
  })
})