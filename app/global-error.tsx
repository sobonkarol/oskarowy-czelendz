"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="pl">
      <body style={{ background: "#07070c", color: "#f0e6c8", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "system-ui" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Coś poszło nie tak</h1>
          <p style={{ color: "#9b8b6e", marginBottom: "1.5rem" }}>{error.message}</p>
          <button
            onClick={reset}
            style={{ padding: "0.75rem 2rem", background: "#d4a843", color: "#000", borderRadius: "0.75rem", border: "none", cursor: "pointer", fontWeight: "bold" }}
          >
            Spróbuj ponownie
          </button>
        </div>
      </body>
    </html>
  )
}
