'use client'

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { ProductFilters } from '@/lib/types'

interface UIState {
  // Cart UI state
  cartOpen: boolean

  // Search state
  searchQuery: string

  // Filter state
  filters: ProductFilters

  // Loading states
  loading: boolean
  productsLoading: boolean
  cartLoading: boolean

  // Error states
  error: string | null

  // Modal states
  authModalOpen: boolean
  authModalMode: 'login' | 'register'

  // Product view state
  viewMode: 'grid' | 'list'

  // Sidebar state
  sidebarOpen: boolean
}

interface UIActions {
  // Cart actions
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  // Search actions
  setSearchQuery: (query: string) => void
  clearSearch: () => void

  // Filter actions
  setFilters: (filters: Partial<ProductFilters>) => void
  updateFilter: (
    key: keyof ProductFilters,
    value: string | number | boolean | string[]
  ) => void
  clearFilters: () => void

  // Loading actions
  setLoading: (loading: boolean) => void
  setProductsLoading: (loading: boolean) => void
  setCartLoading: (loading: boolean) => void

  // Error actions
  setError: (error: string | null) => void
  clearError: () => void

  // Auth modal actions
  openAuthModal: (mode?: 'login' | 'register') => void
  closeAuthModal: () => void
  setAuthModalMode: (mode: 'login' | 'register') => void

  // View mode actions
  setViewMode: (mode: 'grid' | 'list') => void
  toggleViewMode: () => void

  // Sidebar actions
  openSidebar: () => void
  closeSidebar: () => void
  toggleSidebar: () => void

  // Reset actions
  resetUI: () => void
}

type UIStore = UIState & UIActions

const initialState: UIState = {
  cartOpen: false,
  searchQuery: '',
  filters: {},
  loading: false,
  productsLoading: false,
  cartLoading: false,
  error: null,
  authModalOpen: false,
  authModalMode: 'login',
  viewMode: 'grid',
  sidebarOpen: false,
}

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set): UIStore => ({
        ...initialState,

        // Cart actions
        openCart: () => set({ cartOpen: true }),
        closeCart: () => set({ cartOpen: false }),
        toggleCart: () =>
          set((state: UIState) => ({ cartOpen: !state.cartOpen })),

        // Search actions
        setSearchQuery: (query: string) => set({ searchQuery: query }),
        clearSearch: () => set({ searchQuery: '' }),

        // Filter actions
        setFilters: (filters: Partial<ProductFilters>) =>
          set((state: UIState) => ({
            filters: { ...state.filters, ...filters },
          })),
        updateFilter: (
          key: keyof ProductFilters,
          value: string | number | boolean | string[]
        ) =>
          set((state: UIState) => ({
            filters: { ...state.filters, [key]: value },
          })),
        clearFilters: () => set({ filters: {} }),

        // Loading actions
        setLoading: (loading: boolean) => set({ loading }),
        setProductsLoading: (productsLoading: boolean) =>
          set({ productsLoading }),
        setCartLoading: (cartLoading: boolean) => set({ cartLoading }),

        // Error actions
        setError: (error: string | null) => set({ error }),
        clearError: () => set({ error: null }),

        // Auth modal actions
        openAuthModal: (mode: 'login' | 'register' = 'login') =>
          set({ authModalOpen: true, authModalMode: mode }),
        closeAuthModal: () => set({ authModalOpen: false }),
        setAuthModalMode: (authModalMode: 'login' | 'register') =>
          set({ authModalMode }),

        // View mode actions
        setViewMode: (viewMode: 'grid' | 'list') => set({ viewMode }),
        toggleViewMode: () =>
          set((state: UIState) => ({
            viewMode: state.viewMode === 'grid' ? 'list' : 'grid',
          })),

        // Sidebar actions
        openSidebar: () => set({ sidebarOpen: true }),
        closeSidebar: () => set({ sidebarOpen: false }),
        toggleSidebar: () =>
          set((state: UIState) => ({ sidebarOpen: !state.sidebarOpen })),

        // Reset actions
        resetUI: () => set(initialState),
      }),
      {
        name: 'ui-store',
        partialize: (state: UIStore) => ({
          // Only persist certain UI preferences
          viewMode: state.viewMode,
          filters: state.filters,
        }),
      }
    ),
    {
      name: 'ui-store',
    }
  )
)

// Selectors for better performance
export const useCartOpen = () => useUIStore(state => state.cartOpen)
export const useSearchQuery = () => useUIStore(state => state.searchQuery)
export const useFilters = () => useUIStore(state => state.filters)
export const useLoading = () => useUIStore(state => state.loading)
export const useProductsLoading = () =>
  useUIStore(state => state.productsLoading)
export const useCartLoading = () => useUIStore(state => state.cartLoading)
export const useError = () => useUIStore(state => state.error)
export const useAuthModal = () =>
  useUIStore(state => ({
    open: state.authModalOpen,
    mode: state.authModalMode,
  }))
export const useViewMode = () => useUIStore(state => state.viewMode)
export const useSidebarOpen = () => useUIStore(state => state.sidebarOpen)

// Action selectors
export const useCartActions = () =>
  useUIStore(state => ({
    openCart: state.openCart,
    closeCart: state.closeCart,
    toggleCart: state.toggleCart,
  }))

export const useSearchActions = () =>
  useUIStore(state => ({
    setSearchQuery: state.setSearchQuery,
    clearSearch: state.clearSearch,
  }))

export const useFilterActions = () =>
  useUIStore(state => ({
    setFilters: state.setFilters,
    updateFilter: state.updateFilter,
    clearFilters: state.clearFilters,
  }))

export const useLoadingActions = () =>
  useUIStore(state => ({
    setLoading: state.setLoading,
    setProductsLoading: state.setProductsLoading,
    setCartLoading: state.setCartLoading,
  }))

export const useErrorActions = () =>
  useUIStore(state => ({
    setError: state.setError,
    clearError: state.clearError,
  }))

export const useAuthModalActions = () =>
  useUIStore(state => ({
    openAuthModal: state.openAuthModal,
    closeAuthModal: state.closeAuthModal,
    setAuthModalMode: state.setAuthModalMode,
  }))

export const useViewActions = () =>
  useUIStore(state => ({
    setViewMode: state.setViewMode,
    toggleViewMode: state.toggleViewMode,
  }))

export const useSidebarActions = () =>
  useUIStore(state => ({
    openSidebar: state.openSidebar,
    closeSidebar: state.closeSidebar,
    toggleSidebar: state.toggleSidebar,
  }))
