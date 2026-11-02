import { NextResponse, type NextRequest } from 'next/server'
import { currencyForCountry } from '@/lib/pricing'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const country =
    req.headers.get('x-vercel-ip-country') ||
    req.headers.get('cf-ipcountry') ||
    'IN'

  const currency = currencyForCountry(country)

  const res = NextResponse.json({ country, currency })

  // If cookie isn't present, set default
  if (!req.cookies.has('mf_currency')) {
    res.cookies.set('mf_currency', currency, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    })
  }

  return res
}
