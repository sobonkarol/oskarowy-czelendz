import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CEREMONY_YEARS, TOTAL_FILMS } from "@/lib/oscar-data"
import "./globals.css"

export const dynamic = "force-dynamic"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Oskarowy Czelendż",
  description: `Obejrzyj wszystkie filmy nominowane do Oscara za najlepszy film od ${CEREMONY_YEARS[0]} do ${CEREMONY_YEARS[CEREMONY_YEARS.length - 1]}. Ponad ${TOTAL_FILMS} filmów.`,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen scrollbar-gold">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
