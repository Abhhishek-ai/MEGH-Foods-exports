'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { submitInquiry } from '@/app/actions/inquiry'
import { Send, CheckCircle2, Loader2, Building } from 'lucide-react'

const DEFAULT_CATEGORIES = [
  'Traditional Flours',
  'Millet Flours',
  'Vrat Special Flours',
  'Sabudana & Poha',
  'Mamra & Puffed Grains',
  'Fryums & Namkeen',
  'Traditional Sugar & Jaggery',
  'Pooja Kits',
]

export function DistributorForm() {
  const [fullName, setFullName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [importLicense, setImportLicense] = useState('yes')
  const [volume, setVolume] = useState('20ft FCL Container')
  const [selectedLines, setSelectedLines] = useState<string[]>([
    'Traditional Flours',
    'Millet Flours',
  ])
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const toggleLine = (line: string) => {
    setSelectedLines((prev) =>
      prev.includes(line) ? prev.filter((l) => l !== line) : [...prev, line]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    const res = await submitInquiry({
      full_name: fullName,
      business_name: businessName,
      email,
      phone: phone || undefined,
      country,
      city: city || undefined,
      import_license_status: importLicense,
      estimated_order_volume: volume,
      product_interest: selectedLines.join(', '),
      inquiry_type: 'export',
      message: message || undefined,
      website: '', // honeypot
    })

    if (!res.ok) {
      setErrorMsg(res.error || 'Failed to submit trade inquiry.')
      setIsSubmitting(false)
      return
    }

    setIsSubmitting(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="p-8 sm:p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
        <h3 className="text-2xl font-black text-slate-900">Trade Inquiry Dispatched</h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Thank you, <strong>{fullName}</strong> ({businessName}). Our export management team will review your specifications and prepare a formal CIF/FOB quotation within 24 business hours.
        </p>
        <p className="text-xs text-slate-400">
          For urgent inquiries, feel free to reach our trade desk via WhatsApp.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6"
    >
      <div className="flex items-center gap-2 text-brand-blue pb-2 border-b border-slate-100">
        <Building className="w-5 h-5" />
        <h3 className="text-base font-bold text-slate-900">
          Official B2B &amp; Export Quotation Request
        </h3>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
          {errorMsg}
        </div>
      )}

      {/* Row 1: Company & Contact Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Company / Business Name *</label>
          <Input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. Continental Spice Importers LLC"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Primary Contact Name *</label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. John Doe"
            required
          />
        </div>
      </div>

      {/* Row 2: Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Business Email *</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="procurement@company.com"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Phone / WhatsApp Number *</label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555-019-2831"
            required
          />
        </div>
      </div>

      {/* Row 3: Destination Country & City */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Destination Country *</label>
          <Input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. United States, United Kingdom, UAE"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Discharge Port / City *</label>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Port of New York / Newark, Jebel Ali"
            required
          />
        </div>
      </div>

      {/* Row 4: License & Estimated Volume */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Import License Status</label>
          <Select value={importLicense} onValueChange={setImportLicense}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Licensed Food Importer (Active)</SelectItem>
              <SelectItem value="in_progress">License in Application</SelectItem>
              <SelectItem value="supermarket">Supermarket / Retail Chain Buyer</SelectItem>
              <SelectItem value="first_time">Exploring First Shipment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Target Shipment Volume</label>
          <Select value={volume} onValueChange={setVolume}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LCL (1-5 Pallets)">LCL Groupage (1 to 5 Pallets)</SelectItem>
              <SelectItem value="20ft FCL Container">20ft FCL Container (~18 MT)</SelectItem>
              <SelectItem value="40ft FCL Container">40ft FCL Container (~26 MT)</SelectItem>
              <SelectItem value="Multiple FCL / Annual Contract">Annual Contract (Multiple FCL)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Lines Interest Chips */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700">
          Product Lines of Interest (Select All That Apply):
        </label>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_CATEGORIES.map((cat) => {
            const active = selectedLines.includes(cat)
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleLine(cat)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  active
                    ? 'bg-brand-blue text-white border-brand-blue font-bold shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {active ? '✓ ' : ''}
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700">
          Specific Requirements / Incoterms Preferred
        </label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. Looking for CIF pricing to Felixstowe. Need private label custom packaging in 2LBS bags..."
          className="h-24 text-xs"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        size="lg"
        className="w-full bg-brand-blue hover:bg-brand-blue-700 text-white font-bold h-12 rounded-xl text-sm shadow-md flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Submitting Quotation Request...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" /> Submit Export Distributor Inquiry
          </>
        )}
      </Button>
    </form>
  )
}
