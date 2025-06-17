import { renderHook, act } from '@testing-library/react'
import { useUIStore } from '../ui-store'

describe('UI Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useUIStore.setState({
      sidebarOpen: false,
      modals: {},
      loading: {},
      searchQuery: ''
    })
  })

  describe('sidebar', () => {
    it('should toggle sidebar state', () => {
      const { result } = renderHook(() => useUIStore())

      expect(result.current.sidebarOpen).toBe(false)

      act(() => {
        result.current.toggleSidebar()
      })

      expect(result.current.sidebarOpen).toBe(true)

      act(() => {
        result.current.toggleSidebar()
      })

      expect(result.current.sidebarOpen).toBe(false)
    })

    it('should set sidebar open state', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setSidebarOpen(true)
      })

      expect(result.current.sidebarOpen).toBe(true)

      act(() => {
        result.current.setSidebarOpen(false)
      })

      expect(result.current.sidebarOpen).toBe(false)
    })
  })

  describe('modals', () => {
    it('should open modal', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.openModal('test-modal')
      })

      expect(result.current.modals['test-modal']).toBe(true)
    })

    it('should close modal', () => {
      const { result } = renderHook(() => useUIStore())

      // First open the modal
      act(() => {
        result.current.openModal('test-modal')
      })

      expect(result.current.modals['test-modal']).toBe(true)

      // Then close it
      act(() => {
        result.current.closeModal('test-modal')
      })

      expect(result.current.modals['test-modal']).toBe(false)
    })

    it('should toggle modal state', () => {
      const { result } = renderHook(() => useUIStore())

      // Toggle from closed to open
      act(() => {
        result.current.toggleModal('test-modal')
      })

      expect(result.current.modals['test-modal']).toBe(true)

      // Toggle from open to closed
      act(() => {
        result.current.toggleModal('test-modal')
      })

      expect(result.current.modals['test-modal']).toBe(false)
    })

    it('should close all modals', () => {
      const { result } = renderHook(() => useUIStore())

      // Open multiple modals
      act(() => {
        result.current.openModal('modal1')
        result.current.openModal('modal2')
        result.current.openModal('modal3')
      })

      expect(result.current.modals['modal1']).toBe(true)
      expect(result.current.modals['modal2']).toBe(true)
      expect(result.current.modals['modal3']).toBe(true)

      // Close all modals
      act(() => {
        result.current.closeAllModals()
      })

      expect(result.current.modals).toEqual({})
    })

    it('should handle multiple modals independently', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.openModal('modal1')
        result.current.openModal('modal2')
      })

      expect(result.current.modals['modal1']).toBe(true)
      expect(result.current.modals['modal2']).toBe(true)

      // Close only one modal
      act(() => {
        result.current.closeModal('modal1')
      })

      expect(result.current.modals['modal1']).toBe(false)
      expect(result.current.modals['modal2']).toBe(true)
    })
  })

  describe('loading states', () => {
    it('should set loading state for a key', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setLoading('products', true)
      })

      expect(result.current.loading['products']).toBe(true)

      act(() => {
        result.current.setLoading('products', false)
      })

      expect(result.current.loading['products']).toBe(false)
    })

    it('should handle multiple loading states independently', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setLoading('products', true)
        result.current.setLoading('categories', true)
        result.current.setLoading('cart', false)
      })

      expect(result.current.loading['products']).toBe(true)
      expect(result.current.loading['categories']).toBe(true)
      expect(result.current.loading['cart']).toBe(false)

      // Update one loading state
      act(() => {
        result.current.setLoading('products', false)
      })

      expect(result.current.loading['products']).toBe(false)
      expect(result.current.loading['categories']).toBe(true)
      expect(result.current.loading['cart']).toBe(false)
    })
  })

  describe('search', () => {
    it('should set search query', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setSearchQuery('test query')
      })

      expect(result.current.searchQuery).toBe('test query')
    })

    it('should clear search query', () => {
      const { result } = renderHook(() => useUIStore())

      // First set a query
      act(() => {
        result.current.setSearchQuery('test query')
      })

      expect(result.current.searchQuery).toBe('test query')

      // Then clear it
      act(() => {
        result.current.clearSearch()
      })

      expect(result.current.searchQuery).toBe('')
    })

    it('should update search query multiple times', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setSearchQuery('first query')
      })

      expect(result.current.searchQuery).toBe('first query')

      act(() => {
        result.current.setSearchQuery('second query')
      })

      expect(result.current.searchQuery).toBe('second query')
    })
  })
})