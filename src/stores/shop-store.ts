import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  productId: string
  title: string
  price: number
  coverImage: string
  quantity: number
}

interface ShopState {
  cart: CartItem[]
  subtotal: number
  tax: number
  total: number
  isLoading: boolean

  // Actions
  addToCart: (
    product: {
      id: string
      title: string
      price: number
      coverImage: string
    },
    quantity: number,
  ) => void
  removeFromCart: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  calculateTotals: () => void
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      cart: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      isLoading: false,

      addToCart: (product, quantity) => {
        set((state) => {
          // Check if product already exists in cart
          const existingItemIndex = state.cart.findIndex((item) => item.productId === product.id)

          let newCart

          if (existingItemIndex >= 0) {
            // Update quantity if product exists
            newCart = [...state.cart]
            newCart[existingItemIndex].quantity += quantity
          } else {
            // Add new item if product doesn't exist
            const newItem: CartItem = {
              id: `cart-${Date.now()}`,
              productId: product.id,
              title: product.title,
              price: product.price,
              coverImage: product.coverImage,
              quantity,
            }
            newCart = [...state.cart, newItem]
          }

          return { cart: newCart }
        })

        // Calculate new totals
        get().calculateTotals()
      },

      removeFromCart: (cartItemId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== cartItemId),
        }))

        // Calculate new totals
        get().calculateTotals()
      },

      updateQuantity: (cartItemId, quantity) => {
        set((state) => ({
          cart: state.cart.map((item) => (item.id === cartItemId ? { ...item, quantity } : item)),
        }))

        // Calculate new totals
        get().calculateTotals()
      },

      clearCart: () => {
        set({ cart: [], subtotal: 0, tax: 0, total: 0 })
      },

      calculateTotals: () => {
        set((state) => {
          const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
          const tax = subtotal * 0.15 // 15% tax rate
          const total = subtotal + tax

          return { subtotal, tax, total }
        })
      },
    }),
    {
      name: "shop-storage",
      partialize: (state) => ({
        cart: state.cart,
        subtotal: state.subtotal,
        tax: state.tax,
        total: state.total,
      }),
    },
  ),
)

