'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Truck, Plus, Edit2, Trash2, Loader2, Globe } from 'lucide-react'
import {
  saveShippingZone,
  toggleShippingZoneActive,
  deleteShippingZone,
} from '@/app/admin/actions/shipping'
import { formatMoney } from '@/lib/pricing'

export interface ShippingZoneRow {
  id: string
  name: string
  country_codes: string[]
  rate_inr: number
  rate_usd: number
  free_above_inr: number | null
  free_above_usd: number | null
  est_days: string | null
  is_default: boolean
  is_active: boolean
}

interface ShippingManagerProps {
  initialZones: ShippingZoneRow[]
}

export function ShippingManager({ initialZones }: ShippingManagerProps) {
  const router = useRouter()
  const [zones, setZones] = useState<ShippingZoneRow[]>(initialZones)

  // Edit / Add Dialog State
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingZone, setEditingZone] = useState<Partial<ShippingZoneRow> | null>(null)
  const [countryCodesInput, setCountryCodesInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Delete State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggle = async (id: string, nextActive: boolean) => {
    setZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, is_active: nextActive } : z))
    )
    const res = await toggleShippingZoneActive(id, nextActive)
    if (!res.ok) {
      setZones((prev) =>
        prev.map((z) => (z.id === id ? { ...z, is_active: !nextActive } : z))
      )
      alert(res.error)
    }
  }

  const handleOpenEdit = (zone?: ShippingZoneRow) => {
    setFormError(null)
    if (zone) {
      setEditingZone(zone)
      setCountryCodesInput((zone.country_codes || []).join(', '))
    } else {
      setEditingZone({
        name: '',
        country_codes: [],
        rate_inr: 99,
        rate_usd: 25,
        free_above_inr: null,
        free_above_usd: null,
        est_days: '5-10 business days',
        is_default: false,
        is_active: true,
      })
      setCountryCodesInput('')
    }
    setDialogOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingZone?.name) return

    setIsSubmitting(true)
    setFormError(null)

    const codes = countryCodesInput
      .split(',')
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean)

    const payload = {
      ...editingZone,
      country_codes: codes,
    }

    const res = await saveShippingZone(payload)
    if (!res.ok) {
      setFormError(res.error || 'Failed to save shipping zone')
      setIsSubmitting(false)
      return
    }

    setIsSubmitting(false)
    setDialogOpen(false)
    router.refresh()
  }

  const confirmDelete = async () => {
    if (!deletingId) return
    setIsDeleting(true)
    const res = await deleteShippingZone(deletingId)
    if (res.ok) {
      setZones((prev) => prev.filter((z) => z.id !== deletingId))
      setDeleteDialogOpen(false)
      setDeletingId(null)
      router.refresh()
    } else {
      alert(res.error)
    }
    setIsDeleting(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800">
            Regional Shipping Rates &amp; Delivery Rules
          </h2>
          <p className="text-xs text-slate-500">
            Rates applied dynamically during cart checkout based on recipient country.
          </p>
        </div>

        <Button
          onClick={() => handleOpenEdit()}
          className="bg-brand-blue hover:bg-brand-blue-700 text-white flex items-center gap-1.5 h-9 text-xs"
        >
          <Plus className="w-4 h-4" />
          Add Shipping Zone
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Zone Name</TableHead>
              <TableHead>Countries (ISO-2)</TableHead>
              <TableHead>INR Rate</TableHead>
              <TableHead>USD Rate</TableHead>
              <TableHead>Free Shipping Above</TableHead>
              <TableHead>Estimated Transit</TableHead>
              <TableHead className="text-center">Default (Fallback)</TableHead>
              <TableHead className="text-center">Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {zones.map((z) => (
              <TableRow key={z.id}>
                <TableCell className="font-bold text-slate-900">
                  {z.name}
                </TableCell>
                <TableCell>
                  <div className="max-w-xs truncate text-xs text-slate-600 font-mono">
                    {z.country_codes.length > 0
                      ? z.country_codes.join(', ')
                      : 'None (Matches All via Fallback)'}
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-slate-800">
                  {formatMoney(Number(z.rate_inr), 'INR')}
                </TableCell>
                <TableCell className="font-semibold text-slate-800">
                  {formatMoney(Number(z.rate_usd), 'USD')}
                </TableCell>
                <TableCell className="text-xs text-slate-600">
                  {z.free_above_inr ? `₹${z.free_above_inr}` : '—'} /{' '}
                  {z.free_above_usd ? `$${z.free_above_usd}` : '—'}
                </TableCell>
                <TableCell className="text-xs text-slate-600">{z.est_days || '—'}</TableCell>
                <TableCell className="text-center">
                  {z.is_default ? (
                    <Badge variant="blue" className="text-[10px]">
                      Default
                    </Badge>
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={z.is_active}
                    onCheckedChange={(val) => handleToggle(z.id, val)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEdit(z)}
                      className="h-8 w-8 p-0 text-slate-600 hover:text-brand-blue"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={z.is_default}
                      onClick={() => {
                        setDeletingId(z.id)
                        setDeleteDialogOpen(true)
                      }}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 disabled:opacity-30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit / Add Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingZone?.id ? 'Edit Shipping Zone' : 'Create Shipping Zone'}
            </DialogTitle>
            <DialogDescription>
              Configure international and domestic shipping tiers, rates, and free shipping conditions.
            </DialogDescription>
          </DialogHeader>

          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg">
              {formError}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Zone Name *</label>
              <Input
                value={editingZone?.name || ''}
                placeholder="e.g. European Union &amp; UK"
                onChange={(e) =>
                  setEditingZone((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Country Codes (comma-separated ISO-3166 alpha-2)
              </label>
              <Input
                value={countryCodesInput}
                placeholder="e.g. US, CA, GB, DE, FR"
                onChange={(e) => setCountryCodesInput(e.target.value)}
              />
              <p className="text-[10px] text-slate-400">
                Leave empty if this is the default fallback zone (&quot;Rest of World&quot;).
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Shipping Rate (INR ₹)</label>
                <Input
                  type="number"
                  min="0"
                  value={editingZone?.rate_inr ?? 0}
                  onChange={(e) =>
                    setEditingZone((prev) => ({
                      ...prev,
                      rate_inr: parseFloat(e.target.value) || 0,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Shipping Rate (USD $)</label>
                <Input
                  type="number"
                  min="0"
                  value={editingZone?.rate_usd ?? 0}
                  onChange={(e) =>
                    setEditingZone((prev) => ({
                      ...prev,
                      rate_usd: parseFloat(e.target.value) || 0,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Free Above (INR ₹)</label>
                <Input
                  type="number"
                  min="0"
                  value={editingZone?.free_above_inr ?? ''}
                  placeholder="e.g. 999"
                  onChange={(e) =>
                    setEditingZone((prev) => ({
                      ...prev,
                      free_above_inr: e.target.value ? parseFloat(e.target.value) : null,
                    }))
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Free Above (USD $)</label>
                <Input
                  type="number"
                  min="0"
                  value={editingZone?.free_above_usd ?? ''}
                  placeholder="e.g. 150"
                  onChange={(e) =>
                    setEditingZone((prev) => ({
                      ...prev,
                      free_above_usd: e.target.value ? parseFloat(e.target.value) : null,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Estimated Transit Time</label>
              <Input
                value={editingZone?.est_days || ''}
                placeholder="e.g. 10-18 business days"
                onChange={(e) =>
                  setEditingZone((prev) => ({ ...prev, est_days: e.target.value }))
                }
              />
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-semibold text-slate-800">
                    Default Fallback Zone
                  </span>
                  <p className="text-[10px] text-slate-500">
                    Applies to any destination country not explicitly covered by other active zones.
                  </p>
                </div>
                <Switch
                  checked={editingZone?.is_default ?? false}
                  onCheckedChange={(checked) =>
                    setEditingZone((prev) => ({ ...prev, is_default: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-800">Active / Live</span>
                <Switch
                  checked={editingZone?.is_active ?? true}
                  onCheckedChange={(checked) =>
                    setEditingZone((prev) => ({ ...prev, is_active: checked }))
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand-blue hover:bg-brand-blue-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Saving...
                  </>
                ) : (
                  'Save Shipping Zone'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Shipping Zone?</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this shipping zone? Customers from these countries will fall back to the default zone rate.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Zone'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
