import { Marquee, type MarqueeBrand, PillButton } from "./primitives";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1500043357865-c6b8827edf10?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

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
];

export function HeroSection() {
  return (
    <section className="flex flex-1 items-end px-6 pb-6 pt-20">
      <div
        className="relative mx-auto w-full max-w-[88rem] overflow-hidden rounded-2xl"
        style={{ height: "calc(100dvh - 96px)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${HERO_IMAGE})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/20 to-white/10"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/85 via-white/40 to-transparent"
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

          <div className="mt-auto w-full max-w-md overflow-hidden pt-24">
            <Marquee
              brands={HERO_BRANDS}
              trackClass="marquee-track"
              keyframesName="marquee"
              durationSeconds={22}
              itemClass="mx-7 shrink-0 whitespace-nowrap text-black/80"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
