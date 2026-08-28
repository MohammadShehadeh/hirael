'use client';

import * as React from 'react';
import { Languages, Menu, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

import { SECTION_IDS, useActiveSection, type Lang, type SectionId } from './primitives';

const COPY = {
  en: {
    toLang: 'العربية',
    home: 'Novael — home',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    menuTitle: 'Lorem ipsum',
    nav: { intro: 'Lorem', services: 'Ipsum dolor', works: 'Sit amet', contact: 'Consectetur' },
  },
  ar: {
    toLang: 'English',
    home: 'نوفايل — الرئيسية',
    openMenu: 'افتح القائمة',
    closeMenu: 'أغلق القائمة',
    menuTitle: 'لوريم إيبسوم',
    nav: { intro: 'لوريم', services: 'إيبسوم دولور', works: 'سيت أميت', contact: 'كونسيكتيتور' },
  },
} satisfies Record<Lang, { nav: Record<SectionId, string> } & Record<string, unknown>>;

const Wordmark = () => {
  return (
    <span data-slot="novael-display" className="text-lg font-semibold tracking-[0.25em] text-foreground">
      <span className="text-primary">N</span>OVAEL
    </span>
  );
};

export const Navbar = ({ lang, setLang }: { lang: Lang; setLang: (lang: Lang) => void }) => {
  const active = useActiveSection(SECTION_IDS);
  const [open, setOpen] = React.useState(false);
  const c = COPY[lang];

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-18 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="relative mx-auto flex h-full max-w-[1400px] items-center px-6">
        <a href="#intro" aria-label={c.home} className="relative z-10 inline-flex items-center">
          <Wordmark />
        </a>

        <nav className="absolute start-1/2 hidden h-full -translate-x-1/2 rtl:translate-x-1/2 md:block">
          <ul className="flex h-full items-stretch border-s border-border">
            {SECTION_IDS.map((id) => (
              <li key={id} className="border-e border-border">
                <a
                  href={`#${id}`}
                  aria-current={active === id ? 'true' : undefined}
                  className={cn(
                    // Arabic reads small and breaks up under the wide Latin
                    // tracking, so size up and drop the letter-spacing.
                    'flex h-full items-center px-7 text-[10px] font-medium uppercase tracking-[0.3em] transition-colors',
                    'rtl:text-sm rtl:tracking-normal',
                    active === id ? 'bg-accent text-accent-foreground' : 'text-foreground/50 hover:text-foreground',
                  )}
                >
                  {c.nav[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="rounded-full text-muted-foreground hover:text-foreground"
          >
            <Languages className="size-4" />
            <span className="hidden text-sm font-medium sm:inline">{c.toLang}</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={c.openMenu}
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="md:hidden"
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      {/*
        The panel lives inside the template rather than in a portal, so it keeps
        the scoped palette and reads from the same `dir` as the page around it.
      */}
      <div
        aria-hidden={!open}
        className={cn(
          'fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 md:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setOpen(false)}
      />
      <div
        role="dialog"
        aria-modal={open}
        aria-label={c.menuTitle}
        aria-hidden={!open}
        className={cn(
          'fixed inset-y-0 end-0 z-50 flex w-72 max-w-[80vw] flex-col border-s border-border bg-background transition-transform duration-300 md:hidden',
          open ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full',
        )}
      >
        <div className="flex h-18 items-center justify-between border-b border-border px-5">
          <span data-slot="novael-display" className="text-lg font-medium text-foreground">
            {c.menuTitle}
          </span>
          <Button type="button" variant="ghost" size="icon" aria-label={c.closeMenu} onClick={() => setOpen(false)}>
            <X className="size-5" />
          </Button>
        </div>
        <nav className="flex flex-col px-5">
          {SECTION_IDS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              tabIndex={open ? undefined : -1}
              onClick={() => setOpen(false)}
              data-slot="novael-display"
              className={cn(
                'border-b border-border/60 py-4 text-lg font-light transition-colors',
                active === id ? 'text-primary' : 'text-foreground hover:text-primary',
              )}
            >
              {c.nav[id]}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};
