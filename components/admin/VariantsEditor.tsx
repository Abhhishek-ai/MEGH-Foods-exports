'use client'

import React from 'react'
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { type VariantInput } from '@/lib/validation/product'

interface VariantsEditorProps {
  variants: VariantInput[]
  onChange: (variants: VariantInput[]) => void
  productSku: string
}

export function VariantsEditor({ variants, onChange, productSku }: VariantsEditorProps) {
  const addVariant = () => {
    const nextOrder = variants.length
    const nextVariant: VariantInput = {
      label: nextOrder === 0 ? '2LBS' : `${nextOrder * 2}LBS`,
      weight_grams: 908,
      sku: `${productSku || 'SKU'}-${nextOrder + 1}`,
      price_inr: 0,
      price_usd: 0,
      sale_price_inr: null,
      sale_price_usd: null,
      stock_status: 'in_stock',
      is_bulk_only: false,
      sort_order: nextOrder,
    }
    onChange([...variants, nextVariant])
  }

  const updateVariant = (index: number, patch: Partial<VariantInput>) => {
    const updated = variants.map((v, i) => (i === index ? { ...v, ...patch } : v))
    onChange(updated)
  }

  const removeVariant = (index: number) => {
    if (variants.length <= 1) return
    const updated = variants.filter((_, i) => i !== index)
    onChange(updated)
  }

  const moveVariant = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= variants.length) return
    const updated = [...variants]
    const temp = updated[index]
    updated[index] = updated[target]
    updated[target] = temp
    // update sort_orders
    onChange(updated.map((v, i) => ({ ...v, sort_order: i })))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Pack Sizes &amp; Pricing</h4>
          <p className="text-xs text-slate-500">
            Each pack size (e.g. 500g, 2LBS, 25kg) has its own price, SKU, and availability.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={addVariant}
          className="bg-brand-blue hover:bg-brand-blue-700 text-white flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Pack Size
        </Button>
      </div>

      <div className="space-y-3">
        {variants.map((v, index) => (
          <div
            key={v.id || index}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-700">
                Pack Size #{index + 1} — {v.label || 'New Variant'}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={index === 0}
                  onClick={() => moveVariant(index, 'up')}
                  className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={index === variants.length - 1}
                  onClick={() => moveVariant(index, 'down')}
                  className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={variants.length <= 1}
                  onClick={() => removeVariant(index)}
                  className="h-7 w-7 p-0 text-red-500 hover:text-red-700 disabled:opacity-30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Label (e.g. 2LBS)</label>
                <Input
                  value={v.label}
                  placeholder="2LBS / 500g"
                  onChange={(e) => updateVariant(index, { label: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Weight (Grams)</label>
                <Input
                  type="number"
                  min="1"
                  value={v.weight_grams}
                  onChange={(e) => updateVariant(index, { weight_grams: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Pack SKU</label>
                <Input
                  value={v.sku}
                  placeholder="MF-FL-2LBS"
                  onChange={(e) => updateVariant(index, { sku: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Price (INR ₹)</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={v.price_inr}
                  onChange={(e) => updateVariant(index, { price_inr: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Sale Price (INR ₹)</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={v.sale_price_inr ?? ''}
                  placeholder="Optional"
                  onChange={(e) =>
                    updateVariant(index, {
                      sale_price_inr: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Price (USD $)</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={v.price_usd}
                  onChange={(e) => updateVariant(index, { price_usd: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Sale Price (USD $)</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={v.sale_price_usd ?? ''}
                  placeholder="Optional"
                  onChange={(e) =>
                    updateVariant(index, {
                      sale_price_usd: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Stock Status</label>
                <Select
                  value={v.stock_status}
                  onValueChange={(val) =>
                    updateVariant(index, {
                      stock_status: val as 'in_stock' | 'out_of_stock' | 'made_to_order',
                    })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    <SelectItem value="made_to_order">Made to Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 mt-5">
                <div>
                  <span className="text-xs font-semibold text-slate-800">Bulk Pack Only</span>
                  <p className="text-[10px] text-slate-500">Inquiry only, not purchasable online</p>
                </div>
                <Switch
                  checked={v.is_bulk_only}
                  onCheckedChange={(checked) => updateVariant(index, { is_bulk_only: checked })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
