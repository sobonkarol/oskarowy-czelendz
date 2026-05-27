"use client"

import { useState } from "react"

type FormState = { currentPassword: string; newPassword: string; confirmPassword: string }
const empty: FormState = { currentPassword: "", newPassword: "", confirmPassword: "" }

export default function PasswordForm() {
  const [form, setForm] = useState<FormState>(empty)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  function field(key: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [key]: e.target.value }))
      setError("")
      setSuccess(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.newPassword !== form.confirmPassword) {
      setError("Hasła nie są identyczne")
      return
    }
    if (form.newPassword.length < 6) {
      setError("Nowe hasło musi mieć min. 6 znaków")
      return
    }
    setSaving(true)
    const res = await fetch("/api/profile/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
    })
    setSaving(false)
    if (res.ok) {
      setSuccess(true)
      setForm(empty)
    } else {
      const body = await res.json()
      setError(body.error ?? "Błąd podczas zmiany hasła")
    }
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg bg-white/5 border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] transition-colors"

  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="font-playfair font-semibold text-xl text-[var(--text-primary)] mb-6">Zmień hasło</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block text-sm text-[var(--text-secondary)] mb-1">Aktualne hasło</label>
          <input
            id="currentPassword"
            type="password"
            value={form.currentPassword}
            onChange={field("currentPassword")}
            placeholder="••••••••"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm text-[var(--text-secondary)] mb-1">Nowe hasło</label>
          <input
            id="newPassword"
            type="password"
            value={form.newPassword}
            onChange={field("newPassword")}
            placeholder="Min. 6 znaków"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm text-[var(--text-secondary)] mb-1">Potwierdź nowe hasło</label>
          <input
            id="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={field("confirmPassword")}
            placeholder="••••••••"
            required
            className={inputClass}
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">Hasło zostało zmienione</p>}

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-lg text-sm font-medium bg-[var(--gold)] text-black hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? "Zmieniam..." : "Zmień hasło"}
        </button>
      </form>
    </div>
  )
}
