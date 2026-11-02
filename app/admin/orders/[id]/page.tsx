import Link from "next/link"
import { notFound } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/admin"
import { OrderStatusForm } from "@/components/admin/OrderStatusForm"
import { formatMoney } from "@/lib/pricing"
import { ArrowLeft, User, MapPin, CreditCard, Package } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const db = createAdminClient()

  const { data: order, error } = await db
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("id", id)
    .single()

  if (error || !order) {
    notFound()
  }

  const currency = order.currency as "INR" | "USD"

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/admin/orders"
          className="text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to all orders
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-blue bg-blue-50 px-2.5 py-0.5 rounded-full">
            Order Reference
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Order {order.order_number}
          </h1>
          <p className="text-xs text-slate-500">
            Placed on{" "}
            {new Date(order.created_at).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-500">Total Billed</p>
          <p className="text-2xl font-black text-brand-blue">
            {formatMoney(Number(order.total), currency)}
          </p>
        </div>
      </div>

      {/* Customer & Address Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <User className="w-4 h-4 text-brand-blue" /> Customer
          </div>
          <p className="text-xs font-semibold text-slate-900">{order.customer_name}</p>
          <p className="text-xs text-slate-600">{order.customer_email}</p>
          <p className="text-xs text-slate-600">{order.customer_phone}</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <MapPin className="w-4 h-4 text-brand-blue" /> Shipping Destination
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {order.ship_line1}
            {order.ship_line2 ? `, ${order.ship_line2}` : ""}
            <br />
            {order.ship_city}, {order.ship_state} {order.ship_postal_code}
            <br />
            <strong>Country: {order.ship_country}</strong>
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <CreditCard className="w-4 h-4 text-brand-blue" /> Payment &amp; Gateway
          </div>
          <p className="text-xs text-slate-600">
            Status: <strong className="uppercase">{order.payment_status}</strong>
          </p>
          <p className="text-[11px] font-mono text-slate-500 break-all">
            Razorpay Order: {order.razorpay_order_id || "N/A"}
          </p>
          <p className="text-[11px] font-mono text-slate-500 break-all">
            Razorpay Payment: {order.razorpay_payment_id || "N/A"}
          </p>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 flex items-center gap-2">
          <Package className="w-4 h-4 text-brand-blue" />
          <h3 className="text-sm font-bold text-slate-900">Ordered Items</h3>
        </div>

        <div className="divide-y divide-slate-100">
          {(order.items || []).map((item: any) => (
            <div
              key={item.id}
              className="p-4 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-900 text-sm">
                  {item.title_snapshot}
                </span>
                <span className="ml-2 px-2 py-0.5 rounded bg-brand-lime-100 text-brand-lime-700 font-semibold text-[11px]">
                  {item.variant_label}
                </span>
                <div className="text-slate-500 mt-1">
                  Quantity: {item.quantity} × {formatMoney(Number(item.unit_price), currency)}
                </div>
              </div>
              <div className="font-bold text-slate-900 text-sm">
                {formatMoney(Number(item.line_total), currency)}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-1.5 text-xs text-right">
          <div className="text-slate-600">
            Subtotal: <strong>{formatMoney(Number(order.subtotal), currency)}</strong>
          </div>
          <div className="text-slate-600">
            Shipping: <strong>{formatMoney(Number(order.shipping_amount), currency)}</strong>
          </div>
          <div className="text-sm font-black text-brand-blue pt-1">
            Total Charged: {formatMoney(Number(order.total), currency)}
          </div>
        </div>
      </div>

      {/* Order Status & Tracking Form */}
      <OrderStatusForm
        orderId={order.id}
        currentFulfillmentStatus={order.fulfillment_status}
        currentCourier={order.courier}
        currentTrackingNumber={order.tracking_number}
      />
    </div>
  )
}
