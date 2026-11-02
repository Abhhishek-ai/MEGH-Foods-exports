import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getProductBySlug,
  getAllSlugs,
  getRelatedProducts,
} from '@/lib/data/products'
import { ProductDetailView } from '@/components/site/ProductDetailView'
import { ProductCard } from '@/components/site/ProductCard'
import { JsonLd } from '@/components/site/JsonLd'
import { productLd, breadcrumbLd } from '@/lib/seo'
import { ChevronRight } from 'lucide-react'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map((s: { slug: string }) => ({
    slug: s.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return {
      title: 'Product Not Found | Megh Foods',
      description: 'The requested product could not be located.',
    }
  }

  const title = product.seo_title || `${product.title} | Megh Foods`
  const description =
    product.seo_description ||
    product.short_description ||
    `Buy authentic ${product.title} online from Megh Foods. Exported worldwide from Ahmedabad.`

  const cover = product.images?.[0]

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: cover ? [{ url: cover }] : [],
    },
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(
    product.category_id || product.category?.id || null,
    product.id,
    4
  )

  const productJsonLd = productLd({
    title: product.title,
    slug: product.slug,
    description: product.short_description || product.title,
    images: product.images || [],
    sku: product.sku || product.id,
    variants: (product.variants || []).map((v: any) => ({
      sku: v.sku,
      label: v.label,
      price_usd: Number(v.price_usd),
      stock_status: v.stock_status,
    })),
  })

  const breadcrumbs = breadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: product.title, path: `/products/${product.slug}` },
  ])

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-12">
      <JsonLd data={productJsonLd} />
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
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-brand-blue"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold truncate max-w-xs">
          {product.title}
        </span>
      </nav>

      {/* Main PDP Interaction View */}
      <ProductDetailView product={product as any} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-slate-200 space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Related Products
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Explore more authentic specialties in {product.category?.name || 'this category'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p: any) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
