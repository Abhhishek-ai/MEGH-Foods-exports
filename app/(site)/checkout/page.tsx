import { getShippingZones } from '@/lib/data/shipping'
import { CheckoutClient } from '@/components/site/CheckoutClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Secure Checkout | Megh Foods',
  description: 'Complete your traditional Indian grocery purchase securely via Razorpay.',
}

export default async function CheckoutPage() {
  const zones = await getShippingZones()

  const formattedZones = (zones || []).map((z: any) => ({
    id: z.id,
    name: z.name,
    country_codes: z.country_codes || [],
    rate_inr: Number(z.rate_inr),
    rate_usd: Number(z.rate_usd),
    free_above_inr: z.free_above_inr != null ? Number(z.free_above_inr) : null,
    free_above_usd: z.free_above_usd != null ? Number(z.free_above_usd) : null,
    est_days: z.est_days,
    is_default: Boolean(z.is_default),
  }))

  return <CheckoutClient shippingZones={formattedZones} />
}
