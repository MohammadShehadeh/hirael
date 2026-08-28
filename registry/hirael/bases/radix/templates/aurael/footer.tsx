import { LOREM, type Lang } from './primitives';

const COPY = {
  en: {
    brandName: 'Aurael',
    tagline: LOREM.en.short,
    columns: [
      { heading: 'Lorem', links: ['Lorem ipsum', 'Dolor sit', 'Amet consectetur', 'Adipiscing'] },
      { heading: 'Ipsum', links: ['Sed eiusmod', 'Tempor', 'Incididunt', 'Ut labore'] },
      { heading: 'Dolor', links: ['Et dolore', 'Magna aliqua', 'Ut enim', 'Ad minim'] },
    ],
    rights: 'Lorem ipsum dolor sit amet.',
    note: 'Consectetur adipiscing',
  },
  ar: {
    brandName: 'أورايل',
    tagline: LOREM.ar.short,
    columns: [
      { heading: 'لوريم', links: ['لوريم إيبسوم', 'دولور سيت', 'أميت كونسيكتيتور', 'أديبيسكينج'] },
      { heading: 'إيبسوم', links: ['سيد إيوسمود', 'تيمبور', 'إنسيديدنت', 'أوت لابوري'] },
      { heading: 'دولور', links: ['إت دولوري', 'ماجنا أليكوا', 'أوت إينيم', 'أد مينيم'] },
    ],
    rights: 'لوريم إيبسوم دولور سيت أميت.',
    note: 'كونسيكتيتور أديبيسكينج',
  },
} satisfies Record<Lang, unknown>;

export const Footer = ({ lang }: { lang: Lang }) => {
  const c = COPY[lang];
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background px-5 transition-colors duration-500 sm:px-8 md:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-x-12 gap-y-10 py-16 lg:grid-cols-[14rem_1fr] lg:gap-x-16">
          <div>
            <span data-slot="aurael-display" className="text-base font-medium tracking-tight text-foreground">
              {c.brandName}
            </span>
            <p className="mt-3 max-w-[14rem] text-sm leading-relaxed text-muted-foreground">{c.tagline}</p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
            {c.columns.map((column) => (
              <div key={column.heading}>
                <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {column.heading}
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-foreground/70 transition-colors hover:text-foreground">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-2 border-t border-border py-7 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {year} {c.brandName}. {c.rights}
          </p>
          <p>{c.note}</p>
        </div>
      </div>
    </footer>
  );
};
