import Fuse from 'fuse.js'

export type CatalogVariant = {
  id: string
  label: string
  weight_grams: number
  price_inr: number
  price_usd: number
  sale_price_inr: number | null
  sale_price_usd: number | null
  stock_status: 'in_stock' | 'out_of_stock' | 'made_to_order'
  is_bulk_only?: boolean
  product_id?: string
  sku?: string
  sort_order?: number
}

export type CatalogProduct = {
  id: string
  slug: string
  title: string
  short_description: string
  images: string[]
  dietary_tags: string[]
  is_featured: boolean
  is_new_arrival: boolean
  is_b2b_only: boolean
  is_active?: boolean
  created_at?: string
  category: { id: string; name: string; slug: string } | null
  variants: CatalogVariant[]
  category_id?: string | null
  sku?: string
  subcategory?: string | null
  description_md?: string
  nutrition_info?: Record<string, string>
  ingredients?: string | null
  shelf_life?: string | null
  seo_title?: string | null
  seo_description?: string | null
}

export type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'name'

export type Filters = {
  q: string
  categories: string[]
  diet: string[]
  sizes: string[]
  inStockOnly: boolean
  sort: SortKey
}

export const SIZE_BUCKETS = ['Up to 250g', '250g – 1kg', '1kg – 5kg', 'Bulk (5kg+)'] as const

export const weightBucket = (g: number) =>
  g <= 250
    ? SIZE_BUCKETS[0]
    : g <= 1000
    ? SIZE_BUCKETS[1]
    : g <= 5000
    ? SIZE_BUCKETS[2]
    : SIZE_BUCKETS[3]

export const minUnitPrice = (p: CatalogProduct, cur: 'INR' | 'USD') => {
  if (!p.variants || p.variants.length === 0) return 0
  return Math.min(
    ...p.variants.map((v) => {
      const base = cur === 'INR' ? Number(v.price_inr) : Number(v.price_usd)
      const sale = cur === 'INR' ? v.sale_price_inr : v.sale_price_usd
      return sale && Number(sale) > 0 && Number(sale) < base ? Number(sale) : base
    })
  )
}

export function buildSearch(products: CatalogProduct[]) {
  return new Fuse(products, {
    keys: [
      { name: 'title', weight: 0.6 },
      { name: 'short_description', weight: 0.2 },
      { name: 'category.name', weight: 0.15 },
      { name: 'dietary_tags', weight: 0.05 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
  })
}

export function applyFilters(
  products: CatalogProduct[],
  fuse: Fuse<CatalogProduct>,
  f: Filters,
  cur: 'INR' | 'USD'
) {
  let list = f.q.trim() ? fuse.search(f.q.trim()).map((r) => r.item) : [...products]

  if (f.categories.length) {
    list = list.filter((p) => p.category && f.categories.includes(p.category.slug))
  }
  if (f.diet.length) {
    list = list.filter((p) => f.diet.every((d) => p.dietary_tags.includes(d)))
  }
  if (f.sizes.length) {
    list = list.filter((p) =>
      p.variants.some((v) => f.sizes.includes(weightBucket(v.weight_grams)))
    )
  }
  if (f.inStockOnly) {
    list = list.filter((p) =>
      p.variants.some((v) => v.stock_status !== 'out_of_stock')
    )
  }

  const sorters: Record<SortKey, (a: CatalogProduct, b: CatalogProduct) => number> = {
    featured: (a, b) => Number(b.is_featured) - Number(a.is_featured),
    newest: (a, b) => +new Date(b.created_at || 0) - +new Date(a.created_at || 0),
    'price-asc': (a, b) => minUnitPrice(a, cur) - minUnitPrice(b, cur),
    'price-desc': (a, b) => minUnitPrice(b, cur) - minUnitPrice(a, cur),
    name: (a, b) => a.title.localeCompare(b.title),
  }

  if (!f.q.trim()) {
    list.sort(sorters[f.sort])
  }

  return list
}
