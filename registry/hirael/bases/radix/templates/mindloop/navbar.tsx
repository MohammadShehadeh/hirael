'use client';

import * as React from 'react';

import { Button } from '@/registry/hirael/bases/radix/ui/button';

import { InstagramIcon, LinkedinIcon, Logo, TwitterIcon } from './primitives';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Philosophy', href: '#philosophy' },
  { label: 'Use Cases', href: '#use-cases' },
];

const SOCIAL_LINKS = [
  { label: 'Instagram', Icon: InstagramIcon },
  { label: 'LinkedIn', Icon: LinkedinIcon },
  { label: 'Twitter', Icon: TwitterIcon },
];

export const Navbar = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-8 py-4 md:px-28">
      <nav className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <a href="#home" className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-bold tracking-tight">Mindloop</span>
          </a>

          <div className="hidden items-center gap-2 ps-6 lg:flex">
            {NAV_LINKS.map((link, i) => (
              <React.Fragment key={link.label}>
                {i > 0 ? (
                  <span aria-hidden className="text-muted-foreground/50">
                    &bull;
                  </span>
                ) : null}
                <a href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {link.label}
                </a>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {SOCIAL_LINKS.map(({ label, Icon }) => (
            <Button
              key={label}
              asChild
              variant="ghost"
              size="icon-lg"
              className="liquid-glass rounded-full text-muted-foreground hover:text-foreground"
            >
              <a href="#" aria-label={label}>
                <Icon className="size-4" />
              </a>
            </Button>
          ))}
        </div>
      </nav>
    </header>
  );
};
