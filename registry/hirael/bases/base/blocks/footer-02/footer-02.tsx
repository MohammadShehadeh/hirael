'use client';

import * as React from 'react';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';

interface FooterColumn {
  title: string;
  href: string;
  links: readonly { label: string; href: string }[];
}

const MAX_LINKS = 5;

const COLUMNS: readonly FooterColumn[] = [
  {
    title: 'Product',
    href: '#',
    links: [
      { label: 'Overview', href: '#' },
      { label: 'Components', href: '#' },
      { label: 'Templates', href: '#' },
      { label: 'Pricing', href: '#' },
      { label: 'Changelog', href: '#' },
      { label: 'Roadmap', href: '#' },
    ],
  },
  {
    title: 'Resources',
    href: '#',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'Guides', href: '#' },
      { label: 'Tutorials', href: '#' },
      { label: 'API reference', href: '#' },
      { label: 'Examples', href: '#' },
    ],
  },
  {
    title: 'Company',
    href: '#',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Privacy', href: '#' },
    ],
  },
];

const BrandMark = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 80 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M16 78 V40 a24 24 0 0 1 48 0 V78" />
      <path d="M40 44 L43.2 52 L51 55 L43.2 58 L40 66 L36.8 58 L29 55 L36.8 52 Z" />
      <path d="M22 86 H58" opacity="0.7" />
      <path d="M28 92 H52" opacity="0.45" />
      <path d="M34 96 H46" opacity="0.25" />
    </svg>
  );
};

const Footer02 = () => {
  return (
    <footer data-slot="footer" className="relative mx-2 rounded-t-3xl border-t border-border bg-background xl:mx-4">
      <div data-slot="footer-inner" className="relative container w-full py-12 lg:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-32"
          style={{
            background:
              'radial-gradient(35% 128px at 50% 0%, color-mix(in oklch, var(--primary) 14%, transparent), transparent)',
          }}
        />

        <div className="relative flex flex-col gap-10 lg:flex-row">
          <div data-slot="footer-brand" className="flex items-start gap-4 lg:w-1/3">
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground">
              <BrandMark className="size-6" />
            </span>
            <div className="space-y-3">
              <span className="inline-flex items-center font-mono text-sm font-semibold tracking-[-0.02em] text-foreground">
                Hirael
              </span>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                Notes on building for the web: interface patterns, small tools, and resources worth keeping around.
              </p>
            </div>
          </div>

          <nav
            data-slot="footer-nav"
            aria-label="Footer"
            className="grid flex-1 grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3"
          >
            {COLUMNS.map((col) => (
              <div data-slot="footer-column" key={col.title}>
                <a
                  href={col.href}
                  className="text-sm font-semibold text-foreground transition-colors hover:text-foreground"
                >
                  {col.title}
                </a>
                <ul className="mt-3 space-y-2.5">
                  {col.links.slice(0, MAX_LINKS).map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                  {col.links.length > MAX_LINKS && (
                    <li>
                      <a
                        href={col.href}
                        className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        View all
                        <ArrowRight className="size-3.5 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div
          data-slot="footer-meta"
          className={cn(
            'relative mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6',
            'sm:flex-row sm:items-center',
          )}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            © 2026 · All rights reserved
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Terms
            </a>
            <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Status
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer02;
