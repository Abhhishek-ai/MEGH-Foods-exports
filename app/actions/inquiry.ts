'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createInquiry } from '@/lib/data/inquiries'
import { sendInquiryAlert } from '@/lib/email'

const inquirySchema = z.object({
  full_name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z.string().trim().max(30).optional(),
  business_name: z.string().trim().max(160).optional(),
  country: z.string().trim().max(80).optional(),
  city: z.string().trim().max(80).optional(),
  import_license_status: z.string().max(40).optional(),
  estimated_order_volume: z.string().max(80).optional(),
  product_interest: z.string().max(400).optional(),
  inquiry_type: z.enum(['retail', 'b2b', 'export']).default('retail'),
  message: z.string().trim().max(2000).optional(),
  product_id: z.string().uuid().optional(),
  website: z.string().max(0, 'Spam detected').optional(), // honeypot field
})

export async function submitInquiry(input: unknown) {
  try {
    const parsed = inquirySchema.safeParse(input)
    if (!parsed.success) {
      return { ok: false as const, error: 'Please check the form fields and try again.' }
    }

    const { website: _hp, ...row } = parsed.data
    const result = await createInquiry(row)

    if (!result.ok) {
      return {
        ok: false as const,
        error: 'Could not send your inquiry. Please contact us via WhatsApp instead.',
      }
    }

    // Attempt to dispatch owner email alert
    await sendInquiryAlert(row).catch(() => undefined)

    // Revalidate admin pages so new inquiry immediately appears in admin dashboard
    revalidatePath('/admin/inquiries')
    revalidatePath('/admin')

    return { ok: true as const }
  } catch {
    return {
      ok: false as const,
      error: 'An unexpected error occurred. Please contact us via WhatsApp.',
    }
  }
}
