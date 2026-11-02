import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/supabase/public'
import { ProductsTable } from '@/components/admin/ProductsTable'
import { CURATED_PRODUCTS } from '@/lib/data/products'
import { DEFAULT_CATEGORIES } from '@/lib/data/categories'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  let products: any[] = []
  let categories: { id: string; name: string; slug: string }[] = []

  if (isSupabaseConfigured()) {
    try {
      const db = createAdminClient()
      const [pRes, cRes] = await Promise.all([
        db
          .from('products')
          .select('*, category:categories(id,name,slug), variants:product_variants(*)')
          .order('created_at', { ascending: false }),
        db.from('categories').select('id, name, slug').order('sort_order', { ascending: true }),
      ])

      if (pRes.data && pRes.data.length > 0) products = pRes.data
      if (cRes.data && cRes.data.length > 0) categories = cRes.data
    } catch {
      // Graceful fallback
    }
  }

  if (products.length === 0) {
    products = CURATED_PRODUCTS
  }
  if (categories.length === 0) {
    categories = DEFAULT_CATEGORIES.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Product Catalog &amp; Pricing
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage items, multi-pack weights, WebP photos, and live availability.
        </p>
      </div>

      <ProductsTable
        initialProducts={products}
        categories={categories}
      />
    </div>
  )
}
