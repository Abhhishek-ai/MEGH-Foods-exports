import { getOrders } from '@/lib/data/orders'
import { OrdersTable } from '@/components/admin/OrdersTable'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Orders &amp; Shipments
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review paid transactions, prepare parcel fulfillments, and attach tracking numbers.
        </p>
      </div>

      <OrdersTable orders={orders} />
    </div>
  )
}
