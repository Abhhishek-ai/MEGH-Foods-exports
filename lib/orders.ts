import 'server-only'
import type { SupabaseClient } from '@supabase/supabase-js'
import { sendOrderEmails } from '@/lib/email'

export async function markOrderPaid(
  db: SupabaseClient,
  razorpayOrderId: string,
  razorpayPaymentId: string
) {
  const { data } = await db
    .from('orders')
    .update({
      payment_status: 'paid',
      razorpay_payment_id: razorpayPaymentId,
      paid_at: new Date().toISOString(),
    })
    .eq('razorpay_order_id', razorpayOrderId)
    .neq('payment_status', 'paid')
    .select('id')
    .maybeSingle()

  if (data) {
    // Only the first call that actually changes the record to 'paid' triggers the emails
    await sendOrderEmails(data.id).catch(() => undefined)
  }

  return Boolean(data)
}
