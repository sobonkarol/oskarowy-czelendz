import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
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
  description: "Obejrzyj wszystkie filmy nominowane do Oscara za najlepszy film od 1980 do 2025",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen scrollbar-gold">
        {children}
      </body>
    </html>
  )
}
