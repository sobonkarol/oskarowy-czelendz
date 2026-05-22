export const dynamic = "force-dynamic"

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Trophy, Star, Film, Users, ArrowRight, ChevronDown } from "lucide-react"

export default async function LandingPage() {
  const session = await auth()
  if (session) redirect("/dashboard")

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-24 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-150 h-150 rounded-full bg-(--gold) opacity-[0.03] blur-3xl" />
          <div className="absolute bottom-0 left-0 w-100 h-100 rounded-full bg-violet-500 opacity-[0.03] blur-3xl" />
          <div className="absolute top-0 right-0 w-75 h-75 rounded-full bg-amber-400 opacity-[0.04] blur-3xl" />

          {/* Floating stars */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-(--gold) opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 16 + 8}px`,
                animationDelay: `${Math.random() * 3}s`,
                animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              }}
            >
              ★
            </div>
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 text-sm text-(--text-secondary)">
            <Trophy className="w-4 h-4 text-(--gold)" />
            <span>1980 – 2025 · 46 lat Oscarów · ~280 filmów</span>
          </div>

          <h1 className="font-playfair font-bold text-5xl sm:text-6xl md:text-8xl leading-none mb-6">
            <span className="block text-(--text-primary)">Oskarowy</span>
            <span className="block gold-text">Czelendż</span>
          </h1>

          <p className="text-lg md:text-xl text-(--text-secondary) max-w-2xl mx-auto mb-12 leading-relaxed">
            Obejrzyj wszystkie filmy nominowane do Oscara za najlepszy film od 1980 roku.
            Oceniaj, porównuj i rywalizuj z innymi widzami.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl winner-badge font-semibold text-black text-lg transition-all hover:scale-105 gold-glow"
            >
              Rozpocznij czelendż
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl glass glass-hover font-medium text-(--text-primary) text-lg"
            >
              Mam już konto
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-(--text-muted)">
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-playfair font-bold text-3xl md:text-4xl text-center mb-16 text-(--text-primary)">
            Na czym polega <span className="gold-text">czelendż?</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Film,
                title: "Oglądaj filmy",
                desc: "Przeglądaj nominacje do Oscara za najlepszy film rok po roku, od 1980 do 2025. Plakatów, reżyserów i informacje o streamingu.",
              },
              {
                icon: Star,
                title: "Oceniaj od 1 do 10",
                desc: "Każdy film oceniaj w skali 1–10. Twoje oceny budują Twój profil i wpływają na globalne zestawienia.",
              },
              {
                icon: Users,
                title: "Rywalizuj z innymi",
                desc: "Porównuj swoje gusta z całą bazą użytkowników. Kto dał najwyższą średnią Titanicowi? Sprawdź ranking!",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass rounded-2xl p-8 text-center glass-hover">
                <div className="w-14 h-14 winner-badge rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-7 h-7 text-black" />
                </div>
                <h3 className="font-playfair font-bold text-xl mb-3 text-(--text-primary)">{title}</h3>
                <p className="text-(--text-secondary) leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA footer */}
      <section className="py-16 px-4 text-center border-t border-(--border)">
        <p className="text-(--text-muted) text-sm">
          © {new Date().getFullYear()} Oskarowy Czelendż · Dane filmowe: TMDB · Streaming: Watchmode
        </p>
      </section>
    </main>
  )
}
