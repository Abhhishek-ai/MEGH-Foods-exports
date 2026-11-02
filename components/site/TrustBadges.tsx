import React from 'react'
import { ShieldCheck, Award, CheckCircle2, Globe, Sparkles } from 'lucide-react'
import { CONFIG } from '@/lib/config'

export function TrustBadges() {
  const activeCerts = (
    CONFIG.certifications as readonly { key: string; label: string; number: string }[]
  ).filter((c) => Boolean(c.number && c.number.trim()))

  return (
    <div className="py-8 bg-slate-50/70 border-y border-slate-200">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-blue-50 text-brand-blue flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">100% Quality Assured</h4>
              <p className="text-[11px] text-slate-500">Milled from origin grains</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-lime-100 text-brand-lime-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Vacuum Sealed</h4>
              <p className="text-[11px] text-slate-500">Aroma &amp; freshness locked</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Worldwide Delivery</h4>
              <p className="text-[11px] text-slate-500">Air courier &amp; Ocean FCL</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                {activeCerts.length > 0 ? activeCerts[0].label : 'Export Certified'}
              </h4>
              <p className="text-[11px] text-slate-500">
                {activeCerts.length > 0 ? activeCerts[0].number : 'FSSAI & APEDA Registered'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
