import type * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

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

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0Z"
      />
    </svg>
  );
};

const XIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
      />
    </svg>
  );
};

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number): React.CSSProperties => ({ animationDelay: `${index * 60}ms` });

interface FooterColumn {
  label: string;
  links: readonly { label: string; href: string }[];
}

const COLUMNS: readonly FooterColumn[] = [
  {
    label: 'Product',
    links: [
      { label: 'Overview', href: '#' },
      { label: 'Workflows', href: '#' },
      { label: 'Integrations', href: '#' },
      { label: 'Pricing', href: '#' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    label: 'Resources',
    links: [
      { label: 'Docs', href: '#' },
      { label: 'Guides', href: '#' },
      { label: 'API reference', href: '#' },
      { label: 'Status', href: '#' },
      { label: 'Support', href: '#' },
    ],
  },
];

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/mohammadshehadeh', icon: GithubIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/mohammadshhadeh', icon: LinkedinIcon },
  { label: 'X', href: 'https://x.com/_mshehadeh', icon: XIcon },
] as const;

interface BrandMarkProps {
  className?: string;
}

const BrandMark = ({ className }: BrandMarkProps) => {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={cn('size-6 text-primary', className)}>
      <path d="M2.3 12h2.4v10.95h6.2V14.6h4.6v8.35h6.2V12h-2.4V1.05h-6.2V9.4H8.5V1.05H2.3Z" />
    </svg>
  );
};

const Footer03 = () => {
  return (
    <footer data-slot="footer" className="w-full rounded-sm border border-input bg-muted/10 p-2">
      <div className="pt-12 pb-2 md:pb-12">
        <div className="mx-auto max-w-[1480px] px-4">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
            <div data-slot="footer-brand" className={ENTER}>
              <span className="mb-3 inline-flex items-center gap-2 text-base font-semibold tracking-tight text-foreground">
                <BrandMark />
                Hirael
              </span>
              <p className="mb-4 max-w-sm text-sm text-muted-foreground">
                Sections and full pages built on your design tokens. Install the source and it stays yours.
              </p>
              <div className="flex gap-1">
                {SOCIALS.map(({ label, href, icon: Icon }) => (
                  <Button key={label} variant="ghost" size="icon" asChild>
                    <a href={href} aria-label={label}>
                      <Icon className="size-5" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            {COLUMNS.map((column, index) => (
              <div key={column.label} data-slot="footer-column" style={stagger(index + 1)} className={ENTER}>
                <h3 className="mb-4 font-semibold text-foreground">{column.label}</h3>
                <ul className="space-y-3 text-sm">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div data-slot="footer-bottom" style={stagger(3)} className={cn(ENTER, 'border-t border-border/50 pt-8')}>
            <div className="flex flex-col items-center justify-between md:flex-row">
              <div className="mb-4 flex flex-col items-center gap-4 md:mb-0 md:flex-row">
                <p className="text-start text-sm text-muted-foreground">© 2026 Hirael. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer03;
