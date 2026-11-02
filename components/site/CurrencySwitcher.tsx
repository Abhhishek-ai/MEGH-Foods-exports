'use client'

import React, { useEffect, useState } from 'react'

export function CurrencySwitcher() {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR')

  useEffect(() => {
    // Read from cookie or initialize via geo
    const match = document.cookie.match(/(?:^|;\s*)mf_currency=([^;]+)/)
    if (match) {
      setCurrency(match[1] as 'INR' | 'USD')
    } else {
      fetch('/api/geo')
        .then((r) => r.json())
        .then((data) => {
          if (data?.currency) {
            setCurrency(data.currency)
          }
        })
        .catch(() => undefined)
    }
  }, [])

  const handleChange = (newCur: 'INR' | 'USD') => {
    setCurrency(newCur)
    document.cookie = `mf_currency=${newCur}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
    window.dispatchEvent(new Event('currencyChange'))
  }

  return (
    <div className="inline-flex rounded-full bg-slate-100 p-0.5 border border-slate-200 text-xs">
      <button
        type="button"
        onClick={() => handleChange('INR')}
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
        onClick={() => handleChange('USD')}
        className={`px-2 py-0.5 rounded-full font-bold transition-all ${
          currency === 'USD'
            ? 'bg-brand-blue text-white shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        $ USD
      </button>
    </div>
  )
}
