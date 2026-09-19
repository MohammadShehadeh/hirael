import { cn } from '@/lib/utils';

import { GlassButton, SectionIntro, VideoBackdrop } from './primitives';

const FEATURES = [
  {
    title: 'Designed to convert. Built to perform.',
    description:
      'Every pixel is intentional. Our AI studies what works across thousands of top sites, then builds yours to outperform them all.',
    action: 'Learn more',
    videoSrc: '/media/templates/prism/stats.mp4',
    reverse: false,
  },
  {
    title: 'It gets smarter. Automatically.',
    description:
      'Your site evolves on its own. AI monitors every click, scroll, and conversion, then optimizes in real time. No manual updates. Ever.',
    action: 'See how it works',
    videoSrc: '/media/templates/prism/cta.mp4',
    reverse: true,
  },
] as const;

export const Features = () => {
  return (
    <section id="services" data-slot="features" className="px-6 py-24 md:px-16 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <SectionIntro kicker="Capabilities" title="Pro features. Zero complexity." />

        <div className="mt-16 flex flex-col gap-16 md:mt-20 md:gap-24">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className={cn(
                'rise flex flex-col items-center gap-10 lg:flex-row lg:gap-16',
                feature.reverse && 'lg:flex-row-reverse [animation-delay:150ms]',
              )}
            >
              <div className="flex-1">
                <h3 className="text-3xl italic leading-[0.95] tracking-tight text-foreground [font-family:var(--font-prism-serif)] md:text-4xl">
                  {feature.title}
                </h3>
                <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-foreground/60">
                  {feature.description}
                </p>
                <GlassButton className="mt-8">{feature.action}</GlassButton>
              </div>

              <div className="liquid-glass relative aspect-[4/3] w-full flex-1 overflow-hidden rounded-2xl">
                <VideoBackdrop src={feature.videoSrc} fadeBottom={false} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
