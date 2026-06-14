import { PillButton } from "./primitives"

const CARD_IMAGE =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38XZzbokvIgWjottwiXH07Lwa1P%2FHF_20260423_164207_F243351D-ED59-48EC-83A0-A5E996BDBE3C.PNG&w=1280&q=85"

export function InfoSection() {
  return (
    <section className="bg-[#F5F5F5] px-6 py-24">
      <div className="mx-auto max-w-[88rem]">
        <div className="mb-16 grid grid-cols-1 items-start gap-12 md:grid-cols-2">
          <div>
            <h2
              className="mb-8 text-4xl font-medium leading-tight text-black md:text-5xl"
              style={{ letterSpacing: "-0.03em" }}
            >
              Meet USD Halo.
            </h2>
            <PillButton label="Discover it" />
          </div>
          <p className="text-2xl leading-relaxed text-black/70 md:text-3xl">
            USD Halo is a reward-earning dollar coin that lets your savings grow
            while remaining tied to the U.S. dollar.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
            className="flex min-h-80 flex-col justify-between rounded-2xl p-7 lg:col-span-2"
            style={{
              backgroundImage: `url(${CARD_IMAGE})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h3
              className="text-2xl font-medium leading-snug text-black"
              style={{ letterSpacing: "-0.02em" }}
            >
              Savings that bloom
            </h3>
            <p className="max-w-xs text-base text-black/70">
              Gain steady returns as your dollar tokens are routed into
              top-performing DeFi strategies.
            </p>
          </div>

          <div className="flex min-h-80 flex-col justify-between rounded-2xl bg-[#2B2644] p-7">
            <h3
              className="text-2xl font-medium leading-snug text-white"
              style={{ letterSpacing: "-0.02em" }}
            >
              Always fluid,
              <br />
              always pegged.
            </h3>
            <p className="text-base text-white/60">
              Keep fully dollar-anchored with on-demand access to funds, no
              lockups or waits.
            </p>
          </div>

          <div className="flex min-h-80 flex-col justify-between rounded-2xl bg-[#2B2644] p-7">
            <h3
              className="text-2xl font-medium leading-snug text-white"
              style={{ letterSpacing: "-0.02em" }}
            >
              Fully
              <br />
              automated
            </h3>
            <p className="text-base text-white/60">
              Skip the task of tuning positions yourself. USD Halo runs in the
              background for you.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
