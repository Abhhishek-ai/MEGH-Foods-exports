declare global {
  interface Window {
    Razorpay: new (opts: Record<string, unknown>) => {
      open: () => void
      on: (ev: string, cb: (r: unknown) => void) => void
    }
  }
}

export function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) return resolve(true)
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.async = true
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

export async function payWithRazorpay(opts: {
  keyId: string
  amount: number
  currency: string
  razorpayOrderId: string
  orderNumber: string
  customer: { name: string; email: string; phone: string }
  onPaid: (r: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
  }) => void
  onDismiss: () => void
}) {
  const loaded = await loadRazorpay()
  if (!loaded) {
    throw new Error('Could not load the secure payment gateway. Please check your network connection.')
  }

  const rzp = new window.Razorpay({
    key: opts.keyId,
    amount: opts.amount,
    currency: opts.currency,
    order_id: opts.razorpayOrderId,
    name: 'Megh Foods',
    description: `Order ${opts.orderNumber}`,
    image: '/logo.png',
    theme: { color: '#1B4FD8' },
    prefill: {
      name: opts.customer.name,
      email: opts.customer.email,
      contact: opts.customer.phone,
    },
    handler: opts.onPaid,
    modal: {
      ondismiss: opts.onDismiss,
    },
  })

  rzp.open()
}
