import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Wheat,
  Utensils,
  Sparkles,
  Cookie,
  Flame,
  Soup,
  Coffee,
  Package,
  ArrowUpRight,
} from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  image_url?: string | null
}

interface CategoryGridProps {
  categories: Category[]
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  flours: Wheat,
  'millet-flours': Wheat,
  'vrat-special-flours': Sparkles,
  sabudana: Utensils,
  mamra: Cookie,
  balls: Cookie,
  poha: Wheat,
  fryums: Flame,
  'foochka-khichiya': Cookie,
  rice: Wheat,
  snacks: Cookie,
  sugar: Coffee,
  jaggery: Coffee,
  salt: Sparkles,
  'vadhvani-marcha': Flame,
  chikki: Cookie,
  laddu: Cookie,
  shrikhand: Soup,
  'pooja-kit': Sparkles,
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Heritage Product Lines
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
            Explore by Category
          </h2>
        </div>
        <Link
          href="/products"
          className="text-xs font-bold text-brand-blue hover:underline inline-flex items-center gap-1"
        >
          <span>View all categories</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((c) => {
          const Icon = CATEGORY_ICONS[c.slug] || Package

          return (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="group flex flex-col rounded-2xl border border-slate-200/90 bg-white p-2.5 sm:p-3 transition-all duration-200 hover:-translate-y-1 hover:border-brand-blue/50 hover:shadow-lg"
            >
              <div
                className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 mb-2.5"
                style={{ position: 'relative', width: '100%', aspectRatio: '1/1', maxHeight: '130px' }}
              >
                {c.image_url ? (
                  <Image
                    src={c.image_url}
                    alt={c.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-108"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-brand-blue-50 text-brand-blue">
                    <Icon className="w-8 h-8 stroke-[1.5]" />
                  </div>
                )}
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="px-1 text-center">
                <span className="text-xs font-bold text-slate-800 group-hover:text-brand-blue transition-colors line-clamp-1">
                  {c.name}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
