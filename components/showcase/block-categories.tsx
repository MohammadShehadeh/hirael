import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import {
  BLOCKS_BY_KIND,
  type BlockKind,
} from "@/registry/msh-ui/registry-meta"

/* -------------------------------------------------------------------------- */
/* Design system                                                              */
/* -------------------------------------------------------------------------- */

type CategorySlug =
  | BlockKind
  | "blog"
  | "contact"
  | "image-gallery"
  | "integrations"
  | "logo-cloud"
  | "app-shell"
  | "dashboard"

type CategoryDef = {
  slug: CategorySlug
  title: string
  count: number
  freeCount?: number
  comingSoon?: boolean
  illustration: React.ComponentType
}

/* Illustration primitives — every tile composes from this small palette so
   the grid reads as one design system instead of seventeen sketches. */

const Bar = ({
  w = "w-full",
  tone = "bg-muted-foreground/15",
  className = "",
}: {
  w?: string
  tone?: string
  className?: string
}) => (
  <span className={`block h-1 rounded-full ${tone} ${w} ${className}`} />
)

const AccentBar = ({
  w = "w-full",
  className = "",
}: {
  w?: string
  className?: string
}) => (
  <span
    className={`block h-1.5 rounded-full bg-primary/35 ${w} ${className}`}
  />
)

const Pill = ({
  w = "w-full",
  tone = "bg-muted-foreground/15",
  className = "",
}: {
  w?: string
  tone?: string
  className?: string
}) => (
  <span className={`block h-3 rounded-sm border border-border ${tone} ${w} ${className}`} />
)

const Box = ({ className = "" }: { className?: string }) => (
  <span className={`block rounded-sm bg-muted-foreground/12 ${className}`} />
)

const AccentBox = ({ className = "" }: { className?: string }) => (
  <span className={`block rounded-sm bg-primary/30 ${className}`} />
)

/* -------------------------------------------------------------------------- */
/* Illustrations                                                              */
/* -------------------------------------------------------------------------- */
/* Each renders inside a 16:9 zone, centered. All compose from the primitives
   above so colors, weights, and corners stay coherent. */

const IllAuth = () => (
  <div className="flex w-full max-w-[60%] flex-col gap-1.5">
    <Bar w="w-1/2" />
    <Pill />
    <Bar w="w-1/3" />
    <Pill />
    <AccentBar className="mt-0.5" />
  </div>
)

const IllBlog = () => (
  <div className="grid w-full max-w-[80%] grid-cols-2 gap-2">
    {[0, 1].map((i) => (
      <div
        key={i}
        className="flex flex-col gap-1 rounded-sm border border-border p-1.5"
      >
        <Box className="h-6 w-full" />
        <Bar w="w-2/3" />
        <Bar w="w-1/2" tone="bg-muted-foreground/10" />
      </div>
    ))}
  </div>
)

const IllContact = () => (
  <div className="flex w-full max-w-[70%] items-end gap-2">
    <div className="flex flex-1 flex-col gap-1.5">
      <Bar w="w-1/2" />
      <Pill />
      <Bar w="w-1/2" />
      <Pill />
    </div>
    <AccentBox className="size-6" />
  </div>
)

const IllCta = () => (
  <div className="flex w-full max-w-[70%] flex-col items-center gap-2">
    <Bar w="w-3/4" />
    <Bar w="w-1/2" tone="bg-muted-foreground/10" />
    <div className="mt-1 flex gap-1.5">
      <Pill w="w-10" tone="bg-muted-foreground/10" />
      <Pill w="w-10" tone="bg-primary/30" />
    </div>
  </div>
)

const IllFaq = () => (
  <div className="flex w-full max-w-[80%] flex-col gap-1 rounded-sm border border-border bg-card/40">
    {[
      { w: "w-3/4", emphasis: false },
      { w: "w-2/3", emphasis: true },
      { w: "w-1/2", emphasis: false },
    ].map((row, i) => (
      <div
        key={i}
        className={`flex items-center justify-between gap-2 px-2 py-1 ${i < 2 ? "border-b border-border" : ""}`}
      >
        <span
          className={`block h-1 rounded-full ${row.emphasis ? "bg-primary/35" : "bg-muted-foreground/15"} ${row.w}`}
        />
        <span className="block size-1.5 rounded-full bg-muted-foreground/20" />
      </div>
    ))}
  </div>
)

const IllFeatures = () => (
  <div className="grid w-full max-w-[80%] grid-cols-3 gap-3">
    {[0, 1, 2].map((i) => (
      <div key={i} className="flex flex-col items-center gap-1">
        <AccentBox className="size-2.5" />
        <Bar w="w-3/4" />
        <Bar w="w-full" tone="bg-muted-foreground/10" />
      </div>
    ))}
  </div>
)

const IllFooter = () => (
  <div className="grid w-full max-w-[80%] grid-cols-4 gap-2">
    {[3, 3, 3, 1].map((rows, c) => (
      <div key={c} className="flex flex-col gap-1">
        <AccentBar w="w-6" className="mb-0.5 h-1" />
        {Array.from({ length: rows }).map((_, r) => (
          <Bar key={r} w="w-full" />
        ))}
      </div>
    ))}
  </div>
)

const IllHeader = () => (
  <div className="flex w-full max-w-[80%] items-center justify-between gap-2 rounded-sm border border-border bg-card/40 px-2 py-1.5">
    <span className="size-2.5 rounded-full bg-primary/35" />
    <div className="flex gap-1.5">
      <Bar w="w-5" />
      <Bar w="w-5" />
      <Bar w="w-5" />
    </div>
    <Pill w="w-8" tone="bg-primary/25" className="h-2" />
  </div>
)

const IllHero = () => (
  <div className="flex w-full max-w-[60%] flex-col items-center gap-1.5">
    <Bar w="w-1/3" tone="bg-primary/25" />
    <Bar w="w-full" />
    <Bar w="w-3/4" />
    <div className="mt-1 flex gap-1.5">
      <Pill w="w-8" tone="bg-primary/30" />
      <Pill w="w-8" tone="bg-muted-foreground/10" />
    </div>
  </div>
)

const IllGallery = () => (
  <div className="grid w-full max-w-[80%] grid-cols-4 gap-1">
    {Array.from({ length: 8 }).map((_, i) => (
      <Box key={i} className="aspect-square" />
    ))}
  </div>
)

const IllIntegrations = () => (
  <div className="relative h-[70%] w-[70%]">
    <span className="absolute left-1/2 top-1/2 h-px w-[55%] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-border" />
    <span className="absolute left-1/2 top-1/2 h-px w-[55%] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-border" />
    <span className="absolute left-1/2 top-1/2 h-px w-[80%] -translate-x-1/2 -translate-y-1/2 bg-border" />
    <span className="absolute left-1/2 top-1/2 h-[80%] w-px -translate-x-1/2 -translate-y-1/2 bg-border" />
    <span className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-card" />
    <span className="absolute left-0 top-1/2 size-2.5 -translate-y-1/2 rounded-sm bg-muted-foreground/15" />
    <span className="absolute right-0 top-1/2 size-2.5 -translate-y-1/2 rounded-sm bg-muted-foreground/15" />
    <span className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 rounded-sm bg-muted-foreground/15" />
    <span className="absolute bottom-0 left-1/2 size-2.5 -translate-x-1/2 rounded-sm bg-primary/30" />
  </div>
)

const IllLogoCloud = () => (
  <div className="flex w-full flex-col items-center gap-1.5">
    <div className="flex w-[80%] items-center gap-2 [mask-image:linear-gradient(to_right,transparent,black_30%,black_70%,transparent)]">
      <Pill w="w-full" tone="bg-muted-foreground/10" className="h-2.5" />
      <Pill w="w-full" tone="bg-muted-foreground/10" className="h-2.5" />
      <Pill w="w-full" tone="bg-muted-foreground/10" className="h-2.5" />
      <Pill w="w-full" tone="bg-muted-foreground/10" className="h-2.5" />
      <Pill w="w-full" tone="bg-muted-foreground/10" className="h-2.5" />
    </div>
    <div className="flex w-[60%] items-center gap-2 [mask-image:linear-gradient(to_right,transparent,black_30%,black_70%,transparent)]">
      <Pill w="w-full" tone="bg-muted-foreground/10" className="h-2.5" />
      <Pill w="w-full" tone="bg-muted-foreground/10" className="h-2.5" />
      <Pill w="w-full" tone="bg-muted-foreground/10" className="h-2.5" />
    </div>
  </div>
)

const IllNotFound = () => (
  <div className="flex flex-col items-center gap-1">
    <span
      className="font-mono text-2xl font-semibold leading-none tracking-tight text-muted-foreground/35"
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      404
    </span>
    <Bar w="w-12" tone="bg-muted-foreground/10" />
  </div>
)

const IllPricing = () => (
  <div className="grid w-full max-w-[80%] grid-cols-3 items-end gap-1.5">
    {[
      { h: "h-10", accent: false },
      { h: "h-14", accent: true },
      { h: "h-12", accent: false },
    ].map((col, i) => (
      <div
        key={i}
        className={`flex ${col.h} flex-col gap-1 rounded-sm border border-border ${col.accent ? "bg-card" : "bg-card/30"} p-1.5`}
      >
        <Bar w="w-1/2" />
        <AccentBar w="w-3/4" className="mt-auto" />
        <Bar w="w-full" tone="bg-muted-foreground/10" />
      </div>
    ))}
  </div>
)

const IllTestimonial = () => (
  <div className="flex w-full max-w-[70%] flex-col gap-2">
    <span className="font-mono text-xl leading-none text-muted-foreground/30">
      &ldquo;
    </span>
    <div className="flex flex-col gap-1 -mt-2">
      <Bar w="w-full" />
      <Bar w="w-3/4" />
    </div>
    <div className="mt-1 flex items-center gap-1.5">
      <span className="size-3 rounded-full bg-muted-foreground/25" />
      <Bar w="w-12" tone="bg-muted-foreground/25" />
    </div>
  </div>
)

const IllAppShell = () => (
  <div className="flex h-[70%] w-full max-w-[80%] gap-1.5">
    <div className="flex w-1/4 flex-col gap-1 rounded-sm border border-border bg-card/40 p-1.5">
      <AccentBar w="w-full" className="h-1" />
      <Bar w="w-3/4" />
      <Bar w="w-full" />
      <Bar w="w-2/3" />
    </div>
    <div className="flex flex-1 flex-col gap-1 rounded-sm border border-border bg-card/30 p-1.5">
      <Bar w="w-1/3" tone="bg-primary/30" />
      <div className="mt-auto grid grid-cols-3 gap-1">
        <Box className="h-2.5" />
        <Box className="h-2.5" />
        <Box className="h-2.5" />
      </div>
    </div>
  </div>
)

const IllDashboard = () => (
  <div className="flex h-[70%] w-full max-w-[80%] flex-col gap-1.5">
    <div className="grid grid-cols-3 gap-1.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex flex-col gap-0.5 rounded-sm border border-border bg-card/40 p-1"
        >
          <Bar w="w-2/3" />
          <AccentBar w="w-1/2" className="h-1.5" />
        </div>
      ))}
    </div>
    <div className="flex flex-1 items-end gap-1 rounded-sm border border-border bg-card/40 p-1.5">
      {[40, 70, 50, 80, 35, 60, 90].map((h, i) => (
        <span
          key={i}
          className="block w-1.5 rounded-xs bg-primary/30"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  </div>
)

/* -------------------------------------------------------------------------- */
/* Category registry                                                          */
/* -------------------------------------------------------------------------- */

const CATEGORIES: CategoryDef[] = [
  { slug: "hero", title: "Hero Sections", count: BLOCKS_BY_KIND.hero.length, illustration: IllHero },
  { slug: "feature", title: "Features", count: BLOCKS_BY_KIND.feature.length, illustration: IllFeatures },
  { slug: "pricing", title: "Pricing", count: BLOCKS_BY_KIND.pricing.length, illustration: IllPricing },
  { slug: "testimonial", title: "Testimonials", count: BLOCKS_BY_KIND.testimonial.length, illustration: IllTestimonial },
  { slug: "cta", title: "Call to Action", count: BLOCKS_BY_KIND.cta.length, illustration: IllCta },
  { slug: "faq", title: "FAQs", count: BLOCKS_BY_KIND.faq.length, illustration: IllFaq },
  { slug: "login", title: "Auth", count: BLOCKS_BY_KIND.login.length, illustration: IllAuth },
  { slug: "header", title: "Header", count: BLOCKS_BY_KIND.header.length, illustration: IllHeader },
  { slug: "footer", title: "Footer", count: BLOCKS_BY_KIND.footer.length, illustration: IllFooter },
  { slug: "not-found", title: "Not Found", count: BLOCKS_BY_KIND["not-found"].length, illustration: IllNotFound },
  { slug: "blog", title: "Blog Sections", count: 0, comingSoon: true, illustration: IllBlog },
  { slug: "contact", title: "Contact", count: 0, comingSoon: true, illustration: IllContact },
  { slug: "image-gallery", title: "Image Gallery", count: 0, comingSoon: true, illustration: IllGallery },
  { slug: "integrations", title: "Integrations", count: 0, comingSoon: true, illustration: IllIntegrations },
  { slug: "logo-cloud", title: "Logo Cloud", count: 0, comingSoon: true, illustration: IllLogoCloud },
  { slug: "app-shell", title: "App Shell", count: 0, comingSoon: true, illustration: IllAppShell },
  { slug: "dashboard", title: "Dashboard", count: 0, comingSoon: true, illustration: IllDashboard },
]

const ANCHORABLE: Partial<Record<CategorySlug, BlockKind>> = {
  hero: "hero",
  feature: "feature",
  pricing: "pricing",
  testimonial: "testimonial",
  cta: "cta",
  faq: "faq",
  login: "login",
  header: "header",
  footer: "footer",
  "not-found": "not-found",
}

function countLabel(count: number, free?: number) {
  if (free && !count) return `${free} free`
  if (free) return `${count} blocks · ${free} free`
  if (count === 0) return "Soon"
  return `${count} block${count === 1 ? "" : "s"}`
}

/* -------------------------------------------------------------------------- */
/* Tile + grid                                                                */
/* -------------------------------------------------------------------------- */

const tileShell =
  "group relative flex aspect-[5/4] size-full flex-col overflow-hidden rounded-md border border-border bg-background transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)]"

type Variant = "plain" | "indexed"

export function BlockCategories({
  variant = "plain",
  hrefPrefix = "",
}: {
  variant?: Variant
  hrefPrefix?: string
} = {}) {
  const total = CATEGORIES.length

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
      {CATEGORIES.map((cat, i) => {
        const Illustration = cat.illustration
        const anchor = ANCHORABLE[cat.slug]
        const href = anchor ? `${hrefPrefix}#${anchor}` : undefined
        const indexLabel =
          variant === "indexed" ? String(i + 1).padStart(2, "0") : undefined

        return (
          <Tile
            key={cat.slug}
            title={cat.title}
            count={countLabel(cat.count, cat.freeCount)}
            indexLabel={indexLabel}
            total={total}
            href={href}
            comingSoon={cat.comingSoon}
          >
            <Illustration />
          </Tile>
        )
      })}
    </div>
  )
}

function Tile({
  title,
  count,
  indexLabel,
  total,
  href,
  comingSoon,
  children,
}: {
  title: string
  count: string
  indexLabel?: string
  total: number
  href?: string
  comingSoon?: boolean
  children: React.ReactNode
}) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-2 px-3.5 pb-2 pt-2.5">
        <div className="min-w-0">
          <h3 className="truncate text-[13px] font-medium tracking-[-0.005em] text-foreground">
            {title}
          </h3>
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
            {count}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {comingSoon ? (
            <span className="rounded-sm border border-border bg-card px-1 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.1em] text-muted-foreground">
              Soon
            </span>
          ) : (
            href && (
              <span className="inline-flex size-4 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors group-hover:border-foreground/40 group-hover:text-foreground">
                <ArrowUpRight className="size-2.5" />
              </span>
            )
          )}
          {indexLabel && (
            <span className="font-mono text-[9px] tabular-nums uppercase tracking-[0.1em] text-muted-foreground/60">
              {indexLabel}
              <span className="opacity-50">/{String(total).padStart(2, "0")}</span>
            </span>
          )}
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-4 pt-1">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
        />
        {children}
      </div>
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        className={tileShell}
        aria-label={`Browse ${title} blocks`}
      >
        {inner}
      </Link>
    )
  }

  return (
    <div aria-disabled={comingSoon} className={`${tileShell} cursor-default`}>
      {inner}
    </div>
  )
}
