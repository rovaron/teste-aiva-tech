import { create } from 'zustand'

interface UIStore {
  // Sidebar state
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void

  // Modal state
  modals: Record<string, boolean>
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  toggleModal: (modalId: string) => void
  closeAllModals: () => void

  // Loading states
  loading: Record<string, boolean>
  setLoading: (key: string, loading: boolean) => void

  // Search state
  searchQuery: string
  setSearchQuery: (query: string) => void
  clearSearch: () => void
}

export const useUIStore = create<UIStore>((set, get) => ({
  // Sidebar
  sidebarOpen: false,
  setSidebarOpen: open => set({ sidebarOpen: open }),
  toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),

  // Modals
  modals: {},
  openModal: modalId => {
    set({ modals: { ...get().modals, [modalId]: true } })
  },
  closeModal: modalId => {
    set({ modals: { ...get().modals, [modalId]: false } })
  },
  toggleModal: modalId => {
    const current = get().modals[modalId] || false
    set({ modals: { ...get().modals, [modalId]: !current } })
  },
  closeAllModals: () => set({ modals: {} }),

  // Loading
  loading: {},
  setLoading: (key, loading) => {
    set({ loading: { ...get().loading, [key]: loading } })
  },

  // Search
  searchQuery: '',
  setSearchQuery: query => set({ searchQuery: query }),
  clearSearch: () => set({ searchQuery: '' }),
}))
