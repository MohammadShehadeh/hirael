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
    <section className="relative isolate overflow-hidden border-b border-border bg-aurora">
      {/* Top sheen — a 1px gradient line for premium feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-sheen-top"
      />

      {/* Background grid + radial fade */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.4] dark:opacity-[0.8]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, black 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, black 20%, transparent 75%)",
        }}
      />

      {/* Ambient orb behind hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 size-[640px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-40 blur-3xl animate-spin-slow"
        style={{
          background:
            "conic-gradient(from 90deg, color-mix(in oklch, var(--primary) 40%, transparent), transparent 30%, color-mix(in oklch, var(--primary) 24%, transparent) 60%, transparent 80%)",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-9 px-4 pb-20 pt-20 text-center sm:gap-11 sm:px-6 sm:pb-28 sm:pt-28 md:pb-36 md:pt-32 lg:px-8">
        <a
          href={SITE.githubUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="group inline-flex items-center gap-2.5 rounded-full border border-border bg-card/80 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm transition-colors hover:border-foreground/40 hover:bg-accent hover:text-foreground"
        >
          <span className="relative flex size-1.5">
            <span
              className="absolute inline-flex size-full animate-ping-soft rounded-full opacity-80"
              style={{ background: "var(--primary)" }}
            />
            <span
              className="relative inline-flex size-1.5 rounded-full"
              style={{ background: "var(--primary)" }}
            />
          </span>
          v{SITE.version} now live
          <span className="text-border">·</span>
          <span className="text-foreground">star on GitHub</span>
          <ArrowRight className="size-3 transition-transform duration-150 group-hover:translate-x-0.5" />
        </a>

        <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.045em] sm:text-6xl md:text-7xl lg:text-[96px]">
          <span className="text-gradient-primary">shadcn&apos;s</span>
          <br />
          <span className="text-muted-foreground/70">missing pieces.</span>
        </h1>

        <p className="max-w-2xl text-balance text-base text-muted-foreground sm:text-lg md:text-xl">
          A peer registry of the components every real product needs but shadcn
          doesn&apos;t ship — multi-select, combobox, tag input, currency
          input, file dropzone — plus {blocksCount} section blocks across{" "}
          {kindsCount} categories.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/components"
            className="group relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_50%,transparent)] transition-all hover:bg-primary/95 hover:shadow-[0_0_36px_-8px_color-mix(in_oklch,var(--primary)_50%,transparent)]"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary-foreground/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
            />
            Browse components
            <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/blocks"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-card/80 px-5 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:border-foreground/40 hover:bg-accent"
          >
            <Layers className="size-4" />
            See blocks
          </Link>
        </div>

        <div className="flex w-full max-w-2xl flex-col gap-3 pt-2">
          <InstallBlock name="multi-select" />
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            One command. Source lands in{" "}
            <span className="text-foreground">@/components/ui</span>.
          </p>
        </div>
      </div>

      {/* Bottom fade for smoother transition */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent"
      />
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
    <section className="relative border-b border-border">
      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            <span
              aria-hidden
              className="size-1 rounded-full"
              style={{ background: "var(--primary)" }}
            />
            What you get
          </span>
          <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl md:text-5xl">
            Production-grade primitives, <br className="hidden md:inline" />
            <span className="text-muted-foreground/70">
              distributed the shadcn way.
            </span>
          </h2>
        </div>
        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <li
              key={feature.title}
              className="card-glow group relative flex flex-col gap-3 border border-transparent bg-card p-6"
            >
              <span className="relative inline-flex size-10 items-center justify-center rounded-md border border-border bg-background">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -z-10 rounded-md opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-60"
                  style={{ background: "var(--primary)" }}
                />
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
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="card-glow group flex flex-col gap-1.5 border border-transparent bg-card px-5 py-5"
            >
              <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                {item.label}
              </dt>
              <dd className="font-mono text-2xl tabular-nums tracking-[-0.01em] text-foreground">
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
      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <Boxes className="size-3" />
              components
            </span>
            <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl md:text-5xl">
              {totalStable} components{" "}
              <span className="text-muted-foreground/70">
                shadcn doesn&apos;t ship.
              </span>
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              Tap any to preview, copy the install command, or browse the
              source.
            </p>
          </div>
          <Link
            href="/components"
            className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
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
                <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((entry) => (
                    <li key={entry.name}>
                      <Link
                        href={`/${entry.name}`}
                        className="card-glow group flex h-full flex-col justify-between gap-3 border border-transparent bg-card p-4"
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
                                className="size-3 text-muted-foreground transition-colors group-hover:text-foreground"
                              />
                            )}
                          </div>
                          <p className="text-[11px] leading-relaxed text-muted-foreground line-clamp-2">
                            {entry.description}
                          </p>
                        </div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground transition-colors group-hover:text-foreground">
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
    <section className="relative border-b border-border">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:px-8">
        <div className="flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            <Code className="size-3" />
            composition
          </span>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl md:text-5xl">
            Composed{" "}
            <span className="text-muted-foreground/70">the shadcn way.</span>
          </h2>
          <p className="max-w-md text-sm text-muted-foreground sm:text-base">
            Every compound component ships as flat top-level exports — no
            namespacing, no convenience wrappers. The bare name is the root
            primitive and holds state; every rendered piece carries a{" "}
            <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">
              data-slot
            </code>{" "}
            attribute for downstream styling.
          </p>
          <ul className="mt-2 flex flex-col gap-2.5">
            {[
              "Flat compound exports, no namespacing",
              "data-slot attribute on every rendered part",
              "Tokens from --background, --foreground, --primary — never hard-coded",
            ].map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-2.5 text-xs text-muted-foreground sm:text-sm"
              >
                <span
                  aria-hidden
                  className="mt-1 inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-border bg-card"
                >
                  <Check className="size-2.5 text-foreground" />
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative min-w-0">
          {/* Glow behind code block */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-4 -z-10 rounded-2xl opacity-50 blur-2xl"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 50% 50%, color-mix(in oklch, var(--primary) 18%, transparent), transparent 70%)",
            }}
          />
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
      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <Layers className="size-3" />
              section blocks
            </span>
            <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl md:text-5xl">
              Drop-in compositions{" "}
              <span className="text-muted-foreground/70">
                for whole sections.
              </span>
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              Heroes, features, pricing, testimonials, CTAs, FAQs, auth,
              navigation, errors. Copy a block in one command, then shape it
              like any other source file in your repo.
            </p>
          </div>
          <Link
            href="/blocks"
            className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            See all blocks
            <ArrowRight className="size-3 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((entry) => (
            <li key={entry.name}>
              <Link
                href={`/blocks/${entry.name}`}
                className="card-glow group flex h-full flex-col justify-between gap-3 border border-transparent bg-card p-5"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-medium tracking-[-0.01em]">
                      {entry.title}
                    </h3>
                    <span className="rounded-sm border border-border px-1.5 py-0 font-mono text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
                      {entry.blockKind}
                    </span>
                  </div>
                  {entry.blockTagline && (
                    <p className="text-[11px] leading-relaxed text-muted-foreground line-clamp-2">
                      {entry.blockTagline}
                    </p>
                  )}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground transition-colors group-hover:text-foreground">
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
      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card bg-aurora">
          {/* Top sheen */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-sheen-top"
          />

          {/* Grid bg */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.5]"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              maskImage:
                "radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 75%)",
            }}
          />

          {/* Spinning orb */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-0 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl animate-spin-slow"
            style={{
              background:
                "conic-gradient(from 0deg, color-mix(in oklch, var(--primary) 40%, transparent), transparent 50%, color-mix(in oklch, var(--primary) 30%, transparent))",
            }}
          />

          <div className="relative flex flex-col items-center gap-6 px-6 py-16 text-center sm:px-12 sm:py-24">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm">
              <Sparkles className="size-3" />
              ready when you are
            </span>
            <h2 className="max-w-3xl text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-5xl md:text-6xl">
              <span className="text-gradient-primary">Stop rebuilding</span>{" "}
              <br className="hidden sm:inline" />
              <span className="text-muted-foreground/70">
                the same components.
              </span>
            </h2>
            <p className="max-w-xl text-balance text-sm text-muted-foreground sm:text-base">
              {blocksCount} blocks, dozens of components, zero runtime
              dependencies. Distributed via the shadcn CLI — copy what you
              need, leave the rest.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/components"
                className="group relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_50%,transparent)] transition-all hover:bg-primary/95 hover:shadow-[0_0_36px_-8px_color-mix(in_oklch,var(--primary)_50%,transparent)]"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary-foreground/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                />
                Browse components
                <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
              <a
                href={SITE.githubUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-background/80 px-5 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:border-foreground/40 hover:bg-accent"
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
