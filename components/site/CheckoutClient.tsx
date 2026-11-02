'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  ShoppingBag,
  Loader2,
  AlertCircle,
  Truck,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCart } from '@/lib/cart/store'
import { CONFIG } from '@/lib/config'
import { formatMoney, currencyForCountry, round2, type Currency } from '@/lib/pricing'
import { payWithRazorpay } from '@/lib/razorpay-client'
import { InquiryDialog } from '@/components/site/InquiryDialog'

const COUNTRIES = [
  { code: 'IN', name: 'India (Domestic)', currency: 'INR' },
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'CA', name: 'Canada', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom', currency: 'USD' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'USD' },
  { code: 'SA', name: 'Saudi Arabia', currency: 'USD' },
  { code: 'QA', name: 'Qatar', currency: 'USD' },
  { code: 'KW', name: 'Kuwait', currency: 'USD' },
  { code: 'OM', name: 'Oman', currency: 'USD' },
  { code: 'DE', name: 'Germany', currency: 'USD' },
  { code: 'FR', name: 'France', currency: 'USD' },
  { code: 'NL', name: 'Netherlands', currency: 'USD' },
  { code: 'AU', name: 'Australia', currency: 'USD' },
  { code: 'NZ', name: 'New Zealand', currency: 'USD' },
  { code: 'SG', name: 'Singapore', currency: 'USD' },
  { code: 'ZA', name: 'South Africa', currency: 'USD' },
  { code: 'KE', name: 'Kenya', currency: 'USD' },
]

interface ShippingZone {
  id: string
  name: string
  country_codes: string[]
  rate_inr: number
  rate_usd: number
  free_above_inr: number | null
  free_above_usd: number | null
  est_days: string | null
  is_default: boolean
}

interface CheckoutClientProps {
  shippingZones: ShippingZone[]
}

export function CheckoutClient({ shippingZones }: CheckoutClientProps) {
  const router = useRouter()
  const { lines, clear } = useCart()

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [line1, setLine1] = useState('')
  const [line2, setLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('IN')
  const [notes, setNotes] = useState('')

  // UI status
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [dismissMessage, setDismissMessage] = useState<string | null>(null)
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false)

  // Active currency state, synced with user preference cookie & header switcher
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('INR')

  useEffect(() => {
    const updateCurrency = () => {
      const match = document.cookie.match(/(?:^|;\s*)mf_currency=([^;]+)/)
      if (match && (match[1] === 'INR' || match[1] === 'USD')) {
        const cur = match[1] as Currency
        setSelectedCurrency(cur)
        setCountry((prev) => {
          if (cur === 'USD' && prev === 'IN') return 'US'
          if (cur === 'INR' && prev !== 'IN') return 'IN'
          return prev
        })
      }
    }

    updateCurrency()
    window.addEventListener('currencyChange', updateCurrency)
    return () => window.removeEventListener('currencyChange', updateCurrency)
  }, [])

  const handleCurrencySwitch = (newCur: Currency) => {
    setSelectedCurrency(newCur)
    document.cookie = `mf_currency=${newCur}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
    if (newCur === 'USD' && country === 'IN') {
      setCountry('US')
    } else if (newCur === 'INR' && country !== 'IN') {
      setCountry('IN')
    }
    window.dispatchEvent(new Event('currencyChange'))
  }

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry)
    const autoCur = currencyForCountry(newCountry)
    setSelectedCurrency(autoCur)
    document.cookie = `mf_currency=${autoCur}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
    window.dispatchEvent(new Event('currencyChange'))
  }

  const currency: Currency = selectedCurrency

  // Calculate items subtotal
  const subtotal = useMemo(() => {
    const raw = lines.reduce((acc, line) => {
      const price = currency === 'INR' ? line.priceInr : line.priceUsd
      return acc + price * line.quantity
    }, 0)
    return round2(raw)
  }, [lines, currency])

  // Resolve matching shipping zone
  const activeZone = useMemo(() => {
    return (
      shippingZones.find((z) => (z.country_codes || []).includes(country.toUpperCase())) ||
      shippingZones.find((z) => z.is_default) ||
      shippingZones[0]
    )
  }, [shippingZones, country])

  // Calculate live shipping rate
  const shippingAmount = useMemo(() => {
    if (!activeZone) return 0
    const freeThreshold =
      currency === 'INR' ? activeZone.free_above_inr : activeZone.free_above_usd
    if (freeThreshold != null && subtotal >= Number(freeThreshold)) {
      return 0
    }
    return Number(currency === 'INR' ? activeZone.rate_inr : activeZone.rate_usd)
  }, [activeZone, currency, subtotal])

  const total = round2(subtotal + shippingAmount)

  // Max online order threshold
  const maxLimit = currency === 'INR' ? CONFIG.maxOnlineOrderInr : CONFIG.maxOnlineOrderUsd
  const exceedsOnlineLimit = subtotal > maxLimit

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    if (lines.length === 0 || isProcessing) return

    setErrorMessage(null)
    setDismissMessage(null)
    setIsProcessing(true)

    try {
      // 1. Create order on server
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: lines.map((l) => ({
            variantId: l.variantId,
            quantity: l.quantity,
          })),
          customer: { name, email, phone },
          shipping: {
            line1,
            line2: line2 || undefined,
            city,
            state,
            postalCode,
            country,
          },
          currency,
          notes: notes || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.code === 'REQUIRES_QUOTE') {
          setInquiryModalOpen(true)
        }
        throw new Error(data.error || 'Failed to initialize order.')
      }

      // 2. Launch Razorpay Checkout Modal
      await payWithRazorpay({
        keyId: data.keyId,
        amount: data.amount,
        currency: data.currency,
        razorpayOrderId: data.razorpayOrderId,
        orderNumber: data.orderNumber,
        customer: { name, email, phone },
        onPaid: async (paymentResponse) => {
          try {
            // 3. Verify Payment Signature
            const verifyRes = await fetch('/api/checkout/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(paymentResponse),
            })

            const verifyData = await verifyRes.json()
            if (!verifyData.ok) {
              throw new Error('Payment verification failed.')
            }

            // 4. Clear cart & redirect to order confirmation
            clear()
            router.push(`/order/${data.orderNumber}?t=${data.accessToken}`)
          } catch (err: unknown) {
            setErrorMessage(
              'Payment received, but signature verification took longer than expected. Please check your order confirmation email or contact support.'
            )
            setIsProcessing(false)
          }
        },
        onDismiss: () => {
          setIsProcessing(false)
          setDismissMessage('Payment not completed — your cart and entered details are safely saved.')
        },
      })
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred during checkout.')
      setIsProcessing(false)
    }
  }

  if (lines.length === 0) {
    return (
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your cart is empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Add authentic Indian groceries to your cart before proceeding to checkout.
        </p>
        <div className="pt-2">
          <Button asChild className="bg-brand-blue text-white rounded-xl">
            <Link href="/products">Browse All Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="space-y-2 mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          Fast &amp; Secure Guest Checkout
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Complete Your Order
        </h1>
        <p className="text-xs text-slate-500">
          All orders are verified and packed hygienically at our facility in Ahmedabad, India.
        </p>
      </div>

      <form onSubmit={handlePay} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Form: Customer & Shipping Details */}
        <div className="lg:col-span-7 space-y-6">
          {errorMessage && (
            <div className="p-4 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {dismissMessage && (
            <div className="p-4 bg-amber-50 text-amber-800 text-xs rounded-xl border border-amber-200">
              {dismissMessage}
            </div>
          )}

          {/* Customer Information */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              1. Customer Information
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Full Name *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Priya Patel"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya@example.com"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Phone (with country code) *</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  required
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              2. Shipping Destination
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Destination Country *</label>
              <select
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.currency})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Street Address *</label>
              <Input
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                placeholder="Flat / House No., Building Name, Street"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Apartment / Suite (Optional)</label>
              <Input
                value={line2}
                onChange={(e) => setLine2(e.target.value)}
                placeholder="Apt 4B"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">City *</label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="London / New York"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">State / Province *</label>
                <Input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="NY / Greater London"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Postal / Zip Code *</label>
                <Input
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="10001"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Delivery Instructions (Optional)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special courier or gate instructions..."
                className="h-16 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Right Summary: Review & Payment Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                Order Summary ({lines.reduce((a, b) => a + b.quantity, 0)} items)
              </h2>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Billing:</span>
                <div className="inline-flex rounded-full bg-slate-100 p-0.5 border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => handleCurrencySwitch('INR')}
                    className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                      currency === 'INR'
                        ? 'bg-brand-blue text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    ₹ INR
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCurrencySwitch('USD')}
                    className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                      currency === 'USD'
                        ? 'bg-brand-blue text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    $ USD
                  </button>
                </div>
              </div>
            </div>

            {/* Line items thumbnail stack */}
            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
              {lines.map((line) => {
                const unit = currency === 'INR' ? line.priceInr : line.priceUsd
                return (
                  <div key={line.variantId} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-10 h-10 rounded-lg border bg-slate-50 overflow-hidden shrink-0">
                        {line.image ? (
                          <Image
                            src={line.image}
                            alt={line.title}
                            fill
                            sizes="40px"
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ShoppingBag className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 line-clamp-1">{line.title}</p>
                        <p className="text-[11px] text-slate-500">
                          {line.quantity} × {line.variantLabel}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">
                      {formatMoney(unit * line.quantity, currency)}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Pricing Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span className="font-bold text-slate-900">
                  {formatMoney(subtotal, currency)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-brand-blue" />
                  Shipping ({activeZone?.name || 'Standard'}):
                </span>
                <span className="font-bold text-slate-900">
                  {shippingAmount === 0 ? (
                    <span className="text-emerald-600 uppercase font-black text-[11px]">
                      FREE
                    </span>
                  ) : (
                    formatMoney(shippingAmount, currency)
                  )}
                </span>
              </div>

              {activeZone?.est_days && (
                <div className="text-[11px] text-slate-500">
                  Estimated transit: <strong>{activeZone.est_days}</strong>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900">Grand Total:</span>
                <span className="text-2xl font-black text-brand-blue">
                  {formatMoney(total, currency)}
                </span>
              </div>
            </div>

            {/* Exceeds online limit banner */}
            {exceedsOnlineLimit ? (
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-2 text-center">
                <p className="text-xs font-bold text-purple-900">
                  Commercial Order Threshold Exceeded
                </p>
                <p className="text-[11px] text-purple-700 leading-relaxed">
                  Orders over {formatMoney(maxLimit, currency)} must be processed via our export quotation and wire transfer desk to protect against cross-border card limits.
                </p>
                <Button
                  type="button"
                  onClick={() => setInquiryModalOpen(true)}
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white text-xs h-9"
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Request Wholesale Quotation
                </Button>
              </div>
            ) : (
              <Button
                type="submit"
                disabled={isProcessing}
                size="lg"
                className="w-full bg-brand-blue hover:bg-brand-blue-700 text-white font-black h-14 rounded-xl text-base shadow-lg flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Connecting to Gateway...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-brand-lime" />
                    Pay {formatMoney(total, currency)} Securely
                  </>
                )}
              </Button>
            )}

            <div className="pt-2 text-center space-y-1.5">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-Bit Encrypted Razorpay Checkout</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Supports Indian UPI, NetBanking, Debit cards &amp; International Visa/Mastercard/Amex.
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* Inquiry Dialog for high volume limit */}
      <InquiryDialog
        open={inquiryModalOpen}
        onOpenChange={setInquiryModalOpen}
        productTitle="High Volume Export Cart"
      />
    </div>
  )
}
