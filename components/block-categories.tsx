import { type BlockKind } from "@/registry/hirael/registry-meta";

/* -------------------------------------------------------------------------- */
/* Category registry                                                          */
/* -------------------------------------------------------------------------- */

export type CategoryGroup = keyof typeof CATEGORY_GROUP_LABELS;

export const CATEGORY_GROUP_LABELS = {
  marketing: "Marketing",
  site: "Site pages",
  app: "Product & app",
} as const;

export const CATEGORY_GROUP_ORDER: CategoryGroup[] = [
  "marketing",
  "site",
  "app",
];

export type CategoryMeta = {
  slug: string;
  title: string;
  group: CategoryGroup;
  /** Internal BlockKind — present only for categories that have shipped blocks. */
  blockKind?: BlockKind;
  comingSoon?: boolean;
  description: string;
};

export const CATEGORY_REGISTRY: CategoryMeta[] = [
  {
    slug: "hero",
    group: "marketing",
    title: "Hero Sections",
    blockKind: "hero",
    description:
      "Above-the-fold openers: split layouts, centered editorials, stat strips, wordmark trust rows.",
  },
  {
    slug: "features",
    group: "marketing",
    title: "Features",
    blockKind: "feature",
    description:
      "Alternating rows, three-up icon grids, bordered feature cards, and bento layouts.",
  },
  {
    slug: "process",
    group: "marketing",
    title: "How It Works",
    blockKind: "process",
    description:
      "Numbered step rows and onboarding flows that walk through how a product works.",
  },
  {
    slug: "pricing",
    group: "marketing",
    title: "Pricing",
    blockKind: "pricing",
    description:
      "Three-tier card layouts and feature-comparison tables, each with per-tier CTAs.",
  },
  {
    slug: "comparison",
    group: "marketing",
    title: "Comparison",
    blockKind: "comparison",
    description:
      "Us-and-them panels and side-by-side tables that frame the difference.",
  },
  {
    slug: "testimonials",
    group: "marketing",
    title: "Testimonials",
    blockKind: "testimonial",
    description:
      "Single-quote spotlights and masonry quote grids with author rows.",
  },
  {
    slug: "cta",
    group: "marketing",
    title: "Call to Action",
    blockKind: "cta",
    description:
      "Framed bands and centered announce blocks with inline install hints.",
  },
  {
    slug: "newsletter",
    group: "marketing",
    title: "Newsletter",
    blockKind: "newsletter",
    description:
      "Inline subscribe sections with email capture, validation, and a success state.",
  },
  {
    slug: "faqs",
    group: "marketing",
    title: "FAQs",
    blockKind: "faq",
    description:
      "Sticky split layouts and centered accordion grids with numbered indices.",
  },
  {
    slug: "auth",
    group: "site",
    title: "Auth",
    blockKind: "login",
    description:
      "Centered login cards and split testimonial panes with OAuth providers and strength meters.",
  },
  {
    slug: "header",
    group: "site",
    title: "Header",
    blockKind: "header",
    description:
      "Sticky navs with backdrop blur, mobile menus, and dual-CTA layouts.",
  },
  {
    slug: "footer",
    group: "site",
    title: "Footer",
    blockKind: "footer",
    description:
      "Multi-column link layouts with brand block, social row, and copyright rule.",
  },
  {
    slug: "not-found",
    group: "site",
    title: "Not Found",
    blockKind: "not-found",
    description: "Centered 404s with paired CTAs and suggested-route lists.",
  },
  {
    slug: "blog",
    group: "marketing",
    title: "Blog Sections",
    blockKind: "blog",
    description:
      "Article grids, featured-post heroes, and editorial card layouts.",
  },
  {
    slug: "contact",
    group: "site",
    title: "Contact",
    blockKind: "contact",
    description:
      "Split form-and-info layouts, map embeds, and inline support panels.",
  },
  {
    slug: "careers",
    group: "site",
    title: "Careers",
    blockKind: "careers",
    description:
      "Open-roles lists with department filters and linked job rows.",
  },
  {
    slug: "ecommerce",
    group: "app",
    title: "E-commerce",
    blockKind: "ecommerce",
    description:
      "Product grids, carts, and checkout-ready layouts with wishlists, promo codes, and live totals.",
  },
  {
    slug: "image-gallery",
    group: "marketing",
    title: "Image Gallery",
    blockKind: "image-gallery",
    description:
      "Masonry, grid, and carousel gallery layouts with optional lightbox.",
  },
  {
    slug: "integrations",
    group: "app",
    title: "Integrations",
    blockKind: "integrations",
    description:
      "Hub-and-spoke diagrams, integration cards, and connector showcases.",
  },
  {
    slug: "logo-cloud",
    group: "marketing",
    title: "Logo Cloud",
    blockKind: "logo-cloud",
    description:
      "Trusted-by wordmark rows, marquee strips, and bordered logo grids.",
  },
  {
    slug: "app-shell",
    group: "app",
    title: "App Shell",
    blockKind: "app-shell",
    description:
      "Sidebar + topbar layouts with command-palette and breadcrumb chrome.",
  },
  {
    slug: "dashboard",
    group: "app",
    title: "Dashboard",
    blockKind: "dashboard",
    description:
      "Stat cards, charts, and table-driven views composed into full dashboards.",
  },
  {
    slug: "cloud",
    group: "app",
    title: "Cloud",
    blockKind: "cloud",
    description:
      "Infrastructure and DevOps consoles: server cards, VM and pod tables, statuspages, cluster maps, topology, logs, terminals, and deploy feeds.",
  },
  {
    slug: "saas",
    group: "app",
    title: "SaaS",
    blockKind: "saas",
    description:
      "Product-account panels: billing summaries, plan selectors, API-key managers, usage meters, and audit logs.",
  },
  {
    slug: "widgets",
    group: "app",
    title: "Widgets",
    blockKind: "widgets",
    description:
      "Composed dashboard panels: KPI grids, quick actions, notifications, activity feeds, inspectors, and workspace switchers.",
  },
];

export const CATEGORY_BY_SLUG = Object.fromEntries(
  CATEGORY_REGISTRY.map((c) => [c.slug, c]),
) as Record<string, CategoryMeta>;

export const CATEGORIES_BY_GROUP = CATEGORY_GROUP_ORDER.map((group) => ({
  group,
  label: CATEGORY_GROUP_LABELS[group],
  categories: CATEGORY_REGISTRY.filter((c) => c.group === group),
}));
