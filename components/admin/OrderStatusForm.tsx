'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateOrderStatus } from '@/app/admin/actions/orders'
import { Loader2, CheckCircle2, Truck } from 'lucide-react'

interface OrderStatusFormProps {
  orderId: string
  currentFulfillmentStatus: 'new' | 'packed' | 'shipped' | 'delivered' | 'cancelled'
  currentCourier: string | null
  currentTrackingNumber: string | null
}

export function OrderStatusForm({
  orderId,
  currentFulfillmentStatus,
  currentCourier,
  currentTrackingNumber,
}: OrderStatusFormProps) {
  const router = useRouter()
  const [fulfillmentStatus, setFulfillmentStatus] = useState(currentFulfillmentStatus)
  const [courier, setCourier] = useState(currentCourier || '')
  const [trackingNumber, setTrackingNumber] = useState(currentTrackingNumber || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)
    setSuccessMsg(false)

    const res = await updateOrderStatus({
      id: orderId,
      fulfillment_status: fulfillmentStatus,
      courier: courier || null,
      tracking_number: trackingNumber || null,
    })

    if (!res.ok) {
      setErrorMsg(res.error || 'Failed to update order status')
      setIsSubmitting(false)
      return
    }

    setIsSubmitting(false)
    setSuccessMsg(true)
    router.refresh()
    setTimeout(() => setSuccessMsg(false), 4000)
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-xl border border-slate-200 bg-white space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <Truck className="w-4 h-4 text-brand-blue" />
        <h3 className="text-sm font-bold text-slate-900">Update Fulfillment &amp; Courier Tracking</h3>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Fulfillment status updated successfully.</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Fulfillment Status</label>
          <Select
            value={fulfillmentStatus}
            onValueChange={(val) =>
              setFulfillmentStatus(
                val as 'new' | 'packed' | 'shipped' | 'delivered' | 'cancelled'
              )
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New / Awaiting Packing</SelectItem>
              <SelectItem value="packed">Packed &amp; Ready</SelectItem>
              <SelectItem value="shipped">Shipped (Dispatched)</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Courier / Carrier</label>
          <Input
            value={courier}
            onChange={(e) => setCourier(e.target.value)}
            placeholder="e.g. DHL Express, FedEx, Delhivery"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Airway Bill / Tracking No.</label>
          <Input
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="e.g. AWB123456789"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-brand-blue hover:bg-brand-blue-700 text-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Updating...
            </>
          ) : (
            'Save Fulfillment Details'
          )}
        </Button>
      </div>
    </form>
  )
}
