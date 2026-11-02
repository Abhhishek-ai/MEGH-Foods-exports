'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart/store'
import { formatMoney } from '@/lib/pricing'
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react'

export function CartDrawer() {
  const { lines, isOpen, setOpen, setQty, remove } = useCart()
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR')

  useEffect(() => {
    const updateCurrency = () => {
      const match = document.cookie.match(/(?:^|;\s*)mf_currency=([^;]+)/)
      if (match && (match[1] === 'INR' || match[1] === 'USD')) {
        setCurrency(match[1])
      }
    }

    updateCurrency()
    window.addEventListener('currencyChange', updateCurrency)
    return () => window.removeEventListener('currencyChange', updateCurrency)
  }, [])

  const subtotal = lines.reduce((acc, line) => {
    const price = currency === 'INR' ? line.priceInr : line.priceUsd
    return acc + price * line.quantity
  }, 0)

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 bg-white">
        <SheetHeader className="p-6 border-b border-slate-100 flex-shrink-0">
          <SheetTitle className="flex items-center gap-2 text-base font-black text-slate-900">
            <ShoppingBag className="w-5 h-5 text-brand-blue" />
            Your Shopping Cart ({lines.reduce((acc, l) => acc + l.quantity, 0)})
          </SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Your cart is currently empty</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Explore our selection of traditional Indian flours, snacks, jaggery, and export groceries.
              </p>
            </div>
            <Button
              onClick={() => setOpen(false)}
              asChild
              className="bg-brand-blue hover:bg-brand-blue-700 text-white rounded-xl"
            >
              <Link href="/products">Browse All Products</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-6 space-y-4">
              {lines.map((line) => {
                const unit = currency === 'INR' ? line.priceInr : line.priceUsd
                const lineTotal = unit * line.quantity

                return (
                  <div key={line.variantId} className="flex gap-4 pt-4 first:pt-0">
                    <div className="relative w-16 h-16 rounded-xl border border-slate-100 bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center">
                      {line.image ? (
                        <Image
                          src={line.image}
                          alt={line.title}
                          fill
                          sizes="64px"
                          className="object-contain p-1"
                        />
                      ) : (
                        <ShoppingBag className="w-6 h-6 text-slate-300" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${line.slug}`}
                        onClick={() => setOpen(false)}
                        className="text-xs font-bold text-slate-900 hover:text-brand-blue transition-colors line-clamp-1"
                      >
                        {line.title}
                      </Link>
                      <span className="inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-lime-100 text-brand-lime-700">
                        {line.variantLabel}
                      </span>

                      <div className="flex items-center justify-between mt-2">
                        {/* Stepper */}
                        <div className="flex items-center border border-slate-200 rounded-lg">
                          <button
                            type="button"
                            onClick={() => setQty(line.variantId, line.quantity - 1)}
                            className="p-1 hover:bg-slate-100 text-slate-600 rounded-l"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-900">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty(line.variantId, line.quantity + 1)}
                            className="p-1 hover:bg-slate-100 text-slate-600 rounded-r"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">
                            {formatMoney(lineTotal, currency)}
                          </span>
                          <button
                            type="button"
                            onClick={() => remove(line.variantId)}
                            className="text-slate-400 hover:text-red-600 p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Subtotal & Checkout CTA */}
            <SheetFooter className="p-6 border-t border-slate-100 bg-slate-50 flex-col space-y-3">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-semibold text-slate-600">Subtotal</span>
                <span className="text-lg font-black text-brand-blue">
                  {formatMoney(subtotal, currency)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Shipping rates and taxes calculated at checkout.
              </p>

              <div className="flex gap-2 w-full pt-1">
                <Button
                  asChild
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-xl"
                >
                  <Link href="/cart">View Cart</Link>
                </Button>
                <Button
                  asChild
                  onClick={() => setOpen(false)}
                  className="flex-1 bg-brand-blue hover:bg-brand-blue-700 text-white rounded-xl shadow-md"
                >
                  <Link href="/checkout" className="flex items-center justify-center gap-1.5">
                    Checkout <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Secure payment powered by Razorpay</span>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
