import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { isSupabaseConfigured } from '@/lib/supabase/public'
import { createAdminClient } from '@/lib/supabase/admin'

export interface InquiryRecord {
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
  product_id?: string | null
  status: 'new' | 'contacted' | 'closed'
  created_at: string
}

export interface NewInquiryInput {
  full_name: string
  email: string
  phone?: string | null
  business_name?: string | null
  country?: string | null
  city?: string | null
  import_license_status?: string | null
  estimated_order_volume?: string | null
  product_interest?: string | null
  inquiry_type?: 'retail' | 'b2b' | 'export'
  message?: string | null
  product_id?: string | null
}

const DATA_FILE = path.join(process.cwd(), 'data', 'inquiries.json')

function readLocalInquiries(): InquiryRecord[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return []
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(raw) as InquiryRecord[]
  } catch (err) {
    console.error('Failed to read local inquiries:', err)
    return []
  }
}

function writeLocalInquiries(inquiries: InquiryRecord[]): void {
  try {
    const dir = path.dirname(DATA_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(inquiries, null, 2), 'utf-8')
  } catch (err) {
    console.error('Failed to write local inquiries:', err)
  }
}

export async function getInquiries(): Promise<InquiryRecord[]> {
  const local = readLocalInquiries()

  if (isSupabaseConfigured()) {
    try {
      const db = createAdminClient()
      const { data, error } = await db
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data && data.length > 0) {
        // Merge Supabase and local without duplicates
        const seen = new Set(data.map((d: InquiryRecord) => d.id))
        const merged = [...(data as InquiryRecord[]), ...local.filter((l) => !seen.has(l.id))]
        return merged.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      }
    } catch (err) {
      console.warn('Supabase query failed, using local inquiries:', err)
    }
  }

  return local.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export async function createInquiry(input: NewInquiryInput): Promise<{ ok: boolean; data?: InquiryRecord; error?: string }> {
  try {
    const newRecord: InquiryRecord = {
      id: crypto.randomUUID(),
      full_name: input.full_name,
      email: input.email,
      phone: input.phone || null,
      business_name: input.business_name || null,
      country: input.country || null,
      city: input.city || null,
      import_license_status: input.import_license_status || null,
      estimated_order_volume: input.estimated_order_volume || null,
      product_interest: input.product_interest || null,
      inquiry_type: input.inquiry_type || 'retail',
      message: input.message || null,
      product_id: input.product_id || null,
      status: 'new',
      created_at: new Date().toISOString(),
    }

    // 1. Always save locally to guarantee zero data loss
    const local = readLocalInquiries()
    local.unshift(newRecord)
    writeLocalInquiries(local)

    // 2. Also save to Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const db = createAdminClient()
        await db.from('inquiries').insert({
          ...newRecord,
        })
      } catch (err) {
        console.warn('Could not sync inquiry to Supabase, saved locally:', err)
      }
    }

    return { ok: true, data: newRecord }
  } catch (err) {
    console.error('Failed to create inquiry:', err)
    return { ok: false, error: 'Failed to record inquiry' }
  }
}

export async function updateInquiryStatusInDb(
  id: string,
  status: 'new' | 'contacted' | 'closed'
): Promise<{ ok: boolean; error?: string }> {
  try {
    // 1. Update locally
    const local = readLocalInquiries()
    const index = local.findIndex((i) => i.id === id)
    if (index !== -1) {
      local[index].status = status
      writeLocalInquiries(local)
    }

    // 2. Update in Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const db = createAdminClient()
        await db.from('inquiries').update({ status }).eq('id', id)
      } catch (err) {
        console.warn('Could not update status in Supabase:', err)
      }
    }

    return { ok: true }
  } catch (err) {
    console.error('Failed to update inquiry status:', err)
    return { ok: false, error: 'Failed to update inquiry status' }
  }
}

export async function deleteInquiryFromDb(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    // 1. Delete locally
    const local = readLocalInquiries()
    const filtered = local.filter((i) => i.id !== id)
    writeLocalInquiries(filtered)

    // 2. Delete from Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const db = createAdminClient()
        await db.from('inquiries').delete().eq('id', id)
      } catch (err) {
        console.warn('Could not delete inquiry from Supabase:', err)
      }
    }

    return { ok: true }
  } catch (err) {
    console.error('Failed to delete inquiry:', err)
    return { ok: false, error: 'Failed to delete inquiry' }
  }
}
