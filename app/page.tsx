import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowUpRight,
  Boxes,
  Download,
  Languages,
  Layers,
  MonitorSmartphone,
  SunMoon,
} from "lucide-react";

import { BlockShowcase } from "@/components/showcase/block-showcase";
import { Pill, SectionHeading } from "@/components/showcase/page-header";
import { InstallBlock } from "@/components/showcase/install-block";
import { SiteFooter } from "@/components/showcase/site-footer";
import { SiteHeader } from "@/components/showcase/site-header";
import { SITE } from "@/lib/site";
import { Marquee } from "@/registry/hirael/ui/marquee";
import {
  BLOCK_KIND_ORDER,
  BLOCKS_BY_KIND,
  COMPONENTS,
  TEMPLATES,
} from "@/registry/hirael/registry-meta";
import { Button } from "@/registry/hirael/ui/button";

export const metadata: Metadata = {
  title: `${SITE.description} - ${SITE.name}`,
  description: SITE.longDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.description} - ${SITE.name}`,
    description: SITE.longDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${SITE.description} - ${SITE.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.description} - ${SITE.name}`,
    description: SITE.longDescription,
    images: ["/opengraph-image"],
  },
};

const blocksTotal = BLOCK_KIND_ORDER.reduce(
  (sum, k) => sum + BLOCKS_BY_KIND[k].length,
  0,
);

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <CatalogTicker />
        <WhyHirael />
        <SectionBlocks />
        <ClosingCta />
      </main>
      <SiteFooter />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero — full-bleed, cinematic, oversized italic serif                       */
/* -------------------------------------------------------------------------- */

function Hero() {
  const rise =
    "animate-in fade-in-0 slide-in-from-bottom-3 duration-700 ease-out motion-reduce:animate-none";

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

      <div className="mx-auto flex min-h-[86vh] max-w-5xl flex-col items-center justify-center gap-7 px-4 py-24 text-center sm:px-6 sm:py-28">
        <div style={{ animationFillMode: "both" }} className={rise}>
          <span className="glass-panel glass-panel-lit inline-flex items-center gap-2 rounded-full py-1 px-4 text-sm">
            <span className="text-muted-foreground">
              The shadcn-compatible registry
            </span>
          </span>
        </div>

        <h1
          style={{ animationDelay: "80ms", animationFillMode: "both" }}
          className={`text-display w-full text-balance text-[clamp(2.5rem,11vw,7rem)] italic leading-[0.9] tracking-[-0.025em] sm:leading-[0.85] ${rise}`}
        >
          The components <br className="hidden sm:block" />
          shadcn/ui doesn&apos;t ship.
        </h1>

        <p
          style={{ animationDelay: "160ms", animationFillMode: "both" }}
          className={`max-w-xl text-balance text-base text-muted-foreground sm:text-lg ${rise}`}
        >
          Multi-select, combobox, tag input, file dropzone, and the section
          blocks most products end up building anyway. Install with the shadcn
          CLI — the source lands in your repo, yours to keep.
        </p>

        <div
          style={{ animationDelay: "240ms", animationFillMode: "both" }}
          className={`flex flex-wrap items-center justify-center gap-3 ${rise}`}
        >
          <Button size="lg" className="rounded-full px-6" asChild>
            <Link href="/components">
              Browse components
              <ArrowUpRight className="size-4 rtl:-rotate-90" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="glass-panel glass-panel-lit rounded-full px-6"
            asChild
          >
            <Link href="/blocks">Browse blocks</Link>
          </Button>
        </div>

        <div
          style={{ animationDelay: "340ms", animationFillMode: "both" }}
          className={`mt-8 flex flex-col items-center gap-5 ${rise}`}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Works anywhere React runs
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-foreground/55 sm:gap-x-12">
            {["Next", "Remix", "Vite", "Astro", "shadcn/ui"].map((name) => (
              <span
                key={name}
                className="text-display text-2xl italic sm:text-3xl"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Catalog ticker — a slow strip of every component name, dogfooding marquee   */
/* -------------------------------------------------------------------------- */

function CatalogTicker() {
  return (
    <section aria-hidden className="relative -mt-4 pb-4 sm:pb-8">
      <div className="container w-full">
        <div className="relative overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <Marquee pauseOnHover duration={70} gap="0.75rem" repeat={2}>
            {COMPONENTS.map((entry) => (
              <span
                key={entry.name}
                className="glass-panel inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[11px] tracking-tight text-muted-foreground"
              >
                <span className="size-1 rounded-full bg-muted-foreground/50" />
                {entry.name}
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Why Hirael — glass feature cards with icon circles                         */
/* -------------------------------------------------------------------------- */

const FEATURES: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}[] = [
  {
    icon: Download,
    title: "Copies into your repo",
    body: "The CLI writes the source into your project. Nothing in node_modules, no version to bump.",
  },
  {
    icon: Boxes,
    title: "Built on shadcn",
    body: "Radix primitives, shadcn conventions, your components.json. A peer, not a replacement.",
  },
  {
    icon: Layers,
    title: "Any React stack",
    body: "Next, Remix, Vite, Astro — anywhere React and Tailwind already run.",
  },
  {
    icon: SunMoon,
    title: "Light and dark",
    body: "Theme-aware through CSS variables, so every item inherits your tokens in both modes.",
  },
  {
    icon: Languages,
    title: "RTL, no config",
    body: "Logical properties throughout, so dir=rtl works with nothing extra to wire up.",
  },
  {
    icon: MonitorSmartphone,
    title: "Responsive by default",
    body: "Built to hold their shape from small phones to ultra-wide displays.",
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
function CardGrid({
  id,
  squares,
}: {
  id: string;
  squares: [number, number][];
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 mask-[linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-linear-to-br from-primary/8 to-transparent mask-[radial-gradient(farthest-side_at_top,white,transparent)]">
        <svg
          aria-hidden
          className="absolute inset-0 h-full w-full fill-primary/10 stroke-primary/25"
        >
          <defs>
            <pattern
              id={id}
              width={20}
              height={20}
              patternUnits="userSpaceOnUse"
              x="-12"
              y="4"
            >
              <path d="M.5 20V.5H20" fill="none" />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill={`url(#${id})`}
          />
          <svg x="-12" y="4" className="overflow-visible">
            {squares.map(([col, row], i) => (
              <rect
                strokeWidth="0"
                key={`${col}-${row}-${i}`}
                width={21}
                height={21}
                x={col * 20}
                y={row * 20}
              />
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
          blurb="Install with the shadcn CLI and the code lands in your repo, ready to read and change — built the way shadcn ships its primitives."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="glass-panel glass-panel-lit group relative flex flex-col gap-5 overflow-hidden rounded-2xl p-7 transition-colors duration-200 hover:bg-card/70"
              >
                <CardGrid
                  id={`why-grid-${i}`}
                  squares={CARD_GRID_SQUARES[i % CARD_GRID_SQUARES.length]}
                />
                <span className="glass-panel-strong relative z-10 inline-flex size-11 shrink-0 items-center justify-center rounded-full">
                  <Icon className="size-4 text-foreground" />
                </span>
                <div className="relative z-10 flex flex-col gap-2">
                  <h3 className="text-base font-medium tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.body}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Section blocks                                                             */
/* -------------------------------------------------------------------------- */

function SectionBlocks() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="container w-full">
        <SectionHeading
          kicker="Section blocks"
          title="Blocks for whole sections of a page."
          blurb={`${blocksTotal} drop-in compositions across ${BLOCK_KIND_ORDER.length} categories — heroes, pricing, testimonials, CTAs, auth, and more.`}
        />

        <BlockShowcase />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Closing CTA                                                                */
/* -------------------------------------------------------------------------- */

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
        <h2 className="text-display text-balance text-5xl italic leading-[0.88] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
          Install one. Keep all of it.
        </h2>
        <p className="max-w-md text-balance text-sm text-muted-foreground sm:text-base">
          One command copies the source into your repo — yours to read, edit,
          and keep. No package, no lock-in.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" className="rounded-full px-6" asChild>
            <Link href="/components">
              Browse components
              <ArrowUpRight className="size-4 rtl:-rotate-90" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="glass-panel glass-panel-lit rounded-full px-6"
            asChild
          >
            <Link href="/templates">{TEMPLATES.length} full templates</Link>
          </Button>
        </div>
        <InstallBlock name="combobox" className="mt-2 w-full max-w-md" />
      </div>
    </section>
  );
}
