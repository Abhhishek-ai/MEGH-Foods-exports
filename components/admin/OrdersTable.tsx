'use client'

import React, { useState } from 'react'
import Link from 'next/link'
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
import { ShoppingBag, Eye, Search, ExternalLink } from 'lucide-react'
import { formatMoney } from '@/lib/pricing'

export interface OrderRow {
  id: string
  order_number: string
  access_token: string
  customer_name: string
  customer_email: string
  ship_country: string
  currency: 'INR' | 'USD'
  total: number
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  fulfillment_status: 'new' | 'packed' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
}

interface OrdersTableProps {
  orders: OrderRow[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(search.toLowerCase()) ||
      o.ship_country.toLowerCase().includes(search.toLowerCase())

    const matchStatus =
      statusFilter === 'all' ||
      o.payment_status === statusFilter ||
      o.fulfillment_status === statusFilter

    return matchSearch && matchStatus
  })

  const getPaymentBadge = (status: OrderRow['payment_status']) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">Paid</Badge>
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Pending</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      case 'refunded':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-300">Refunded</Badge>
    }
  }

  const getFulfillmentBadge = (status: OrderRow['fulfillment_status']) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">Delivered</Badge>
      case 'shipped':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Shipped</Badge>
      case 'packed':
        return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300">Packed</Badge>
      case 'new':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300">New Order</Badge>
      case 'cancelled':
        return <Badge className="bg-slate-100 text-slate-800 border-slate-300">Cancelled</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, customer name, email..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Orders ({orders.length})</option>
            <option value="paid">Paid</option>
            <option value="pending">Payment Pending</option>
            <option value="new">Fulfillment: New</option>
            <option value="shipped">Fulfillment: Shipped</option>
            <option value="delivered">Fulfillment: Delivered</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-center">Payment</TableHead>
              <TableHead className="text-center">Fulfillment</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-slate-500">
                  <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  No matching orders found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono font-bold text-brand-blue">
                    {o.order_number}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {new Date(o.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-slate-900">{o.customer_name}</div>
                    <div className="text-[11px] text-slate-500">{o.customer_email}</div>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-700">
                    {o.ship_country}
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">
                    {formatMoney(Number(o.total), o.currency)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getPaymentBadge(o.payment_status)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getFulfillmentBadge(o.fulfillment_status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm" className="h-8 text-xs text-brand-blue">
                      <Link href={`/admin/orders/${o.id}`} className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        Manage
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
