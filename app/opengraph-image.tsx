import { ImageResponse } from "next/og";

import { SITE } from "@/lib/site";
import { COMPONENTS, REGISTRY } from "@/registry/hirael/registry-meta";

export const dynamic = "force-static";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE.description} - ${SITE.name}`;

export default function OpenGraphImage() {
  const components = COMPONENTS.length;
  const blocks = REGISTRY.filter((r) => r.category === "blocks").length;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0D1117",
        color: "#E7E4DE",
        fontFamily: "serif",
        padding: 80,
      }}
    >
      <svg
        width="160"
        height="168"
        viewBox="0 13 80 84"
        fill="none"
        stroke="#E7E4DE"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginBottom: 36 }}
      >
        <path d="M16 78 V40 a24 24 0 0 1 48 0 V78" />
        <path d="M40 44 L43.2 52 L51 55 L43.2 58 L40 66 L36.8 58 L29 55 L36.8 52 Z" />
        <path d="M18 84 H62" opacity="0.85" />
        <path d="M24 89 H56" opacity="0.5" />
        <path d="M30 94 H50" opacity="0.28" />
      </svg>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 170,
          fontSize: 128,
          letterSpacing: 24,
          marginRight: -24,
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
          marginRight: -6,
          color: "#ADA69A",
          textTransform: "uppercase",
        }}
      >
        Longing · Memory · Light
      </div>
      <div
        style={{
          marginTop: 72,
          fontSize: 24,
          color: "#99A0AD",
          fontFamily: "sans-serif",
          letterSpacing: 0.5,
          marginRight: -0.5,
        }}
      >
        {SITE.description}
      </div>
      <div
        style={{
          marginTop: 20,
          fontSize: 20,
          color: "#E7E4DE",
          fontFamily: "monospace",
          letterSpacing: 3,
          marginRight: -3,
          textTransform: "uppercase",
        }}
      >
        {`${components} components · ${blocks} blocks · shadcn registry`}
      </div>
    </div>,
    { ...size },
  );
}
