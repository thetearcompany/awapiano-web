import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AdminState {
  // UI state
  sidebarCollapsed: boolean
  currentSection: string

  // Filters and pagination
  articleFilters: {
    search: string
    categoryId: string | null
    published: boolean | null
    page: number
    limit: number
  }

  userFilters: {
    search: string
    role: string | null
    page: number
    limit: number
  }

  productFilters: {
    search: string
    type: string | null
    published: boolean | null
    page: number
    limit: number
  }

  // Actions
  setSidebarCollapsed: (collapsed: boolean) => void
  setCurrentSection: (section: string) => void
  setArticleFilters: (filters: Partial<AdminState["articleFilters"]>) => void
  setUserFilters: (filters: Partial<AdminState["userFilters"]>) => void
  setProductFilters: (filters: Partial<AdminState["productFilters"]>) => void
  resetFilters: () => void
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      // UI state
      sidebarCollapsed: false,
      currentSection: "dashboard",

      // Filters and pagination
      articleFilters: {
        search: "",
        categoryId: null,
        published: null,
        page: 1,
        limit: 10,
      },

      userFilters: {
        search: "",
        role: null,
        page: 1,
        limit: 10,
      },

      productFilters: {
        search: "",
        type: null,
        published: null,
        page: 1,
        limit: 10,
      },

      // Actions
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setCurrentSection: (section) => set({ currentSection: section }),

      setArticleFilters: (filters) =>
        set((state) => ({
          articleFilters: {
            ...state.articleFilters,
            ...filters,
          },
        })),

      setUserFilters: (filters) =>
        set((state) => ({
          userFilters: {
            ...state.userFilters,
            ...filters,
          },
        })),

      setProductFilters: (filters) =>
        set((state) => ({
          productFilters: {
            ...state.productFilters,
            ...filters,
          },
        })),

      resetFilters: () =>
        set({
          articleFilters: {
            search: "",
            categoryId: null,
            published: null,
            page: 1,
            limit: 10,
          },
          userFilters: {
            search: "",
            role: null,
            page: 1,
            limit: 10,
          },
          productFilters: {
            search: "",
            type: null,
            published: null,
            page: 1,
            limit: 10,
          },
        }),
    }),
    {
      name: "admin-storage",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        currentSection: state.currentSection,
      }),
    },
  ),
)

