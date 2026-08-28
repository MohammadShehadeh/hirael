import { LOREM, Accent, Band, Lead, Reveal, type Lang } from './primitives';

const COPY = {
  en: {
    label: 'Adipiscing',
    note: LOREM.en.short,
    title: 'Lorem ipsum dolor sit',
    accent: 'amet consectetur.',
    quote: LOREM.en.medium,
    author: 'Lorem Ipsum',
    location: 'Dolor sit amet',
    proof: [
      { value: '4.9/5', label: 'Lorem ipsum' },
      { value: '98%', label: 'Dolor sit' },
      { value: '24/7', label: 'Amet' },
      { value: '5 yr', label: 'Consectetur' },
    ],
  },
  ar: {
    label: 'أديبيسكينج',
    note: LOREM.ar.short,
    title: 'لوريم إيبسوم دولور سيت',
    accent: 'أميت كونسيكتيتور.',
    quote: LOREM.ar.medium,
    author: 'لوريم إيبسوم',
    location: 'دولور سيت أميت',
    proof: [
      { value: '٤٫٩/٥', label: 'لوريم إيبسوم' },
      { value: '٩٨٪', label: 'دولور سيت' },
      { value: '٢٤/٧', label: 'أميت' },
      { value: '٥ سنوات', label: 'كونسيكتيتور' },
    ],
  },
} satisfies Record<Lang, unknown>;

export const Customers = ({ lang }: { lang: Lang }) => {
  const c = COPY[lang];
  return (
    <Band id="customers" index="06" label={c.label} note={c.note} lang={lang}>
      <Reveal>
        <Lead lang={lang}>
          {c.title} <Accent>{c.accent}</Accent>
        </Lead>
      </Reveal>

      <Reveal delay={0.06}>
        <figure className="mt-12 border-t border-border pt-10">
          <blockquote>
            <p className="max-w-xl text-balance text-2xl font-medium leading-snug text-foreground sm:text-3xl">
              {c.quote}
            </p>
          </blockquote>
          <figcaption className="mt-6 text-sm text-muted-foreground">
            <span className="text-foreground">{c.author}</span>
            {' · '}
            {c.location}
          </figcaption>
        </figure>
      </Reveal>

      <Reveal delay={0.1}>
        <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-4">
          {c.proof.map((item) => (
            <div key={item.label} className="bg-background p-5">
              <dt className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">{item.value}</dt>
              <dd className="mt-1 text-xs text-muted-foreground">{item.label}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Band>
  );
};
