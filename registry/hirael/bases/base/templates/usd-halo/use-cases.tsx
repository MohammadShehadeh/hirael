import { ArrowRight } from 'lucide-react';

const USE_CASES_VIDEO = '/media/templates/usd-halo/use-cases.mp4';

export const UseCasesSection = () => {
  return (
    <section className="bg-[#F5F5F5] px-6 py-24">
      <div className="mx-auto grid max-w-[88rem] grid-cols-1 items-start gap-8 md:grid-cols-2">
        <div className="md:pe-12 md:pt-2">
          <p className="mb-2 text-sm text-black/60">USD Halo in Practice</p>
          <h2
            className="mb-6 text-5xl font-medium leading-none text-black md:text-6xl"
            style={{ letterSpacing: '-0.04em' }}
          >
            Use modes
          </h2>
          <p className="max-w-sm text-base leading-relaxed text-black/60">
            USD Halo powers a wide range of modes for builders, companies and treasuries wanting safe and rewarding
            stablecoin integrations plus more
          </p>
        </div>

        <div className="relative min-h-[720px] overflow-hidden rounded-3xl">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            src={USE_CASES_VIDEO}
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/15 to-transparent" />
          <div className="relative z-10 p-10 md:p-12">
            <h3
              className="mb-5 text-4xl font-medium leading-tight text-black md:text-5xl"
              style={{ letterSpacing: '-0.03em' }}
            >
              Commerce
            </h3>
            <p className="mb-8 max-w-md text-base text-black/70">
              Lift customer retention by offering USD Halo, a trusted dollar-backed stablecoin with strong yields,
              letting your patrons earn with zero effort on your platform.
            </p>
            <a href="#" className="group inline-flex items-center gap-3 text-base font-medium text-black">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur transition-colors duration-200 group-hover:bg-white">
                <ArrowRight className="h-4 w-4 text-black rtl:rotate-180" />
              </span>
              Know more
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
