import { CtaButton, SectionLabel } from './primitives';

const ABOUT_VIDEO = '/media/templates/akor/about.mp4';

export const About = () => {
  return (
    <section id="about" data-slot="about" className="bg-[var(--akor-ink)] px-8 pb-24 pt-12 lg:px-16 lg:pb-32 lg:pt-16">
      <SectionLabel>About Us</SectionLabel>

      <div className="flex flex-col items-stretch gap-12 lg:flex-row lg:gap-0">
        <div className="lg:w-[45%]">
          <video
            className="h-auto w-full rounded-sm"
            src={ABOUT_VIDEO}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden
            tabIndex={-1}
          />
        </div>

        <div aria-hidden className="mx-10 mt-8 hidden w-px bg-muted-foreground/20 lg:block" />

        <div className="flex min-h-[500px] flex-1 flex-col justify-between lg:min-h-[600px]">
          <h2 className="text-3xl font-normal leading-[1.15] tracking-tight text-foreground sm:text-4xl">
            AI-powered security, automation for businesses and smart infrastructures
          </h2>

          <div className="mt-auto pt-12">
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
              AKOR designs and runs security systems that learn. We pair on-site hardware and building automation with
              models trained on real incidents, so the places people work and live respond to risk before it becomes an
              event.
            </p>
            <CtaButton className="mt-10">Get Quote</CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
};
