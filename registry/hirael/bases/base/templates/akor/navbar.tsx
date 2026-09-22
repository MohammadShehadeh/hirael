'use client';

import * as React from 'react';
import { Menu, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';

import { Wordmark } from './primitives';

export const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'About Us', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Team', href: '#team' },
  { label: 'Contacts', href: '#contacts' },
] as const;

const QUOTE_BUTTON = 'h-11 active:scale-[0.97]';

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header data-slot="navbar" className="fixed inset-x-0 top-0 z-50 px-8 py-5 lg:px-16">
      <nav className="flex items-center justify-between gap-6">
        <a href="#home" aria-label="AKOR home">
          <Wordmark />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <Button type="button" variant="secondary" size="lg" className={cn(QUOTE_BUTTON, 'hidden md:inline-flex')}>
          Get Quote
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="icon-lg"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
          className="md:hidden"
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </nav>

      {isOpen ? (
        <div className="mt-4 flex flex-col gap-1 rounded-lg border border-border bg-background p-2 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="rounded-md px-4 py-3 text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <Button type="button" variant="secondary" size="lg" className={cn(QUOTE_BUTTON, 'mt-1')}>
            Get Quote
          </Button>
        </div>
      ) : null}
    </header>
  );
};
