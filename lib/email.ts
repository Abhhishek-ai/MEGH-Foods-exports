import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/admin'
import { CONFIG } from '@/lib/config'
import { formatMoney } from '@/lib/pricing'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM_EMAIL = process.env.EMAIL_FROM || 'Megh Foods <orders@meghfoods.com>'
const OWNER_EMAIL = process.env.OWNER_NOTIFY_EMAIL || 'owner@meghfoods.com'

export async function sendOrderEmails(orderId: string) {
  if (!resend) return

  try {
    const db = createAdminClient()
    const { data: order, error } = await db
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', orderId)
      .single()

    if (error || !order) return

    const currency = order.currency as 'INR' | 'USD'
    const itemsHtml = (order.items || [])
      .map(
        (it: { title_snapshot: string; variant_label: string; quantity: number; line_total: number }) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">
            <strong>${it.title_snapshot}</strong> (${it.variant_label})
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">${it.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">${formatMoney(Number(it.line_total), currency)}</td>
        </tr>
      `
      )
      .join('')

    const customerHtml = `
      <div style="font-family: Montserrat, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <div style="background-color: #1B4FD8; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">MEGH FOODS</h1>
          <p style="color: #9CCB3B; margin: 4px 0 0; font-size: 14px; font-weight: 600;">Rooted in India, Loved Worldwide.</p>
        </div>
        <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; background: #ffffff;">
          <h2 style="color: #0f172a; font-size: 18px;">Thank You for Your Order!</h2>
          <p>Hi ${order.customer_name},</p>
          <p>Your payment has been received and your order <strong>${order.order_number}</strong> is being processed at our Ahmedabad facility.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
            <thead>
              <tr style="background-color: #f8fafc;">
                <th style="padding: 8px; text-align: left; border-bottom: 2px solid #cbd5e1;">Item</th>
                <th style="padding: 8px; text-align: center; border-bottom: 2px solid #cbd5e1;">Qty</th>
                <th style="padding: 8px; text-align: right; border-bottom: 2px solid #cbd5e1;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Subtotal:</td>
                <td style="padding: 8px; text-align: right;">${formatMoney(Number(order.subtotal), currency)}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Shipping:</td>
                <td style="padding: 8px; text-align: right;">${formatMoney(Number(order.shipping_amount), currency)}</td>
              </tr>
              <tr style="font-size: 16px; font-weight: bold; color: #1B4FD8;">
                <td colspan="2" style="padding: 8px; text-align: right;">Grand Total:</td>
                <td style="padding: 8px; text-align: right;">${formatMoney(Number(order.total), currency)}</td>
              </tr>
            </tfoot>
          </table>

          <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; margin-top: 16px; font-size: 13px;">
            <strong>Shipping To:</strong><br />
            ${order.customer_name}<br />
            ${order.ship_line1}${order.ship_line2 ? `, ${order.ship_line2}` : ''}<br />
            ${order.ship_city}, ${order.ship_state} ${order.ship_postal_code}<br />
            ${order.ship_country}
          </div>

          <p style="margin-top: 24px; font-size: 12px; color: #64748b;">
            Track your order anytime: <a href="${CONFIG.siteUrl}/order/${order.order_number}?t=${order.access_token}" style="color: #1B4FD8;">View Order Status</a>
          </p>
        </div>
      </div>
    `

    const ownerHtml = `
      <div style="font-family: sans-serif; color: #1e293b; padding: 20px;">
        <h2>🚨 New Paid Order: ${order.order_number}</h2>
        <p><strong>Customer:</strong> ${order.customer_name} (${order.customer_email}, ${order.customer_phone})</p>
        <p><strong>Destination:</strong> ${order.ship_city}, ${order.ship_country}</p>
        <p><strong>Total:</strong> ${formatMoney(Number(order.total), currency)}</p>
        <p><a href="${CONFIG.siteUrl}/admin/orders/${order.id}">Open in Admin Console &rarr;</a></p>
      </div>
    `

    await Promise.all([
      resend.emails.send({
        from: FROM_EMAIL,
        to: order.customer_email,
        subject: `Order Confirmation — ${order.order_number} | Megh Foods`,
        html: customerHtml,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: OWNER_EMAIL,
        subject: `[NEW ORDER] ${order.order_number} — ${formatMoney(Number(order.total), currency)} (${order.ship_country})`,
        html: ownerHtml,
      }),
    ])
  } catch {
    // Ignore email failure gracefully
  }
}

export async function sendShippedEmail(orderId: string) {
  if (!resend) return

  try {
    const db = createAdminClient()
    const { data: order } = await db.from('orders').select('*').eq('id', orderId).single()
    if (!order) return

    const html = `
      <div style="font-family: Montserrat, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <div style="background-color: #1B4FD8; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">MEGH FOODS</h1>
        </div>
        <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; background: #ffffff;">
          <h2 style="color: #0f172a; font-size: 18px;">Your Order Has Shipped! 📦</h2>
          <p>Hi ${order.customer_name},</p>
          <p>Great news! Your order <strong>${order.order_number}</strong> has been handed over to our international courier partner.</p>
          
          <div style="background-color: #eff6ff; border-left: 4px solid #1B4FD8; padding: 16px; margin: 20px 0; font-size: 14px;">
            <p style="margin: 0 0 8px;"><strong>Courier:</strong> ${order.courier || 'Express Logistics'}</p>
            <p style="margin: 0;"><strong>Tracking Number:</strong> ${order.tracking_number || 'Awaiting live scan'}</p>
          </div>

          <p><a href="${CONFIG.siteUrl}/order/${order.order_number}?t=${order.access_token}" style="display: inline-block; background-color: #1B4FD8; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;">Track Order Live</a></p>
        </div>
      </div>
    `

    await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customer_email,
      subject: `Your Order ${order.order_number} Has Shipped! — Megh Foods`,
      html,
    })
  } catch {
    // Ignore email failure gracefully
  }
}

export async function sendInquiryAlert(row: {
  full_name: string
  email: string
  phone?: string
  business_name?: string
  country?: string
  city?: string
  inquiry_type: string
  message?: string
  estimated_order_volume?: string
}) {
  if (!resend) return

  try {
    const html = `
      <div style="font-family: sans-serif; color: #1e293b; padding: 20px;">
        <h2>📬 New ${row.inquiry_type.toUpperCase()} Inquiry Received</h2>
        <p><strong>Name:</strong> ${row.full_name}</p>
        <p><strong>Email:</strong> ${row.email}</p>
        <p><strong>Phone:</strong> ${row.phone || 'N/A'}</p>
        <p><strong>Business:</strong> ${row.business_name || 'N/A'}</p>
        <p><strong>Location:</strong> ${row.city ? `${row.city}, ` : ''}${row.country || 'N/A'}</p>
        <p><strong>Estimated Volume:</strong> ${row.estimated_order_volume || 'N/A'}</p>
        <div style="background: #f1f5f9; padding: 12px; margin: 12px 0; border-radius: 6px;">
          <strong>Message:</strong><br />
          ${(row.message || 'No additional message provided.').replace(/\n/g, '<br />')}
        </div>
        <p><a href="${CONFIG.siteUrl}/admin/inquiries">Review Inquiries in Admin Console &rarr;</a></p>
      </div>
    `

    await resend.emails.send({
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      subject: `[${row.inquiry_type.toUpperCase()} INQUIRY] from ${row.full_name} (${row.country || 'Global'})`,
      html,
    })
  } catch {
    // Ignore email failure gracefully
  }
}
