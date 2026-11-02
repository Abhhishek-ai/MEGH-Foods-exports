'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import {
  Package,
  ShieldCheck,
  Check,
  Globe2,
  Clock,
  Sparkles,
  Plus,
  Minus,
  ShoppingBag,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { InquiryDialog } from '@/components/site/InquiryDialog'
import { useCart } from '@/lib/cart/store'
import { formatMoney, unitPrice, type Currency } from '@/lib/pricing'

export interface ProductDetailProps {
  product: {
    id: string
    slug: string
    title: string
    sku: string
    subcategory?: string | null
    short_description: string
    description_md: string
    nutrition_info: Record<string, string>
    ingredients?: string | null
    shelf_life?: string | null
    dietary_tags: string[]
    images: string[]
    is_b2b_only: boolean
    is_new_arrival: boolean
    category?: { id: string; name: string; slug: string } | null
    variants: Array<{
      id: string
      label: string
      weight_grams: number
      sku: string
      price_inr: number
      price_usd: number
      sale_price_inr: number | null
      sale_price_usd: number | null
      stock_status: 'in_stock' | 'out_of_stock' | 'made_to_order'
      is_bulk_only: boolean
    }>
  }
}

export function ProductDetailView({ product }: ProductDetailProps) {
  const { add } = useCart()
  const [currency, setCurrency] = useState<Currency>('INR')
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ''
  )
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [addedToast, setAddedToast] = useState(false)

  // Listen for currency toggle
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

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ||
    product.variants[0]

  const basePrice = Number(
    currency === 'INR' ? selectedVariant?.price_inr : selectedVariant?.price_usd
  )
  const effectivePrice = selectedVariant
    ? unitPrice(selectedVariant, currency)
    : 0
  const hasDiscount =
    selectedVariant && effectivePrice > 0 && effectivePrice < basePrice

  const isOutOfStock = selectedVariant?.stock_status === 'out_of_stock'
  const isBulkOnly = selectedVariant?.is_bulk_only || product.is_b2b_only
  const canAddToCart = !isOutOfStock && !isBulkOnly

  const handleAddToCart = () => {
    if (!selectedVariant || !canAddToCart) return

    add(
      {
        variantId: selectedVariant.id,
        productId: product.id,
        slug: product.slug,
        title: product.title,
        variantLabel: selectedVariant.label,
        image: product.images?.[0] || null,
        priceInr: Number(selectedVariant.price_inr),
        priceUsd: Number(selectedVariant.price_usd),
      },
      quantity
    )

    setAddedToast(true)
    setTimeout(() => setAddedToast(false), 3000)
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80']

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-sm flex items-center justify-center">
            {images.length > 0 ? (
              <Image
                src={images[activeImageIndex] || images[0]}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-300">
                <Package className="w-16 h-16" />
                <span className="text-xs text-slate-400 mt-2 font-medium">Megh Authentic</span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
              {product.is_new_arrival && (
                <span className="bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  New Arrival
                </span>
              )}
              {product.is_b2b_only && (
                <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  B2B Wholesale Only
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails row */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl border-2 overflow-hidden bg-white shrink-0 p-1 transition-all ${
                    activeImageIndex === idx
                      ? 'border-brand-blue ring-2 ring-brand-blue/30 shadow'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            {product.category && (
              <span className="text-xs font-bold uppercase tracking-wider text-brand-blue bg-blue-50 px-2.5 py-1 rounded-full">
                {product.category.name}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2.5 leading-snug">
              {product.title}
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              SKU: {selectedVariant?.sku || product.sku}
            </p>
          </div>

          {/* Price & Discount */}
          <div className="flex items-baseline gap-3 pb-4 border-b border-slate-200">
            {isBulkOnly ? (
              <div>
                <span className="text-2xl font-black text-brand-blue">
                  Commercial Pricing
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bulk order pricing available upon container / LCL quotation inquiry.
                </p>
              </div>
            ) : (
              <>
                <span className="text-3xl font-black text-brand-blue">
                  {formatMoney(effectivePrice, currency)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-slate-400 line-through">
                    {formatMoney(basePrice, currency)}
                  </span>
                )}
                {selectedVariant && (
                  <span className="text-xs text-slate-500 font-medium">
                    / {selectedVariant.label} ({selectedVariant.weight_grams}g)
                  </span>
                )}
              </>
            )}
          </div>

          {/* Dietary chips */}
          {product.dietary_tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {product.dietary_tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                >
                  ✓ {tag}
                </span>
              ))}
            </div>
          )}

          {/* Short description */}
          {product.short_description && (
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.short_description}
            </p>
          )}

          {/* Pack Size Selection Pills */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Select Pack Size:
              </label>
              {selectedVariant?.stock_status === 'in_stock' ? (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock &amp; Ready to Ship
                </span>
              ) : selectedVariant?.stock_status === 'made_to_order' ? (
                <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Freshly Milled to Order
                </span>
              ) : (
                <span className="text-xs font-semibold text-red-600">Out of Stock</span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => {
                const active = v.id === selectedVariantId
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all flex items-center gap-2 ${
                      active
                        ? 'border-brand-lime-600 bg-brand-lime-100 text-brand-lime-700 ring-2 ring-brand-lime-500/20 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{v.label}</span>
                    <span className="text-[11px] opacity-75 font-normal">
                      ({v.weight_grams}g)
                    </span>
                    {v.is_bulk_only && (
                      <span className="text-[9px] uppercase font-bold text-purple-700 ml-1">
                        Bulk
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Add to Cart / Quantity / Inquiry Actions */}
          <div className="space-y-3 pt-2">
            {canAddToCart ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center justify-between sm:justify-start border border-slate-200 rounded-xl bg-white px-3 h-12 w-full sm:w-36">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-1 hover:text-brand-blue disabled:opacity-30"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-slate-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                    className="p-1 hover:text-brand-blue"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-brand-blue hover:bg-brand-blue-700 text-white font-bold h-12 rounded-xl text-sm shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart • {formatMoney(effectivePrice * quantity, currency)}
                </Button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-xs text-slate-600 font-medium">
                  {isOutOfStock
                    ? 'This pack size is currently out of stock.'
                    : 'This bulk packaging is supplied via commercial export quotation.'}
                </p>
              </div>
            )}

            {addedToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center justify-between">
                <span>Added {quantity} × {product.title} to cart!</span>
                <span className="text-brand-blue underline cursor-pointer" onClick={() => useCart.getState().setOpen(true)}>
                  View Cart
                </span>
              </div>
            )}

            {/* B2B Wholesale Quote Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setInquiryOpen(true)}
              className="w-full h-11 rounded-xl border-slate-300 text-slate-800 font-semibold flex items-center justify-center gap-2 hover:bg-slate-50"
            >
              <MessageSquare className="w-4 h-4 text-brand-blue" />
              Inquire for Bulk Wholesale / Export Quotation
            </Button>
          </div>

          {/* Reassurance strip */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-blue shrink-0" />
              <span>Authentic Origin Guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-lime-600 shrink-0" />
              <span>Vacuum-Packed Freshness</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs: Description, Nutrition, Ingredients & Shelf Life, Shipping */}
      <div className="pt-6 border-t border-slate-200">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-xl bg-slate-100 p-1 rounded-xl">
            <TabsTrigger value="description" className="text-xs">Description</TabsTrigger>
            <TabsTrigger value="nutrition" className="text-xs">Nutrition Facts</TabsTrigger>
            <TabsTrigger value="specs" className="text-xs">Ingredients</TabsTrigger>
            <TabsTrigger value="shipping" className="text-xs">Shipping Info</TabsTrigger>
          </TabsList>

          {/* TAB 1: Markdown Description */}
          <TabsContent value="description" className="pt-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed">
              {product.description_md ? (
                <ReactMarkdown>{product.description_md}</ReactMarkdown>
              ) : (
                <p className="text-slate-500">
                  {product.short_description ||
                    'Authentic traditional grocery item sourced directly from certified agrarian regions in Gujarat and across India, processed under strict sanitary standards for export.'}
                </p>
              )}
            </div>
          </TabsContent>

          {/* TAB 2: Nutrition Facts */}
          <TabsContent value="nutrition" className="pt-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-lg">
              <h3 className="text-base font-black text-slate-900 border-b-2 border-slate-900 pb-2 mb-3">
                Nutrition Facts
              </h3>
              <p className="text-xs text-slate-500 mb-4">Values per 100g serving</p>

              {Object.keys(product.nutrition_info || {}).length > 0 ? (
                <div className="divide-y divide-slate-100 text-xs">
                  {Object.entries(product.nutrition_info).map(([key, val]) => (
                    <div key={key} className="py-2 flex items-center justify-between">
                      <span className="font-semibold text-slate-700">{key}</span>
                      <span className="font-mono font-bold text-slate-900">{val}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Standard export nutritional declaration available on physical pack label.
                </p>
              )}
            </div>
          </TabsContent>

          {/* TAB 3: Ingredients & Shelf Life */}
          <TabsContent value="specs" className="pt-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 max-w-2xl text-xs sm:text-sm">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Ingredients:</h4>
                <p className="text-slate-600">
                  {product.ingredients || '100% pure traditional agricultural produce. No artificial preservatives, additives, or synthetic dyes.'}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Shelf Life &amp; Storage:</h4>
                <p className="text-slate-600">
                  {product.shelf_life || 'Best before 12 months from packing date.'} Store in a cool, dry place away from direct sunlight. Once opened, transfer to an airtight container.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Manufacturing &amp; Packing Origin:</h4>
                <p className="text-slate-600">
                  Packaged by Megh Overseas Pvt. Ltd., Ahmedabad, Gujarat, India. Registered APEDA &amp; FSSAI exporter.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: Shipping Info */}
          <TabsContent value="shipping" className="pt-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-600">
              <h4 className="font-bold text-slate-900 text-base">Global Parcel &amp; Freight Delivery</h4>
              <p>
                We ship small-parcel retail orders directly to doorstep addresses in India, USA, Canada, United Kingdom, European Union, Middle East, and Africa.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>India:</strong> 3–6 business days via express courier.</li>
                <li><strong>US &amp; Canada:</strong> 10–18 business days with door-to-door tracking.</li>
                <li><strong>EU &amp; UK:</strong> 10–20 business days with customs clearance.</li>
                <li><strong>Middle East:</strong> 7–12 business days.</li>
              </ul>
              <p>
                For container load shipments (FCL / LCL), ocean transit schedules from Mundra / Nhava Sheva ports are coordinated directly with your freight forwarder.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Inquiry Dialog */}
      <InquiryDialog
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        productId={product.id}
        productTitle={product.title}
      />
    </div>
  )
}
