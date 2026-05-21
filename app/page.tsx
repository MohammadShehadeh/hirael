import Link from "next/link"
import type { Metadata } from "next"
import {
  ArrowRight,
  Boxes,
  Check,
  Code,
  GitBranch,
  Layers,
  Palette,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react"

import { InlineCodeBlock } from "@/components/showcase/code-block"
import { InstallBlock } from "@/components/showcase/install-block"
import { SiteFooter } from "@/components/showcase/site-footer"
import { SiteHeader } from "@/components/showcase/site-header"
import { highlightCode } from "@/lib/highlight"
import { SITE } from "@/lib/site"
import {
  BLOCK_KIND_ORDER,
  CATEGORY_LABELS,
  REGISTRY,
  REGISTRY_BY_CATEGORY,
  type ComponentCategory,
} from "@/registry/sabk/registry-meta"

const FEATURED_CATEGORIES: ComponentCategory[] = ["inputs", "pickers", "data"]

const FEATURED_BLOCKS = [
  "hero-01",
  "feature-01",
  "pricing-01",
  "testimonial-01",
  "cta-01",
  "faq-01",
]

const COMPOSE_SNIPPET = `import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectTrigger,
} from "@/components/ui/multi-select"

<MultiSelect value={value} onValueChange={setValue} options={options}>
  <MultiSelectTrigger placeholder="Pick…" />
  <MultiSelectContent searchPlaceholder="Filter…" />
</MultiSelect>`

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.description}`,
  description: SITE.longDescription,
  openGraph: {
    title: `${SITE.name} — ${SITE.description}`,
    description: SITE.longDescription,
    type: "website",
  },
}

export default async function LandingPage() {
  const components = REGISTRY.filter((r) => r.category !== "blocks")
  const blocks = REGISTRY_BY_CATEGORY.blocks
  const stableComponents = components.filter((r) => r.status === "stable")
  const composeHtml = await highlightCode(COMPOSE_SNIPPET, "tsx")

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero blocksCount={blocks.length} kindsCount={BLOCK_KIND_ORDER.length} />
        <Features />
        <CountersStrip
          components={components.length}
          stableComponents={stableComponents.length}
          blocks={blocks.length}
          blockKinds={BLOCK_KIND_ORDER.length}
        />
        <ComponentsPreview />
        <Composition html={composeHtml} code={COMPOSE_SNIPPET} />
        <BlocksPreview />
        <BottomCta blocksCount={blocks.length} />
      </main>
      <SiteFooter />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

function Hero({
  blocksCount,
  kindsCount,
}: {
  blocksCount: number
  kindsCount: number
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Background grid + radial fade */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, black 30%, transparent 80%)",
        }}
      />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-4 pb-16 pt-16 text-center sm:gap-10 sm:px-6 sm:pb-20 sm:pt-20 md:pb-28 md:pt-24 lg:px-8">
        <a
          href={SITE.githubUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-foreground/40 hover:bg-accent hover:text-foreground"
        >
          <span className="size-1.5 rounded-full bg-foreground" />
          v{SITE.version} now live
          <span className="text-foreground">·</span>
          star on GitHub
          <ArrowRight className="size-3 transition-transform duration-150 group-hover:translate-x-0.5" />
        </a>

        <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-[88px]">
          shadcn&apos;s
          <br />
          <span className="text-muted-foreground/80">missing pieces.</span>
        </h1>

        <p className="max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
          A peer registry of the components every real product needs but shadcn
          doesn&apos;t ship — multi-select, combobox, tag input, currency
          input, file dropzone — plus {blocksCount} section blocks across{" "}
          {kindsCount} categories.
        </p>

        <div className="flex w-full max-w-xl flex-col gap-3">
          <InstallBlock name="multi-select" />
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            One command. Source lands in <span className="text-foreground">@/components/ui</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/components"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Browse components
            <ArrowRight className="size-3.5" />
          </Link>
          <Link
            href="/blocks"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-foreground/40 hover:bg-accent"
          >
            <Layers className="size-3.5" />
            See blocks
          </Link>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Features                                                                   */
/* -------------------------------------------------------------------------- */

const FEATURES = [
  {
    icon: Zap,
    title: "Copy-paste, not a dependency",
    body: "Distributed via the shadcn CLI. Source lands in your repo — no msh ui runtime, no breaking version bumps.",
  },
  {
    icon: GitBranch,
    title: "Peer of shadcn",
    body: "Composes on top of shadcn's primitives. If you have shadcn, you have everything you need to install.",
  },
  {
    icon: Shield,
    title: "Accessible by default",
    body: "Keyboard navigation, ARIA, focus rings, motion-reduce. Built on Radix where it matters.",
  },
  {
    icon: Palette,
    title: "Theme-first",
    body: "Every color comes from CSS tokens. Paste any shadcn theme generator output and watch the whole registry re-skin.",
  },
  {
    icon: Code,
    title: "Composable APIs",
    body: "Flat compound exports with data-slot attributes. Compose the way you compose shadcn's own primitives.",
  },
  {
    icon: Sparkles,
    title: "Production polish",
    body: "1px soft borders, 0.65rem radius scale, zinc neutrals, Geist Sans + Mono. Designed to ship.",
  },
] as const

function Features() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-10 flex flex-col gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            ◆ what you get
          </span>
          <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.025em] sm:text-4xl">
            Production-grade primitives, distributed the shadcn way.
          </h2>
        </div>
        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <li key={feature.title} className="flex flex-col gap-3 bg-card p-6">
              <span className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background">
                <feature.icon className="size-4 text-foreground" />
              </span>
              <h3 className="text-base font-medium tracking-[-0.01em]">
                {feature.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {feature.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Counters                                                                   */
/* -------------------------------------------------------------------------- */

function CountersStrip({
  components,
  stableComponents,
  blocks,
  blockKinds,
}: {
  components: number
  stableComponents: number
  blocks: number
  blockKinds: number
}) {
  const items: { label: string; value: string }[] = [
    { label: "components", value: `${stableComponents} / ${components}` },
    { label: "blocks", value: `${blocks}` },
    { label: "block categories", value: `${blockKinds}` },
    { label: "runtime deps", value: "0" },
  ]
  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-1 bg-card px-4 py-4"
            >
              <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                {item.label}
              </dt>
              <dd className="font-mono text-xl tabular-nums tracking-[-0.01em] text-foreground">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Components preview                                                         */
/* -------------------------------------------------------------------------- */

function ComponentsPreview() {
  const totalStable = REGISTRY.filter(
    (r) => r.category !== "blocks" && r.status === "stable"
  ).length

  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              <Boxes className="-mt-0.5 mr-1 inline size-3" />
              components
            </span>
            <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.025em] sm:text-4xl">
              {totalStable} components shadcn doesn&apos;t ship.
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Tap any to preview, copy the install command, or browse the
              source.
            </p>
          </div>
          <Link
            href="/components"
            className="group inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
          >
            See all
            <ArrowRight className="size-3 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="flex flex-col gap-10">
          {FEATURED_CATEGORIES.map((cat) => {
            const items = REGISTRY_BY_CATEGORY[cat].slice(0, 6)
            if (!items.length) return null
            return (
              <div key={cat} className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-foreground">
                    {CATEGORY_LABELS[cat]}
                  </h3>
                  <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                    {REGISTRY_BY_CATEGORY[cat].length} total
                  </span>
                </div>
                <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((entry) => (
                    <li key={entry.name}>
                      <Link
                        href={`/${entry.name}`}
                        className="group flex h-full flex-col justify-between gap-3 bg-card p-4 transition-colors hover:bg-accent"
                      >
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-medium tracking-[-0.01em]">
                              {entry.title}
                            </h4>
                            {entry.status === "planned" ? (
                              <span className="rounded-sm border border-border px-1.5 py-0 font-mono text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
                                soon
                              </span>
                            ) : (
                              <Check
                                aria-hidden
                                className="size-3 text-muted-foreground"
                              />
                            )}
                          </div>
                          <p className="text-[11px] leading-relaxed text-muted-foreground line-clamp-2">
                            {entry.description}
                          </p>
                        </div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground group-hover:text-foreground">
                          /{entry.name} →
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Composition                                                                */
/* -------------------------------------------------------------------------- */

function Composition({ html, code }: { html: string; code: string }) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            ◆ composition
          </span>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.025em] sm:text-4xl">
            Composed the shadcn way.
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Every compound component ships as flat top-level exports — no
            namespacing, no convenience wrappers. The bare name is the root
            primitive and holds state; every rendered piece carries a{" "}
            <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">
              data-slot
            </code>{" "}
            attribute for downstream styling.
          </p>
          <ul className="mt-2 flex flex-col gap-2">
            {[
              "Flat compound exports, no namespacing",
              "data-slot attribute on every rendered part",
              "Tokens from --background, --foreground, --primary — never hard-coded",
            ].map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-2 text-xs text-muted-foreground"
              >
                <Check className="mt-0.5 size-3.5 shrink-0 text-foreground" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0">
          <InlineCodeBlock code={code} html={html} />
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Blocks preview                                                             */
/* -------------------------------------------------------------------------- */

function BlocksPreview() {
  const featured = FEATURED_BLOCKS.map((name) =>
    REGISTRY_BY_CATEGORY.blocks.find((b) => b.name === name)
  ).filter((b): b is NonNullable<typeof b> => Boolean(b))

  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              <Layers className="-mt-0.5 mr-1 inline size-3" />
              section blocks
            </span>
            <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.025em] sm:text-4xl">
              Drop-in compositions for whole sections.
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Heroes, features, pricing, testimonials, CTAs, FAQs, auth,
              navigation, errors. Copy a block in one command, then shape it
              like any other source file in your repo.
            </p>
          </div>
          <Link
            href="/blocks"
            className="group inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
          >
            See all blocks
            <ArrowRight className="size-3 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((entry) => (
            <li key={entry.name}>
              <Link
                href={`/blocks/${entry.name}`}
                className="group flex h-full flex-col justify-between gap-3 bg-card p-4 transition-colors hover:bg-accent"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-medium tracking-[-0.01em]">
                      {entry.title}
                    </h3>
                    <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
                      {entry.blockKind}
                    </span>
                  </div>
                  {entry.blockTagline && (
                    <p className="text-[11px] leading-relaxed text-muted-foreground line-clamp-2">
                      {entry.blockTagline}
                    </p>
                  )}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground group-hover:text-foreground">
                  /blocks/{entry.name} →
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Bottom CTA                                                                 */
/* -------------------------------------------------------------------------- */

function BottomCta({ blocksCount }: { blocksCount: number }) {
  return (
    <section>
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="relative overflow-hidden rounded-lg border border-border bg-card">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              maskImage:
                "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 80%)",
            }}
          />
          <div className="relative flex flex-col items-center gap-5 px-6 py-12 text-center sm:px-12 sm:py-16">
            <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.025em] sm:text-4xl">
              Ready to ship the components you keep building from scratch?
            </h2>
            <p className="max-w-xl text-balance text-sm text-muted-foreground">
              {blocksCount} blocks, dozens of components, zero runtime
              dependencies. Distributed via the shadcn CLI — copy what you
              need, leave the rest.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link
                href="/components"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Browse components
                <ArrowRight className="size-3.5" />
              </Link>
              <a
                href={SITE.githubUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:border-foreground/40 hover:bg-accent"
              >
                Star on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
