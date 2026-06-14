import type { CSSProperties } from "react"

import { ArrowPillButton } from "./primitives"

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_161253_c72b1869-400f-45ed-ac0c-52f68c2ed5bd.mp4"

const HERO_BRANDS: { name: string; style: CSSProperties }[] = [
  {
    name: "Stripe",
    style: {
      fontFamily: "Georgia, serif",
      fontWeight: 700,
      letterSpacing: "-0.02em",
      fontSize: "15px",
    },
  },
  {
    name: "Coinbase",
    style: {
      fontFamily: "Arial, sans-serif",
      fontWeight: 900,
      letterSpacing: "0.08em",
      fontSize: "13px",
      textTransform: "uppercase",
    },
  },
  {
    name: "Uniswap",
    style: {
      fontFamily: "'Trebuchet MS', sans-serif",
      fontWeight: 600,
      letterSpacing: "0.01em",
      fontSize: "15px",
      fontStyle: "italic",
    },
  },
  {
    name: "Aave",
    style: {
      fontFamily: "'Courier New', monospace",
      fontWeight: 700,
      letterSpacing: "0.12em",
      fontSize: "13px",
      textTransform: "uppercase",
    },
  },
  {
    name: "Compound",
    style: {
      fontFamily: "Palatino, 'Book Antiqua', serif",
      fontWeight: 400,
      letterSpacing: "-0.01em",
      fontSize: "16px",
    },
  },
  {
    name: "MakerDAO",
    style: {
      fontFamily: "Impact, 'Arial Narrow', sans-serif",
      fontWeight: 400,
      letterSpacing: "0.04em",
      fontSize: "14px",
    },
  },
  {
    name: "Chainlink",
    style: {
      fontFamily: "Verdana, sans-serif",
      fontWeight: 700,
      letterSpacing: "-0.03em",
      fontSize: "13px",
    },
  },
]

export function Hero() {
  return (
    <section className="flex flex-1 items-end px-6 pb-6 pt-20">
      <div
        className="relative w-full overflow-hidden rounded-2xl"
        style={{ height: "calc(100vh - 96px)" }}
      >
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          src={HERO_VIDEO}
        />

        <div className="relative z-10 flex h-full flex-col items-start justify-start p-12 pt-36">
          <h1
            className="mb-4 max-w-xl text-5xl font-medium leading-tight text-black md:text-6xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            Your Wealth
            <br />
            Works
          </h1>

          <p
            className="mb-8 max-w-md text-base leading-relaxed text-black/70 md:text-lg"
            style={{
              fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
            }}
          >
            An automated, reward-powered digital dollar built for native passive
            earnings and effortless connection into DeFi.
          </p>

          <ArrowPillButton label="Join us" textClassName="text-base md:text-lg" />

          <div className="mt-24 w-full max-w-md overflow-hidden">
            <div className="marquee-track">
              {[...HERO_BRANDS, ...HERO_BRANDS].map((brand, index) => (
                <span
                  key={`${brand.name}-${index}`}
                  className="mx-7 shrink-0 whitespace-nowrap text-black/60"
                  style={brand.style}
                >
                  {brand.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
