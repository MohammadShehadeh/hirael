'use client';

import { ArrowUpRight } from 'lucide-react';

import { cn } from '@/lib/utils';

import { LOREM, Reveal, SectionHeader, type Lang } from './primitives';

const PROJECT_IDS = ['northwind', 'pipeline', 'cascade', 'bazaar', 'meridian', 'ledger', 'atlas', 'playfield'] as const;

type ProjectId = (typeof PROJECT_IDS)[number];

const COPY = {
  en: {
    pretitle: 'Sit amet',
    title: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor.',
    projectLink: 'Lorem ipsum',
    items: {
      northwind: {
        title: 'Lorem Ipsum',
        category: 'Lorem',
        description: LOREM.en.medium,
      },
      pipeline: {
        title: 'Dolor Sit',
        category: 'Ipsum',
        description: LOREM.en.medium,
      },
      cascade: {
        title: 'Amet Consectetur',
        category: 'Sed eiusmod',
        description: LOREM.en.medium,
      },
      bazaar: {
        title: 'Adipiscing Elit',
        category: 'Amet',
        description: LOREM.en.medium,
      },
      meridian: {
        title: 'Sed Eiusmod',
        category: 'Consectetur',
        description: LOREM.en.medium,
      },
      ledger: {
        title: 'Tempor Incididunt',
        category: 'Adipiscing',
        description: LOREM.en.medium,
      },
      atlas: {
        title: 'Ut Labore',
        category: 'Sed eiusmod',
        description: LOREM.en.medium,
      },
      playfield: {
        title: 'Et Dolore',
        category: 'Elit',
        description: LOREM.en.medium,
      },
    },
  },
  ar: {
    pretitle: 'سيت أميت',
    title: 'لوريم إيبسوم دولور سيت أميت كونسيكتيتور أديبيسكينج إليت سيد دو إيوسمود.',
    projectLink: 'لوريم إيبسوم',
    items: {
      northwind: {
        title: 'لوريم إيبسوم',
        category: 'لوريم',
        description: LOREM.ar.medium,
      },
      pipeline: {
        title: 'دولور سيت',
        category: 'إيبسوم',
        description: LOREM.ar.medium,
      },
      cascade: {
        title: 'أميت كونسيكتيتور',
        category: 'سيد إيوسمود',
        description: LOREM.ar.medium,
      },
      bazaar: {
        title: 'أديبيسكينج إليت',
        category: 'أميت',
        description: LOREM.ar.medium,
      },
      meridian: {
        title: 'سيد إيوسمود',
        category: 'كونسيكتيتور',
        description: LOREM.ar.medium,
      },
      ledger: {
        title: 'تيمبور إنسيديدنت',
        category: 'أديبيسكينج',
        description: LOREM.ar.medium,
      },
      atlas: {
        title: 'أوت لابوري',
        category: 'سيد إيوسمود',
        description: LOREM.ar.medium,
      },
      playfield: {
        title: 'إت دولوري',
        category: 'إليت',
        description: LOREM.ar.medium,
      },
    },
  },
} satisfies Record<
  Lang,
  { items: Record<ProjectId, { title: string; category: string; description: string }> } & Record<string, unknown>
>;

/**
 * Stand-in for a project screenshot: an accent-washed panel carrying the entry
 * index. Swap the whole element for an `<Image>` once real artwork exists.
 */
const ProjectPlaceholder = ({ index }: { index: number }) => {
  return (
    <div
      aria-hidden
      data-slot="project-placeholder"
      className="absolute inset-0 bg-secondary"
      style={{
        backgroundImage: [
          `radial-gradient(120% 90% at ${index % 2 === 0 ? '15%' : '85%'} 0%, color-mix(in oklch, var(--primary) 26%, transparent), transparent 62%)`,
          'linear-gradient(160deg, color-mix(in oklch, var(--foreground) 7%, transparent), transparent 55%)',
        ].join(', '),
      }}
    >
      <span className="absolute bottom-4 end-5 font-mono text-6xl font-medium text-foreground/10 sm:text-7xl">
        {String(index + 1).padStart(2, '0')}
      </span>
    </div>
  );
};

export const Works = ({ lang }: { lang: Lang }) => {
  const c = COPY[lang];

  return (
    <section id="works" className="py-20 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-6">
        <SectionHeader lang={lang} pretitle={c.pretitle} title={c.title} />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {PROJECT_IDS.map((id, index) => {
            const copy = c.items[id];
            return (
              <Reveal key={id} delay={(index % 2) * 120}>
                <a
                  href="#"
                  aria-label={`${copy.title} — ${copy.category}`}
                  className="group relative block overflow-hidden rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-card">
                    <ProjectPlaceholder index={index} />
                    {/* Persistent gradient keeps the label legible. */}
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"
                    />
                    {/* Extra dim on interaction lifts the revealed copy. */}
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-black/55 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
                    />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                    <p
                      className={cn(
                        'text-xs font-medium text-primary',
                        lang === 'en' ? 'uppercase tracking-[0.2em]' : 'text-sm tracking-normal',
                      )}
                    >
                      {copy.category}
                    </p>
                    <h3 data-slot="novael-display" className="mt-1 text-xl font-medium text-white sm:text-2xl">
                      {copy.title}
                    </h3>

                    {/* Description expands on hover / keyboard focus. */}
                    <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
                      <div className="overflow-hidden">
                        <p className="pt-3 text-sm font-light leading-relaxed text-white/70">{copy.description}</p>
                      </div>
                    </div>

                    <span className="mt-4 inline-flex translate-y-1 items-center gap-2 text-xs font-medium tracking-wide text-white opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 rtl:tracking-normal">
                      {c.projectLink}
                      <ArrowUpRight className="size-3.5 rtl:-scale-x-100" />
                    </span>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
