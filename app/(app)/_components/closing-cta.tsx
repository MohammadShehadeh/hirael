import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { InstallBlock } from '@/components/install-block';
import { Pill } from '@/components/page-header';
import { TEMPLATES } from '@/registry/hirael/registry-meta';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

export const ClosingCta = () => {
  return (
    <section className="relative isolate overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="hero-aurora" />
        <div className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-background to-transparent" />
      </div>

      <div className="mx-auto flex max-w-3xl flex-col items-center gap-7 px-4 text-center sm:px-6">
        <Pill data-live>Get started</Pill>
        <h2 className="text-display text-4xl leading-[0.88] tracking-[-0.02em] italic sm:text-6xl lg:text-7xl">
          Install one. Keep all of it.
        </h2>
        <p className="max-w-md text-sm text-muted-foreground sm:text-base">
          One command copies the source into your repo, where you can read it, change it and keep it. No package to
          update, nothing to lock you in.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/components">
              Browse components
              <ArrowUpRight className="size-4 rtl:-rotate-90" />
            </Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/templates">{TEMPLATES.length} full templates</Link>
          </Button>
        </div>
        <InstallBlock name="combobox" className="mt-2 w-full max-w-md" />
      </div>
    </section>
  );
};
