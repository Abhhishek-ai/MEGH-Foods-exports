'use client'

import React from 'react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { SIZE_BUCKETS, type Filters } from '@/lib/catalog/filter'
import { RotateCcw, Filter } from 'lucide-react'

interface FilterPanelProps {
  filters: Filters
  categories: { id: string; name: string; slug: string }[]
  availableDietaryTags: string[]
  onChange: (filters: Filters) => void
  onReset: () => void
}

export function FilterPanel({
  filters,
  categories,
  availableDietaryTags,
  onChange,
  onReset,
}: FilterPanelProps) {
  const toggleCategory = (slug: string) => {
    const next = filters.categories.includes(slug)
      ? filters.categories.filter((c) => c !== slug)
      : [...filters.categories, slug]
    onChange({ ...filters, categories: next })
  }

  const toggleDiet = (dietTag: string) => {
    const next = filters.diet.includes(dietTag)
      ? filters.diet.filter((d) => d !== dietTag)
      : [...filters.diet, dietTag]
    onChange({ ...filters, diet: next })
  }

  const toggleSize = (size: string) => {
    const next = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size]
    onChange({ ...filters, sizes: next })
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.diet.length > 0 ||
    filters.sizes.length > 0 ||
    filters.inStockOnly ||
    Boolean(filters.q.trim())

  return (
    <div className="space-y-6">
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-blue" />
          <h3 className="text-sm font-bold text-slate-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] font-semibold text-brand-blue hover:underline"
          >
            <RotateCcw className="w-3 h-3" /> Reset All
          </button>
        )}
      </div>

      {/* In-stock Only switch */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
        <span className="text-xs font-semibold text-slate-800">In Stock Only</span>
        <Switch
          checked={filters.inStockOnly}
          onCheckedChange={(val) => onChange({ ...filters, inStockOnly: val })}
        />
      </div>

      {/* Categories */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Categories ({categories.length})
        </h4>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {categories.map((c) => {
            const checked = filters.categories.includes(c.slug)
            return (
              <label
                key={c.id}
                className="flex items-center gap-2 text-xs text-slate-700 hover:text-brand-blue cursor-pointer py-0.5"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCategory(c.slug)}
                  className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                />
                <span className={checked ? 'font-bold text-slate-900' : ''}>{c.name}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Dietary Tags */}
      {availableDietaryTags.length > 0 && (
        <div className="space-y-2.5 pt-2 border-t border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Dietary Preferences
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {availableDietaryTags.map((tag) => {
              const active = filters.diet.includes(tag)
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleDiet(tag)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                    active
                      ? 'bg-brand-blue text-white border-brand-blue font-bold shadow-sm'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Pack Size Buckets */}
      <div className="space-y-2.5 pt-2 border-t border-slate-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Pack Sizes
        </h4>
        <div className="space-y-1.5">
          {SIZE_BUCKETS.map((bucket) => {
            const checked = filters.sizes.includes(bucket)
            return (
              <label
                key={bucket}
                className="flex items-center gap-2 text-xs text-slate-700 hover:text-brand-blue cursor-pointer py-0.5"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleSize(bucket)}
                  className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                />
                <span className={checked ? 'font-bold text-slate-900' : ''}>{bucket}</span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}
