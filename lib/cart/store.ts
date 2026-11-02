'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartLine = {
  variantId: string
  productId: string
  slug: string
  title: string
  variantLabel: string
  image: string | null
  priceInr: number
  priceUsd: number
  quantity: number
}

interface CartState {
  lines: CartLine[]
  isOpen: boolean
  setOpen: (open: boolean) => void
  add: (line: Omit<CartLine, 'quantity'>, qty?: number) => void
  setQty: (variantId: string, qty: number) => void
  remove: (variantId: string) => void
  clear: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      setOpen: (open) => set({ isOpen: open }),
      add: (line, qty = 1) =>
        set((s) => {
          const i = s.lines.findIndex((l) => l.variantId === line.variantId)
          if (i >= 0) {
            const lines = [...s.lines]
            lines[i] = {
              ...lines[i],
              quantity: Math.min(50, lines[i].quantity + qty),
            }
            return { lines, isOpen: true }
          }
          return { lines: [...s.lines, { ...line, quantity: qty }], isOpen: true }
        }),
      setQty: (variantId, qty) =>
        set((s) => ({
          lines: s.lines.map((l) =>
            l.variantId === variantId
              ? { ...l, quantity: Math.max(1, Math.min(50, qty)) }
              : l
          ),
        })),
      remove: (variantId) =>
        set((s) => ({ lines: s.lines.filter((l) => l.variantId !== variantId) })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: 'megh-cart-v1',
      partialize: (state) => ({ lines: state.lines }),
    }
  )
)
