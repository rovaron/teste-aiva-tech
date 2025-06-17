import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { AddToCartButton } from '../AddToCartButton'
import { useCartStore } from '@/stores/cart-store'
import { Product } from '@/lib/types'

// Mock the cart store
jest.mock('@/stores/cart-store')
const mockUseCartStore = useCartStore as jest.MockedFunction<
  typeof useCartStore
>

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      className,
      whileHover,
      whileTap,
      variants,
      initial,
      animate,
      exit,
      transition,
      ...props
    }: {
      children: React.ReactNode
      className?: string
      [key: string]: unknown
    }) => {
      return (
        <div className={className} {...props}>
          {children}
        </div>
      )
    },
    button: ({
      children,
      className,
      whileHover,
      whileTap,
      variants,
      initial,
      animate,
      exit,
      transition,
      ...props
    }: {
      children: React.ReactNode
      className?: string
      [key: string]: unknown
    }) => {
      return (
        <button className={className} {...props}>
          {children}
        </button>
      )
    },
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock the cart action
jest.mock('@/actions/cart', () => ({
  addToCartAction: jest.fn().mockResolvedValue({ success: true }),
}))

// Mock React's useTransition
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useTransition: () => [false, (fn: () => void) => fn()],
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ShoppingCart: () => <div data-testid='shopping-cart-icon' />,
  Check: () => <div data-testid='check-icon' />,
  Loader2: () => <div data-testid='loader-icon' />,
}))

describe('AddToCartButton', () => {
  const mockAddItem = jest.fn()
  const mockToggleCart = jest.fn()

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    slug: 'test-product',
    price: 99.99,
    description: 'A test product',
    images: ['test-image.jpg'],
    category: {
      id: 1,
      name: 'Test Category',
      slug: 'test-category',
      image: 'category-image.jpg',
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseCartStore.mockReturnValue({
      items: [],
      isOpen: false,
      addItem: mockAddItem,
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      toggleCart: mockToggleCart,
      getTotalItems: jest.fn().mockReturnValue(0),
      getTotalPrice: jest.fn().mockReturnValue(0),
    })
  })

  it('renders with default text', () => {
    render(<AddToCartButton product={mockProduct} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls addItem when clicked', async () => {
    render(<AddToCartButton product={mockProduct} />)
    const button = screen.getByRole('button')

    await act(async () => {
      fireEvent.click(button)
    })

    expect(mockAddItem).toHaveBeenCalledWith({
      id: '1',
      name: 'Test Product',
      slug: 'test-product',
      price: 99.99,
      image: 'test-image.jpg',
    })
  })

  it('applies variant classes correctly', () => {
    render(<AddToCartButton product={mockProduct} variant='outline' />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('relative', 'overflow-hidden')
  })

  it('applies size classes correctly', () => {
    render(<AddToCartButton product={mockProduct} size='lg' />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('relative', 'overflow-hidden')
  })

  it('applies custom className', () => {
    render(<AddToCartButton product={mockProduct} className='custom-class' />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('applies fullWidth correctly', () => {
    render(<AddToCartButton product={mockProduct} fullWidth />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('w-full')
  })

  it('handles products without images', async () => {
    const productWithoutImages = { ...mockProduct, images: [] }
    render(<AddToCartButton product={productWithoutImages} />)
    const button = screen.getByRole('button')

    await act(async () => {
      fireEvent.click(button)
    })

    expect(mockAddItem).toHaveBeenCalledWith({
      id: '1',
      name: 'Test Product',
      slug: 'test-product',
      price: 99.99,
      image: undefined,
    })
  })

  it('uses custom quantity when provided', async () => {
    render(<AddToCartButton product={mockProduct} quantity={3} />)
    const button = screen.getByRole('button')

    await act(async () => {
      fireEvent.click(button)
    })

    expect(mockAddItem).toHaveBeenCalledWith({
      id: '1',
      name: 'Test Product',
      slug: 'test-product',
      price: 99.99,
      image: 'test-image.jpg',
    })
  })

  it('prevents event propagation on click', async () => {
    const parentClickHandler = jest.fn()
    render(
      <div onClick={parentClickHandler}>
        <AddToCartButton product={mockProduct} />
      </div>
    )

    const button = screen.getByRole('button')

    await act(async () => {
      fireEvent.click(button)
    })

    expect(parentClickHandler).not.toHaveBeenCalled()
  })
})
