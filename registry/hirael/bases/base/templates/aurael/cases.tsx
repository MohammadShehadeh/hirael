import Image from 'next/image';

import { LOREM, SCENE_IMAGE, Accent, Band, Lead, Reveal, type Lang } from './primitives';

const COPY = {
  en: {
    label: 'Ipsum',
    note: LOREM.en.short,
    title: 'Lorem ipsum dolor sit',
    accent: 'amet consectetur.',
    cases: [
      {
        image: SCENE_IMAGE.morning,
        title: 'Lorem ipsum, dolor sit',
        meta: 'Lorem ipsum · 8.5 · 22',
        alt: 'The valley at dawn, mist over the lake below the ridge',
      },
      {
        image: SCENE_IMAGE.night,
        title: 'Lorem ipsum, amet consectetur',
        meta: 'Dolor sit · amet consectetur · 0',
        alt: 'The same valley at night under a crescent moon',
      },
    ],
    statement: 'Lorem ipsum dolor. Sit amet consectetur. Adipiscing elit.',
  },
  ar: {
    label: 'إيبسوم',
    note: LOREM.ar.short,
    title: 'لوريم إيبسوم دولور سيت',
    accent: 'أميت كونسيكتيتور.',
    cases: [
      {
        image: SCENE_IMAGE.morning,
        title: 'لوريم إيبسوم، دولور سيت',
        meta: 'لوريم إيبسوم · ٨٫٥ · ٢٢',
        alt: 'الوادي عند الفجر والضباب فوق البحيرة تحت الحافة',
      },
      {
        image: SCENE_IMAGE.night,
        title: 'لوريم إيبسوم، أميت كونسيكتيتور',
        meta: 'دولور سيت · أميت كونسيكتيتور · ٠',
        alt: 'الوادي نفسه ليلاً تحت هلال',
      },
    ],
    statement: 'لوريم إيبسوم دولور. سيت أميت كونسيكتيتور. أديبيسكينج إليت.',
  },
} satisfies Record<Lang, unknown>;

export const Cases = ({ lang }: { lang: Lang }) => {
  const c = COPY[lang];
  return (
    <Band id="cases" index="02" label={c.label} note={c.note} lang={lang}>
      <Reveal>
        <Lead lang={lang}>
          {c.title} <Accent>{c.accent}</Accent>
        </Lead>
      </Reveal>

      <div className="mt-12 flex flex-col gap-10">
        {c.cases.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.05}>
            <figure>
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 44rem, 90vw"
                  className="object-cover object-center"
                />
              </div>
              <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-base font-medium text-foreground">{item.title}</span>
                <span className="text-sm text-muted-foreground">{item.meta}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="mt-14 border-t border-border pt-10 text-2xl font-medium leading-snug text-foreground sm:text-3xl">
          {c.statement}
        </p>
      </Reveal>
    </Band>
  );
};
