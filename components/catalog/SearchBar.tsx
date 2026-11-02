'use client'

import React from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Search by product name, dietary tag, ingredient...'}
        className="pl-10 pr-9 h-10 rounded-xl border-slate-200 text-xs bg-white shadow-sm focus:border-brand-blue"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
