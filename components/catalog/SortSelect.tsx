'use client'

import React from 'react'
import { type SortKey } from '@/lib/catalog/filter'

interface SortSelectProps {
  value: SortKey
  onChange: (val: SortKey) => void
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Sort By:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="h-10 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
      >
        <option value="featured">Featured / Curated</option>
        <option value="newest">Newest Additions</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name">Alphabetical (A - Z)</option>
      </select>
    </div>
  )
}
