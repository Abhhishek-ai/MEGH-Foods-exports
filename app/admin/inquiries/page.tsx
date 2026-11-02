import { getInquiries } from '@/lib/data/inquiries'
import { InquiriesManager, type InquiryRow } from '@/components/admin/InquiriesManager'

export const dynamic = 'force-dynamic'

export default async function AdminInquiriesPage() {
  const inquiries = (await getInquiries()) as InquiryRow[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Customer &amp; Export Inquiries
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review B2B wholesale leads, container quotation requests, and small parcel customer queries.
        </p>
      </div>

      <InquiriesManager initialInquiries={inquiries} />
    </div>
  )
}
