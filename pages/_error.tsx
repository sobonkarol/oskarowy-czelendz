import type { NextPageContext } from "next"

type Props = { statusCode: number }

export default function Error({ statusCode }: Props) {
  return (
    <div style={{ padding: 32, textAlign: "center", background: "#07070c", color: "#f0e6c8", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 48, color: "#d4a843" }}>{statusCode}</h1>
      <p>Wystąpił nieoczekiwany błąd.</p>
    </div>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}
