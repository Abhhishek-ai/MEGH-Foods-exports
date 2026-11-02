'use client'

import React, { useState } from 'react'
import Link from 'next/link'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Inbox, Download, Search, Eye, Trash2, Mail, Phone, Building } from 'lucide-react'
import { updateInquiryStatus, deleteInquiry } from '@/app/admin/actions/inquiries'

export interface InquiryRow {
  id: string
  full_name: string
  email: string
  phone: string | null
  business_name: string | null
  country: string | null
  city: string | null
  import_license_status: string | null
  estimated_order_volume: string | null
  product_interest: string | null
  inquiry_type: 'retail' | 'b2b' | 'export'
  message: string | null
  status: 'new' | 'contacted' | 'closed'
  created_at: string
}

interface InquiriesManagerProps {
  initialInquiries: InquiryRow[]
}

export function InquiriesManager({ initialInquiries }: InquiriesManagerProps) {
  const router = useRouter()
  const [inquiries, setInquiries] = useState<InquiryRow[]>(initialInquiries)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // View modal state
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRow | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  // Delete modal state
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const filtered = inquiries.filter((inq) => {
    const matchSearch =
      inq.full_name.toLowerCase().includes(search.toLowerCase()) ||
      inq.email.toLowerCase().includes(search.toLowerCase()) ||
      (inq.business_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (inq.country || '').toLowerCase().includes(search.toLowerCase())

    const matchType = typeFilter === 'all' || inq.inquiry_type === typeFilter
    const matchStatus = statusFilter === 'all' || inq.status === statusFilter

    return matchSearch && matchType && matchStatus
  })

  const handleStatusChange = async (id: string, newStatus: 'new' | 'contacted' | 'closed') => {
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    )
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null))
    }
    await updateInquiryStatus(id, newStatus)
  }

  const confirmDelete = async () => {
    if (!deletingId) return
    setIsDeleting(true)
    const res = await deleteInquiry(deletingId)
    if (res.ok) {
      setInquiries((prev) => prev.filter((i) => i.id !== deletingId))
      setDeleteDialogOpen(false)
      setDeletingId(null)
      router.refresh()
    }
    setIsDeleting(false)
  }

  const getTypeBadge = (type: InquiryRow['inquiry_type']) => {
    switch (type) {
      case 'export':
        return <Badge className="bg-blue-100 text-brand-blue border-blue-200">Export FCL</Badge>
      case 'b2b':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">B2B Wholesale</Badge>
      case 'retail':
        return <Badge className="bg-slate-100 text-slate-800 border-slate-200">Retail</Badge>
    }
  }

  const getStatusBadge = (status: InquiryRow['status']) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300">New</Badge>
      case 'contacted':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Contacted</Badge>
      case 'closed':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">Closed</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {/* Search & Export Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads by name, email, company..."
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="w-36">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Types</option>
              <option value="export">Export FCL</option>
              <option value="b2b">B2B Wholesale</option>
              <option value="retail">Retail Support</option>
            </select>
          </div>

          <div className="w-36">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <Button asChild variant="outline" size="sm" className="h-9 text-xs flex items-center gap-1.5 border-slate-300">
          <Link href="/admin/inquiries/export">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Link>
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Contact / Company</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Volume Estimate</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                  <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  No inquiries found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((inq) => (
                <TableRow key={inq.id}>
                  <TableCell className="text-xs text-slate-500">
                    {new Date(inq.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-900">{inq.full_name}</div>
                    <div className="text-[11px] text-slate-500">
                      {inq.business_name ? `${inq.business_name} • ` : ''}
                      {inq.email}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-700">
                    {inq.country || 'N/A'}
                  </TableCell>
                  <TableCell>{getTypeBadge(inq.inquiry_type)}</TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {inq.estimated_order_volume || 'Not specified'}
                  </TableCell>
                  <TableCell className="text-center">
                    <Select
                      value={inq.status}
                      onValueChange={(val) =>
                        handleStatusChange(inq.id, val as 'new' | 'contacted' | 'closed')
                      }
                    >
                      <SelectTrigger className="h-7 w-28 text-xs mx-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedInquiry(inq)
                          setViewDialogOpen(true)
                        }}
                        className="h-8 w-8 p-0 text-slate-600 hover:text-brand-blue"
                        title="View Full Message"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDeletingId(inq.id)
                          setDeleteDialogOpen(true)
                        }}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Inquiry Detail View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Inquiry Details</span>
              {selectedInquiry && getTypeBadge(selectedInquiry.inquiry_type)}
            </DialogTitle>
            <DialogDescription>
              Received on{' '}
              {selectedInquiry &&
                new Date(selectedInquiry.created_at).toLocaleString('en-IN')}
            </DialogDescription>
          </DialogHeader>

          {selectedInquiry && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedInquiry.full_name}</span>
                  <div className="flex items-center gap-1 mt-1 text-slate-600">
                    <Mail className="w-3 h-3" /> {selectedInquiry.email}
                  </div>
                  {selectedInquiry.phone && (
                    <div className="flex items-center gap-1 mt-0.5 text-slate-600">
                      <Phone className="w-3 h-3" /> {selectedInquiry.phone}
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Company / Region</span>
                  <span className="font-semibold text-slate-900">
                    {selectedInquiry.business_name || 'Individual Inquiry'}
                  </span>
                  <div className="text-slate-600 mt-1">
                    {selectedInquiry.city ? `${selectedInquiry.city}, ` : ''}
                    {selectedInquiry.country || 'Global'}
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Import License: <strong>{selectedInquiry.import_license_status || 'N/A'}</strong>
                  </div>
                </div>
              </div>

              {selectedInquiry.estimated_order_volume && (
                <div>
                  <span className="font-bold text-slate-700">Estimated Order Volume:</span>{' '}
                  <span className="text-slate-900">{selectedInquiry.estimated_order_volume}</span>
                </div>
              )}

              {selectedInquiry.product_interest && (
                <div>
                  <span className="font-bold text-slate-700">Product Line Interest:</span>{' '}
                  <span className="text-slate-900">{selectedInquiry.product_interest}</span>
                </div>
              )}

              <div className="space-y-1">
                <span className="font-bold text-slate-700">Message / Quotation Request:</span>
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-slate-800 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {selectedInquiry.message || 'No additional message was provided.'}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-700">Update Status:</span>
                <Select
                  value={selectedInquiry.status}
                  onValueChange={(val) =>
                    handleStatusChange(
                      selectedInquiry.id,
                      val as 'new' | 'contacted' | 'closed'
                    )
                  }
                >
                  <SelectTrigger className="w-36 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Inquiry?</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this lead record? This action cannot be undone.
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
              {isDeleting ? 'Deleting...' : 'Delete Lead'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
