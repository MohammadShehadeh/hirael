import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 14,
        backgroundImage: "linear-gradient(180deg, #252C37 0%, #161B22 100%)",
        border: "1px solid rgba(231,228,222,0.12)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.45)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "46%",
          display: "flex",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 100%)",
        }}
      />
      <svg
        width="44"
        height="55"
        viewBox="0 0 80 100"
        fill="none"
        stroke="#E7E4DE"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 78 V40 a24 24 0 0 1 48 0 V78" />
        <path d="M40 44 L43.2 52 L51 55 L43.2 58 L40 66 L36.8 58 L29 55 L36.8 52 Z" />
        <path d="M18 84 H62" opacity="0.85" />
        <path d="M24 89 H56" opacity="0.5" />
        <path d="M30 94 H50" opacity="0.28" />
      </svg>
    </div>,
    { ...size },
  );
}
