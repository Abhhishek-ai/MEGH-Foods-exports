import { NextResponse } from 'next/server'
import { z } from 'zod'
import Razorpay from 'razorpay'
import { createAdminClient } from '@/lib/supabase/admin'
import { CONFIG } from '@/lib/config'
import { currencyForCountry, unitPrice, round2, formatMoney } from '@/lib/pricing'

export const runtime = 'nodejs'

const bodySchema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.string().uuid(),
        quantity: z.number().int().min(1).max(50),
      })
    )
    .min(1, 'Cart is empty')
    .max(40, 'Exceeded maximum item lines'),
  customer: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
    email: z.string().trim().email('Invalid email address'),
    phone: z.string().trim().min(6, 'Phone is too short').max(25),
  }),
  shipping: z.object({
    line1: z.string().trim().min(3, 'Address line 1 is required').max(200),
    line2: z.string().trim().max(200).optional(),
    city: z.string().trim().min(2, 'City is required').max(100),
    state: z.string().trim().min(1, 'State / Province is required').max(100),
    postalCode: z.string().trim().min(3, 'Postal code is required').max(12),
    country: z.string().trim().length(2, 'Invalid ISO country code'),
  }),
  currency: z.enum(['INR', 'USD']).optional(),
  notes: z.string().max(500).optional(),
})

type VariantRow = {
  id: string
  label: string
  price_inr: number
  price_usd: number
  sale_price_inr: number | null
  sale_price_usd: number | null
  stock_status: string
  is_bulk_only: boolean
  product: {
    id: string
    title: string
    is_active: boolean
    is_b2b_only: boolean
  }
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => null)
  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please check the checkout form details.', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { items, customer, shipping, notes } = parsed.data
  const db = createAdminClient()
  const country = shipping.country.toUpperCase()
  const currency: 'INR' | 'USD' = parsed.data.currency || currencyForCountry(country)

  // Fetch variant records and join parent products
  const { data, error } = await db
    .from('product_variants')
    .select(
      'id,label,price_inr,price_usd,sale_price_inr,sale_price_usd,stock_status,is_bulk_only,product:products!inner(id,title,is_active,is_b2b_only)'
    )
    .in(
      'id',
      items.map((i) => i.variantId)
    )

  if (error || !data) {
    return NextResponse.json({ error: 'Could not load products for price calculation.' }, { status: 500 })
  }

  const variants = data as unknown as VariantRow[]
  const byId = new Map(variants.map((v) => [v.id, v]))

  let subtotal = 0
  const lines: { v: VariantRow; qty: number; unit: number }[] = []

  for (const it of items) {
    const v = byId.get(it.variantId)
    if (
      !v ||
      !v.product.is_active ||
      v.product.is_b2b_only ||
      v.is_bulk_only ||
      v.stock_status === 'out_of_stock'
    ) {
      return NextResponse.json(
        {
          error: `An item in your cart (${v?.product?.title || 'Unknown'}) is currently unavailable or requires a wholesale quotation.`,
          code: 'UNAVAILABLE',
        },
        { status: 409 }
      )
    }

    const unit = unitPrice(v, currency)
    subtotal += unit * it.quantity
    lines.push({ v, qty: it.quantity, unit })
  }

  subtotal = round2(subtotal)

  // Fraud / card limit safety check
  const maxLimit = currency === 'INR' ? CONFIG.maxOnlineOrderInr : CONFIG.maxOnlineOrderUsd
  if (subtotal > maxLimit) {
    return NextResponse.json(
      {
        error: `Order total exceeds the online checkout threshold (${formatMoney(
          maxLimit,
          currency
        )}). For large commercial or container shipments, please request a wholesale quote.`,
        code: 'REQUIRES_QUOTE',
      },
      { status: 422 }
    )
  }

  // Calculate Shipping based on country and shipping_zones
  const { data: zones } = await db.from('shipping_zones').select('*').eq('is_active', true)
  const zone =
    (zones ?? []).find((z) => (z.country_codes || []).includes(country)) ??
    (zones ?? []).find((z) => z.is_default)

  if (!zone) {
    return NextResponse.json(
      { error: 'We do not currently offer automated retail parcel delivery to this country. Please submit an export inquiry.' },
      { status: 422 }
    )
  }

  const freeAbove = currency === 'INR' ? zone.free_above_inr : zone.free_above_usd
  const rate = Number(currency === 'INR' ? zone.rate_inr : zone.rate_usd)
  const shippingAmount = freeAbove != null && subtotal >= Number(freeAbove) ? 0 : rate
  const total = round2(subtotal + shippingAmount)

  // Create Order in DB
  const { data: order, error: oErr } = await db
    .from('orders')
    .insert({
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      ship_line1: shipping.line1,
      ship_line2: shipping.line2 || null,
      ship_city: shipping.city,
      ship_state: shipping.state,
      ship_postal_code: shipping.postalCode,
      ship_country: country,
      currency,
      subtotal,
      shipping_amount: shippingAmount,
      total,
      customer_notes: notes || null,
    })
    .select('id, order_number, access_token')
    .single()

  if (oErr || !order) {
    return NextResponse.json({ error: 'Failed to create order record. Please try again.' }, { status: 500 })
  }

  // Create Snapshot Order Items
  const { error: iErr } = await db.from('order_items').insert(
    lines.map(({ v, qty, unit }) => ({
      order_id: order.id,
      product_id: v.product.id,
      variant_id: v.id,
      title_snapshot: v.product.title,
      variant_label: v.label,
      unit_price: unit,
      quantity: qty,
      line_total: round2(unit * qty),
    }))
  )

  if (iErr) {
    await db.from('orders').delete().eq('id', order.id)
    return NextResponse.json({ error: 'Failed to save order items.' }, { status: 500 })
  }

  // Create Razorpay Order
  try {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ''
    const keySecret = process.env.RAZORPAY_KEY_SECRET || ''

    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials missing from environment')
    }

    const rzp = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })

    const rOrder = await rzp.orders.create({
      amount: Math.round(total * 100), // amount in currency subunits (paise / cents)
      currency,
      receipt: order.order_number,
      notes: {
        order_number: order.order_number,
        destination_country: country,
      },
    })

    await db
      .from('orders')
      .update({ razorpay_order_id: rOrder.id })
      .eq('id', order.id)

    return NextResponse.json({
      orderNumber: order.order_number,
      accessToken: order.access_token,
      razorpayOrderId: rOrder.id,
      amount: rOrder.amount,
      currency,
      keyId,
    })
  } catch (err: unknown) {
    console.error('Razorpay gateway error:', err)
    await db
      .from('orders')
      .update({ payment_status: 'failed' })
      .eq('id', order.id)

    return NextResponse.json(
      { error: 'Payment gateway communication error. Please try again in a few moments.' },
      { status: 502 }
    )
  }
}
