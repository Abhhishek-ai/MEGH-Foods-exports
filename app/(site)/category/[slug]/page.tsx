import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCategories, getCategoryBySlug } from '@/lib/data/categories'
import { getActiveProducts } from '@/lib/data/products'
import { CatalogClient } from '@/components/catalog/CatalogClient'
import { JsonLd } from '@/components/site/JsonLd'
import { breadcrumbLd } from '@/lib/seo'
import { ChevronRight, Loader2 } from 'lucide-react'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((c: { slug: string }) => ({
    slug: c.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const cat = await getCategoryBySlug(slug)

  if (!cat) {
    return {
      title: 'Category Not Found | Megh Foods',
      description: 'The requested category could not be located.',
    }
  }

  return {
    title: `${cat.name} | Megh Foods`,
    description: `Shop authentic ${cat.name} exported worldwide from Ahmedabad, Gujarat by Megh Foods.`,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [currentCategory, allCategories, allProducts] = await Promise.all([
    getCategoryBySlug(slug),
    getCategories(),
    getActiveProducts(),
  ])

  if (!currentCategory) {
    notFound()
  }

  const breadcrumbs = breadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: currentCategory.name, path: `/category/${currentCategory.slug}` },
  ])

  // Filter products by this category
  const categoryProducts = allProducts.filter(
    (p: any) => p.category && p.category.slug === slug
  )

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-8">
      <JsonLd data={breadcrumbs} />

      {/* Breadcrumb nav */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-brand-blue">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/products" className="hover:text-brand-blue">
          Products
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold">{currentCategory.name}</span>
      </nav>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          Category Collection
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {currentCategory.name}
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
          Explore our range of authentic {currentCategory.name.toLowerCase()} available for global small-parcel retail orders and bulk wholesale container exports.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Loading category items...</p>
          </div>
        }
      >
        <CatalogClient
          initialProducts={categoryProducts as any}
          categories={allCategories}
        />
      </Suspense>
    </div>
  )
}
