export const metadata = {
  title: "Privacy Policy | Megh Foods",
  description: "Privacy policy and personal data protection principles for Megh Overseas Pvt. Ltd.",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-12 space-y-8 text-slate-800">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">
          Effective Date: January 1, 2026 • Megh Overseas Pvt. Ltd., Ahmedabad
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          When you place an order or submit a B2B inquiry on Megh Foods, we collect necessary contact information (name, email address, phone number), shipping address, and order history. Payment details (credit card numbers, UPI credentials) are transmitted directly to Razorpay over TLS/SSL encryption and are never stored on our servers.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900">2. How We Use Your Information</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Your personal data is used solely to process transactions, dispatch international and domestic parcels, fulfill customs documentation, communicate shipment tracking, and respond to wholesale distributor inquiries. We do not sell, rent, or trade customer data to third-party advertisers.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900">3. Data Security &amp; Retention</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          We maintain physical, electronic, and administrative safeguards to protect your personal information against unauthorized access, loss, or misuse. Customer data is retained in accordance with statutory accounting and tax compliance laws in India.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900">4. Contact Privacy Officer</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          If you have questions regarding this Privacy Policy or wish to request data correction, please email privacy@meghfoods.com.
        </p>
      </section>
    </div>
  )
}
