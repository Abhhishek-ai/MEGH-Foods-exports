import { MetadataRoute } from 'next'
import { CONFIG } from '@/lib/config'
import { getAllSlugs } from '@/lib/data/products'
import { getCategories } from '@/lib/data/categories'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = CONFIG.siteUrl

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/wholesale-export`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/shipping-returns`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  const [slugs, categories] = await Promise.all([
    getAllSlugs(),
    getCategories(),
  ])

  const productRoutes: MetadataRoute.Sitemap = slugs.map((p: { slug: string; updated_at?: string }) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c: { slug: string }) => ({
    url: `${baseUrl}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}
