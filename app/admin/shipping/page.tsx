import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/supabase/public'
import { ShippingManager, type ShippingZoneRow } from '@/components/admin/ShippingManager'
import { DEFAULT_SHIPPING_ZONES } from '@/lib/data/shipping'

export const dynamic = 'force-dynamic'

export default async function AdminShippingPage() {
  let zones: ShippingZoneRow[] = []

  if (isSupabaseConfigured()) {
    try {
      const db = createAdminClient()
      const { data } = await db.from('shipping_zones').select('*').order('name', { ascending: true })
      if (data && data.length > 0) zones = data as ShippingZoneRow[]
    } catch {
      // Fallback
    }
  }

  if (zones.length === 0) {
    zones = DEFAULT_SHIPPING_ZONES as unknown as ShippingZoneRow[]
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Shipping Zones &amp; Delivery Rates
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure country-specific parcel delivery fees, transit estimates, and free shipping thresholds.
        </p>
      </div>

      <ShippingManager initialZones={zones} />
    </div>
  )
}
