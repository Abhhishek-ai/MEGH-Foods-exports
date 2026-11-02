import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Globe2,
  Package,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Plane,
  Ship,
  Award,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getFeaturedProducts } from '@/lib/data/products'
import { getCategories } from '@/lib/data/categories'
import { ProductCard } from '@/components/site/ProductCard'
import { CategoryGrid } from '@/components/site/CategoryGrid'
import { TrustBadges } from '@/components/site/TrustBadges'
import { JsonLd } from '@/components/site/JsonLd'
import { organizationLd } from '@/lib/seo'

export const revalidate = 3600

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
  ])

  return (
    <div className="space-y-16 pb-16">
      <JsonLd data={organizationLd()} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white py-14 md:py-20 border-b border-slate-100">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue-50 border border-brand-blue-100 text-brand-blue text-xs font-bold">
                <Sparkles className="w-4 h-4 text-brand-lime-600" />
                <span>Ahmedabad, India • Certified Foodstuff Exporter</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
                Rooted in India,{' '}
                <span className="text-brand-blue">Loved Worldwide.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Traditional flours, fasting &amp; millet specialties, sabudana, poha, namkeen, and authentic groceries from Gujarat, India. Delivered to your doorstep worldwide in consumer parcels or shipped by full container load (FCL).
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
                <Button
                  asChild
                  size="lg"
                  className="bg-brand-blue hover:bg-brand-blue-700 text-white font-bold h-12 px-8 rounded-xl shadow-md text-sm"
                >
                  <Link href="/products" className="flex items-center gap-2">
                    Shop Products <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 px-6 rounded-xl border-slate-300 text-slate-800 font-bold hover:bg-slate-50 text-sm"
                >
                  <Link href="/wholesale-export">
                    Distributor Inquiries
                  </Link>
                </Button>
              </div>

              {/* Quick trust metrics */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 pt-3 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Vacuum-Sealed
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> APEDA &amp; FSSAI Licensed
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Doorstep Global Delivery
                </span>
              </div>
            </div>

            {/* Right Product Showcase: Rich Visual Card */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-lg">
                {/* Decorative background glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-brand-blue/20 to-brand-lime/20 rounded-3xl blur-2xl opacity-60 -z-10" />

                <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden">
                  {/* Hero Image Container */}
                  <div
                    className="relative aspect-[16/11] w-full overflow-hidden bg-slate-100"
                    style={{ position: 'relative', width: '100%', height: '280px' }}
                  >
                    <Image
                      src="/images/hero/hero-bread.jpg"
                      alt="Traditional Indian stone-ground flours and grains by Megh Foods"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />

                    {/* Gradient Overlay for badges */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-black/20 to-transparent" />

                    {/* Top Tag */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md flex items-center gap-2 border border-slate-100 text-xs font-bold text-slate-900">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      Direct from Ahmedabad
                    </div>

                    {/* Top Right Tag */}
                    <div className="absolute top-4 right-4 bg-brand-lime text-slate-950 px-3 py-1.5 rounded-full shadow-md text-xs font-black">
                      Export Quality
                    </div>

                    {/* Bottom Caption on Image */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-extrabold text-lg sm:text-xl drop-shadow-sm">
                        Authentic Traditional Milling &amp; Fasting Staples
                      </h3>
                      <p className="text-xs text-slate-200 drop-shadow-sm line-clamp-1">
                        Rajgira, Singhara, Sharbati Wheat, Sabudana, Poha, Fryums &amp; Jaggery
                      </p>
                    </div>
                  </div>

                  {/* Highlights Bar */}
                  <div className="p-4 sm:p-5 bg-white grid grid-cols-2 gap-3 divide-x divide-slate-100 text-xs">
                    <div className="pl-2 space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                        Retail Grocery Parcels
                      </span>
                      <p className="font-extrabold text-slate-900 text-sm">
                        2LBS • 4LBS • 8LBS
                      </p>
                      <p className="text-[11px] text-slate-500">Shipped with international tracking</p>
                    </div>

                    <div className="pl-4 space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                        Wholesale Container Load
                      </span>
                      <p className="font-extrabold text-brand-blue text-sm">
                        25kg Bags • FCL / LCL
                      </p>
                      <p className="text-[11px] text-slate-500">Phytosanitary certified export</p>
                    </div>
                  </div>
                </div>

                {/* Floating Bottom Card */}
                <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue-50 text-brand-blue flex items-center justify-center shrink-0">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Serving 25+ Countries</p>
                    <p className="text-[10px] text-slate-500">USA, EU, UK, GCC &amp; Africa</p>
                  </div>
                </div>

                {/* Floating Right Card */}
                <div className="absolute -top-4 -right-3 sm:-right-5 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-xl px-3 py-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">FSSAI &amp; APEDA Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Strip */}
      <TrustBadges />

      {/* Category Grid Section */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6">
        <CategoryGrid categories={categories} />
      </section>

      {/* Featured / Bestseller Products */}
      {featuredProducts.length > 0 && (
        <section className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Popular Export Selections
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
                Featured Products
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1"
            >
              <span>Browse entire catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Export Markets Strip */}
      <section className="bg-slate-900 text-white py-14">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-lime">
              Global Supply Reach
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Exporting Across 5 Continents
            </h2>
            <p className="text-xs text-slate-400">
              Reliable air parcel couriers and ocean container logistics directly from Western India.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <Globe2 className="w-6 h-6 text-brand-lime mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white">United States &amp; Canada</h4>
              <p className="text-[11px] text-slate-400 mt-1">10–18 Days Door-to-Door</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <Plane className="w-6 h-6 text-brand-lime mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white">UK &amp; European Union</h4>
              <p className="text-[11px] text-slate-400 mt-1">Phytosanitary Compliant</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <Ship className="w-6 h-6 text-brand-lime mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white">Middle East &amp; GCC</h4>
              <p className="text-[11px] text-slate-400 mt-1">7–12 Business Days</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <Package className="w-6 h-6 text-brand-lime mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white">Africa</h4>
              <p className="text-[11px] text-slate-400 mt-1">Direct Port Shipments</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 col-span-2 sm:col-span-1">
              <Building2 className="w-6 h-6 text-brand-lime mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white">India Domestic</h4>
              <p className="text-[11px] text-slate-400 mt-1">3–6 Days Express Air</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Heritage Story: Rich Visual Grid */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-brand-blue-50/40 rounded-3xl p-8 sm:p-12 border border-brand-blue-100">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-blue bg-white px-3 py-1 rounded-full border border-brand-blue-100">
              The Megh Quality Standard
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Honoring India&apos;s Culinary Traditions with Uncompromising Quality
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Based in Ahmedabad, Gujarat, Megh Overseas Pvt. Ltd. was built with a clear purpose: to bridge the diaspora and global food lovers with pure, unadulterated traditional Indian foodstuffs.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              We oversee every step—from selecting indigenous millet and fasting grains like singhara and rajgira directly from agrarian cooperatives, to stone milling under climate-controlled conditions and vacuum sealing each pouch to ensure zero oxidation.
            </p>
            <div className="pt-2">
              <Button asChild variant="outline" className="rounded-xl border-slate-300 font-semibold text-xs">
                <Link href="/about">Read Our Full Story &rarr;</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1 */}
            <div className="group rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div
                className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100"
                style={{ position: 'relative', height: '140px', width: '100%' }}
              >
                <Image
                  src="/images/features/milling.jpg"
                  alt="Slow Stone-Ground Milling"
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 space-y-1">
                <h3 className="text-sm font-bold text-slate-900">100% Traditional Milling</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Slow stone-ground milling preserves natural oils, fibers, and authentic aroma.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div
                className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100"
                style={{ position: 'relative', height: '140px', width: '100%' }}
              >
                <Image
                  src="/images/features/packaging.jpg"
                  alt="Vacuum Seal Barrier Packaging"
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Vacuum Seal Barrier</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Multi-layer food-grade packaging locks moisture out during long ocean journeys.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div
                className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100"
                style={{ position: 'relative', height: '140px', width: '100%' }}
              >
                <Image
                  src="/images/features/compliance.jpg"
                  alt="Certified Export Testing"
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Lab Tested Compliance</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Regular testing for moisture, aflatoxins, and purity exceeding export norms.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="group rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div
                className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100"
                style={{ position: 'relative', height: '140px', width: '100%' }}
              >
                <Image
                  src="/images/features/logistics.jpg"
                  alt="Container Freight & Logistics"
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Global Port Logistics</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Rapid transit to Mundra &amp; Nhava Sheva terminals for seamless international cut-offs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wholesale CTA Banner */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-3xl p-8 sm:p-14 text-white shadow-xl bg-gradient-to-br from-brand-blue via-brand-blue to-blue-900 border border-brand-blue-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-lime">
                B2B Container Load Supply
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                Are You an International Supermarket or Grocery Distributor?
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                Partner with Megh Overseas Pvt. Ltd. for reliable pallet and container shipments (FCL/LCL), competitive export FOB/CIF rates, and private label packaging options.
              </p>
            </div>

            <Button
              asChild
              size="lg"
              className="bg-brand-lime text-slate-950 hover:bg-brand-lime-600 font-black px-8 py-3 rounded-xl shadow-lg shrink-0 text-sm"
            >
              <Link href="/wholesale-export" className="flex items-center gap-2">
                Request Export Quotation <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
