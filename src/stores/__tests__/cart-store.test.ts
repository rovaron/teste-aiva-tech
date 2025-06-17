import { renderHook, act } from '@testing-library/react'
import { useCartStore } from '../cart-store'

// Mock zustand persist
jest.mock('zustand/middleware', () => ({
  persist: (fn: unknown) => fn,
}))

describe('Cart Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useCartStore.setState({
      items: [],
      isOpen: false,
    })
  })

  describe('addItem', () => {
    it('should add new item to cart', () => {
      const { result } = renderHook(() => useCartStore())
      const newItem = {
        id: '1',
        name: 'Test Product',
        slug: 'test-product',
        price: 29.99,
        image: 'test.jpg',
      }

      act(() => {
        result.current.addItem(newItem)
      })

      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0]).toEqual({
        ...newItem,
        quantity: 1,
      })
    })

    it('should increase quantity if item already exists', () => {
      const { result } = renderHook(() => useCartStore())
      const item = {
        id: '1',
        name: 'Test Product',
        slug: 'test-product',
        price: 29.99,
      }

      act(() => {
        result.current.addItem(item)
        result.current.addItem(item)
      })

      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0].quantity).toBe(2)
    })
  })

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const { result } = renderHook(() => useCartStore())
      const item = {
        id: '1',
        name: 'Test Product',
        slug: 'test-product',
        price: 29.99,
      }

      act(() => {
        result.current.addItem(item)
        result.current.removeItem('1')
      })

      expect(result.current.items).toHaveLength(0)
    })

    it('should not affect cart if item does not exist', () => {
      const { result } = renderHook(() => useCartStore())
      const item = {
        id: '1',
        name: 'Test Product',
        slug: 'test-product',
        price: 29.99,
      }

      act(() => {
        result.current.addItem(item)
        result.current.removeItem('2')
      })

      expect(result.current.items).toHaveLength(1)
    })
  })

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const { result } = renderHook(() => useCartStore())
      const item = {
        id: '1',
        name: 'Test Product',
        slug: 'test-product',
        price: 29.99,
      }

      act(() => {
        result.current.addItem(item)
        result.current.updateQuantity('1', 5)
      })

      expect(result.current.items[0].quantity).toBe(5)
    })

    it('should remove item if quantity is 0', () => {
      const { result } = renderHook(() => useCartStore())
      const item = {
        id: '1',
        name: 'Test Product',
        slug: 'test-product',
        price: 29.99,
      }

      act(() => {
        result.current.addItem(item)
        result.current.updateQuantity('1', 0)
      })

      expect(result.current.items).toHaveLength(0)
    })
  })

  describe('clearCart', () => {
    it('should remove all items from cart', () => {
      const { result } = renderHook(() => useCartStore())
      const item1 = {
        id: '1',
        name: 'Test Product 1',
        slug: 'test-product-1',
        price: 29.99,
      }
      const item2 = {
        id: '2',
        name: 'Test Product 2',
        slug: 'test-product-2',
        price: 39.99,
      }

      act(() => {
        result.current.addItem(item1)
        result.current.addItem(item2)
        result.current.clearCart()
      })

      expect(result.current.items).toHaveLength(0)
    })
  })

  describe('toggleCart', () => {
    it('should toggle cart open state', () => {
      const { result } = renderHook(() => useCartStore())

      expect(result.current.isOpen).toBe(false)

      act(() => {
        result.current.toggleCart()
      })

      expect(result.current.isOpen).toBe(true)

      act(() => {
        result.current.toggleCart()
      })

      expect(result.current.isOpen).toBe(false)
    })
  })

  describe('getTotalItems', () => {
    it('should return total number of items', () => {
      const { result } = renderHook(() => useCartStore())
      const item1 = {
        id: '1',
        name: 'Test Product 1',
        slug: 'test-product-1',
        price: 29.99,
      }
      const item2 = {
        id: '2',
        name: 'Test Product 2',
        slug: 'test-product-2',
        price: 39.99,
      }

      act(() => {
        result.current.addItem(item1)
        result.current.addItem(item2)
        result.current.updateQuantity('1', 3)
      })

      expect(result.current.getTotalItems()).toBe(4) // 3 + 1
    })

    it('should return 0 for empty cart', () => {
      const { result } = renderHook(() => useCartStore())
      expect(result.current.getTotalItems()).toBe(0)
    })
  })

  describe('getTotalPrice', () => {
    it('should calculate total price correctly', () => {
      const { result } = renderHook(() => useCartStore())
      const item1 = {
        id: '1',
        name: 'Test Product 1',
        slug: 'test-product-1',
        price: 10.0,
      }
      const item2 = {
        id: '2',
        name: 'Test Product 2',
        slug: 'test-product-2',
        price: 20.0,
      }

      act(() => {
        result.current.addItem(item1)
        result.current.addItem(item2)
        result.current.updateQuantity('1', 2) // 2 * 10.00 = 20.00
        // item2 quantity is 1 * 20.00 = 20.00
        // Total: 40.00
      })

      expect(result.current.getTotalPrice()).toBe(40.0)
    })

    it('should return 0 for empty cart', () => {
      const { result } = renderHook(() => useCartStore())
      expect(result.current.getTotalPrice()).toBe(0)
    })
  })
})
