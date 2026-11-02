import { Suspense } from 'react'
import { getActiveProducts } from '@/lib/data/products'
import { getCategories } from '@/lib/data/categories'
import { CatalogClient } from '@/components/catalog/CatalogClient'
import { type CatalogProduct } from '@/lib/catalog/filter'
import { Loader2 } from 'lucide-react'

export const revalidate = 3600

export const metadata = {
  title: 'All Products | Megh Foods',
  description:
    'Browse traditional Indian groceries: flours, millet, vrat special flours, sabudana, poha, fryums, snacks, sugar, and jaggery exported worldwide.',
}

export default async function ProductsPage() {
  const [productsData, categoriesData] = await Promise.all([
    getActiveProducts(),
    getCategories(),
  ])

  // Map database response to CatalogProduct type
  const products: CatalogProduct[] = (productsData || []).map((p: any) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    short_description: p.short_description || '',
    images: p.images || [],
    dietary_tags: p.dietary_tags || [],
    is_featured: Boolean(p.is_featured),
    is_new_arrival: Boolean(p.is_new_arrival),
    is_b2b_only: Boolean(p.is_b2b_only),
    created_at: p.created_at,
    category: p.category
      ? { id: p.category.id, name: p.category.name, slug: p.category.slug }
      : null,
    variants: (p.variants || []).map((v: any) => ({
      id: v.id,
      label: v.label,
      weight_grams: v.weight_grams,
      price_inr: Number(v.price_inr),
      price_usd: Number(v.price_usd),
      sale_price_inr: v.sale_price_inr != null ? Number(v.sale_price_inr) : null,
      sale_price_usd: v.sale_price_usd != null ? Number(v.sale_price_usd) : null,
      stock_status: v.stock_status,
      is_bulk_only: v.is_bulk_only,
    })),
  }))

  const categories = (categoriesData || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }))

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-6">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          Export &amp; Retail Groceries
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Megh Foods Product Collection
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
          Order retail small-parcel packs with international doorstep delivery, or explore container-grade varieties milled and packed in Ahmedabad, India.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Loading product catalogue...</p>
          </div>
        }
      >
        <CatalogClient initialProducts={products} categories={categories} />
      </Suspense>
    </div>
  )
}
