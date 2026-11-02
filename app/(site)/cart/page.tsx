'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart/store'
import { formatMoney } from '@/lib/pricing'

export default function CartPage() {
  const { lines, setQty, remove, clear } = useCart()
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
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-12 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review items, modify pack quantities, and proceed to secure checkout.
          </p>
        </div>

        {lines.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clear}
            className="text-xs text-slate-500 hover:text-red-600"
          >
            Clear Cart
          </Button>
        )}
      </div>

      {lines.length === 0 ? (
        <div className="p-16 text-center rounded-3xl border border-slate-200 bg-white space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Your cart is currently empty</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Discover our authentic collection of traditional Indian flours, vrat specialties, snacks, and traditional groceries.
          </p>
          <div className="pt-2">
            <Button asChild className="bg-brand-blue text-white rounded-xl">
              <Link href="/products">Explore Product Catalog</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
              {lines.map((line) => {
                const unit = currency === 'INR' ? line.priceInr : line.priceUsd
                const lineTotal = unit * line.quantity

                return (
                  <div key={line.variantId} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-xl border border-slate-100 bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center">
                        {line.image ? (
                          <Image
                            src={line.image}
                            alt={line.title}
                            fill
                            sizes="80px"
                            className="object-contain p-2"
                          />
                        ) : (
                          <ShoppingBag className="w-8 h-8 text-slate-300" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <Link
                          href={`/products/${line.slug}`}
                          className="text-sm font-bold text-slate-900 hover:text-brand-blue transition-colors line-clamp-1"
                        >
                          {line.title}
                        </Link>
                        <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-brand-lime-100 text-brand-lime-700">
                          {line.variantLabel}
                        </span>
                        <p className="text-xs text-slate-500">
                          Unit: {formatMoney(unit, currency)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-6 pt-2 sm:pt-0">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-lg">
                        <button
                          type="button"
                          onClick={() => setQty(line.variantId, line.quantity - 1)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-l"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-slate-900">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(line.variantId, line.quantity + 1)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-r"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-black text-slate-900">
                          {formatMoney(lineTotal, currency)}
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(line.variantId)}
                          className="text-xs text-slate-400 hover:text-red-600 mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div>
              <Button asChild variant="ghost" className="text-xs text-brand-blue">
                <Link href="/products" className="flex items-center gap-1.5">
                  <ArrowLeft className="w-4 h-4" /> Continue Shopping
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: Order Summary Card */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <h3 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span className="font-bold text-slate-900">
                  {formatMoney(subtotal, currency)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-brand-blue" /> Shipping:
                </span>
                <span className="text-slate-500 italic">
                  Calculated at checkout
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900">Estimated Total:</span>
                <span className="text-xl font-black text-brand-blue">
                  {formatMoney(subtotal, currency)}
                </span>
              </div>
            </div>

            <Button
              asChild
              size="lg"
              className="w-full bg-brand-blue hover:bg-brand-blue-700 text-white font-bold h-12 rounded-xl text-sm shadow-md"
            >
              <Link href="/checkout" className="flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

            <div className="pt-2 border-t border-slate-100 space-y-2 text-[11px] text-slate-500 text-center">
              <div className="flex items-center justify-center gap-1.5 text-slate-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Razorpay Payment Gateway</span>
              </div>
              <p>Prices and international shipping rates are verified on the server.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
