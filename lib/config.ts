export const CONFIG = {
  siteName: 'Megh Foods',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '+919876543210',
  domesticCountry: 'IN',
  contact: {
    email: process.env.EMAIL_FROM ?? 'care@meghfoods.com',
    phone: '+91 79 4000 0000',
    address: 'Megh Overseas Pvt. Ltd., Ahmedabad, Gujarat, India',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '+91 98765 43210',
  },
  // Orders above these totals must go through the B2B quote flow (card cross-border limits, fraud risk).
  maxOnlineOrderInr: 250000,
  maxOnlineOrderUsd: 3000,
  // Owner fills these in code/config once; badge is hidden when empty.
  certifications: [
    { key: 'fssai', label: 'FSSAI Licensed', number: '' },
    { key: 'iso', label: 'ISO Certified', number: '' },
    { key: 'apeda', label: 'APEDA Registered', number: '' },
  ],
} as const;
