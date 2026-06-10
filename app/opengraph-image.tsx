import { ImageResponse } from "next/og"

import { SITE } from "@/lib/site"
import { REGISTRY } from "@/registry/hirael/registry-meta"

export const dynamic = "force-static"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = `${SITE.name} — ${SITE.description}`

export default function OpenGraphImage() {
  const components = REGISTRY.filter(
    (r) => r.category !== "blocks"
  ).length
  const blocks = REGISTRY.filter((r) => r.category === "blocks").length

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090b",
          color: "#fafafa",
          fontFamily: "serif",
          padding: 80,
        }}
      >
        <svg
          width="160"
          height="200"
          viewBox="0 0 80 100"
          fill="none"
          stroke="#fafafa"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginBottom: 36 }}
        >
          <path d="M16 78 V40 a24 24 0 0 1 48 0 V78" />
          <path d="M40 44 L43.2 52 L51 55 L43.2 58 L40 66 L36.8 58 L29 55 L36.8 52 Z" />
          <path d="M22 86 H58" opacity="0.7" />
          <path d="M28 92 H52" opacity="0.45" />
          <path d="M34 96 H46" opacity="0.25" />
        </svg>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 170,
            fontSize: 128,
            letterSpacing: 24,
            paddingLeft: 24,
            fontWeight: 500,
          }}
        >
          HIRAEL
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 28,
            letterSpacing: 6,
            paddingLeft: 6,
            color: "#a1a1aa",
            textTransform: "uppercase",
          }}
        >
          Longing · Memory · Light
        </div>
        <div
          style={{
            marginTop: 72,
            fontSize: 24,
            color: "#a1a1aa",
            fontFamily: "sans-serif",
            letterSpacing: 0.5,
          }}
        >
          {SITE.description}
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 20,
            color: "#fafafa",
            fontFamily: "monospace",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          {`${components} components · ${blocks} blocks · shadcn registry`}
        </div>
      </div>
    ),
    { ...size }
  )
}
