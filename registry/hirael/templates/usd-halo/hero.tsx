import { Marquee, type MarqueeBrand, PillButton } from "./primitives"

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38XZzbokvIgWjottwiXH07Lwa1P/HF_20260423_161253_C72B1869-400F-45ED-AC0C-52F68C2ED5BD.mp4"

const HERO_BRANDS: MarqueeBrand[] = [
  {
    name: "Stripe",
    style: {
      fontFamily: "Georgia, 'Times New Roman', serif",
      fontWeight: 700,
      letterSpacing: "-0.02em",
      fontSize: "15px",
    },
  },
  {
    name: "Coinbase",
    style: {
      fontFamily: "Arial, Helvetica, sans-serif",
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

export function HeroSection() {
  return (
    <section className="flex flex-1 items-end px-6 pb-6 pt-20">
      <div
        className="relative mx-auto w-full max-w-[88rem] overflow-hidden rounded-2xl"
        style={{ height: "calc(100vh - 96px)" }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
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
              fontFamily:
                "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
            }}
          >
            An automated, reward-powered digital dollar built for native passive
            earnings and effortless connection into DeFi.
          </p>

          <PillButton label="Join us" large />

          <div className="mt-24 w-full max-w-md overflow-hidden">
            <Marquee
              brands={HERO_BRANDS}
              trackClass="marquee-track"
              keyframesName="marquee"
              durationSeconds={22}
              itemClass="mx-7 shrink-0 whitespace-nowrap text-black/60"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
