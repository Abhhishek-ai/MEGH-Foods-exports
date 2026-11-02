export const metadata = {
  title: "Terms & Conditions | Megh Foods",
  description: "Terms and conditions governing the purchase of products and trade relationships with Megh Overseas Pvt. Ltd.",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-12 space-y-8 text-slate-800">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Terms &amp; Conditions
        </h1>
        <p className="text-xs text-slate-500">
          Effective Date: January 1, 2026 • Megh Overseas Pvt. Ltd., Ahmedabad
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          By accessing or using the Megh Foods website (meghfoods.com) and placing an order, you agree to be bound by these Terms and Conditions. These terms apply to all visitors, buyers, and international trade partners.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900">2. Pricing, Currencies &amp; Payment</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Orders originating in India are billed in Indian Rupees (INR). Orders destined for international delivery are billed in US Dollars (USD). Product totals and applicable regional shipping rates are strictly calculated and confirmed on our servers at the time of checkout. Online payments are processed via Razorpay. Orders exceeding our online fraud and card limits must be completed via custom export quotation and wire transfer.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900">3. Customs, Duties &amp; Taxes</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          For cross-border consumer parcels, destination import tariffs, taxes, and local customs brokerage fees (if levied by the recipient country&apos;s customs authorities) remain the responsibility of the consignee unless specified otherwise on your invoice.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900">4. Governing Law &amp; Jurisdiction</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          These Terms and any contractual disputes shall be governed by and construed in accordance with the laws of the Republic of India. The courts of Ahmedabad, Gujarat, India shall have exclusive jurisdiction over any legal proceedings arising from transactions on this platform.
        </p>
      </section>
    </div>
  )
}
