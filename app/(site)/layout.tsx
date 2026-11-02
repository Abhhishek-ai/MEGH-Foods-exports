import { Header } from "@/components/site/Header"
import { Footer } from "@/components/site/Footer"
import { WhatsAppButton } from "@/components/site/WhatsAppButton"
import { CartDrawer } from "@/components/site/CartDrawer"

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <CartDrawer />
    </div>
  )
}
