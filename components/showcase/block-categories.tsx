import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import {
  BLOCKS_BY_KIND,
  type BlockKind,
} from "@/registry/hirael/registry-meta"
import {
  IllAppShell,
  IllAuth,
  IllBlog,
  IllContact,
  IllCta,
  IllDashboard,
  IllEcommerce,
  IllFaq,
  IllFeatures,
  IllFooter,
  IllGallery,
  IllHeader,
  IllHero,
  IllIntegrations,
  IllLogoCloud,
  IllNotFound,
  IllPricing,
  IllTestimonial,
} from "@/components/showcase/block-categories-illustrations"

/* -------------------------------------------------------------------------- */
/* Category registry                                                          */
/* -------------------------------------------------------------------------- */

export type CategoryMeta = {
  slug: string
  title: string
  /** Internal BlockKind — present only for categories that have shipped blocks. */
  blockKind?: BlockKind
  comingSoon?: boolean
  description: string
}

type CategoryDefWithIllustration = CategoryMeta & {
  count: number
  freeCount?: number
  illustration: React.ComponentType
}

export const CATEGORY_REGISTRY: CategoryMeta[] = [
  {
    slug: "hero",
    title: "Hero Sections",
    blockKind: "hero",
    description:
      "Above-the-fold openers — split layouts, centered editorials, stat strips, wordmark trust rows.",
  },
  {
    slug: "features",
    title: "Features",
    blockKind: "feature",
    description:
      "Alternating rows, three-up icon grids, and bordered feature cards.",
  },
  {
    slug: "pricing",
    title: "Pricing",
    blockKind: "pricing",
    description:
      "Three-tier card layouts and feature-comparison tables, each with per-tier CTAs.",
  },
  {
    slug: "testimonials",
    title: "Testimonials",
    blockKind: "testimonial",
    description:
      "Single-quote spotlights and masonry quote grids with author rows.",
  },
  {
    slug: "cta",
    title: "Call to Action",
    blockKind: "cta",
    description:
      "Framed bands and centered announce blocks with inline install hints.",
  },
  {
    slug: "faqs",
    title: "FAQs",
    blockKind: "faq",
    description:
      "Sticky split layouts and centered accordion grids with numbered indices.",
  },
  {
    slug: "auth",
    title: "Auth",
    blockKind: "login",
    description:
      "Centered login cards and split testimonial panes with OAuth providers and strength meters.",
  },
  {
    slug: "header",
    title: "Header",
    blockKind: "header",
    description:
      "Sticky navs with backdrop blur, mobile menus, and dual-CTA layouts.",
  },
  {
    slug: "footer",
    title: "Footer",
    blockKind: "footer",
    description:
      "Multi-column link layouts with brand block, social row, and copyright rule.",
  },
  {
    slug: "not-found",
    title: "Not Found",
    blockKind: "not-found",
    description:
      "Centered 404s with paired CTAs and suggested-route lists.",
  },
  {
    slug: "blog",
    title: "Blog Sections",
    blockKind: "blog",
    description:
      "Article grids, featured-post heroes, and editorial card layouts.",
  },
  {
    slug: "contact",
    title: "Contact",
    blockKind: "contact",
    description:
      "Split form-and-info layouts, map embeds, and inline support panels.",
  },
  {
    slug: "ecommerce",
    title: "E-commerce",
    blockKind: "ecommerce",
    description:
      "Product grids, carts, and checkout-ready layouts with wishlists, promo codes, and live totals.",
  },
  {
    slug: "image-gallery",
    title: "Image Gallery",
    blockKind: "image-gallery",
    description:
      "Masonry, grid, and carousel gallery layouts with optional lightbox.",
  },
  {
    slug: "integrations",
    title: "Integrations",
    blockKind: "integrations",
    description:
      "Hub-and-spoke diagrams, integration cards, and connector showcases.",
  },
  {
    slug: "logo-cloud",
    title: "Logo Cloud",
    blockKind: "logo-cloud",
    description:
      "Trusted-by wordmark rows, marquee strips, and bordered logo grids.",
  },
  {
    slug: "app-shell",
    title: "App Shell",
    blockKind: "app-shell",
    description:
      "Sidebar + topbar layouts with command-palette and breadcrumb chrome.",
  },
  {
    slug: "dashboard",
    title: "Dashboard",
    blockKind: "dashboard",
    description:
      "Stat cards, charts, and table-driven views composed into full dashboards.",
  },
]

export const CATEGORY_BY_SLUG = Object.fromEntries(
  CATEGORY_REGISTRY.map((c) => [c.slug, c])
) as Record<string, CategoryMeta>

const CATEGORIES: CategoryDefWithIllustration[] = [
  { ...CATEGORY_BY_SLUG["hero"], count: BLOCKS_BY_KIND.hero.length, illustration: IllHero },
  { ...CATEGORY_BY_SLUG["features"], count: BLOCKS_BY_KIND.feature.length, illustration: IllFeatures },
  { ...CATEGORY_BY_SLUG["pricing"], count: BLOCKS_BY_KIND.pricing.length, illustration: IllPricing },
  { ...CATEGORY_BY_SLUG["testimonials"], count: BLOCKS_BY_KIND.testimonial.length, illustration: IllTestimonial },
  { ...CATEGORY_BY_SLUG["cta"], count: BLOCKS_BY_KIND.cta.length, illustration: IllCta },
  { ...CATEGORY_BY_SLUG["faqs"], count: BLOCKS_BY_KIND.faq.length, illustration: IllFaq },
  { ...CATEGORY_BY_SLUG["auth"], count: BLOCKS_BY_KIND.login.length, illustration: IllAuth },
  { ...CATEGORY_BY_SLUG["header"], count: BLOCKS_BY_KIND.header.length, illustration: IllHeader },
  { ...CATEGORY_BY_SLUG["footer"], count: BLOCKS_BY_KIND.footer.length, illustration: IllFooter },
  { ...CATEGORY_BY_SLUG["not-found"], count: BLOCKS_BY_KIND["not-found"].length, illustration: IllNotFound },
  { ...CATEGORY_BY_SLUG["blog"], count: BLOCKS_BY_KIND.blog.length, illustration: IllBlog },
  { ...CATEGORY_BY_SLUG["contact"], count: BLOCKS_BY_KIND.contact.length, illustration: IllContact },
  { ...CATEGORY_BY_SLUG["ecommerce"], count: BLOCKS_BY_KIND.ecommerce.length, illustration: IllEcommerce },
  { ...CATEGORY_BY_SLUG["image-gallery"], count: BLOCKS_BY_KIND["image-gallery"].length, illustration: IllGallery },
  { ...CATEGORY_BY_SLUG["integrations"], count: BLOCKS_BY_KIND.integrations.length, illustration: IllIntegrations },
  { ...CATEGORY_BY_SLUG["logo-cloud"], count: BLOCKS_BY_KIND["logo-cloud"].length, illustration: IllLogoCloud },
  { ...CATEGORY_BY_SLUG["app-shell"], count: BLOCKS_BY_KIND["app-shell"].length, illustration: IllAppShell },
  { ...CATEGORY_BY_SLUG["dashboard"], count: BLOCKS_BY_KIND.dashboard.length, illustration: IllDashboard },
]

function countLabel(count: number, free?: number) {
  if (free && !count) return `${free} free`
  if (free) return `${count} blocks · ${free} free`
  if (count === 0) return "Roadmap"
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
}: {
  variant?: Variant
} = {}) {
  const total = CATEGORIES.length

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
      {CATEGORIES.map((cat, i) => {
        const Illustration = cat.illustration
        const indexLabel =
          variant === "indexed" ? String(i + 1).padStart(2, "0") : undefined

        return (
          <Tile
            key={cat.slug}
            title={cat.title}
            count={countLabel(cat.count, cat.freeCount)}
            indexLabel={indexLabel}
            total={total}
            href={`/blocks/${cat.slug}`}
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
        aria-label={
          comingSoon ? `${title} (roadmap)` : `Browse ${title} blocks`
        }
      >
        {inner}
      </Link>
    )
  }

  return (
    <div className={`${tileShell} cursor-default`}>
      {inner}
    </div>
  )
}
