import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        background: "linear-gradient(135deg, #0d0d18 0%, #07070c 100%)",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Oscar statuette */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        {/* Head */}
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#d4a843" }} />
        {/* Neck */}
        <div style={{ width: 3, height: 2, background: "#d4a843" }} />
        {/* Shoulders + body */}
        <div style={{ width: 13, height: 7, background: "#d4a843", borderRadius: "2px 2px 0 0" }} />
        {/* Pedestal wide */}
        <div style={{ width: 17, height: 3, background: "#c49232", borderRadius: "0 0 3px 3px" }} />
      </div>
    </div>,
    { width: 32, height: 32 }
  )
}
