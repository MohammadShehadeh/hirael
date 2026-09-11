import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { SITE } from '@/lib/site';
import { Logo } from '@/components/logo';

interface FooterLink {
  href: string;
  label: string;
  isExternal?: boolean;
}

interface FooterLinkGroup {
  label: string;
  links: FooterLink[];
}

const FOOTER_LINKS: FooterLinkGroup[] = [
  {
    label: 'Library',
    links: [
      { href: '/components', label: 'Components' },
      { href: '/blocks', label: 'Blocks' },
      { href: '/templates', label: 'Templates' },
    ],
  },
  {
    label: 'Resources',
    links: [
      { href: '/changelog', label: 'Changelog' },
      { href: `${SITE.githubRepoUrl}/blob/main/CONTRIBUTING.md`, label: 'Contributing', isExternal: true },
      { href: `${SITE.githubRepoUrl}/blob/main/LICENSE`, label: 'License', isExternal: true },
    ],
  },
  {
    // isExternal keeps these static files out of the client router, which would otherwise treat them as routes.
    label: 'For agents',
    links: [
      { href: '/llms.txt', label: 'llms.txt', isExternal: true },
      { href: '/r/registry.json', label: 'Registry JSON', isExternal: true },
    ],
  },
  {
    label: 'Author',
    links: [
      { href: SITE.githubRepoUrl, label: 'Repository', isExternal: true },
      { href: SITE.authorUrl, label: 'Portfolio', isExternal: true },
      { href: SITE.githubUrl, label: 'GitHub', isExternal: true },
    ],
  },
];

const COMPACT_LINKS: FooterLink[] = [
  { href: '/components', label: 'Components' },
  { href: '/blocks', label: 'Blocks' },
  { href: '/templates', label: 'Templates' },
  { href: '/changelog', label: 'Changelog' },
  { href: '/llms.txt', label: 'llms.txt', isExternal: true },
];

export interface SiteFooterCompactProps {
  className?: string;
}

export const SiteFooterCompact = ({ className }: SiteFooterCompactProps) => {
  const year = new Date().getFullYear();
  return (
    <footer className={cn('mt-auto border-t border-border px-4 py-5 sm:px-6 lg:px-8', className)}>
      <div className="flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {SITE.author}. Built on shadcn/ui.
        </p>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {COMPACT_LINKS.map((link) =>
            link.isExternal ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ) : (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ),
          )}
          <a
            href={SITE.githubRepoUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
};

export interface SiteFooterProps {
  className?: string;
}

export const SiteFooter = ({ className }: SiteFooterProps) => {
  const year = new Date().getFullYear();

  return (
    <footer className={cn('mt-auto pb-4 sm:pb-6', className)}>
      <div className="container w-full">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card sm:rounded-3xl">
          <div aria-hidden className="ambient-halo opacity-70" />
          <div
            aria-hidden
            className="bg-dot-grid pointer-events-none absolute inset-0 opacity-30 mask-[radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent_80%)]"
          />

          <div className="relative px-6 pt-12 sm:px-10 sm:pt-14 lg:px-14">
            <div className="flex flex-col gap-8 border-b border-border/70 pb-10 md:flex-row md:items-end md:justify-between">
              <div className="flex max-w-sm flex-col gap-4">
                <Link
                  href="/"
                  aria-label={`${SITE.name} | home`}
                  className="inline-flex w-fit transition-opacity hover:opacity-80"
                >
                  <Logo className="h-10" />
                </Link>
                <p className="text-display text-xl leading-snug text-foreground/90 sm:text-2xl">{SITE.description}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Install any item with the shadcn CLI and the source lands in your repo, styled for light, dark and
                  RTL. There is no package to depend on and nothing to keep up to date.
                </p>
              </div>

              <Link
                href="/components"
                className="group inline-flex h-11 w-fit items-center gap-2 self-start rounded-full bg-primary ps-6 pe-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 md:self-auto"
              >
                Browse components
                <span className="flex size-7 items-center justify-center rounded-full bg-background/15 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
              {FOOTER_LINKS.map((group) => (
                <div key={group.label} className="flex flex-col gap-3.5">
                  <h3 className="text-xs uppercase text-foreground/70">{group.label}</h3>
                  <ul className="flex flex-col gap-2.5">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        {link.isExternal ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <span
              aria-hidden
              className="wordmark-cutout pointer-events-none absolute inset-x-0 -bottom-4 text-center text-[18vw] leading-none sm:-bottom-8 lg:text-[12rem]"
            >
              Hirael
            </span>
            <div className="relative flex flex-col items-start justify-between gap-3 border-t border-border/70 px-6 py-6 sm:flex-row sm:items-center sm:px-10 lg:px-14">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                © {year} {SITE.author}. Built on shadcn/ui.
              </p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Source, not a package</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
