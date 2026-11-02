'use client'

import { MessageCircle } from "lucide-react"
import { CONFIG } from "@/lib/config"

export function WhatsAppButton() {
  if (!CONFIG.whatsapp) return null

  const cleanNumber = CONFIG.whatsapp.replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    'Hello Megh Foods, I have an inquiry about your products and export offerings.'
  )}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#20ba59] hover:shadow-xl transition-all transform hover:-translate-y-0.5"
    >
      <MessageCircle className="w-5 h-5 fill-current" />
      <span className="text-xs font-bold hidden sm:inline">WhatsApp Us</span>
    </a>
  )
}
