import Link from "next/link"
import {
  Package,
  Layers,
  ShoppingBag,
  Inbox,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createAdminClient } from "@/lib/supabase/admin"
import { isSupabaseConfigured } from "@/lib/supabase/public"
import { formatMoney } from "@/lib/pricing"
import { getInquiries } from "@/lib/data/inquiries"
import { CURATED_PRODUCTS } from "@/lib/data/products"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const allInquiries = await getInquiries()
  let totalProducts = CURATED_PRODUCTS.length
  let activeProducts = CURATED_PRODUCTS.filter((p) => p.is_active).length
  let newInquiries = allInquiries.filter((i) => i.status === "new").length
  let ordersToFulfill = 0
  let revenueInr = 0
  let revenueUsd = 0

  if (isSupabaseConfigured()) {
    try {
      const db = createAdminClient()

      const [
        productsRes,
        activeRes,
        inquiriesRes,
        fulfillRes,
        paidOrdersRes,
      ] = await Promise.all([
        db.from("products").select("id", { count: "exact", head: true }),
        db.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
        db.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
        db
          .from("orders")
          .select("id", { count: "exact", head: true })
          .eq("payment_status", "paid")
          .in("fulfillment_status", ["new", "packed"]),
        db
          .from("orders")
          .select("currency, total, created_at")
          .eq("payment_status", "paid"),
      ])

      if (productsRes.count !== null && productsRes.count !== undefined) totalProducts = productsRes.count
      if (activeRes.count !== null && activeRes.count !== undefined) activeProducts = activeRes.count
      if (inquiriesRes.count !== null && inquiriesRes.count !== undefined) newInquiries = inquiriesRes.count
      if (fulfillRes.count !== null && fulfillRes.count !== undefined) ordersToFulfill = fulfillRes.count

      const now = new Date()
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      for (const order of paidOrdersRes.data ?? []) {
        const orderDate = new Date(order.created_at)
        if (orderDate >= firstDayOfMonth) {
          if (order.currency === "INR") {
            revenueInr += Number(order.total) || 0
          } else {
            revenueUsd += Number(order.total) || 0
          }
        }
      }
    } catch {
      // Falls back gracefully
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Welcome to the Megh Foods store &amp; export administration console.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/products"
          prefetch={true}
          className="group block rounded-xl border border-slate-200/90 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand-blue/50 hover:shadow-md cursor-pointer"
        >
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 group-hover:text-brand-blue transition-colors">
                Total Products
              </CardTitle>
              <div className="flex items-center gap-1.5">
                <Package className="w-4 h-4 text-brand-blue" />
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-blue" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900">
                {totalProducts}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {activeProducts} active &amp; live online
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link
          href="/admin/orders"
          prefetch={true}
          className="group block rounded-xl border border-slate-200/90 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-amber-400 hover:shadow-md cursor-pointer"
        >
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 group-hover:text-amber-600 transition-colors">
                Orders to Fulfill
              </CardTitle>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-amber-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900">
                {ordersToFulfill}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Paid orders awaiting packing/dispatch
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link
          href="/admin/inquiries"
          prefetch={true}
          className="group block rounded-xl border border-slate-200/90 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand-lime-600 hover:shadow-md cursor-pointer"
        >
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 group-hover:text-brand-lime-700 transition-colors">
                New Inquiries
              </CardTitle>
              <div className="flex items-center gap-1.5">
                <Inbox className="w-4 h-4 text-brand-lime-600" />
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-lime-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900">
                {newInquiries}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                B2B and export leads requiring contact
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link
          href="/admin/orders"
          prefetch={true}
          className="group block rounded-xl border border-slate-200/90 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-md cursor-pointer"
        >
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 group-hover:text-emerald-600 transition-colors">
                Revenue (This Month)
              </CardTitle>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-base font-black text-slate-900">
                {formatMoney(revenueInr, "INR")}
              </div>
              <div className="text-sm font-bold text-slate-600 mt-0.5">
                {formatMoney(revenueUsd, "USD")}
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
