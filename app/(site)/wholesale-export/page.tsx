import Image from 'next/image'
import {
  Globe2,
  Building2,
  PackageCheck,
  ShieldCheck,
  Clock,
  Award,
  Truck,
  CheckCircle,
} from 'lucide-react'
import { DistributorForm } from '@/components/site/DistributorForm'

export const revalidate = 3600

export const metadata = {
  title: 'Wholesale & Export Supply | Megh Overseas Pvt. Ltd.',
  description:
    'Direct container load (FCL/LCL) supply of Indian flours, snacks, jaggery, and groceries from Ahmedabad. Certified exporter with private label capabilities.',
}

export default function WholesaleExportPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16">
      {/* Top Hero: Clean Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
        <div className="lg:col-span-7 space-y-4">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-lime bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
            Megh Overseas Pvt. Ltd. • International Trade Division
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Global B2B Grocery Export &amp; Container Supply
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            From Ahmedabad, Gujarat to distributor warehouses across North America, Europe, the Middle East, and Africa. We supply supermarket chains and ethnic distributors with premium, lab-certified Indian groceries.
          </p>
        </div>

        <div className="lg:col-span-5 flex justify-center">
          <div
            className="w-full max-w-md rounded-2xl overflow-hidden shadow-lg border border-slate-700/60 bg-slate-800"
            style={{ position: 'relative', height: '220px', width: '100%' }}
          >
            <Image
              src="/images/wholesale/hero-container.jpg"
              alt="International Ocean Port & Container Cargo"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 420px"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Core Advantages with Compact Bounded Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-sm space-y-4">
          <div
            className="w-full rounded-2xl overflow-hidden bg-slate-100"
            style={{ position: 'relative', height: '160px', width: '100%' }}
          >
            <Image
              src="/images/wholesale/customs-compliance.jpg"
              alt="Customs & Export Compliance"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-brand-blue" />
              <h3 className="text-base font-bold text-slate-900">Export Compliance</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Registered with APEDA and FSSAI. Comprehensive documentation including Phytosanitary Certificates, Certificate of Origin, and export fumigation seals for seamless port clearance.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-sm space-y-4">
          <div
            className="w-full rounded-2xl overflow-hidden bg-slate-100"
            style={{ position: 'relative', height: '160px', width: '100%' }}
          >
            <Image
              src="/images/wholesale/packaging.jpg"
              alt="Private Label Packaging"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-brand-lime-700" />
              <h3 className="text-base font-bold text-slate-900">Private Label &amp; OEM Packaging</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Contract packaging in customer-branded standup pouches (500g, 2LBS, 4LBS, 8LBS) or institutional woven polypropylene bags (25kg, 50kg) with custom multi-language barcoding.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-sm space-y-4">
          <div
            className="w-full rounded-2xl overflow-hidden bg-slate-100"
            style={{ position: 'relative', height: '160px', width: '100%' }}
          >
            <Image
              src="/images/wholesale/port-logistics.jpg"
              alt="Efficient Western Port Logistics"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-blue" />
              <h3 className="text-base font-bold text-slate-900">Western Port Logistics</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Factory situated in Ahmedabad with rapid direct transit to Mundra and Nhava Sheva (JNPT) container terminals, ensuring reduced demurrage risks and rapid vessel cut-offs.
            </p>
          </div>
        </div>
      </div>

      {/* 4-Step Export Workflow */}
      <section className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
            Streamlined Sourcing
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            How International Trade Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-brand-blue text-white font-bold text-sm flex items-center justify-center mx-auto sm:mx-0 shadow">
              1
            </div>
            <h4 className="text-sm font-bold text-slate-900">Quotation Request</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Submit your desired product lines, volume estimates, and destination discharge port.
            </p>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-brand-blue text-white font-bold text-sm flex items-center justify-center mx-auto sm:mx-0 shadow">
              2
            </div>
            <h4 className="text-sm font-bold text-slate-900">Sampling &amp; Specification</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              We dispatch courier product samples and formal lab certificates of analysis for buyer review.
            </p>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-brand-blue text-white font-bold text-sm flex items-center justify-center mx-auto sm:mx-0 shadow">
              3
            </div>
            <h4 className="text-sm font-bold text-slate-900">Contract &amp; Production</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Confirmation of Proforma Invoice, Incoterms (FOB/CIF), private label artwork approval, and packaging.
            </p>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-brand-blue text-white font-bold text-sm flex items-center justify-center mx-auto sm:mx-0 shadow">
              4
            </div>
            <h4 className="text-sm font-bold text-slate-900">Fumigation &amp; Dispatch</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Container stuffing, official export inspection, fumigation certification, and vessel onboarding.
            </p>
          </div>
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
              Commercial Trade Desk
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Request Wholesale Quotation
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Fill out this form to connect directly with our international sales directors in Ahmedabad. Inquiries receive commercial CIF/FOB pricing and lead-time schedules within 24 business hours.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-brand-blue-50/50 border border-brand-blue-100 space-y-4 text-xs text-slate-700">
            <h4 className="font-bold text-slate-900 text-sm">Trade Desk Guarantee:</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dedicated international account manager</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Complimentary courier sample kits for qualified buyers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Flexible Incoterms: EXW, FOB Mundra, CIF Major Ports</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Letter of Credit (L/C) &amp; TT payment terms supported</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200/90 shadow-md">
          <DistributorForm />
        </div>
      </section>
    </div>
  )
}
