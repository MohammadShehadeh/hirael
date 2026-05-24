import Link from "next/link"

import {
  BLOCKS_BY_KIND,
  type BlockKind,
} from "@/registry/msh-ui/registry-meta"

type CategorySlug =
  | BlockKind
  | "blog"
  | "contact"
  | "image-gallery"
  | "integrations"
  | "logo-cloud"
  | "app-shell"
  | "dashboard"

type CategoryCard = {
  slug: CategorySlug
  title: string
  count: number
  freeCount?: number
  comingSoon?: boolean
  render: (meta: { title: string; countLabel: string }) => React.ReactNode
}

const cardShell =
  "group relative aspect-video size-full overflow-hidden rounded-md border bg-background transition-colors hover:bg-card dark:bg-[radial-gradient(80%_100%_at_49%_0%,rgba(255,255,255,0.06),transparent)]"

const headingClass = "font-medium text-sm tracking-[-0.01em] md:text-base"
const subClass = "text-muted-foreground text-xs"

function countLabel(count: number, free?: number) {
  if (free && !count) return `${free} Free  block${free === 1 ? "" : "s"}`
  if (free) return `${count}  blocks (+ ${free} Free)`
  return `${count}  block${count === 1 ? "" : "s"}`
}

const CATEGORIES: CategoryCard[] = [
  {
    slug: "login",
    title: "Auth",
    count: BLOCKS_BY_KIND.login.length,
    render: ({ title, countLabel }) => (
      <div className="grid size-full grid-cols-2">
        <div className="z-10 border-r py-5 ps-3 pe-1 md:px-5">
          <h3 className={headingClass}>{title}</h3>
          <p className={subClass}>{countLabel}</p>
        </div>
        <div className="flex flex-col items-center justify-center p-3">
          <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-muted-foreground/20 p-2 md:h-2" />
          <div className="mb-1.5 h-1 w-full rounded-sm bg-muted-foreground/10 md:h-2" />
          <div className="mb-3 h-1 w-full rounded-sm bg-muted-foreground/10 md:h-2" />
          <div className="h-3 w-full rounded-sm bg-primary/20 md:h-4" />
        </div>
      </div>
    ),
  },
  {
    slug: "blog",
    title: "Blog Sections",
    count: 0,
    comingSoon: true,
    render: ({ title, countLabel }) => (
      <div className="flex size-full w-full flex-col items-center justify-center gap-2 px-8">
        <div className="w-full">
          <h3 className={headingClass}>{title}</h3>
          <p className={subClass}>{countLabel}</p>
        </div>
        <div className="flex w-full items-center gap-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="w-full overflow-hidden rounded-sm border bg-background shadow-xs"
            >
              <div className="h-6 w-full bg-card md:h-12" />
              <div className="flex flex-col gap-1 border-t p-1 md:p-2">
                <div className="h-1 w-1/2 rounded-full bg-muted-foreground/20 md:h-1.5" />
                <div className="h-0.5 w-3/4 rounded-full bg-muted-foreground/20 md:h-1.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    slug: "contact",
    title: "Contact",
    count: 0,
    comingSoon: true,
    render: ({ title, countLabel }) => (
      <div className="grid size-full grid-cols-2 gap-4 p-2 md:p-5">
        <div className="flex flex-col justify-center gap-2">
          <div>
            <h3 className={headingClass}>{title}</h3>
            <p className={subClass}>{countLabel}</p>
          </div>
          <div className="h-1 w-full rounded-full bg-muted-foreground/20 md:h-2" />
          <div className="h-1 w-full rounded-full bg-muted-foreground/20 md:h-2" />
        </div>
        <div className="flex h-full w-full flex-col gap-1.5 rounded-md border bg-background p-2 shadow-xs">
          <div className="h-1 w-8 rounded-full bg-muted-foreground/20 md:h-1.5" />
          <div className="h-2 w-full rounded-sm border bg-muted/20 md:h-3" />
          <div className="h-1 w-8 rounded-full bg-muted-foreground/20 md:h-1.5" />
          <div className="h-2 w-full rounded-sm border bg-muted/20 md:h-3" />
          <div className="mt-auto h-3 w-full rounded-sm bg-primary/20 md:h-4" />
        </div>
      </div>
    ),
  },
  {
    slug: "cta",
    title: "Call to Action",
    count: BLOCKS_BY_KIND.cta.length,
    render: ({ title, countLabel }) => (
      <div className="flex size-full flex-col items-center justify-center gap-2">
        <h3 className={headingClass}>{title}</h3>
        <div className="w-full border-y px-4">
          <div className="grid grid-cols-2 border-x">
            <div className="flex w-full items-center border-r px-2">
              <p className={subClass}>{countLabel}</p>
            </div>
            <div className="flex items-center gap-2 p-1">
              <div className="h-4 w-full rounded-sm bg-muted-foreground/20" />
              <div className="h-4 w-full rounded-sm bg-primary/20" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    slug: "faq",
    title: "Faqs",
    count: BLOCKS_BY_KIND.faq.length,
    render: ({ title, countLabel }) => (
      <div className="grid size-full grid-cols-2">
        <div className="flex flex-col border-r py-5 ps-3 pe-1 md:px-5">
          <h3 className={headingClass}>{title}</h3>
          <p className={subClass}>{countLabel}</p>
        </div>
        <div className="flex items-center">
          <div className="flex w-full flex-col border-t">
            <div className="flex h-4 w-full items-center border-b px-2 md:h-6">
              <div className="h-1.5 w-2/3 rounded-full bg-muted-foreground/20" />
            </div>
            <div className="flex h-4 w-full items-center border-b px-2 md:h-6">
              <div className="h-1.5 w-1/2 rounded-full bg-muted-foreground/20" />
            </div>
            <div className="flex h-14 w-full flex-col gap-1.5 border-b bg-card px-2 pt-2">
              <div className="h-1.5 w-3/4 rounded-full bg-primary/20" />
              <div className="h-1 w-full rounded-full bg-muted-foreground/10" />
              <div className="h-1 w-full rounded-full bg-muted-foreground/10" />
              <div className="h-1 w-5/6 rounded-full bg-muted-foreground/10" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    slug: "feature",
    title: "Features",
    count: BLOCKS_BY_KIND.feature.length,
    render: ({ title, countLabel }) => (
      <div className="flex size-full flex-col justify-center gap-2 px-4 md:gap-5">
        <div className="flex flex-col items-center">
          <h3 className={headingClass}>{title}</h3>
          <p className={subClass}>{countLabel}</p>
        </div>
        <div className="grid grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="relative flex flex-col items-center justify-center py-1 md:py-4"
            >
              {i < 2 && (
                <span className="absolute inset-y-0 right-0 h-full w-px bg-gradient-to-b from-foreground/5 via-foreground/15 to-foreground/5" />
              )}
              <div className="size-1.5 rounded-sm bg-primary/20 md:size-2.5" />
              <div className="mt-1 h-1 w-4 rounded-full bg-muted-foreground/20 md:mt-2 md:h-1.5 md:w-6" />
              <div className="mt-1 h-1 w-8 rounded-full bg-muted-foreground/20 md:mt-1 md:h-1 md:w-10" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    slug: "footer",
    title: "Footer",
    count: BLOCKS_BY_KIND.footer.length,
    render: ({ title, countLabel }) => (
      <div className="flex size-full w-full flex-col gap-2">
        <div className="flex flex-col items-center pt-5">
          <h3 className={headingClass}>{title}</h3>
          <p className={subClass}>{countLabel}</p>
        </div>
        <div className="mt-auto border-t px-4 [mask-image:linear-gradient(to_bottom,black_60%,transparent)]">
          <div className="grid grid-cols-4 gap-2 border-x p-3">
            {[4, 3, 3, 1].map((rows, c) => (
              <div key={c} className="flex flex-col gap-1">
                <div className="mb-1 h-1 w-4 rounded-full bg-primary/20" />
                {Array.from({ length: rows - 1 }).map((_, r) => (
                  <div
                    key={r}
                    className="h-1 w-6 rounded-full bg-muted-foreground/20"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    slug: "header",
    title: "Header",
    count: BLOCKS_BY_KIND.header.length,
    render: ({ title, countLabel }) => (
      <div className="flex size-full w-full flex-col gap-2 p-2 md:p-4">
        <div className="flex items-center justify-between gap-4 rounded-md border bg-card p-1 shadow-xs">
          <div className="size-3.5 rounded-full bg-primary/20" />
          <div className="flex gap-1">
            <div className="h-1.5 w-5 rounded-full bg-muted-foreground/20 md:w-8" />
            <div className="h-1.5 w-5 rounded-full bg-muted-foreground/20 md:w-8" />
            <div className="h-1.5 w-5 rounded-full bg-muted-foreground/20 md:w-8" />
          </div>
          <div className="h-3.5 w-8 rounded-sm bg-primary/20 md:w-12" />
        </div>
        <div className="flex flex-col items-center pt-2 md:pt-5">
          <p className={subClass}>{countLabel}</p>
          <h3 className={headingClass}>{title}</h3>
        </div>
      </div>
    ),
  },
  {
    slug: "hero",
    title: "Hero Sections",
    count: BLOCKS_BY_KIND.hero.length,
    render: ({ title, countLabel }) => (
      <div className="relative flex size-full w-full flex-col items-center justify-center">
        <span className="absolute inset-y-0 left-4 w-px bg-gradient-to-b from-transparent via-border to-border" />
        <span className="absolute inset-y-0 right-4 w-px bg-gradient-to-b from-transparent via-border to-border" />
        <h3 className={headingClass}>{title}</h3>
        <p className={subClass}>{countLabel}</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="mx-auto h-4 w-12 rounded bg-primary/10" />
          <div className="mx-auto h-4 w-12 rounded bg-primary/20" />
        </div>
      </div>
    ),
  },
  {
    slug: "image-gallery",
    title: "Image Gallery",
    count: 0,
    comingSoon: true,
    render: ({ title, countLabel }) => (
      <div className="flex size-full w-full flex-col gap-2 px-4 pt-5">
        <div className="w-full text-center">
          <h3 className={headingClass}>{title}</h3>
          <p className={subClass}>{countLabel}</p>
        </div>
        <div className="relative -mt-2.5 size-full [mask-image:linear-gradient(to_bottom,black_60%,transparent)]">
          <div className="absolute inset-0 grid grid-cols-4 gap-1.5">
            <div className="flex flex-col gap-1">
              <div className="aspect-square rounded-sm bg-muted-foreground/10" />
              <div className="aspect-square rounded-sm bg-muted-foreground/10" />
            </div>
            <div className="flex flex-col gap-1 pt-5">
              <div className="aspect-square rounded-sm bg-muted-foreground/10" />
              <div className="aspect-square rounded-sm bg-muted-foreground/10" />
            </div>
            <div className="flex flex-col gap-1 pt-5">
              <div className="aspect-square rounded-sm bg-muted-foreground/10" />
              <div className="aspect-square rounded-sm bg-muted-foreground/10" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="aspect-square rounded-sm bg-muted-foreground/10" />
              <div className="aspect-square rounded-sm bg-muted-foreground/10" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    slug: "integrations",
    title: "Integrations",
    count: 0,
    comingSoon: true,
    render: ({ title, countLabel }) => (
      <div className="grid size-full grid-cols-2 items-center justify-end px-6">
        <div className="flex items-center px-2">
          <div>
            <h3 className={headingClass}>{title}</h3>
            <p className={subClass}>{countLabel}</p>
          </div>
        </div>
        <div className="relative size-20">
          <div className="absolute inset-0 z-10 m-auto size-6 rounded-full border bg-card shadow-xs" />
          <div className="absolute top-0 left-0 z-10 size-4 rounded-md bg-muted" />
          <div className="absolute top-0 right-0 z-10 size-4 rounded-md bg-muted" />
          <div className="absolute bottom-0 left-0 z-10 size-4 rounded-md bg-muted" />
          <div className="absolute right-0 bottom-0 z-10 size-4 rounded-md bg-muted" />
          <div className="absolute top-1/2 left-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-border" />
          <div className="absolute top-1/2 left-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 rotate-45 bg-border" />
        </div>
      </div>
    ),
  },
  {
    slug: "logo-cloud",
    title: "Logo Cloud",
    count: 0,
    comingSoon: true,
    render: ({ title, countLabel }) => (
      <div className="flex size-full w-full flex-col items-center justify-center">
        <div className="pb-3 text-center">
          <h3 className={headingClass}>{title}</h3>
          <p className={subClass}>{countLabel}</p>
        </div>
        <div className="mx-auto h-px w-full max-w-[50%] bg-border [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />
        <div className="flex w-full items-center gap-2 overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-2.5 w-12 rounded-xs bg-muted-foreground/10 md:h-3.5"
            />
          ))}
        </div>
        <div className="h-px w-full bg-border [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />
      </div>
    ),
  },
  {
    slug: "not-found",
    title: "Not Found",
    count: BLOCKS_BY_KIND["not-found"].length,
    render: ({ title, countLabel }) => (
      <div className="flex size-full flex-col items-center justify-center">
        <div className="text-5xl font-extrabold text-muted-foreground/25 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
          404
        </div>
        <div className="-mt-2.5 w-full text-center">
          <h3 className={headingClass}>{title}</h3>
          <p className={subClass}>{countLabel}</p>
        </div>
      </div>
    ),
  },
  {
    slug: "pricing",
    title: "Pricing",
    count: BLOCKS_BY_KIND.pricing.length,
    render: ({ title, countLabel }) => (
      <div className="size-full pt-4">
        <div className="grid size-full grid-cols-3 [mask-image:linear-gradient(to_bottom,black_60%,transparent)]">
          <div className="flex w-full pt-8">
            <div className="w-full border-t p-2 md:p-4">
              <div className="mb-1.5 h-2.5 w-[85%] rounded-md bg-primary/20 md:h-3.5" />
              <div className="h-1.5 w-[75%] rounded-full bg-muted-foreground/20 md:h-2" />
            </div>
          </div>
          <div className="w-full rounded-t-md border-x border-t p-1 text-center md:p-3">
            <h3 className={headingClass}>{title}</h3>
            <p className={subClass}>{countLabel}</p>
          </div>
          <div className="flex w-full pt-8">
            <div className="w-full border-t p-2 md:p-4">
              <div className="mb-1.5 h-2.5 w-[85%] rounded-md bg-primary/20 md:h-3.5" />
              <div className="h-2 w-[75%] rounded-full bg-muted-foreground/20" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    slug: "testimonial",
    title: "Testimonials",
    count: BLOCKS_BY_KIND.testimonial.length,
    render: ({ title, countLabel }) => (
      <div className="flex size-full w-full flex-col items-center justify-center p-4">
        <div className="w-full text-center">
          <h3 className={headingClass}>{title}</h3>
          <p className={subClass}>{countLabel}</p>
        </div>
        <div className="flex flex-col items-center gap-2 pt-1 md:pt-4">
          <div className="mt-1 flex flex-col items-center gap-1">
            <div className="h-1.5 w-32 rounded-full bg-muted-foreground/40" />
            <div className="h-1.5 w-24 rounded-full bg-muted-foreground/40" />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1">
          <div className="size-5 rounded-full bg-muted-foreground/20" />
          <div className="h-1.5 w-10 rounded-full bg-muted-foreground/30" />
        </div>
      </div>
    ),
  },
  {
    slug: "app-shell",
    title: "App Shell",
    count: 0,
    comingSoon: true,
    render: ({ title, countLabel }) => (
      <div className="grid size-full grid-cols-[1fr_3fr] gap-1 p-2 md:p-3">
        <div className="flex flex-col gap-1 rounded-sm border bg-card p-1.5 md:p-2">
          <div className="h-1.5 w-full rounded-full bg-primary/20" />
          <div className="h-1 w-2/3 rounded-full bg-muted-foreground/20" />
          <div className="h-1 w-3/4 rounded-full bg-muted-foreground/20" />
          <div className="h-1 w-1/2 rounded-full bg-muted-foreground/20" />
          <div className="mt-auto h-1 w-2/3 rounded-full bg-muted-foreground/20" />
        </div>
        <div className="flex flex-col gap-1.5 rounded-sm border bg-background p-2">
          <div className="flex items-center justify-between">
            <h3 className={headingClass}>{title}</h3>
            <div className="size-2 rounded-full bg-primary/30" />
          </div>
          <p className={subClass}>{countLabel}</p>
          <div className="mt-auto grid grid-cols-3 gap-1">
            <div className="h-3 rounded-sm bg-muted-foreground/10" />
            <div className="h-3 rounded-sm bg-muted-foreground/10" />
            <div className="h-3 rounded-sm bg-muted-foreground/10" />
          </div>
        </div>
      </div>
    ),
  },
  {
    slug: "dashboard",
    title: "Dashboard",
    count: 0,
    comingSoon: true,
    render: ({ title, countLabel }) => (
      <div className="flex size-full flex-col gap-1.5 p-3">
        <div className="flex items-center justify-between">
          <h3 className={headingClass}>{title}</h3>
          <p className={subClass}>{countLabel}</p>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <div className="h-6 rounded-sm border bg-card p-1">
            <div className="h-1 w-2/3 rounded-full bg-muted-foreground/20" />
            <div className="mt-1 h-2 w-1/2 rounded-sm bg-primary/30" />
          </div>
          <div className="h-6 rounded-sm border bg-card p-1">
            <div className="h-1 w-2/3 rounded-full bg-muted-foreground/20" />
            <div className="mt-1 h-2 w-1/2 rounded-sm bg-primary/20" />
          </div>
          <div className="h-6 rounded-sm border bg-card p-1">
            <div className="h-1 w-2/3 rounded-full bg-muted-foreground/20" />
            <div className="mt-1 h-2 w-1/2 rounded-sm bg-muted-foreground/30" />
          </div>
        </div>
        <div className="mt-auto h-8 rounded-sm border bg-card p-1.5">
          <div className="flex h-full items-end gap-1">
            <div className="h-1/3 w-2 rounded-xs bg-primary/30" />
            <div className="h-2/3 w-2 rounded-xs bg-primary/30" />
            <div className="h-1/2 w-2 rounded-xs bg-primary/30" />
            <div className="h-3/4 w-2 rounded-xs bg-primary/30" />
            <div className="h-2/5 w-2 rounded-xs bg-primary/30" />
            <div className="h-full w-2 rounded-xs bg-primary/30" />
          </div>
        </div>
      </div>
    ),
  },
]

const ANCHORABLE_KINDS: Record<string, BlockKind> = {
  login: "login",
  cta: "cta",
  faq: "faq",
  feature: "feature",
  footer: "footer",
  header: "header",
  hero: "hero",
  "not-found": "not-found",
  pricing: "pricing",
  testimonial: "testimonial",
}

export function BlockCategories() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
      {CATEGORIES.map((cat) => {
        const label = countLabel(cat.count, cat.freeCount)
        const anchor = ANCHORABLE_KINDS[cat.slug]
        const inner = cat.render({ title: cat.title, countLabel: label })

        if (anchor) {
          return (
            <Link
              key={cat.slug}
              href={`#${anchor}`}
              className={cardShell}
              aria-label={`Jump to ${cat.title}`}
            >
              {inner}
            </Link>
          )
        }

        return (
          <div
            key={cat.slug}
            aria-disabled={cat.comingSoon}
            className={`${cardShell} opacity-80`}
          >
            {inner}
          </div>
        )
      })}
      <div
        aria-disabled
        className={`${cardShell} flex flex-col items-center justify-center opacity-80`}
      >
        <h3 className={headingClass}>More</h3>
        <p className={subClass}>Coming Soon…</p>
      </div>
    </div>
  )
}
