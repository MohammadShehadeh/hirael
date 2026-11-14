'use client';

import * as React from 'react';
import { ArrowUpRight, Menu } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/registry/hirael/bases/base/ui/sheet';

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Studio', href: '#studio' },
  { label: 'Journal', href: '#journal' },
  { label: 'Contact', href: '#contact' },
] as const;

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/mohammadshhadeh' },
  { label: 'GitHub', href: 'https://github.com/mohammadshehadeh' },
  { label: 'X', href: 'https://x.com/_mshehadeh' },
] as const;

const FOCUS_RING = 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';

const RISE =
  'animate-in fade-in slide-in-from-bottom-3 duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const Wordmark = () => (
  <a
    href="#"
    data-slot="header-brand"
    className={cn('rounded-sm text-base font-semibold tracking-[-0.03em] text-foreground', FOCUS_RING)}
  >
    Hirael
  </a>
);

const twoDigits = (value: number) => String(value).padStart(2, '0');

interface MenuLinksProps {
  current: string;
  onNavigate: (href: string) => void;
}

const MenuLinks = ({ current, onNavigate }: MenuLinksProps) => (
  <nav data-slot="header-menu-links" aria-label="Main" className="flex-1">
    <ul className="flex flex-col">
      {LINKS.map((link, index) => (
        <li
          key={link.href}
          className={cn('border-b border-border', RISE)}
          style={{ animationDelay: `${80 + index * 40}ms` }}
        >
          <SheetClose
            nativeButton={false}
            render={
              <a
                href={link.href}
                aria-current={current === link.href ? 'page' : undefined}
                onClick={() => onNavigate(link.href)}
                className={cn(
                  'group/link flex items-baseline gap-4 py-4 text-muted-foreground transition-colors duration-150 hover:text-foreground aria-[current=page]:text-foreground md:py-5',
                  FOCUS_RING,
                )}
              />
            }
          >
            <span dir="ltr" className="text-xs tabular-nums">
              {twoDigits(index + 1)}
              <span className="text-muted-foreground/60"> / {twoDigits(LINKS.length)}</span>
            </span>
            <span className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">{link.label}</span>
            <ArrowUpRight
              aria-hidden
              className="ms-auto size-5 self-center opacity-0 transition-opacity duration-150 group-hover/link:opacity-100 group-focus-visible/link:opacity-100 rtl:-scale-x-100"
            />
          </SheetClose>
        </li>
      ))}
    </ul>
  </nav>
);

const MenuAside = () => (
  <aside
    data-slot="header-menu-aside"
    className={cn('flex flex-col gap-8 md:w-64 md:shrink-0', RISE)}
    style={{ animationDelay: '280ms' }}
  >
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted-foreground uppercase">New projects</p>
      <a
        href="mailto:hello@mohammadshehadeh.com"
        className={cn('w-fit rounded-sm text-sm underline underline-offset-4', FOCUS_RING)}
      >
        hello@mohammadshehadeh.com
      </a>
    </div>
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted-foreground uppercase">Elsewhere</p>
      <ul className="flex flex-col gap-1.5">
        {SOCIALS.map((social) => (
          <li key={social.label}>
            <a
              href={social.href}
              target="_blank"
              rel="noreferrer noopener"
              className={cn(
                'w-fit rounded-sm text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground',
                FOCUS_RING,
              )}
            >
              {social.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
    <SheetClose
      nativeButton={false}
      render={<Button render={<a href="#contact" />} nativeButton={false} className="w-fit" />}
    >
      Start a project
    </SheetClose>
  </aside>
);

const Header04 = () => {
  const [current, setCurrent] = React.useState<string>(LINKS[0].href);
  const currentLabel = LINKS.find((link) => link.href === current)?.label;

  return (
    <div data-slot="header-04-block" className="relative w-full bg-background">
      <header data-slot="header" className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-6 md:px-10">
          <Wordmark />
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="sm" className="-me-2" />}>
              Menu
              <Menu aria-hidden />
            </SheetTrigger>
            <SheetContent side="top" className="h-dvh overflow-y-auto">
              <div className="mx-auto w-full max-w-6xl px-2 md:px-6">
                <SheetHeader className="h-14 justify-center">
                  <SheetTitle>Hirael</SheetTitle>
                  <SheetDescription className="sr-only">Site navigation</SheetDescription>
                </SheetHeader>
              </div>
              <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 pb-10 md:flex-row md:gap-16 md:px-10">
                <MenuLinks current={current} onNavigate={setCurrent} />
                <MenuAside />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="mx-auto flex min-h-104 w-full max-w-6xl items-end px-6 pb-10 md:px-10">
        <p className="text-sm text-muted-foreground">Open the menu and pick a page. You are on {currentLabel}.</p>
      </main>
    </div>
  );
};

export default Header04;
