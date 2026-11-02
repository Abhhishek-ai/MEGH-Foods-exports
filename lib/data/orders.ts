import fs from 'fs'
import path from 'path'
import { isSupabaseConfigured } from '@/lib/supabase/public'
import { createAdminClient } from '@/lib/supabase/admin'
import type { OrderRow } from '@/components/admin/OrdersTable'

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json')

export const INITIAL_SAMPLE_ORDERS: OrderRow[] = [
  {
    id: 'ord-01-sample',
    order_number: 'MF-202611-001',
    access_token: 'tok_sample_1',
    customer_name: 'Rajesh Patel',
    customer_email: 'rajesh.patel@gmail.com',
    ship_country: 'United States',
    currency: 'USD',
    total: 84.5,
    payment_status: 'paid',
    fulfillment_status: 'new',
    created_at: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
  },
  {
    id: 'ord-02-sample',
    order_number: 'MF-202611-002',
    access_token: 'tok_sample_2',
    customer_name: 'Anjali Sharma',
    customer_email: 'anjali.sharma@outlook.com',
    ship_country: 'India',
    currency: 'INR',
    total: 1250,
    payment_status: 'paid',
    fulfillment_status: 'packed',
    created_at: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
  },
]

function readLocalOrders(): OrderRow[] {
  try {
    if (!fs.existsSync(ORDERS_FILE)) {
      writeLocalOrders(INITIAL_SAMPLE_ORDERS)
      return INITIAL_SAMPLE_ORDERS
    }
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8')
    const parsed = JSON.parse(raw) as OrderRow[]
    return parsed.length > 0 ? parsed : INITIAL_SAMPLE_ORDERS
  } catch {
    return INITIAL_SAMPLE_ORDERS
  }
}

function writeLocalOrders(orders: OrderRow[]): void {
  try {
    const dir = path.dirname(ORDERS_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8')
  } catch (err) {
    console.error('Failed to write local orders:', err)
  }
}

export async function getOrders(): Promise<OrderRow[]> {
  const local = readLocalOrders()

  if (isSupabaseConfigured()) {
    try {
      const db = createAdminClient()
      const { data, error } = await db
        .from('orders')
        .select(
          'id, order_number, access_token, customer_name, customer_email, ship_country, currency, total, payment_status, fulfillment_status, created_at'
        )
        .order('created_at', { ascending: false })

      if (!error && data && data.length > 0) {
        const seen = new Set(data.map((d: OrderRow) => d.id))
        const merged = [...(data as OrderRow[]), ...local.filter((l) => !seen.has(l.id))]
        return merged.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      }
    } catch {
      // Return local immediately
    }
  }

  return local.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}
