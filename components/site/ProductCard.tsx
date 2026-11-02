'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Package, ArrowRight } from 'lucide-react'
import { PackPills } from '@/components/site/PackPills'
import { formatMoney } from '@/lib/pricing'
import { type CatalogProduct, minUnitPrice } from '@/lib/catalog/filter'

interface ProductCardProps {
  product: CatalogProduct
}

export function ProductCard({ product }: ProductCardProps) {
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

  const cover =
    product.images?.[0] ||
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
  const startingPrice = minUnitPrice(product, currency)
  const isOutOfStock =
    product.variants.length > 0 &&
    product.variants.every((v) => v.stock_status === 'out_of_stock')

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 transition-all duration-200 hover:-translate-y-1 hover:border-brand-blue/40 hover:shadow-lg"
    >
      <div>
        {/* Pack Shot Container */}
        <div
          className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-100 border border-slate-100 flex items-center justify-center mb-3"
          style={{ position: 'relative', width: '100%', aspectRatio: '1/1', maxHeight: '260px' }}
        >
          <Image
            src={cover}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-108"
          />

          {/* Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
            {product.is_b2b_only && (
              <span className="rounded-md bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 shadow-sm">
                B2B Bulk Only
              </span>
            )}
            {product.is_new_arrival && (
              <span className="rounded-md bg-brand-blue text-white text-[10px] font-bold px-2 py-0.5 shadow-sm">
                New Arrival
              </span>
            )}
            {isOutOfStock && (
              <span className="rounded-md bg-slate-800 text-white text-[10px] font-bold px-2 py-0.5 shadow-sm">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Category tag */}
        {product.category && (
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            {product.category.name}
          </p>
        )}

        {/* Title */}
        <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-blue transition-colors line-clamp-2 leading-snug">
          {product.title}
        </h3>

        {/* Short description */}
        {product.short_description && (
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {product.short_description}
          </p>
        )}
      </div>

      {/* Footer Area: Pack size pills + Price */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
        <PackPills variants={product.variants} />

        <div className="flex items-center justify-between mt-1">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">
              {product.is_b2b_only ? 'Wholesale Quote' : 'Starting From'}
            </span>
            <span className="text-sm font-black text-brand-blue">
              {product.is_b2b_only
                ? 'Request Quote'
                : formatMoney(startingPrice, currency)}
            </span>
          </div>

          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-50 text-slate-400 group-hover:bg-brand-blue group-hover:text-white transition-colors">
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
