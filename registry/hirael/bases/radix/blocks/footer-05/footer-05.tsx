import type * as React from 'react';

import { cn } from '@/lib/utils';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const COLUMNS = [
  {
    title: 'Product',
    links: ['Features', 'Pipeline', 'Pricing', 'Changelog', 'Status'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'API reference', 'CLI', 'Community'],
  },
  {
    title: 'Company',
    links: ['About', 'Terms', 'Privacy'],
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

const Footer05 = () => {
  return (
    <div className="bg-background p-2">
      <footer data-slot="footer" className="rounded-md border border-border bg-muted/10">
        <div className="mx-auto max-w-6xl px-6 pt-12 pb-2 md:pb-12">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
            <div data-slot="footer-brand" className={cn(ENTER, 'flex flex-col gap-4 lg:col-span-2')}>
              <a href="#" className="flex w-fit items-center gap-2 text-foreground">
                <BrandMark className="size-5" />
                <span className="text-base font-semibold tracking-tight">Hirael</span>
              </a>
              <p className="max-w-xs text-sm text-balance text-muted-foreground">
                The pipeline editor for teams who want to see their CI, not scroll it.
              </p>
            </div>

            {COLUMNS.map((col, index) => (
              <div
                key={col.title}
                data-slot="footer-column"
                style={stagger(index + 1)}
                className={cn(ENTER, 'flex flex-col gap-3')}
              >
                <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
                <ul className="flex flex-col gap-2 text-sm">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            data-slot="footer-legal"
            style={stagger(4)}
            className={cn(
              ENTER,
              'flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row',
            )}
          >
            <p>© 2026 Hirael. All rights reserved.</p>
            <a href="#" className="transition-colors duration-150 hover:text-foreground">
              Source on GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer05;
