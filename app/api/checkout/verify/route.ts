import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { markOrderPaid } from '@/lib/orders'

export const runtime = 'nodejs'

const verifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
})

function safeEqual(a: string, b: string): boolean {
  try {
    const x = Buffer.from(a)
    const y = Buffer.from(b)
    return x.length === y.length && crypto.timingSafeEqual(x, y)
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => null)
  const parsed = verifySchema.safeParse(json)

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid verification payload' }, { status: 400 })
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data
  const secret = process.env.RAZORPAY_KEY_SECRET || ''

  if (!secret) {
    return NextResponse.json({ ok: false, error: 'Payment gateway configuration missing' }, { status: 500 })
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (!safeEqual(expectedSignature, razorpay_signature)) {
    return NextResponse.json({ ok: false, error: 'Payment signature mismatch' }, { status: 400 })
  }

  const db = createAdminClient()
  await markOrderPaid(db, razorpay_order_id, razorpay_payment_id)

  return NextResponse.json({ ok: true })
}
