import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

import { type ChangelogEntry } from '@/lib/changelog';
import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

const rise = 'animate-in fade-in-0 slide-in-from-bottom-3 duration-700 ease-out motion-reduce:animate-none';

export interface HeroProps {
  latestRelease: ChangelogEntry | null;
}

export const Hero = ({ latestRelease }: HeroProps) => {
  return (
    <section className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 inset-s-4 hidden w-px bg-linear-to-b from-transparent via-border to-border md:start-8 md:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 inset-e-4 hidden w-px bg-linear-to-b from-transparent via-border to-border md:end-8 md:block"
      />
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-4 py-12 text-center sm:gap-6 sm:px-6 sm:py-16">
        {latestRelease && (
          <Link href="/changelog" className={cn('group max-w-full text-foreground', rise)}>
            <span className="glass-panel glass-panel-lit inline-flex max-w-full min-w-0 items-center gap-2.5 rounded-full py-1 ps-1.5 pe-4 text-sm">
              {latestRelease.version && (
                <span className="rounded-full bg-foreground px-2 py-0.5 text-xs text-background">
                  v{latestRelease.version}
                </span>
              )}
              <span className="group-hover:underline line-clamp-1 text-start">{latestRelease.title}</span>
              <ArrowRight
                className="text-foreground -rotate-45 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-px"
                size={16}
              />
            </span>
          </Link>
        )}

        <h1
          className={cn(
            'text-display w-full text-balance text-3xl italic leading-normal tracking-tight delay-[80ms] fill-mode-both sm:text-4xl sm:leading-[0.9] md:text-5xl',
            rise,
          )}
        >
          Components, blocks and templates for{' '}
          <Image
            alt="Shadcn"
            src="/shadcn.avif"
            className="inline-block size-6 rounded-full md:size-8 lg:size-10"
            width={32}
            height={32}
          />{' '}
          shadcn/ui.
        </h1>

        <p className={cn('max-w-2xl text-base text-muted-foreground delay-[160ms] fill-mode-both sm:text-lg', rise)}>
          The inputs, pickers and page sections shadcn/ui leaves out, built on the same primitives and your Tailwind
          tokens. Install with the shadcn CLI and the source lands in your repo, styled for light, dark and RTL.
        </p>

        <div className={cn('flex flex-wrap items-center justify-center gap-3 delay-[240ms] fill-mode-both', rise)}>
          <Button size="lg" asChild>
            <Link href="/components">
              Browse components
              <ArrowUpRight className="size-4 rtl:-rotate-90" />
            </Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/blocks">Browse blocks</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
