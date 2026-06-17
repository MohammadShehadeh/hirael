import { ImageResponse } from "next/og";

export const dynamic = "force-static";

const SIZE = 512;

export function GET() {
  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 112,
        backgroundImage: "linear-gradient(180deg, #252C37 0%, #161B22 100%)",
        border: "2px solid rgba(231,228,222,0.12)",
        boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
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
          borderTopLeftRadius: 112,
          borderTopRightRadius: 112,
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 100%)",
        }}
      />
      <svg width="368" height="368" viewBox="80 104 352 352" fill="none">
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
    </div>,
    { width: SIZE, height: SIZE },
  );
}
