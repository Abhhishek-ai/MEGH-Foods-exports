import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { markOrderPaid } from '@/lib/orders'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const raw = await req.text() // Must be raw text for HMAC verification
    const sig = req.headers.get('x-razorpay-signature') ?? ''
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET ?? ''

    if (!secret) {
      console.error('RAZORPAY_WEBHOOK_SECRET missing in environment')
      return NextResponse.json({ error: 'Webhook unconfigured' }, { status: 500 })
    }

    const expected = crypto
      .createHmac('sha256', secret)
      .update(raw)
      .digest('hex')

    const a = Buffer.from(sig)
    const b = Buffer.from(expected)

    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
    }

    const event = JSON.parse(raw)
    const db = createAdminClient()

    switch (event.event) {
      case 'order.paid': {
        const order = event.payload.order?.entity
        const payment = event.payload.payment?.entity
        if (order?.id && payment?.id) {
          await markOrderPaid(db, order.id, payment.id)
        }
        break
      }
      case 'payment.failed': {
        const p = event.payload.payment?.entity
        if (p?.order_id) {
          await db
            .from('orders')
            .update({ payment_status: 'failed' })
            .eq('razorpay_order_id', p.order_id)
            .eq('payment_status', 'pending')
        }
        break
      }
      case 'refund.processed': {
        const r = event.payload.refund?.entity
        if (r?.payment_id) {
          await db
            .from('orders')
            .update({ payment_status: 'refunded' })
            .eq('razorpay_payment_id', r.payment_id)
        }
        break
      }
      default:
        // Other events ignored safely
        break
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    console.error('Webhook processing exception:', err)
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 })
  }
}
