import { LOREM, Accent, Band, Lead, Reveal, type Lang } from './primitives';

const COPY = {
  en: {
    label: 'Lorem',
    note: LOREM.en.short,
    title: 'Lorem ipsum dolor sit',
    accent: 'amet consectetur.',
    steps: [
      {
        title: 'Lorem ipsum',
        body: LOREM.en.short,
      },
      {
        title: 'Dolor sit amet',
        body: LOREM.en.short,
      },
      {
        title: 'Consectetur adipiscing',
        body: LOREM.en.short,
      },
      {
        title: 'Sed eiusmod tempor',
        body: LOREM.en.short,
      },
    ],
  },
  ar: {
    label: 'لوريم',
    note: LOREM.ar.short,
    title: 'لوريم إيبسوم دولور سيت',
    accent: 'أميت كونسيكتيتور.',
    steps: [
      {
        title: 'لوريم إيبسوم',
        body: LOREM.ar.short,
      },
      {
        title: 'دولور سيت أميت',
        body: LOREM.ar.short,
      },
      {
        title: 'كونسيكتيتور أديبيسكينج',
        body: LOREM.ar.short,
      },
      {
        title: 'سيد إيوسمود تيمبور',
        body: LOREM.ar.short,
      },
    ],
  },
} satisfies Record<Lang, unknown>;

export const HowItWorks = ({ lang }: { lang: Lang }) => {
  const c = COPY[lang];
  return (
    <Band id="how-it-works" index="01" label={c.label} note={c.note} lang={lang}>
      <Reveal>
        <Lead lang={lang}>
          {c.title} <Accent>{c.accent}</Accent>
        </Lead>
      </Reveal>

      <ol className="mt-12">
        {c.steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.05}>
            <li className="grid grid-cols-[2.5rem_1fr] gap-5 border-t border-border py-7 sm:grid-cols-[4rem_1fr]">
              <span className="font-mono text-sm text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="text-lg font-medium text-foreground">{step.title}</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </Band>
  );
};
