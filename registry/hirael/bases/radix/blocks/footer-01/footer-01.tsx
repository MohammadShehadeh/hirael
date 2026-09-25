import type * as React from 'react';

import { cn } from '@/lib/utils';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number): React.CSSProperties => ({ animationDelay: `${index * 60}ms` });

interface LinkColumn {
  title: string;
  links: readonly { label: string; href: string }[];
}

const COLUMNS: readonly LinkColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'Registry', href: '#' },
      { label: 'Themes', href: '#' },
      { label: 'Playground', href: '#' },
      { label: 'Changelog', href: '#' },
      { label: 'Roadmap', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Manifesto', href: '#' },
      { label: 'Customers', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'Guides', href: '#' },
      { label: 'Examples', href: '#' },
      { label: 'Support', href: '#' },
      { label: 'License', href: '#' },
    ],
  },
];

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.61-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.49-1.11-1.49-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.13-4.55-5.04 0-1.11.39-2.02 1.03-2.74-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.04A9.4 9.4 0 0 1 12 7.04c.85 0 1.7.12 2.5.34 1.9-1.31 2.74-1.04 2.74-1.04.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.74 0 3.92-2.34 4.78-4.57 5.03.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  );
};

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

const SOCIALS = [{ label: 'GitHub', href: 'https://github.com/mohammadshehadeh', icon: GithubIcon }] as const;

const Footer01 = () => {
  return (
    <footer data-slot="footer" className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-[1480px] px-4 py-16">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-5 lg:gap-16">
          <div data-slot="footer-brand" className={cn(ENTER, 'col-span-2')}>
            <div className="flex flex-col gap-4">
              <span className="inline-flex items-center text-sm font-semibold tracking-[-0.02em] text-foreground">
                <BrandMark className="me-1.5 size-5 text-foreground" />
                Hirael
              </span>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                The components and blocks shadcn/ui doesn&apos;t ship, installed as source with the shadcn CLI. Nothing
                to update at runtime.
              </p>
            </div>
          </div>

          {COLUMNS.map((col, index) => (
            <div
              key={col.title}
              data-slot="footer-column"
              style={stagger(index + 1)}
              className={cn(ENTER, 'flex flex-col gap-4')}
            >
              <h3 className="text-xs text-muted-foreground uppercase">{col.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          data-slot="footer-meta"
          style={stagger(4)}
          className={cn(
            ENTER,
            'mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center',
          )}
        >
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>© 2026 Hirael Labs</span>
            <span aria-hidden className="text-border">
              |
            </span>
            <span>All rights reserved</span>
          </p>
          <div className="flex items-center gap-1">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="inline-flex size-8 items-center justify-center rounded-sm border border-transparent text-muted-foreground transition-colors duration-150 hover:border-border hover:bg-card hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer01;
