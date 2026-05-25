import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          borderRadius: 36,
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 180,
            fontWeight: 700,
            lineHeight: 1,
            color: "transparent",
            backgroundImage:
              "linear-gradient(to bottom, #000000 0%, #000000 36%, #FFFFFF 36%, #FFFFFF 58%, #007A3D 58%, #007A3D 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
          }}
        >
          M
        </div>
      </div>
    ),
    { ...size }
  )
}
