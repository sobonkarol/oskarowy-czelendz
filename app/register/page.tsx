"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Trophy, Eye, EyeOff, Loader2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (form.password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków")
      return
    }
    setLoading(true)

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const data = await res.json()

    setLoading(false)
    if (!res.ok) {
      setError(data.error ?? "Wystąpił błąd")
    } else {
      router.push("/login?registered=1")
    }
  }

  const field = (key: keyof typeof form, label: string, type = "text", placeholder = "") => (
    <div className="space-y-1.5">
      <label className="text-sm text-(--text-secondary)">{label}</label>
      <input
        type={type}
        required
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="w-full bg-white/5 border border-(--border) rounded-xl px-4 py-3 text-(--text-primary) placeholder-[var(--text-muted)] focus:outline-none focus:border-(--gold) transition-colors"
        placeholder={placeholder}
      />
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 winner-badge rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-black" />
          </div>
          <h1 className="font-playfair font-bold text-3xl text-(--text-primary) mb-2">
            Dołącz do czelendżu
          </h1>
          <p className="text-(--text-secondary)">Stwórz konto i zacznij oceniać Oscarowe klasyki</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {field("firstName", "Imię", "text", "Jan")}
            {field("lastName", "Nazwisko", "text", "Kowalski")}
          </div>
          {field("email", "Email", "email", "ty@example.com")}

          <div className="space-y-1.5">
            <label className="text-sm text-(--text-secondary)">Hasło</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full bg-white/5 border border-(--border) rounded-xl px-4 py-3 pr-12 text-(--text-primary) placeholder-[var(--text-muted)] focus:outline-none focus:border-(--gold) transition-colors"
                placeholder="Min. 6 znaków"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text-secondary)"
              >
                {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl winner-badge font-semibold text-black flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {loading ? "Rejestracja..." : "Zarejestruj się"}
          </button>

          <p className="text-center text-sm text-(--text-secondary)">
            Masz już konto?{" "}
            <Link href="/login" className="text-(--gold) hover:underline">
              Zaloguj się
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
