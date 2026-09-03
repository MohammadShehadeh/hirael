import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, ArrowUpRight, Boxes, Download, Languages, Layers, MonitorSmartphone, SunMoon } from 'lucide-react';

import { BlockPreview } from '@/components/block-preview';
import { BlockShowcase } from '@/components/block-showcase';
import { DemoCard } from '@/components/demo-card';
import { ItemCards } from '@/components/item-cards';
import { Pill, SectionHeading } from '@/components/page-header';
import { InstallBlock } from '@/components/install-block';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getChangelog, type ChangelogEntry } from '@/lib/changelog';
import { getRecentlyAdded } from '@/lib/detail-extras';
import { getRepoStars } from '@/lib/github';
import { listingMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { Marquee } from '@/registry/hirael/bases/radix/components/marquee';
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

export const metadata: Metadata = listingMetadata({
  path: '/',
  // `title.template` applies to child segments, not to the page in the same
  // one, so the home page names the site itself.
  title: `${SITE.tagline} - ${SITE.name}`,
  description: SITE.longDescription,
  keywords: [...SITE.keywords],
});

const blocksTotal = BLOCK_KIND_ORDER.reduce((sum, k) => sum + BLOCKS_BY_KIND[k].length, 0);

export default async function LandingPage() {
  const [stars, changelog] = await Promise.all([getRepoStars(), getChangelog()]);
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader stars={stars} />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <Hero latestRelease={changelog.entries[0] ?? null} />
        <CatalogTicker />
        <WhyHirael />
        <FeaturedComponents />
        <SectionBlocks />
        <FullTemplates />
        <RecentlyAdded />
        <ClosingCta />
      </main>
      <SiteFooter />
    </div>
  );
}

function Hero({ latestRelease }: { latestRelease: ChangelogEntry | null }) {
  const rise = 'animate-in fade-in-0 slide-in-from-bottom-3 duration-700 ease-out motion-reduce:animate-none';

  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src="/images/hero-dark.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden object-cover object-center opacity-75 dark:block"
        />
        <Image
          src="/images/hero-light.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-85 dark:hidden"
        />
        <div className="absolute inset-0 bg-linear-to-b from-background/25 via-background/45 to-background" />
        <div className="bg-dot-grid absolute inset-0 opacity-20 mask-[radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent_70%)]" />
      </div>

      <div className="mx-auto flex min-h-[86vh] flex-col max-w-5xl items-center justify-center gap-7 px-4 py-24 text-center sm:px-6 sm:py-28">
        {latestRelease && (
          <Link href="/changelog" className={cn('group text-foreground', rise)}>
            <span className="glass-panel glass-panel-lit inline-flex items-center gap-2.5 rounded-full py-1 ps-1.5 pe-4 text-sm">
              {latestRelease.version && (
                <span className="rounded-full bg-foreground px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-background">
                  v{latestRelease.version}
                </span>
              )}
              <span className="group-hover:underline">{latestRelease.title}</span>
              <ArrowRight
                className="text-foreground -rotate-45 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-px"
                size={16}
              />
            </span>
          </Link>
        )}

        <h1
          style={{ animationDelay: '80ms', animationFillMode: 'both' }}
          className={`w-full text-pretty text-4xl italic leading-[0.95] tracking-[-0.025em] sm:text-5xl sm:leading-[0.9] md:text-6xl ${rise}`}
        >
          Components, blocks &amp; templates built on top of shadcn/ui.
        </h1>

        <p
          style={{ animationDelay: '160ms', animationFillMode: 'both' }}
          className={`max-w-xl text-base text-muted-foreground sm:text-lg ${rise}`}
        >
          A shadcn-compatible registry of React components, section blocks, and full-page templates most products end up
          building anyway. Install with the shadcn CLI; the source lands in your repo, yours to keep.
        </p>

        <div
          style={{ animationDelay: '240ms', animationFillMode: 'both' }}
          className={`flex flex-wrap items-center justify-center gap-3 ${rise}`}
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

        <div
          style={{ animationDelay: '340ms', animationFillMode: 'both' }}
          className={`mt-8 flex flex-col items-center gap-5 ${rise}`}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Works anywhere React runs
          </span>
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm font-medium text-foreground/60 sm:gap-x-10">
            {['Next.js', 'Remix', 'Vite', 'Astro', 'shadcn/ui'].map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CatalogTicker() {
  return (
    <section aria-label="Component catalog" className="relative -mt-4 pb-4 sm:pb-8">
      <div className="container w-full">
        <div className="relative overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <Marquee pauseOnHover duration={70} gap="0.75rem" repeat={2}>
            {COMPONENTS.map((entry) => (
              <Link
                key={entry.name}
                href={entryHref(entry)}
                title={entry.title}
                className="glass-panel inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[11px] tracking-tight text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                <span className="size-1 rounded-full bg-muted-foreground/50" />
                {entry.name}
              </Link>
            ))}
          </Marquee>
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
    body: 'The CLI writes the source into your project. Nothing in node_modules, no version to bump.',
  },
  {
    icon: Boxes,
    title: 'Built on shadcn',
    body: 'Radix primitives, shadcn conventions, your components.json. A peer, not a replacement.',
  },
  {
    icon: Layers,
    title: 'Any React stack',
    body: 'Next, Remix, Vite, Astro: anywhere React and Tailwind already run.',
  },
  {
    icon: SunMoon,
    title: 'Light and dark',
    body: 'Theme-aware through CSS variables, so every item inherits your tokens in both modes.',
  },
  {
    icon: Languages,
    title: 'RTL, no config',
    body: 'Logical properties throughout, so dir=rtl works with nothing extra to wire up.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Responsive by default',
    body: 'Built to hold their shape from small phones to ultra-wide displays.',
  },
];

// A few lit cells per card so the blueprint grid reads differently on each.
// Coordinates are [column, row] in 20px grid units.
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

/**
 * Faint blueprint grid with a few lit cells — adapted from the Tailwind UI
 * "GridPattern". Token-only (foreground at low opacity) so it stays on the
 * near-monochrome palette and works in both themes; masked so it glows at the
 * top and fades out.
 */
function CardGrid({ id, squares }: { id: string; squares: [number, number][] }) {
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
      <div className="container w-full">
        <SectionHeading
          kicker="Why Hirael"
          title="Own the source, not a dependency."
          blurb="Install with the shadcn CLI and the code lands in your repo, ready to read and change, built the way shadcn ships its primitives."
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
      <div className="container w-full">
        <SectionHeading
          kicker="Components"
          title="Try them before you install."
          blurb={`${COMPONENTS.length} components, each live here and on its own page. These six are the ones most products reach for first.`}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_COMPONENTS.map((name) => (
            <DemoCard key={name} entry={REGISTRY_BY_NAME[name]} />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button variant="outline" className="rounded-full px-5" asChild>
            <Link href="/components">
              All {COMPONENTS.length} components
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
      <div className="container w-full">
        <SectionHeading
          kicker="Section blocks"
          title="Blocks for whole sections of a page."
          blurb={`${blocksTotal} drop-in compositions across ${BLOCK_KIND_ORDER.length} categories: heroes, pricing, testimonials, CTAs, auth, and more.`}
        />

        <BlockShowcase />
      </div>
    </section>
  );
}

/** The two the catalog leads with; the rest are one click away on /templates. */
const FEATURED_TEMPLATES = ['agency-landing', 'mindloop'] as const;

/**
 * Components and blocks each get a section that shows the real thing; templates
 * were the one item type the page only named, in a button at the very bottom.
 * They are the largest thing the registry ships, so they get the same framed
 * preview the templates index uses.
 */
function FullTemplates() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="container w-full">
        <SectionHeading
          kicker="Templates"
          title="Whole pages, not just parts."
          blurb={`${TEMPLATES.length} complete layouts composed from the same blocks and components. One command copies the whole page into your repo.`}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
              All {TEMPLATES.length} templates
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

const RECENT_COUNT = 6;

/**
 * What shipped last. The changelog tells the story of a release; this points
 * at the items themselves, so a returning visitor lands on something new in
 * one click instead of reading release notes to find its name.
 */
async function RecentlyAdded() {
  const recent = await getRecentlyAdded(RECENT_COUNT);
  if (recent.length === 0) return null;

  return (
    <section className="relative py-20 sm:py-28">
      <div className="container w-full">
        <SectionHeading
          kicker="Recently added"
          title="The newest of the catalog."
          blurb="The last few items to land, newest first. Every release is written up in the changelog."
        />

        <ItemCards items={recent} withDate />

        <div className="mt-8 flex justify-center">
          <Button variant="outline" className="rounded-full px-5" asChild>
            <Link href="/changelog">
              Read the changelog
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
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="mx-auto flex max-w-3xl flex-col items-center gap-7 px-4 text-center sm:px-6">
        <Pill live>Get started</Pill>
        <h2 className="text-display text-4xl italic leading-[0.88] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
          Install one. Keep all of it.
        </h2>
        <p className="max-w-md text-sm text-muted-foreground sm:text-base">
          One command copies the source into your repo, yours to read, edit, and keep. No package, no lock-in.
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
