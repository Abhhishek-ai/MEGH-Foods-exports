import { CONFIG } from '@/lib/config'

export const organizationLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: CONFIG.siteName,
  url: CONFIG.siteUrl,
  logo: `${CONFIG.siteUrl}/logo.png`,
  description: 'Authentic Indian food products and groceries, exported worldwide from Ahmedabad, Gujarat.',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: `+${CONFIG.whatsapp}`,
    contactType: 'customer service',
    areaServed: ['IN', 'US', 'CA', 'GB', 'EU', 'AE'],
    availableLanguage: ['en', 'hi', 'gu'],
  },
})

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: `${CONFIG.siteUrl}${it.path}`,
  })),
})

export const productLd = (p: {
  title: string
  slug: string
  description: string
  images: string[]
  sku: string
  variants: {
    sku: string
    label: string
    price_usd: number
    stock_status: string
  }[]
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: p.title,
  sku: p.sku,
  image: p.images.length > 0 ? p.images : [`${CONFIG.siteUrl}/og-image.png`],
  description: p.description,
  brand: {
    '@type': 'Brand',
    name: 'Megh Foods',
  },
  offers: (p.variants || []).map((v) => ({
    '@type': 'Offer',
    sku: v.sku,
    name: v.label,
    priceCurrency: 'USD',
    price: Number(v.price_usd).toFixed(2),
    availability:
      v.stock_status === 'out_of_stock'
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
    url: `${CONFIG.siteUrl}/products/${p.slug}`,
  })),
})
