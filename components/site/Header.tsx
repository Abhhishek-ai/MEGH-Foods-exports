'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Globe2, Menu, X } from 'lucide-react'
import { CurrencySwitcher } from '@/components/site/CurrencySwitcher'
import { useCart } from '@/lib/cart/store'

export function Header() {
  const { lines, setOpen } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const cartCount = lines.reduce((acc, l) => acc + l.quantity, 0)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      {/* Top Banner */}
      <div className="bg-brand-blue text-white text-xs py-1.5 px-4 text-center font-medium">
        <span>Worldwide Export Shipping &amp; B2B Wholesale Container Supply • Ahmedabad, India</span>
      </div>

      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-brand-blue flex items-center justify-center text-white font-black text-sm shadow-sm transition-transform group-hover:scale-105 border border-brand-blue-700">
              <span className="text-brand-lime font-black">M</span><span className="text-white font-black">F</span>
            </div>
            <span className="text-2xl font-black tracking-tight text-brand-blue">
              MEGH <span className="text-brand-lime-600 font-bold text-xl">FOODS</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <Link href="/products" className="hover:text-brand-blue transition-colors">
              All Products
            </Link>
            <Link href="/wholesale-export" className="hover:text-brand-blue transition-colors">
              Wholesale &amp; Export
            </Link>
            <Link href="/about" className="hover:text-brand-blue transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-brand-blue transition-colors">
              Contact
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <CurrencySwitcher />

          <Link
            href="/wholesale-export"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-blue-50 text-brand-blue border border-brand-blue-100 hover:bg-brand-blue-100 transition-colors"
          >
            <Globe2 className="w-3.5 h-3.5" />
            Distributor Inquiry
          </Link>

          {/* Cart Icon */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative p-2 text-slate-700 hover:text-brand-blue transition-colors"
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-blue text-white text-[10px] font-black rounded-full flex items-center justify-center shadow">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden text-slate-700 hover:text-brand-blue"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-3">
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 hover:text-brand-blue py-1"
          >
            All Products
          </Link>
          <Link
            href="/wholesale-export"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 hover:text-brand-blue py-1"
          >
            Wholesale &amp; Export
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 hover:text-brand-blue py-1"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 hover:text-brand-blue py-1"
          >
            Contact
          </Link>
          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/wholesale-export"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-blue-50 text-brand-blue border border-brand-blue-100"
            >
              <Globe2 className="w-3.5 h-3.5" />
              Distributor Inquiry
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
