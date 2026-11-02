'use client'

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface MarkdownFieldProps {
  value: string
  onChange: (val: string) => void
  label?: string
  placeholder?: string
}

export function MarkdownField({ value, onChange, label, placeholder }: MarkdownFieldProps) {
  const [tab, setTab] = useState<'write' | 'preview'>('write')

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {label && <label className="text-xs font-semibold text-slate-700">{label}</label>}
        <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-slate-100">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setTab('write')}
            className={`h-6 px-2.5 text-[11px] rounded ${
              tab === 'write' ? 'bg-white shadow-sm font-bold text-slate-900' : 'text-slate-600'
            }`}
          >
            Write
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setTab('preview')}
            className={`h-6 px-2.5 text-[11px] rounded ${
              tab === 'preview' ? 'bg-white shadow-sm font-bold text-slate-900' : 'text-slate-600'
            }`}
          >
            Preview
          </Button>
        </div>
      </div>

      {tab === 'write' ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Write product description with markdown (bullet points, bold, headings)...'}
          className="min-h-[140px] text-xs font-mono"
        />
      ) : (
        <div className="min-h-[140px] p-3 rounded-md border border-slate-200 bg-white text-xs text-slate-800 prose prose-slate max-w-none">
          {value.trim() ? (
            <ReactMarkdown>{value}</ReactMarkdown>
          ) : (
            <span className="text-slate-400 italic">No description written yet.</span>
          )}
        </div>
      )}
    </div>
  )
}
