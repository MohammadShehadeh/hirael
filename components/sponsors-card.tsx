'use client';

import { usePathname } from 'next/navigation';
import { ArrowUpRight, Star } from 'lucide-react';

import { cn } from '@/lib/utils';
import { SITE } from '@/lib/site';
import { SPONSOR_URL, SPONSORS, sponsorHref } from '@/lib/sponsors';
import { formatStars } from '@/components/github-link';
import { useRepoStars } from '@/components/repo-stars';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

const OPEN_SLOTS = 2;

const tileClassName =
  'flex h-11 items-center justify-center rounded-md px-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40';

const hasOwnRightColumn = (pathname: string) =>
  /^\/(components|blocks)\/[^/]+\/[^/]+$/.test(pathname) || /^\/templates\/[^/]+$/.test(pathname);

export const SponsorsRail = () => {
  const pathname = usePathname();
  if (hasOwnRightColumn(pathname)) return null;

  return (
    <aside className="sticky top-11 hidden h-[calc(100svh-2.75rem)] w-(--docs-rail-width) shrink-0 overflow-y-auto p-4 xl:block">
      <SponsorsCard />
    </aside>
  );
};

interface SponsorsCardProps {
  className?: string;
}

export const SponsorsCard = ({ className }: SponsorsCardProps) => {
  const stars = useRepoStars();

  return (
    <section
      aria-labelledby="sponsors-heading"
      data-slot="sponsors-card"
      className={cn('flex flex-col rounded-xl bg-muted/60 p-1', className)}
    >
      <header className="flex items-center justify-between gap-2 px-3 py-2">
        <h2 id="sponsors-heading" className="text-sm font-semibold">
          Sponsors
        </h2>
        <a
          href={SPONSOR_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[11px] whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
        >
          Become a sponsor
          <ArrowUpRight aria-hidden className="size-3.5 rtl:-scale-x-100" />
        </a>
      </header>

      <div className="flex flex-col gap-1.5 rounded-lg border border-border/60 bg-background p-2">
        {SPONSORS.length > 0
          ? SPONSORS.map((sponsor) => (
              <a
                key={sponsor.name}
                href={sponsorHref(sponsor.href)}
                target="_blank"
                rel="noreferrer"
                title={sponsor.name}
                className={cn(tileClassName, 'gap-2 bg-muted/40 hover:bg-muted')}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimized */}
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className={cn('max-h-6 w-auto max-w-full object-contain', sponsor.invertOnDark && 'dark:invert')}
                />
                {sponsor.showName && (
                  <span aria-hidden className="text-sm font-semibold tracking-tight">
                    {sponsor.name}
                  </span>
                )}
              </a>
            ))
          : Array.from({ length: OPEN_SLOTS }, (_, i) => (
              <a
                key={i}
                href={SPONSOR_URL}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  tileClassName,
                  'border border-dashed border-border text-xs text-muted-foreground hover:border-foreground/40 hover:text-foreground',
                )}
              >
                Your logo here
              </a>
            ))}
      </div>

      <div className="flex flex-col gap-2.5 px-3 pt-3 pb-2">
        <p className="text-xs leading-relaxed text-pretty text-muted-foreground">
          {SITE.name} is free and open source. If it saved you time, a star helps others find it.
        </p>
        <Button variant="outline" size="sm" asChild>
          <a href={SITE.githubRepoUrl} target="_blank" rel="noreferrer">
            <Star className="fill-primary text-primary" />
            Star on GitHub
            {stars ? <span className="text-muted-foreground tabular-nums">{formatStars(stars)}</span> : null}
          </a>
        </Button>
      </div>
    </section>
  );
};
