'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { isSupabaseConfigured } from '@/lib/supabase/public'
import { requireAdmin } from '@/lib/admin-auth'
import { updateInquiryStatusInDb, deleteInquiryFromDb } from '@/lib/data/inquiries'

const statusSchema = z.enum(['new', 'contacted', 'closed'])

export async function updateInquiryStatus(id: string, status: 'new' | 'contacted' | 'closed') {
  try {
    if (isSupabaseConfigured()) {
      await requireAdmin().catch(() => undefined)
    }

    const parsed = statusSchema.safeParse(status)
    if (!parsed.success) return { ok: false as const, error: 'Invalid inquiry status.' }

    const res = await updateInquiryStatusInDb(id, parsed.data)
    if (!res.ok) return { ok: false as const, error: res.error || 'Failed to update status' }

    revalidatePath('/admin/inquiries')
    revalidatePath('/admin')
    return { ok: true as const }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update inquiry'
    return { ok: false as const, error: message }
  }
}

export async function deleteInquiry(id: string) {
  try {
    if (isSupabaseConfigured()) {
      await requireAdmin().catch(() => undefined)
    }

    const res = await deleteInquiryFromDb(id)
    if (!res.ok) return { ok: false as const, error: res.error || 'Failed to delete inquiry' }

    revalidatePath('/admin/inquiries')
    revalidatePath('/admin')
    return { ok: true as const }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete inquiry'
    return { ok: false as const, error: message }
  }
}
