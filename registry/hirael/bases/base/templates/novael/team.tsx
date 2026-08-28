'use client';

import { cn } from '@/lib/utils';
import { Marquee } from '@/registry/hirael/bases/base/components/marquee';

import { LOREM, Reveal, SectionHeader, type Lang } from './primitives';

/** Rendered as plain wordmarks, so the row stays locale-independent. */
const COMPANIES = ['Halcyon', 'Cobalt', 'Lumen Labs', 'Vantara', 'Orbital', 'Ardent', 'Solstice', 'Kestrel'] as const;

const COPY = {
  en: {
    pretitle: 'Lorem ipsum',
    title: 'Lorem ipsum dolor sit amet',
    lead: LOREM.en.long,
    companiesLabel: 'Consectetur adipiscing',
  },
  ar: {
    pretitle: 'لوريم إيبسوم',
    title: 'لوريم إيبسوم دولور سيت أميت',
    lead: LOREM.ar.long,
    companiesLabel: 'كونسيكتيتور أديبيسكينج',
  },
} satisfies Record<Lang, unknown>;

export const Team = ({ lang }: { lang: Lang }) => {
  const c = COPY[lang];

  return (
    <section id="team" className="py-20 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-6">
        <SectionHeader lang={lang} pretitle={c.pretitle} title={c.title} />

        <Reveal className="mx-auto mt-10 max-w-2xl text-center">
          <p className="text-lg font-light leading-relaxed text-muted-foreground">{c.lead}</p>
        </Reveal>

        <Reveal className="mt-16 border-t border-border/60 pt-12">
          <p
            className={cn(
              'text-center text-xs font-medium text-muted-foreground',
              lang === 'en' ? 'uppercase tracking-[0.3em]' : 'text-sm tracking-normal',
            )}
          >
            {c.companiesLabel}
          </p>
          {/* The wordmarks are Latin, so the track keeps its own reading order. */}
          <div dir="ltr" className="relative mt-7 w-full min-w-0 overflow-hidden">
            <Marquee pauseOnHover duration={20} gap="2rem" className="py-1">
              {COMPANIES.map((company) => (
                <span
                  key={company}
                  data-slot="novael-display"
                  className="whitespace-nowrap text-xl font-semibold tracking-wide text-foreground/70 transition-colors hover:text-foreground sm:text-2xl"
                >
                  {company}
                </span>
              ))}
            </Marquee>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
};
