import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { CONFIG } from "@/lib/config";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(CONFIG.siteUrl),
  title: "Megh Foods — Rooted in India, Loved Worldwide",
  description:
    "Exporters of premium traditional Indian groceries: flours, millet, poha, sabudana, snacks, and authentic food products from Ahmedabad, India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="font-sans antialiased min-h-screen bg-white">
        {children}
      </body>
    </html>
  );
}
