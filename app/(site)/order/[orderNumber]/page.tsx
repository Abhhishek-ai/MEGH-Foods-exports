import Link from "next/link"
import { notFound } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/admin"
import { CONFIG } from "@/lib/config"
import { formatMoney } from "@/lib/pricing"
import { OrderStatusTracker } from "@/components/site/OrderStatusTracker"
import {
  Package,
  MapPin,
  Truck,
  MessageCircle,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from "lucide-react"

export const dynamic = "force-dynamic"

export default async function OrderStatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>
  searchParams: Promise<{ t?: string }>
}) {
  const { orderNumber } = await params
  const { t: token } = await searchParams

  if (!token) {
    notFound()
  }

  const supabase = createAdminClient()

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .single()

  if (!order || order.access_token !== token) {
    notFound()
  }

  const { data: items = [] } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", order.id)

  const currency = order.currency as "INR" | "USD"
  const formattedDate = new Date(order.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header Breadcrumb & Actions */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-blue" />
              <span>Verified Customer Order</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Order {order.order_number}
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
              <Calendar className="w-3.5 h-3.5" />
              Placed on {formattedDate}
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-blue hover:text-brand-blue-hover transition"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Live Status Tracker */}
        <div className="mb-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <OrderStatusTracker
            initialPaymentStatus={order.payment_status}
            fulfillmentStatus={order.fulfillment_status}
            orderNumber={order.order_number}
            accessToken={order.access_token}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Items & Shipping */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items Ordered */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
                <Package className="w-5 h-5 text-brand-blue" />
                <h2 className="font-bold text-slate-900">Items Ordered ({items?.length || 0})</h2>
              </div>

              <div className="divide-y divide-slate-100">
                {items && items.length > 0 ? (
                  items.map((item) => (
                    <div key={item.id} className="py-3.5 flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{item.title_snapshot}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Pack size: <span className="font-medium text-slate-700">{item.variant_label}</span>
                        </p>
                        <p className="text-xs text-slate-500">
                          Qty: <span className="font-semibold text-slate-700">{item.quantity}</span> × {formatMoney(Number(item.unit_price), currency)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900 text-sm">
                          {formatMoney(Number(item.line_total), currency)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 py-4">No item details available.</p>
                )}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
                <MapPin className="w-5 h-5 text-brand-blue" />
                <h2 className="font-bold text-slate-900">Delivery Address</h2>
              </div>

              <div className="text-sm text-slate-700 space-y-1">
                <p className="font-bold text-slate-900">{order.customer_name}</p>
                <p>{order.ship_line1}</p>
                {order.ship_line2 && <p>{order.ship_line2}</p>}
                <p>
                  {order.ship_city}, {order.ship_state} {order.ship_postal_code}
                </p>
                <p className="font-medium text-slate-900">{order.ship_country}</p>

                <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                  <p>Email: <span className="text-slate-800 font-medium">{order.customer_email}</span></p>
                  <p>Phone: <span className="text-slate-800 font-medium">{order.customer_phone}</span></p>
                  {order.customer_notes && (
                    <div className="mt-2 p-2 bg-slate-50 rounded text-slate-600 text-xs">
                      <span className="font-semibold">Order Instructions:</span> {order.customer_notes}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Courier & Tracking Information */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
                <Truck className="w-5 h-5 text-brand-blue" />
                <h2 className="font-bold text-slate-900">Courier &amp; Tracking</h2>
              </div>

              {order.courier || order.tracking_number ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs">
                    <div>
                      <p className="text-slate-500">Shipping Partner</p>
                      <p className="font-bold text-slate-900 text-sm">{order.courier || "Export Logistics Partner"}</p>
                    </div>
                    {order.tracking_number && (
                      <div className="text-right">
                        <p className="text-slate-500">AWB / Tracking Number</p>
                        <p className="font-mono font-bold text-brand-blue text-sm">{order.tracking_number}</p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Live updates are transmitted by our export warehouse in Ahmedabad directly to your registered email and phone.
                  </p>
                </div>
              ) : (
                <div className="text-xs text-slate-500">
                  <p className="font-medium text-slate-700">Awaiting dispatch</p>
                  <p className="mt-1">
                    Your package is being securely packed and inspected at our Ahmedabad warehouse. Once handed over to the export courier (DHL/FedEx/India Post), tracking details will appear here automatically.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Cost Breakdown & Support */}
          <div className="space-y-6">
            {/* Cost Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="font-bold text-slate-900 pb-3 mb-3 border-b border-slate-100">
                Payment Summary
              </h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">
                    {formatMoney(Number(order.subtotal), currency)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-medium text-slate-900">
                    {Number(order.shipping_amount) === 0
                      ? "FREE"
                      : formatMoney(Number(order.shipping_amount), currency)}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between font-extrabold text-slate-900 text-base">
                  <span>Total</span>
                  <span className="text-brand-blue">
                    {formatMoney(Number(order.total), currency)}
                  </span>
                </div>
              </div>

              {order.razorpay_payment_id && (
                <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
                  Payment Ref: {order.razorpay_payment_id}
                </div>
              )}
            </div>

            {/* Need Help? */}
            <div className="bg-gradient-to-br from-brand-blue/5 to-emerald-500/5 rounded-2xl border border-brand-blue/15 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-brand-blue" />
                <h3 className="font-bold text-slate-900 text-sm">Need Help with this Order?</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our export and customer care team in Ahmedabad is available to assist you Monday through Saturday.
              </p>

              <div className="space-y-2.5 pt-1 text-xs">
                <a
                  href={`https://wa.me/${CONFIG.contact.whatsapp.replace(/[^0-9]/g, "")}?text=Hi%2C%20I%20have%20an%20inquiry%20regarding%20Order%20${order.order_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 bg-emerald-50 text-emerald-800 rounded-xl font-semibold hover:bg-emerald-100 transition border border-emerald-200"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Support ({CONFIG.contact.whatsapp})</span>
                </a>

                <a
                  href={`mailto:${CONFIG.contact.email}?subject=Inquiry regarding Order ${order.order_number}`}
                  className="flex items-center gap-2 p-2.5 bg-white text-slate-800 rounded-xl font-semibold hover:bg-slate-50 transition border border-slate-200"
                >
                  <Mail className="w-4 h-4 text-brand-blue" />
                  <span>{CONFIG.contact.email}</span>
                </a>

                <a
                  href={`tel:${CONFIG.contact.phone.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center gap-2 p-2.5 bg-white text-slate-800 rounded-xl font-semibold hover:bg-slate-50 transition border border-slate-200"
                >
                  <Phone className="w-4 h-4 text-slate-600" />
                  <span>{CONFIG.contact.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
