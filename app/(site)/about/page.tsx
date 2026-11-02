import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'About Us | Megh Foods — Rooted in India, Loved Worldwide',
  description:
    'Learn about Megh Overseas Pvt. Ltd., Ahmedabad — our milling heritage, hygienic processing, export standards, and commitment to uncompromised quality.',
}

export default function AboutPage() {
  return (
    <div className="space-y-16 py-12 md:py-16">
      {/* Top Hero Section with Photo */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-blue bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-brand-lime-600" />
              Our Heritage &amp; Commitment
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Rooted in India, <br />
              <span className="text-brand-blue">Loved Worldwide.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Megh Foods is the premier international grocery brand of **Megh Overseas Pvt. Ltd.**, based in Ahmedabad, Gujarat, India. Our founding mission is to preserve the authentic culinary heritage of India and deliver it with unyielding quality to tables and supermarket aisles across the globe.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Button asChild className="bg-brand-blue hover:bg-brand-blue-700 text-white rounded-xl font-bold">
                <Link href="/products">Explore Catalogue</Link>
              </Button>
              <Button asChild variant="outline" className="border-slate-300 rounded-xl font-semibold">
                <Link href="/wholesale-export">Wholesale Inquiries</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div
              className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200"
              style={{ position: 'relative', height: '320px', width: '100%' }}
            >
              <Image
                src="/images/hero/hero-bread.jpg"
                alt="Traditional Indian stone milling and golden grains"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-lime">
                  Ahmedabad, Gujarat, India
                </p>
                <p className="text-lg font-bold">
                  Sourcing Indigenous Grains Directly from Farmer Collectives
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Excellence with Rich Photos */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
            Uncompromised Quality
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            How We Ensure Export Excellence
          </h2>
          <p className="text-xs text-slate-500">
            Every batch meets rigorous phytosanitary standards for hassle-free worldwide delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm flex flex-col justify-between">
            <div
              className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100"
              style={{ position: 'relative', height: '180px', width: '100%' }}
            >
              <Image
                src="/images/features/milling.jpg"
                alt="Traditional Taste & Milling"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="p-6 sm:p-8 space-y-3">
              <h3 className="text-xl font-bold text-slate-900">Traditional Taste &amp; Milling</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                From coarse singhare ka atta and rajgira to stone-ground whole wheat, poha, and authentic Gujarati mamra, every product is sourced directly from certified agrarian cooperatives and milled following time-honored slow grinding practices to safeguard natural wheatgerm oils and vital nutrients.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm flex flex-col justify-between">
            <div
              className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100"
              style={{ position: 'relative', height: '180px', width: '100%' }}
            >
              <Image
                src="/images/features/packaging.jpg"
                alt="Hygienic Vacuum Packaging"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="p-6 sm:p-8 space-y-3">
              <h3 className="text-xl font-bold text-slate-900">Hygienic Vacuum Packaging</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Long-distance ocean transport demands extraordinary barrier packaging. We employ multi-layer food-grade barrier films, nitrogen flushing, and automated vacuum sealing to prevent moisture ingress, oxidation, and pest infestation throughout 20-30 day ocean voyages.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm flex flex-col justify-between">
            <div
              className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100"
              style={{ position: 'relative', height: '180px', width: '100%' }}
            >
              <Image
                src="/images/features/compliance.jpg"
                alt="Laboratory Testing & Certification"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="p-6 sm:p-8 space-y-3">
              <h3 className="text-xl font-bold text-slate-900">Certified Food Safety Standards</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Registered with APEDA and FSSAI. Batches are regularly tested by accredited laboratories for moisture levels, micro-biological safety, aflatoxins, and pesticide residues to strictly comply with FDA, EFSA, and GCC import authorities.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm flex flex-col justify-between">
            <div
              className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100"
              style={{ position: 'relative', height: '180px', width: '100%' }}
            >
              <Image
                src="/images/features/logistics.jpg"
                alt="Global Ocean & Air Freight"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="p-6 sm:p-8 space-y-3">
              <h3 className="text-xl font-bold text-slate-900">Direct Port Connectivity</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our strategic facility in Ahmedabad provides rapid feeder transit to India&apos;s two largest container ports: Mundra and JNPT (Nhava Sheva). We accommodate full container loads (FCL), consolidated pallet cargo (LCL), and door-to-door retail air shipments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="bg-brand-blue text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-black">
            Experience Authentic Indian Groceries Anywhere in the World
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Order consumer pouches for direct home delivery or contact our trade desk for wholesale container shipments.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Button asChild className="bg-brand-lime text-slate-950 hover:bg-brand-lime-600 font-bold rounded-xl px-6">
              <Link href="/products">Shop Retail Products</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-xl font-bold">
              <Link href="/wholesale-export">Request Wholesale Quote</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
