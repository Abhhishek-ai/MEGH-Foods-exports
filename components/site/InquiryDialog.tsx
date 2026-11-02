'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { submitInquiry } from '@/app/actions/inquiry'
import { CheckCircle2, Loader2, Send, Globe } from 'lucide-react'

interface InquiryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId?: string
  productTitle?: string
}

export function InquiryDialog({
  open,
  onOpenChange,
  productId,
  productTitle,
}: InquiryDialogProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [importLicense, setImportLicense] = useState('yes')
  const [volume, setVolume] = useState('1 to 5 Metric Tons')
  const [message, setMessage] = useState(
    productTitle
      ? `Hello Megh Foods trade team, I am interested in container/wholesale pricing for: ${productTitle}.`
      : 'Hello Megh Foods, please share your export catalogue and wholesale CIF pricing.'
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    const res = await submitInquiry({
      full_name: fullName,
      email,
      phone: phone || undefined,
      business_name: businessName || undefined,
      country: country || undefined,
      city: city || undefined,
      import_license_status: importLicense,
      estimated_order_volume: volume,
      product_interest: productTitle || 'General Grocery Export',
      inquiry_type: 'b2b',
      message,
      product_id: productId || undefined,
      website: '', // honeypot
    })

    if (!res.ok) {
      setErrorMsg(res.error || 'Failed to submit inquiry. Please try again.')
      setIsSubmitting(false)
      return
    }

    setIsSubmitting(false)
    setSuccess(true)
  }

  const handleReset = () => {
    setSuccess(false)
    setErrorMsg(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-brand-blue mb-1">
            <Globe className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              B2B Wholesale &amp; Export Desk
            </span>
          </div>
          <DialogTitle className="text-xl font-black text-slate-900">
            {productTitle ? `Inquire for ${productTitle}` : 'Wholesale Export Quotation'}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Direct container supply, private label packing, and CIF quotes from Ahmedabad.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Inquiry Dispatched!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Thank you, {fullName}. Our international trade desk will review your requirements and respond with formal FOB/CIF pricing within 24 business hours.
            </p>
            <div className="pt-4">
              <Button onClick={handleReset} className="bg-brand-blue text-white">
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Full Name *</label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Business Email *</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@distributor.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Phone / WhatsApp</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Company / Supermarket</label>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Global Foods LLC"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Destination Country *</label>
                <Input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. United States, United Kingdom, UAE"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">City / Port of Discharge</label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. New York / Jebel Ali"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Import License Status</label>
                <Select value={importLicense} onValueChange={setImportLicense}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Licensed Importer (Active)</SelectItem>
                    <SelectItem value="in_progress">License in Progress</SelectItem>
                    <SelectItem value="retailer">Retail Store / Buying Group</SelectItem>
                    <SelectItem value="none">First-time Importer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Estimated Order Volume</label>
                <Select value={volume} onValueChange={setVolume}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LCL (1-5 Pallets)">LCL (1 to 5 Pallets)</SelectItem>
                    <SelectItem value="1 to 5 Metric Tons">1 to 5 Metric Tons</SelectItem>
                    <SelectItem value="20ft FCL Container">20ft FCL Container (~18 MT)</SelectItem>
                    <SelectItem value="40ft FCL Container">40ft FCL Container (~26 MT)</SelectItem>
                    <SelectItem value="Recurring Annual Contract">Recurring Annual Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Message / Requirements</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mention desired pack sizes, CIF port name, private label requirements..."
                className="h-20 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand-blue hover:bg-brand-blue-700 text-white min-w-[130px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 mr-1.5" /> Request Quotation
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
