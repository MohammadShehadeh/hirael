import { ArrowRight } from "lucide-react"

const USE_CASE_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_183428_ab5e672a-f608-4dcb-b319-f3e040f02e2d.mp4"

export function UseCasesSection() {
  return (
    <section className="bg-[#F5F5F5] px-6 py-24">
      <div className="mx-auto grid max-w-[88rem] grid-cols-1 items-start gap-8 md:grid-cols-2">
        <div className="md:pr-12 md:pt-2">
          <p className="mb-2 text-sm text-black/60">USD Halo in Practice</p>
          <h2
            className="mb-6 text-5xl font-medium leading-none md:text-6xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            Use modes
          </h2>
          <p className="max-w-sm text-base leading-relaxed text-black/60">
            USD Halo powers a wide range of modes for builders, companies and
            treasuries wanting safe and rewarding stablecoin integrations plus
            more
          </p>
        </div>

        <div className="relative min-h-[720px] overflow-hidden rounded-3xl">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            src={USE_CASE_VIDEO}
          />

          <div className="relative z-10 p-10 md:p-12">
            <h3
              className="mb-5 text-4xl font-medium leading-tight text-black md:text-5xl"
              style={{ letterSpacing: "-0.03em" }}
            >
              Commerce
            </h3>
            <p className="mb-8 max-w-md text-base text-black/70">
              Lift customer retention by offering USD Halo, a trusted
              dollar-backed stablecoin with strong yields, letting your patrons
              earn with zero effort on your platform.
            </p>
            <button
              type="button"
              className="group inline-flex items-center gap-3 text-base font-medium text-black"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur transition-colors duration-200 group-hover:bg-white">
                <ArrowRight className="h-4 w-4 text-black" />
              </span>
              Know more
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
