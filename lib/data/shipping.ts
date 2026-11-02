import { publicClient, isSupabaseConfigured } from '@/lib/supabase/public'

export const DEFAULT_SHIPPING_ZONES = [
  {
    id: 'sz-01',
    name: 'India Domestic',
    country_codes: ['IN'],
    rate_inr: 99,
    rate_usd: 0,
    free_above_inr: 999,
    free_above_usd: null,
    est_days: '3-6 business days',
    is_default: false,
    is_active: true,
  },
  {
    id: 'sz-02',
    name: 'United States & Canada',
    country_codes: ['US', 'CA'],
    rate_inr: 0,
    rate_usd: 24,
    free_above_inr: null,
    free_above_usd: 150,
    est_days: '10-18 business days',
    is_default: false,
    is_active: true,
  },
  {
    id: 'sz-03',
    name: 'European Union & UK',
    country_codes: [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU',
      'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES',
      'SE', 'GB',
    ],
    rate_inr: 0,
    rate_usd: 28,
    free_above_inr: null,
    free_above_usd: 160,
    est_days: '10-20 business days',
    is_default: false,
    is_active: true,
  },
  {
    id: 'sz-04',
    name: 'Middle East (GCC)',
    country_codes: ['AE', 'SA', 'QA', 'KW', 'OM', 'BH'],
    rate_inr: 0,
    rate_usd: 20,
    free_above_inr: null,
    free_above_usd: 120,
    est_days: '7-12 business days',
    is_default: false,
    is_active: true,
  },
  {
    id: 'sz-05',
    name: 'Africa',
    country_codes: ['ZA', 'KE', 'NG', 'TZ', 'UG', 'GH', 'MU', 'EG'],
    rate_inr: 0,
    rate_usd: 30,
    free_above_inr: null,
    free_above_usd: 180,
    est_days: '12-22 business days',
    is_default: false,
    is_active: true,
  },
  {
    id: 'sz-06',
    name: 'Rest of World',
    country_codes: [],
    rate_inr: 0,
    rate_usd: 35,
    free_above_inr: null,
    free_above_usd: 200,
    est_days: '12-25 business days',
    is_default: true,
    is_active: true,
  },
]

export async function getShippingZones() {
  if (!isSupabaseConfigured()) {
    return DEFAULT_SHIPPING_ZONES
  }

  try {
    let timeoutId: NodeJS.Timeout
    const timeoutPromise = new Promise<null>((resolve) => {
      timeoutId = setTimeout(() => resolve(null), 1500)
    })

    const query = publicClient()
      .from('shipping_zones')
      .select('*')
      .eq('is_active', true)
      .order('is_default', { ascending: true })

    const res = await Promise.race([query as any, timeoutPromise])
    clearTimeout(timeoutId!)

    if (!res || !res.data || res.data.length === 0) {
      return DEFAULT_SHIPPING_ZONES
    }
    return res.data
  } catch {
    return DEFAULT_SHIPPING_ZONES
  }
}
