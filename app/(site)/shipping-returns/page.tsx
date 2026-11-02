export const metadata = {
  title: "Shipping & Returns Policy | Megh Foods",
  description: "Comprehensive shipping timelines, transit damage procedures, and refund policy for Megh Foods.",
}

export default function ShippingReturnsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-12 space-y-10 text-slate-800">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Shipping &amp; Returns Policy
        </h1>
        <p className="text-xs text-slate-500">
          Last updated: January 2026 • Megh Overseas Pvt. Ltd.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">1. Shipping &amp; Delivery Timelines</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Orders are processed and dispatched from our certified fulfillment center in Ahmedabad, India within 1–2 business days of payment verification.
        </p>
        <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1.5">
          <li><strong>Domestic (India):</strong> 3–6 business days via air or surface express courier.</li>
          <li><strong>United States &amp; Canada:</strong> 10–18 business days via international air courier.</li>
          <li><strong>European Union &amp; United Kingdom:</strong> 10–20 business days.</li>
          <li><strong>Middle East (GCC):</strong> 7–12 business days.</li>
          <li><strong>Rest of World:</strong> 12–25 business days depending on customs clearance.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">2. Perishable Food Items &amp; Returns</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Because our products are consumable, food-grade grocery items, we cannot accept returns once packaging has been opened or sealed products have been delivered, in accordance with international sanitary guidelines.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">3. Damaged in Transit or Incorrect Items</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          In the rare event that an item arrives damaged or compromised during transit, please notify our customer care team within <strong>48 hours of delivery</strong> at <span className="font-semibold text-brand-blue">orders@meghfoods.com</span> with:
        </p>
        <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
          <li>Your order number (e.g., MF-1002)</li>
          <li>Clear photographs of the outer shipping box, shipping label, and damaged package</li>
        </ul>
        <p className="text-xs text-slate-600 leading-relaxed">
          Upon verification, we will promptly dispatch a replacement or issue a full refund to your original payment method.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">4. Order Cancellation &amp; Refunds</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Orders may be cancelled free of charge before they have been packed and dispatched from our warehouse. Once handed over to the courier partner, cancellations cannot be processed.
        </p>
        <p className="text-xs text-slate-600 leading-relaxed">
          Approved refunds are processed through our payment gateway (Razorpay) back to the original source card or bank account within <strong>5–7 business days</strong>.
        </p>
      </section>
    </div>
  )
}
