import type * as React from 'react';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';

interface FooterColumn {
  title: string;
  href: string;
  links: readonly { label: string; href: string }[];
}

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

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
      { label: 'Roadmap', href: '#' },
      { label: 'Status', href: '#' },
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
      { label: 'Changelog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Privacy', href: '#' },
    ],
  },
];

interface BrandMarkProps {
  className?: string;
}

const BrandMark = ({ className }: BrandMarkProps) => {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M2.3 12h2.4v10.95h6.2V14.6h4.6v8.35h6.2V12h-2.4V1.05h-6.2V9.4H8.5V1.05H2.3Z" />
    </svg>
  );
};

const Footer02 = () => {
  return (
    <footer data-slot="footer" className="relative mx-2 rounded-t-3xl border-t border-border bg-background xl:mx-4">
      <div data-slot="footer-inner" className="relative mx-auto w-full max-w-[1480px] px-4 py-12 lg:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(35%_128px_at_50%_0%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent)]"
        />

        <div className="relative flex flex-col gap-10 lg:flex-row">
          <div data-slot="footer-brand" className={cn(ENTER, 'flex flex-col gap-3 lg:w-1/3')}>
            <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-[-0.02em] text-foreground">
              <BrandMark className="size-5" />
              Hirael
            </span>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Components, blocks and full pages for shadcn/ui projects. Install the source and change whatever you need.
            </p>
          </div>

          <nav
            data-slot="footer-nav"
            aria-label="Footer"
            className="grid flex-1 grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3"
          >
            {COLUMNS.map((col, index) => (
              <div data-slot="footer-column" key={col.title} style={stagger(index + 1)} className={ENTER}>
                <a
                  href={col.href}
                  className="text-sm font-semibold text-foreground transition-colors duration-150 hover:text-muted-foreground"
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
          style={stagger(4)}
          className={cn(
            ENTER,
            'relative mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6',
            'sm:flex-row sm:items-center',
          )}
        >
          <p className="text-xs text-muted-foreground">© 2026 Hirael. All rights reserved.</p>
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
