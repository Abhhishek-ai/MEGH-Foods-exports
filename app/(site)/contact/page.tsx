import { MapPin, Mail, Phone, MessageSquare } from "lucide-react"
import { CONFIG } from "@/lib/config"

export const metadata = {
  title: "Contact Us | Megh Foods",
  description: "Get in touch with Megh Overseas Pvt. Ltd., Ahmedabad for retail support and export inquiries.",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-12 space-y-12">
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Contact Our Team
        </h1>
        <p className="text-sm text-slate-600">
          Have questions regarding an order, international export terms, or bulk pricing? We are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border bg-white shadow-sm space-y-3">
          <MapPin className="w-6 h-6 text-brand-blue" />
          <h3 className="text-sm font-bold text-slate-900">Headquarters</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Megh Overseas Pvt. Ltd.<br />
            Ahmedabad, Gujarat 380015, India
          </p>
        </div>

        <div className="p-6 rounded-2xl border bg-white shadow-sm space-y-3">
          <Mail className="w-6 h-6 text-brand-blue" />
          <h3 className="text-sm font-bold text-slate-900">Email Inquiries</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Export Desk: export@meghfoods.com<br />
            Retail Orders: orders@meghfoods.com
          </p>
        </div>

        <div className="p-6 rounded-2xl border bg-white shadow-sm space-y-3">
          <Phone className="w-6 h-6 text-brand-blue" />
          <h3 className="text-sm font-bold text-slate-900">Direct Contact</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            WhatsApp Business: +{CONFIG.whatsapp || "91 98765 43210"}<br />
            Hours: Mon - Sat, 9:30 AM - 6:30 PM IST
          </p>
        </div>
      </div>
    </div>
  )
}
