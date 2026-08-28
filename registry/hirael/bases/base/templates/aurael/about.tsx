import { ArrowUpRight } from 'lucide-react';

import { LOREM, Band, Lead, Reveal, type Lang } from './primitives';

const COPY = {
  en: {
    label: 'Dolor',
    note: LOREM.en.short,
    statement: 'Lorem ipsum dolor sit amet consectetur.',
    body: LOREM.en.long,
    cta: 'Lorem ipsum',
    stats: [
      { value: '400+', label: 'Lorem ipsum' },
      { value: '3.2 MWp', label: 'Dolor sit' },
      { value: '9', label: 'Amet' },
      { value: '7 yrs', label: 'Consectetur' },
    ],
  },
  ar: {
    label: 'دولور',
    note: LOREM.ar.short,
    statement: 'لوريم إيبسوم دولور سيت أميت.',
    body: LOREM.ar.long,
    cta: 'لوريم إيبسوم',
    stats: [
      { value: '+٤٠٠', label: 'لوريم إيبسوم' },
      { value: '٣٫٢ ميغاواط', label: 'دولور سيت' },
      { value: '٩', label: 'أميت' },
      { value: '٧ سنوات', label: 'كونسيكتيتور' },
    ],
  },
} satisfies Record<Lang, unknown>;

export const About = ({ lang }: { lang: Lang }) => {
  const c = COPY[lang];
  return (
    <Band id="about" index="03" label={c.label} note={c.note} lang={lang}>
      <Reveal>
        <Lead lang={lang}>{c.statement}</Lead>
      </Reveal>
      <Reveal delay={0.06}>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">{c.body}</p>
      </Reveal>
      <Reveal delay={0.1}>
        <a href="#" className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground">
          {c.cta}
          <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-foreground rtl:-scale-x-100" />
        </a>
      </Reveal>

      <Reveal delay={0.12}>
        <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-4">
          {c.stats.map((stat) => (
            <div key={stat.label} className="bg-background p-5">
              <dt className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">{stat.value}</dt>
              <dd className="mt-1 text-xs text-muted-foreground">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Band>
  );
};
