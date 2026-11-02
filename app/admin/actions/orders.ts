'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin-auth'
import { sendShippedEmail } from '@/lib/email'

const updateOrderSchema = z.object({
  id: z.string().uuid(),
  fulfillment_status: z.enum(['new', 'packed', 'shipped', 'delivered', 'cancelled']),
  courier: z.string().trim().max(100).nullable().optional(),
  tracking_number: z.string().trim().max(100).nullable().optional(),
})

export async function updateOrderStatus(input: unknown) {
  try {
    const supabase = await requireAdmin()
    const parsed = updateOrderSchema.safeParse(input)
    if (!parsed.success) {
      return { ok: false as const, error: 'Invalid order status inputs.' }
    }

    const { id, fulfillment_status, courier, tracking_number } = parsed.data

    const { data: currentOrder, error: fetchErr } = await supabase
      .from('orders')
      .select('fulfillment_status, tracking_number')
      .eq('id', id)
      .single()

    if (fetchErr || !currentOrder) {
      return { ok: false as const, error: 'Order not found.' }
    }

    const { error: updateErr } = await supabase
      .from('orders')
      .update({
        fulfillment_status,
        courier: courier || null,
        tracking_number: tracking_number || null,
      })
      .eq('id', id)

    if (updateErr) {
      return { ok: false as const, error: updateErr.message }
    }

    // When status changes to 'shipped' and tracking number is present, email the customer
    if (
      fulfillment_status === 'shipped' &&
      currentOrder.fulfillment_status !== 'shipped' &&
      tracking_number
    ) {
      await sendShippedEmail(id).catch(() => undefined)
    }

    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${id}`)
    return { ok: true as const }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update order'
    return { ok: false as const, error: message }
  }
}
