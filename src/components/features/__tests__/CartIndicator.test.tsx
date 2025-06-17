import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CartIndicator } from '../CartIndicator'

// Mock do useCartStore
const mockGetTotalItems = jest.fn()
const mockToggleCart = jest.fn()

jest.mock('@/stores/cart-store', () => ({
  useCartStore: () => ({
    getTotalItems: mockGetTotalItems,
    toggleCart: mockToggleCart,
  }),
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => {
      const { variants, animate, initial, exit, transition, whileTap, whileHover, ...domProps } = props
      return <div className={className} {...domProps}>{children}</div>
    },
    button: ({ children, className, ...props }: any) => {
      const { variants, animate, initial, exit, transition, whileTap, whileHover, ...domProps } = props
      return <button className={className} {...domProps}>{children}</button>
    },
    span: ({ children, className, ...props }: any) => {
      const { variants, animate, initial, exit, transition, whileTap, whileHover, ...domProps } = props
      return <span className={className} {...domProps}>{children}</span>
    },
  },
  AnimatePresence: ({ children }: any) => children,
}))

// Mock do MiniCart
jest.mock('../MiniCart', () => ({
  MiniCart: ({ isOpen }: { isOpen: boolean }) => (
    isOpen ? <div data-testid="mini-cart">Mini Cart</div> : null
  ),
}))

// Mock do lucide-react
jest.mock('lucide-react', () => ({
  ShoppingCart: (props: any) => <div data-testid="shopping-cart-icon" {...props} />,
}))

describe('CartIndicator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders cart indicator button after mounting', async () => {
    mockGetTotalItems.mockReturnValue(0)
    render(<CartIndicator />)
    
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
    expect(screen.getByTestId('shopping-cart-icon')).toBeInTheDocument()
  })

  it('displays item count when items are in cart', async () => {
    mockGetTotalItems.mockReturnValue(3)
    render(<CartIndicator />)
    
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument()
    })
  })

  it('calls toggleCart when clicked', async () => {
    mockGetTotalItems.mockReturnValue(0)
    render(<CartIndicator />)
    
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByRole('button'))
    expect(mockToggleCart).toHaveBeenCalledTimes(1)
  })

  it('applies custom className', async () => {
    mockGetTotalItems.mockReturnValue(0)
    render(<CartIndicator className="custom-class" />)
    
    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveClass('custom-class')
    })
  })

  it('displays 99+ for large item counts', async () => {
    mockGetTotalItems.mockReturnValue(150)
    render(<CartIndicator />)
    
    await waitFor(() => {
      expect(screen.getByText('99+')).toBeInTheDocument()
    })
  })

  it('shows mini cart on hover when items are present', async () => {
    mockGetTotalItems.mockReturnValue(2)
    render(<CartIndicator />)
    
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
    
    const container = screen.getByRole('button').parentElement!
    fireEvent.mouseEnter(container)
    
    expect(screen.getByTestId('mini-cart')).toBeInTheDocument()
  })

  it('does not show mini cart on hover when cart is empty', async () => {
    mockGetTotalItems.mockReturnValue(0)
    render(<CartIndicator />)
    
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
    
    const container = screen.getByRole('button').parentElement!
    fireEvent.mouseEnter(container)
    
    expect(screen.queryByTestId('mini-cart')).not.toBeInTheDocument()
  })

  it('shows accessible label with item count', async () => {
    mockGetTotalItems.mockReturnValue(2)
    render(<CartIndicator showLabel={true} />)
    
    await waitFor(() => {
      expect(screen.getByText('2 itens no carrinho')).toBeInTheDocument()
    })
  })

  it('shows accessible label for empty cart', async () => {
    mockGetTotalItems.mockReturnValue(0)
    render(<CartIndicator showLabel={true} />)
    
    await waitFor(() => {
      expect(screen.getByText('Carrinho vazio')).toBeInTheDocument()
    })
  })
})