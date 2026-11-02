import React from 'react'

interface PackPillsProps {
  variants: Array<{ id?: string; label: string }>
  maxVisible?: number
}

export function PackPills({ variants, maxVisible = 4 }: PackPillsProps) {
  if (!variants || variants.length === 0) return null

  const visible = variants.slice(0, maxVisible)
  const remainder = variants.length - maxVisible

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map((v, i) => (
        <span
          key={v.id || i}
          className="inline-block text-[10px] font-bold tracking-tight px-1.5 py-0.5 rounded bg-brand-lime-100 text-brand-lime-700 border border-brand-lime-600/30"
        >
          {v.label}
        </span>
      ))}
      {remainder > 0 && (
        <span className="text-[10px] font-medium text-slate-500">
          +{remainder} more
        </span>
      )}
    </div>
  )
}
