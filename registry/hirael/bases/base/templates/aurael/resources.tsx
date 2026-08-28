import { ArrowUpRight } from 'lucide-react';

import { cn } from '@/lib/utils';

import { LOREM, Accent, Band, Lead, Reveal, type Lang } from './primitives';

const COPY = {
  en: {
    label: 'Consectetur',
    note: LOREM.en.short,
    title: 'Lorem ipsum dolor sit',
    accent: 'amet consectetur.',
    items: [
      { tag: 'Lorem', title: 'Lorem ipsum dolor sit amet consectetur', meta: '6 min' },
      { tag: 'Lorem', title: 'Consectetur adipiscing elit sed eiusmod', meta: '4 min' },
      { tag: 'Ipsum', title: 'Tempor incididunt ut labore et dolore', meta: '3 min' },
    ],
  },
  ar: {
    label: 'كونسيكتيتور',
    note: LOREM.ar.short,
    title: 'لوريم إيبسوم دولور سيت',
    accent: 'أميت كونسيكتيتور.',
    items: [
      { tag: 'لوريم', title: 'لوريم إيبسوم دولور سيت أميت كونسيكتيتور', meta: '٦ دقائق' },
      { tag: 'لوريم', title: 'كونسيكتيتور أديبيسكينج إليت سيد إيوسمود', meta: '٤ دقائق' },
      { tag: 'إيبسوم', title: 'تيمبور إنسيديدنت أوت لابوري إت دولوري', meta: '٣ دقائق' },
    ],
  },
} satisfies Record<Lang, unknown>;

export const Resources = ({ lang }: { lang: Lang }) => {
  const c = COPY[lang];
  return (
    <Band id="resources" index="05" label={c.label} note={c.note} lang={lang}>
      <Reveal>
        <Lead lang={lang}>
          {c.title} <Accent>{c.accent}</Accent>
        </Lead>
      </Reveal>

      <ul className="mt-12">
        {c.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.04}>
            <li>
              <a
                href="#"
                className="group grid grid-cols-[3.5rem_1fr_auto] items-baseline gap-4 border-t border-border py-5"
              >
                <span
                  className={cn('text-xs text-muted-foreground', lang === 'en' && 'font-mono uppercase tracking-wider')}
                >
                  {item.tag}
                </span>
                <span className="text-base font-medium text-foreground sm:text-lg">{item.title}</span>
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  {item.meta}
                  <ArrowUpRight className="size-4 transition-colors group-hover:text-foreground rtl:-scale-x-100" />
                </span>
              </a>
            </li>
          </Reveal>
        ))}
      </ul>
    </Band>
  );
};
