'use client';

import * as React from 'react';
import { Languages, Menu, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

import { SECTION_IDS, useActiveSection, type Lang, type SectionId } from './primitives';

const COPY = {
  en: {
    toLang: 'العربية',
    home: 'Novael home',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    menuTitle: 'Lorem ipsum',
    nav: { intro: 'Lorem', services: 'Ipsum dolor', works: 'Sit amet', contact: 'Consectetur' },
  },
  ar: {
    toLang: 'English',
    home: 'نوفايل، الرئيسية',
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

interface NavbarProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const Navbar = ({ lang, setLang }: NavbarProps) => {
  const active = useActiveSection(SECTION_IDS);
  const [open, setOpen] = React.useState(false);
  const c = COPY[lang];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-18 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="relative mx-auto flex h-full max-w-[1400px] items-center px-6">
          <a href="#intro" aria-label={c.home} className="relative z-10 inline-flex items-center">
            <Wordmark />
          </a>

          <nav className="absolute start-1/2 hidden h-full -translate-x-1/2 md:block rtl:translate-x-1/2">
            <ul className="flex h-full items-stretch border-s border-border">
              {SECTION_IDS.map((id) => (
                <li key={id} className="border-e border-border">
                  <a
                    href={`#${id}`}
                    aria-current={active === id ? 'true' : undefined}
                    className={cn(
                      'flex h-full items-center px-7 text-[10px] font-medium tracking-[0.3em] uppercase transition-colors',
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
            <Button type="button" variant="ghost" size="sm" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}>
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
      </header>

      {/* Outside the header: its backdrop-filter would make it the containing block for these fixed layers,
          squeezing the drawer into the header's height. */}
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
        // Closed, the drawer still sits past the viewport edge; inert and invisible take it out of focus order,
        // the accessibility tree and hit testing. visibility is transitioned so the slide-out still plays.
        inert={!open}
        className={cn(
          'fixed inset-y-0 end-0 z-50 flex w-72 max-w-[80vw] flex-col border-s border-border bg-background transition-[translate,visibility] duration-300 md:hidden',
          open ? 'visible translate-x-0' : 'invisible translate-x-full rtl:-translate-x-full',
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
    </>
  );
};
