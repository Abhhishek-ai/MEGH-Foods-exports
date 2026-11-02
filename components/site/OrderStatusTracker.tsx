'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Clock, AlertCircle, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface OrderStatusTrackerProps {
  initialPaymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  fulfillmentStatus: 'new' | 'packed' | 'shipped' | 'delivered' | 'cancelled'
  orderNumber: string
  accessToken: string
}

export function OrderStatusTracker({
  initialPaymentStatus,
  fulfillmentStatus,
  orderNumber,
  accessToken,
}: OrderStatusTrackerProps) {
  const router = useRouter()
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus)
  const [pollCount, setPollCount] = useState(0)

  useEffect(() => {
    if (paymentStatus === 'paid' || paymentStatus === 'failed' || pollCount >= 8) {
      return
    }

    const timer = setTimeout(async () => {
      try {
        router.refresh()
        setPollCount((c) => c + 1)
      } catch {
        // Fallback
      }
    }, 4000)

    return () => clearTimeout(timer)
  }, [paymentStatus, pollCount, router])

  const getPaymentDisplay = () => {
    switch (paymentStatus) {
      case 'paid':
        return (
          <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="font-bold text-xs">Payment Confirmed &amp; Captured</p>
              <p className="text-[11px] text-emerald-600">Your order has been queued for warehouse packing in Ahmedabad.</p>
            </div>
          </div>
        )
      case 'pending':
        return (
          <div className="flex items-center gap-2 text-amber-800 bg-amber-50 px-4 py-2.5 rounded-xl border border-amber-200">
            <RefreshCw className="w-5 h-5 text-amber-600 animate-spin" />
            <div>
              <p className="font-bold text-xs">Confirming Payment with Gateway...</p>
              <p className="text-[11px] text-amber-600">Waiting for Razorpay webhook confirmation (polling automatically).</p>
            </div>
          </div>
        )
      case 'failed':
        return (
          <div className="flex items-center gap-2 text-red-700 bg-red-50 px-4 py-2.5 rounded-xl border border-red-200">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-bold text-xs">Payment Incomplete or Failed</p>
              <p className="text-[11px] text-red-600">The gateway reported a payment failure. Please retry or contact support.</p>
            </div>
          </div>
        )
      case 'refunded':
        return (
          <div className="flex items-center gap-2 text-purple-700 bg-purple-50 px-4 py-2.5 rounded-xl border border-purple-200">
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
            <div>
              <p className="font-bold text-xs">Order Refund Processed</p>
              <p className="text-[11px] text-purple-600">Refund credited back to original source account.</p>
            </div>
          </div>
        )
    }
  }

  const getFulfillmentDisplay = () => {
    switch (fulfillmentStatus) {
      case 'delivered':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">Delivered</Badge>
      case 'shipped':
        return <Badge className="bg-blue-100 text-brand-blue border-blue-300">Shipped / In Transit</Badge>
      case 'packed':
        return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300">Packed &amp; Awaiting Courier</Badge>
      case 'new':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Processing in Warehouse</Badge>
      case 'cancelled':
        return <Badge className="bg-slate-100 text-slate-800 border-slate-300">Order Cancelled</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {getPaymentDisplay()}

      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
        <span className="font-semibold text-slate-700">Fulfillment Status:</span>
        {getFulfillmentDisplay()}
      </div>
    </div>
  )
}
