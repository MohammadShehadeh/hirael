import { ImageResponse } from "next/og"

import { SITE } from "@/lib/site"

export const alt = `${SITE.name} — ${SITE.description}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(255,255,255,0.06), transparent 70%)",
          color: "#f5f5f5",
          fontFamily: "serif",
          padding: 64,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 56,
            left: 56,
            width: 24,
            height: 24,
            borderTop: "2px solid #f5f5f5",
            borderLeft: "2px solid #f5f5f5",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 56,
            right: 56,
            width: 24,
            height: 24,
            borderTop: "2px solid #f5f5f5",
            borderRight: "2px solid #f5f5f5",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 56,
            left: 56,
            width: 24,
            height: 24,
            borderBottom: "2px solid #f5f5f5",
            borderLeft: "2px solid #f5f5f5",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 56,
            right: 56,
            width: 24,
            height: 24,
            borderBottom: "2px solid #f5f5f5",
            borderRight: "2px solid #f5f5f5",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: "monospace",
            fontSize: 18,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "rgba(245,245,245,0.6)",
          }}
        >
          <span>{SITE.registry.name}</span>
          <span style={{ color: "rgba(245,245,245,0.3)" }}>/</span>
          <span>v{SITE.version}</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            gap: 32,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 200,
                height: 200,
                fontSize: 260,
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                style={{
                  fontSize: 128,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.95,
                  color: "#f5f5f5",
                }}
              >
                MSH UI
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 16,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "rgba(245,245,245,0.5)",
                }}
              >
                peer registry · shadcn cli
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: 40,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              maxWidth: 1000,
              color: "#f5f5f5",
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <span style={{ color: "rgba(245,245,245,0.55)" }}>
              The components shadcn doesn&apos;t ship —
            </span>
            <span style={{ fontWeight: 600 }}>
              multi-select, combobox, tag input, file dropzone
            </span>
            <span style={{ color: "rgba(245,245,245,0.55)" }}>
              and the rest.
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "monospace",
            fontSize: 18,
            color: "rgba(245,245,245,0.55)",
          }}
        >
          <span>{SITE.url.replace(/^https?:\/\//, "")}</span>
          <span>{SITE.author}</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
