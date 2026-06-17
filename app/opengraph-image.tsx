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
        width="150"
        height="150"
        viewBox="80 104 352 352"
        fill="none"
        style={{ marginBottom: 36 }}
      >
        <path
          d="M160 340V235C160 171 203 128 256 128C309 128 352 171 352 235V340"
          fill="none"
          stroke="#E7E4DE"
          strokeWidth="18"
          strokeLinecap="square"
        />
        <path
          d="M256 220C262 242 274 254 296 260C274 266 262 278 256 300C250 278 238 266 216 260C238 254 250 242 256 220Z"
          fill="#E7E4DE"
        />
        <path
          d="M95 372C160 364 352 364 417 372C352 380 160 380 95 372Z"
          fill="#E7E4DE"
        />
        <path
          d="M135 405C185 399 327 399 377 405C327 411 185 411 135 405Z"
          fill="#E7E4DE"
        />
        <path
          d="M190 438C220 434 292 434 322 438C292 442 220 442 190 438Z"
          fill="#E7E4DE"
        />
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
