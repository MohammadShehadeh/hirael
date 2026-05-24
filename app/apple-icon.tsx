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
          background: "#0D1117",
        }}
      >
        <svg
          width="120"
          height="150"
          viewBox="0 0 80 100"
          fill="none"
          stroke="#E7E4DE"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 78 V40 a24 24 0 0 1 48 0 V78" />
          <path d="M40 44 L43.2 52 L51 55 L43.2 58 L40 66 L36.8 58 L29 55 L36.8 52 Z" />
          <path d="M22 86 H58" opacity="0.7" />
          <path d="M28 92 H52" opacity="0.45" />
          <path d="M34 96 H46" opacity="0.25" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
