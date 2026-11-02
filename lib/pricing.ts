export type Currency = 'INR' | 'USD'

export type VariantPrices = {
  price_inr: number | string
  price_usd: number | string
  sale_price_inr: number | string | null
  sale_price_usd: number | string | null
}

export const currencyForCountry = (cc: string): Currency =>
  cc.toUpperCase() === 'IN' ? 'INR' : 'USD'

export function unitPrice(v: VariantPrices, currency: Currency): number {
  const base = Number(currency === 'INR' ? v.price_inr : v.price_usd)
  const saleRaw = currency === 'INR' ? v.sale_price_inr : v.sale_price_usd
  const sale = saleRaw == null ? null : Number(saleRaw)
  return sale !== null && sale > 0 && sale < base ? sale : base
}

export const formatMoney = (amount: number, currency: Currency) =>
  new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency,
  }).format(amount)

export const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100
