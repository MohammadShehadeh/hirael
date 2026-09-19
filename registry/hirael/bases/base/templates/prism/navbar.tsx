'use client';

import * as React from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

import { Button } from '@/registry/hirael/bases/base/ui/button';

import { Wordmark } from './primitives';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Pricing', href: '#pricing' },
] as const;

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header data-slot="navbar" className="fixed inset-x-0 top-4 z-50 px-6 lg:px-16">
      <nav className="flex items-center justify-between gap-4 md:grid md:grid-cols-[1fr_auto_1fr]">
        <a href="#home" aria-label="Prism home" className="justify-self-start">
          <Wordmark />
        </a>

        <div className="liquid-glass flex items-center gap-1 rounded-full p-1.5 md:ps-2">
          <div className="hidden items-center md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-foreground/90 transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
            className="rounded-full text-foreground hover:bg-foreground/10 hover:text-foreground md:hidden"
          >
            {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
          <Button type="button" className="h-auto rounded-full px-3.5 py-1.5 text-sm font-medium">
            Get Started
            <ArrowUpRight className="size-4 rtl:-scale-x-100" />
          </Button>
        </div>
      </nav>

      {isOpen ? (
        <div className="liquid-glass mt-3 flex flex-col rounded-3xl p-2 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="rounded-full px-4 py-2.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-foreground/10 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </header>
  );
};
