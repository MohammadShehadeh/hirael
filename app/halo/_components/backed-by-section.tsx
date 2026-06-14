import type { CSSProperties } from "react"

const BACKERS: { name: string; style: CSSProperties }[] = [
  {
    name: "Fundamental Labs",
    style: {
      fontFamily: "'Times New Roman', serif",
      fontWeight: 400,
      letterSpacing: "0.02em",
      fontSize: "14px",
    },
  },
  {
    name: "KUCOIN",
    style: {
      fontFamily: "'Arial Black', sans-serif",
      fontWeight: 900,
      letterSpacing: "0.08em",
      fontSize: "16px",
    },
  },
  {
    name: "NGC",
    style: {
      fontFamily: "Impact, sans-serif",
      fontWeight: 700,
      letterSpacing: "0.05em",
      fontSize: "18px",
    },
  },
  {
    name: "NxGen",
    style: {
      fontFamily: "Georgia, serif",
      fontWeight: 600,
      letterSpacing: "-0.02em",
      fontSize: "17px",
    },
  },
  {
    name: "Matter Labs",
    style: {
      fontFamily: "Helvetica, sans-serif",
      fontWeight: 700,
      letterSpacing: "-0.01em",
      fontSize: "15px",
    },
  },
  {
    name: "DEXTools",
    style: {
      fontFamily: "Verdana, sans-serif",
      fontWeight: 700,
      letterSpacing: "0.06em",
      fontSize: "14px",
      textTransform: "uppercase",
    },
  },
  {
    name: "NGRAVE",
    style: {
      fontFamily: "'Courier New', monospace",
      fontWeight: 700,
      letterSpacing: "0.18em",
      fontSize: "14px",
    },
  },
  {
    name: "Polychain",
    style: {
      fontFamily: "Palatino, serif",
      fontWeight: 500,
      letterSpacing: "0.03em",
      fontSize: "15px",
    },
  },
]

export function BackedBySection() {
  return (
    <section className="bg-[#F5F5F5] px-6 py-16">
      <div className="mx-auto grid max-w-[88rem] grid-cols-1 items-center gap-8 md:grid-cols-4">
        <p className="text-base leading-relaxed text-black/70">
          Funded by premier partners
          <br />
          and forward-thinking leaders.
        </p>

        <div className="overflow-hidden md:col-span-3">
          <div className="backers-track">
            {[...BACKERS, ...BACKERS].map((backer, index) => (
              <span
                key={`${backer.name}-${index}`}
                className="mx-10 shrink-0 whitespace-nowrap text-black/50"
                style={backer.style}
              >
                {backer.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
