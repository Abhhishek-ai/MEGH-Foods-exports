'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  type CatalogProduct,
  type Filters,
  type SortKey,
  buildSearch,
  applyFilters,
} from '@/lib/catalog/filter'
import { SearchBar } from '@/components/catalog/SearchBar'
import { FilterPanel } from '@/components/catalog/FilterPanel'
import { SortSelect } from '@/components/catalog/SortSelect'
import { ProductCard } from '@/components/site/ProductCard'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Filter, SlidersHorizontal, PackageSearch } from 'lucide-react'

interface CatalogClientProps {
  initialProducts: CatalogProduct[]
  categories: { id: string; name: string; slug: string }[]
}

export function CatalogClient({ initialProducts, categories }: CatalogClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Listen to currency changes
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

  // Initialize filters from URL params
  const [filters, setFilters] = useState<Filters>(() => {
    const q = searchParams.get('q') || ''
    const cat = searchParams.get('category')
    const cats = cat ? cat.split(',').filter(Boolean) : []
    const diet = searchParams.get('diet')
    const diets = diet ? diet.split(',').filter(Boolean) : []
    const size = searchParams.get('size')
    const sizes = size ? size.split(',').filter(Boolean) : []
    const inStock = searchParams.get('instock') === 'true'
    const sort = (searchParams.get('sort') as SortKey) || 'featured'

    return {
      q,
      categories: cats,
      diet: diets,
      sizes,
      inStockOnly: inStock,
      sort,
    }
  })

  // Debounce search update to URL
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams()
      if (filters.q.trim()) params.set('q', filters.q.trim())
      if (filters.categories.length) params.set('category', filters.categories.join(','))
      if (filters.diet.length) params.set('diet', filters.diet.join(','))
      if (filters.sizes.length) params.set('size', filters.sizes.join(','))
      if (filters.inStockOnly) params.set('instock', 'true')
      if (filters.sort !== 'featured') params.set('sort', filters.sort)

      const qs = params.toString()
      if (typeof window !== 'undefined') {
        const nextUrl = qs ? `/products?${qs}` : '/products'
        window.history.replaceState(null, '', nextUrl)
      }
    }, 150)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [filters])

  // Extract all unique dietary tags present in products
  const availableDietaryTags = useMemo(() => {
    const set = new Set<string>()
    initialProducts.forEach((p) => {
      (p.dietary_tags || []).forEach((t) => set.add(t))
    })
    return Array.from(set).sort()
  }, [initialProducts])

  // Build Fuse index once with useMemo
  const fuse = useMemo(() => {
    return buildSearch(initialProducts)
  }, [initialProducts])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return applyFilters(initialProducts, fuse, filters, currency)
  }, [initialProducts, fuse, filters, currency])

  const handleReset = () => {
    setFilters({
      q: '',
      categories: [],
      diet: [],
      sizes: [],
      inStockOnly: false,
      sort: 'featured',
    })
  }

  return (
    <div className="space-y-6">
      {/* Top search & sorting control bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={filters.q}
            onChange={(q) => setFilters((prev) => ({ ...prev, q }))}
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          {/* Mobile Filter Button */}
          <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="lg:hidden flex items-center gap-2 h-10 rounded-xl border-slate-200 text-xs"
              >
                <SlidersHorizontal className="w-4 h-4 text-brand-blue" />
                Filters
                {(filters.categories.length > 0 ||
                  filters.diet.length > 0 ||
                  filters.sizes.length > 0 ||
                  filters.inStockOnly) && (
                  <span className="w-2 h-2 rounded-full bg-brand-blue" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-xs overflow-y-auto">
              <SheetHeader className="pb-4">
                <SheetTitle className="text-base font-bold">Catalog Filters</SheetTitle>
              </SheetHeader>
              <FilterPanel
                filters={filters}
                categories={categories}
                availableDietaryTags={availableDietaryTags}
                onChange={(f) => setFilters(f)}
                onReset={() => {
                  handleReset()
                  setMobileFilterOpen(false)
                }}
              />
            </SheetContent>
          </Sheet>

          <SortSelect
            value={filters.sort}
            onChange={(sort) => setFilters((prev) => ({ ...prev, sort }))}
          />
        </div>
      </div>

      {/* Main Layout: Sticky Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sticky Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-24 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <FilterPanel
            filters={filters}
            categories={categories}
            availableDietaryTags={availableDietaryTags}
            onChange={(f) => setFilters(f)}
            onReset={handleReset}
          />
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
            </span>
            {filters.categories.length > 0 && (
              <span className="font-semibold text-brand-blue">
                Filtered by {filters.categories.length} {filters.categories.length === 1 ? 'category' : 'categories'}
              </span>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="p-16 text-center rounded-2xl border border-dashed border-slate-300 bg-white space-y-4">
              <PackageSearch className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No matching products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your filters, clearing your search query, or check all product categories.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="rounded-xl border-slate-300 text-xs"
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
