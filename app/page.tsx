import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, ArrowUpRight, Boxes, Download, Languages, Layers, MonitorSmartphone, SunMoon } from 'lucide-react';

import { BlockPreview } from '@/components/block-preview';
import { BlockShowcase } from '@/components/block-showcase';
import { DemoCard } from '@/components/demo-card';
import { LandingCatalog } from '@/components/landing-catalog';
import { Pill, SectionHeading } from '@/components/page-header';
import { InstallBlock } from '@/components/install-block';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getChangelog, type ChangelogEntry } from '@/lib/changelog';
import { getLatestCatalog } from '@/lib/detail-extras';
import { getRepoStars } from '@/lib/github';
import { listingMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';
import {
  BLOCK_KIND_ORDER,
  BLOCKS_BY_KIND,
  COMPONENTS,
  REGISTRY_BY_NAME,
  TEMPLATES,
  entryHref,
} from '@/registry/hirael/registry-meta';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export const metadata: Metadata = listingMetadata({
  path: '/',
  // `title.template` applies to child segments, not the page in the same one, so the home page names the site itself.
  title: `${SITE.tagline} - ${SITE.name}`,
  description: SITE.longDescription,
  keywords: [...SITE.keywords],
});

const blocksTotal = BLOCK_KIND_ORDER.reduce((sum, k) => sum + BLOCKS_BY_KIND[k].length, 0);

const CATALOG_PREVIEW_COUNT = 2;

export default async function LandingPage() {
  const [stars, changelog, latest] = await Promise.all([
    getRepoStars(),
    getChangelog(),
    getLatestCatalog(CATALOG_PREVIEW_COUNT),
  ]);
  return (
    <div className="flex min-h-svh flex-col overflow-x-clip">
      <SiteHeader stars={stars} />
      <main
        id="main-content"
        tabIndex={-1}
        className="page-rails mx-auto w-[calc(100%-1rem)] max-w-[1480px] flex-1 outline-none sm:w-[calc(100%-1.5rem)]"
      >
        <div className="relative mx-auto max-w-6xl">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -start-px hidden w-px bg-border mask-[linear-gradient(to_bottom,transparent,black_6%)] xl:block"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -end-px hidden w-px bg-border mask-[linear-gradient(to_bottom,transparent,black_6%)] xl:block"
          />
          <Hero latestRelease={changelog.entries[0] ?? null} />
          <BleedRule />
          <LandingCatalog items={latest} />
          <BleedRule />
          <WhyHirael />
          <FeaturedComponents />
          <SectionBlocks />
          <FullTemplates />
          <BleedRule />
          <ClosingCta />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

interface HeroProps {
  latestRelease: ChangelogEntry | null;
}

function BleedRule() {
  return <div aria-hidden className="relative left-1/2 z-1 h-px w-screen -translate-x-1/2 bg-border" />;
}

function Hero({ latestRelease }: HeroProps) {
  const rise = 'animate-in fade-in-0 slide-in-from-bottom-3 duration-700 ease-out motion-reduce:animate-none';

  return (
    <section className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 start-4 hidden w-px bg-linear-to-b from-transparent via-border to-border md:start-8 md:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 end-4 hidden w-px bg-linear-to-b from-transparent via-border to-border md:end-8 md:block"
      />
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-4 py-12 text-center sm:gap-6 sm:px-6 sm:py-16">
        {latestRelease && (
          <Link href="/changelog" className={cn('group max-w-full text-foreground', rise)}>
            <span className="glass-panel glass-panel-lit inline-flex max-w-full min-w-0 items-center gap-2.5 rounded-full py-1 ps-1.5 pe-4 text-sm">
              {latestRelease.version && (
                <span className="rounded-full bg-foreground px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-background">
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
          style={{ animationDelay: '80ms', animationFillMode: 'both' }}
          className={cn(
            'text-display w-full text-balance text-3xl italic leading-[0.95] tracking-tight sm:text-4xl sm:leading-[0.9] md:text-5xl',
            rise,
          )}
        >
          Components, blocks and templates{' '}
          for{' '}
          <Image alt="Shadcn" src="/shadcn.avif" className="inline-block size-6 rounded-full md:size-8 lg:size-10" width={32} height={32} />{' '}
          shadcn/ui.
        </h1>

        <p
          style={{ animationDelay: '160ms', animationFillMode: 'both' }}
          className={cn('max-w-2xl text-base text-muted-foreground sm:text-lg', rise)}
        >
          The inputs, pickers and page sections shadcn/ui leaves out, built on the same primitives and your Tailwind
          tokens. Install with the shadcn CLI and the source lands in your repo, styled for light, dark and RTL.
        </p>

        <div
          style={{ animationDelay: '240ms', animationFillMode: 'both' }}
          className={cn('flex flex-wrap items-center justify-center gap-3', rise)}
        >
          <Button size="lg" className="rounded-full px-6" asChild>
            <Link href="/components">
              Browse components
              <ArrowUpRight className="size-4 rtl:-rotate-90" />
            </Link>
          </Button>
          <Button size="lg" variant="ghost" className="glass-panel glass-panel-lit rounded-full px-6" asChild>
            <Link href="/blocks">Browse blocks</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

const FEATURES: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}[] = [
  {
    icon: Download,
    title: 'Copies into your repo',
    body: 'The shadcn CLI writes the files into your project. Nothing in node_modules, no version to bump, and every line is yours to change.',
  },
  {
    icon: Boxes,
    title: 'Built on shadcn',
    body: 'Radix or Base UI primitives, shadcn conventions and your components.json. It sits beside the shadcn components you already have and looks like them.',
  },
  {
    icon: Layers,
    title: 'Any framework',
    body: 'Next.js, Remix, Vite or Astro: anywhere shadcn/ui and Tailwind CSS already run, with no runtime package to add.',
  },
  {
    icon: SunMoon,
    title: 'Light and dark',
    body: 'Every item reads your CSS variables, so it takes on your palette in both themes with nothing to restyle.',
  },
  {
    icon: Languages,
    title: 'RTL, no config',
    body: 'Logical properties throughout, mirrored icons and arrow keys, so setting dir=rtl is the whole job.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Responsive by default',
    body: 'Each item is checked from phone width to ultra-wide, so it looks right at whatever size you ship.',
  },
];

const CARD_GRID_SQUARES: [number, number][][] = [
  [
    [8, 1],
    [10, 3],
    [9, 5],
  ],
  [
    [9, 2],
    [11, 4],
    [8, 6],
  ],
  [
    [10, 1],
    [8, 4],
    [11, 2],
  ],
  [
    [8, 2],
    [10, 5],
    [9, 1],
  ],
  [
    [11, 3],
    [9, 6],
    [8, 1],
  ],
  [
    [9, 4],
    [11, 1],
    [10, 6],
  ],
];

interface CardGridProps {
  id: string;
  squares: [number, number][];
}

function CardGrid({ id, squares }: CardGridProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 mask-[linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-linear-to-br from-primary/8 to-transparent mask-[radial-gradient(farthest-side_at_top,white,transparent)]">
        <svg aria-hidden className="absolute inset-0 h-full w-full fill-primary/10 stroke-primary/25">
          <defs>
            <pattern id={id} width={20} height={20} patternUnits="userSpaceOnUse" x="-12" y="4">
              <path d="M.5 20V.5H20" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
          <svg x="-12" y="4" className="overflow-visible">
            {squares.map(([col, row], i) => (
              <rect strokeWidth="0" key={`${col}-${row}-${i}`} width={21} height={21} x={col * 20} y={row * 20} />
            ))}
          </svg>
        </svg>
      </div>
    </div>
  );
}

function WhyHirael() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="w-full px-4 sm:px-6">
        <SectionHeading
          kicker="Why Hirael"
          title="Own the source, not a dependency."
          blurb="Every item follows shadcn conventions: compound parts, data-slot attributes, your components.json and theme tokens. The CLI writes the files into your repo, so you edit them like code you wrote."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="glass-panel glass-panel-lit group relative flex flex-col gap-5 overflow-hidden rounded-2xl p-7 transition-colors duration-200 hover:bg-card/70"
              >
                <CardGrid id={`why-grid-${i}`} squares={CARD_GRID_SQUARES[i % CARD_GRID_SQUARES.length]} />
                <span className="glass-panel-strong relative z-10 inline-flex size-11 shrink-0 items-center justify-center rounded-full">
                  <Icon className="size-4 text-foreground" />
                </span>
                <div className="relative z-10 flex flex-col gap-2">
                  <h3 className="text-base font-medium tracking-tight">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const FEATURED_COMPONENTS = [
  'multi-select',
  'date-range-picker',
  'tag-input',
  'combobox',
  'currency-input',
  'rating',
] as const;

function FeaturedComponents() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="w-full px-4 sm:px-6">
        <SectionHeading
          kicker="Components"
          title="Try them before you install."
          blurb={`${COMPONENTS.length} components, each running live here and on its own page, so you can test keyboard, RTL and both themes before you install. These six are the ones most products reach for first.`}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_COMPONENTS.map((name) => (
            <DemoCard key={name} entry={REGISTRY_BY_NAME[name]} />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button variant="outline" className="rounded-full px-5" asChild>
            <Link href="/components">
              All components
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function SectionBlocks() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="w-full px-4 sm:px-6">
        <SectionHeading
          kicker="Section blocks"
          title="Blocks for whole sections of a page."
          blurb={`${blocksTotal} sections in ${BLOCK_KIND_ORDER.length} categories: heroes, pricing, testimonials, FAQs, auth and dashboards. Each is built from the same components, so a block you install matches the ones you already have.`}
        />

        <BlockShowcase />
      </div>
    </section>
  );
}

const FEATURED_TEMPLATES = ['agency-landing', 'mindloop'] as const;

function FullTemplates() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="w-full px-4 sm:px-6">
        <SectionHeading
          kicker="Templates"
          title="Whole pages, not just parts."
          blurb={`${TEMPLATES.length} complete pages assembled from the blocks and components above, with light, dark and RTL already handled. One command copies the whole page, sections and all, into your repo.`}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {FEATURED_TEMPLATES.map((name) => {
            const entry = REGISTRY_BY_NAME[name];
            return (
              <Link
                key={name}
                href={entryHref(entry)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background outline-none transition-colors hover:border-foreground/40 focus-visible:border-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <BlockPreview entry={entry} />
                <div className="flex flex-col gap-1.5 p-5">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-base font-medium tracking-[-0.01em]">{entry.title}</span>
                    <ArrowUpRight
                      className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 rtl:-scale-x-100"
                      aria-hidden
                    />
                  </span>
                  <span className="line-clamp-2 text-sm text-muted-foreground">{entry.description}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <Button variant="outline" className="rounded-full px-5" asChild>
            <Link href="/templates">
              All templates
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="relative isolate overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="hero-aurora" />
        <div className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-background to-transparent" />
      </div>

      <div className="mx-auto flex max-w-3xl flex-col items-center gap-7 px-4 text-center sm:px-6">
        <Pill data-live>Get started</Pill>
        <h2 className="text-display text-4xl italic leading-[0.88] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
          Install one. Keep all of it.
        </h2>
        <p className="max-w-md text-sm text-muted-foreground sm:text-base">
          One command copies the source into your repo, where you can read it, change it and keep it. No package to
          update, nothing to lock you in.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" className="rounded-full px-6" asChild>
            <Link href="/components">
              Browse components
              <ArrowUpRight className="size-4 rtl:-rotate-90" />
            </Link>
          </Button>
          <Button size="lg" variant="ghost" className="glass-panel glass-panel-lit rounded-full px-6" asChild>
            <Link href="/templates">{TEMPLATES.length} full templates</Link>
          </Button>
        </div>
        <InstallBlock name="combobox" className="mt-2 w-full max-w-md" />
      </div>
    </section>
  );
}
