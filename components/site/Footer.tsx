import Link from "next/link"
import { CONFIG } from "@/lib/config"

export function Footer() {
  return (
    <footer className="border-t bg-slate-50 text-slate-700">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <span className="text-xl font-black tracking-tight text-brand-blue">
              MEGH <span className="text-brand-lime-600 font-bold">FOODS</span>
            </span>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Brand of Megh Overseas Pvt. Ltd. Exporters of premium traditional Indian groceries, flours, millet, and ethnic food specialties from Ahmedabad, Gujarat, India to homes and distributors across the globe.
            </p>
            <p className="text-xs text-brand-blue font-semibold">
              Rooted in India, Loved Worldwide.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Categories</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="/products?category=flours" className="hover:text-brand-blue">Traditional Flours</Link></li>
              <li><Link href="/products?category=millet-flours" className="hover:text-brand-blue">Millet Flours &amp; Vrat</Link></li>
              <li><Link href="/products?category=sabudana" className="hover:text-brand-blue">Sabudana &amp; Poha</Link></li>
              <li><Link href="/products?category=fryums" className="hover:text-brand-blue">Fryums &amp; Namkeen</Link></li>
              <li><Link href="/products?category=jaggery" className="hover:text-brand-blue">Jaggery &amp; Traditional Sugar</Link></li>
              <li><Link href="/products?category=pooja-kit" className="hover:text-brand-blue">Pooja Kits</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">B2B &amp; Export</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="/wholesale-export" className="hover:text-brand-blue">Distributor Inquiries</Link></li>
              <li><Link href="/wholesale-export" className="hover:text-brand-blue">Private Label Packaging</Link></li>
              <li><Link href="/wholesale-export" className="hover:text-brand-blue">Container Load Supply</Link></li>
              <li><Link href="/about" className="hover:text-brand-blue">Export Quality Standards</Link></li>
              <li><Link href="/contact" className="hover:text-brand-blue">Contact Trade Desk</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Policy &amp; Compliance</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="/shipping-returns" className="hover:text-brand-blue">Shipping &amp; Delivery</Link></li>
              <li><Link href="/shipping-returns" className="hover:text-brand-blue">Cancellations &amp; Refunds</Link></li>
              <li><Link href="/privacy" className="hover:text-brand-blue">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-blue">Terms &amp; Conditions</Link></li>
              <li><Link href="/admin/login" className="hover:text-brand-blue text-slate-400">Owner Portal</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Megh Overseas Pvt. Ltd. All rights reserved.</p>
          <p>Headquartered in Ahmedabad, Gujarat, India. Registered Exporter.</p>
        </div>
      </div>
    </footer>
  )
}
