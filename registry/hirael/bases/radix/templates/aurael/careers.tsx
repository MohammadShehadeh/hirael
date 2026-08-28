import { ArrowUpRight } from 'lucide-react';

import { LOREM, Accent, Band, Lead, Reveal, type Lang } from './primitives';

const COPY = {
  en: {
    label: 'Sit amet',
    note: LOREM.en.short,
    title: 'Lorem ipsum dolor sit',
    accent: 'amet consectetur.',
    roles: [
      { title: 'Lorem ipsum', meta: 'Dolor sit · amet' },
      { title: 'Dolor sit amet', meta: 'Consectetur · amet' },
      { title: 'Consectetur adipiscing', meta: 'Elit · amet' },
      { title: 'Sed eiusmod tempor', meta: 'Incididunt · amet' },
    ],
  },
  ar: {
    label: 'سيت أميت',
    note: LOREM.ar.short,
    title: 'لوريم إيبسوم دولور سيت',
    accent: 'أميت كونسيكتيتور.',
    roles: [
      { title: 'لوريم إيبسوم', meta: 'دولور سيت · أميت' },
      { title: 'دولور سيت أميت', meta: 'كونسيكتيتور · أميت' },
      { title: 'كونسيكتيتور أديبيسكينج', meta: 'إليت · أميت' },
      { title: 'سيد إيوسمود تيمبور', meta: 'إنسيديدنت · أميت' },
    ],
  },
} satisfies Record<Lang, unknown>;

export const Careers = ({ lang }: { lang: Lang }) => {
  const c = COPY[lang];
  return (
    <Band id="careers" index="04" label={c.label} note={c.note} lang={lang}>
      <Reveal>
        <Lead lang={lang}>
          {c.title} <Accent>{c.accent}</Accent>
        </Lead>
      </Reveal>

      <ul className="mt-12">
        {c.roles.map((role, i) => (
          <Reveal key={role.title} delay={i * 0.04}>
            <li>
              <a href="#" className="group flex items-center justify-between gap-4 border-t border-border py-5">
                <div className="min-w-0">
                  <h3 className="text-base font-medium text-foreground transition-colors sm:text-lg">{role.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{role.meta}</p>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground rtl:-scale-x-100" />
              </a>
            </li>
          </Reveal>
        ))}
      </ul>
    </Band>
  );
};
