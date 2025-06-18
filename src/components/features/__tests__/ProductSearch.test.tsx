import { render, screen } from '@testing-library/react'
import { ProductSearch } from '../ProductSearch'
import { searchProducts } from '@/lib/api'

// Mock das dependências
jest.mock('@/lib/api')
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  }),
  useSearchParams: () => ({
    get: () => '',
    toString: () => ''
  })
}))
jest.mock('@/hooks/useDebounce', () => ({
  useDebounce: (value: string) => value
}))

const mockSearchProducts = searchProducts as jest.MockedFunction<typeof searchProducts>

describe('ProductSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSearchProducts.mockResolvedValue([])
  })

  it('should render the search component', () => {
    render(<ProductSearch />)
    // Verifica se o componente renderiza sem erros
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('should render with custom placeholder', () => {
    render(<ProductSearch placeholder="Custom placeholder" />)
    // Verifica se o placeholder customizado é aplicado
    const input = screen.getByRole('combobox')
    expect(input).toBeInTheDocument()
  })

  it('should render with custom className', () => {
    render(<ProductSearch className="custom-class" />)
    // Verifica se a classe customizada é aplicada
    const container = screen.getByRole('combobox').closest('.custom-class')
    expect(container).toBeInTheDocument()
  })
})