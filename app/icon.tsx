import { ImageResponse } from "next/og"

export const size = { width: 512, height: 512 }
export const contentType = "image/png"

export default function Icon() {
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
          fontFamily: "serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            width: 360,
            height: 360,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 460,
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
      </div>
    ),
    { ...size }
  )
}
