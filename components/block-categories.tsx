import { type BlockKind } from '@/registry/hirael/registry-meta';

export type CategoryGroup = keyof typeof CATEGORY_GROUP_LABELS;

export const CATEGORY_GROUP_LABELS = {
  marketing: 'Marketing',
  site: 'Site pages',
  app: 'Product & app',
} as const;

export const CATEGORY_GROUP_ORDER: CategoryGroup[] = ['marketing', 'site', 'app'];

export interface CategoryMeta {
  slug: string;
  title: string;
  group: CategoryGroup;
  blockKind?: BlockKind;
  isComingSoon?: boolean;
  description: string;
}

export const CATEGORY_REGISTRY: CategoryMeta[] = [
  {
    slug: 'hero',
    group: 'marketing',
    title: 'Hero Sections',
    blockKind: 'hero',
    description:
      'Above-the-fold openers for a landing page: split layouts, centered editorial, stat strips and trust rows, each with headline, supporting copy and paired CTAs in place.',
  },
  {
    slug: 'features',
    group: 'marketing',
    title: 'Features',
    blockKind: 'feature',
    description:
      'Feature sections that explain a product: alternating rows, three-up icon grids, bordered cards and bento layouts, laid out to hold real copy and screenshots.',
  },
  {
    slug: 'process',
    group: 'marketing',
    title: 'How It Works',
    blockKind: 'process',
    description:
      'How-it-works sections: numbered step rows and onboarding flows that walk a visitor through a product in three or four steps.',
  },
  {
    slug: 'pricing',
    group: 'marketing',
    title: 'Pricing',
    blockKind: 'pricing',
    description:
      'Pricing sections with three-tier cards and feature comparison tables, a highlighted plan and a call to action on every tier.',
  },
  {
    slug: 'team',
    group: 'marketing',
    title: 'Team',
    blockKind: 'team',
    description: 'Team sections with portrait grids, roles, short bios and a link to open roles.',
  },
  {
    slug: 'stats',
    group: 'marketing',
    title: 'Stats',
    blockKind: 'stats',
    description:
      'Stat bands for proof numbers under a hero or above a CTA: metric, label and delta in a bordered row, with count-up on scroll.',
  },
  {
    slug: 'comparison',
    group: 'marketing',
    title: 'Comparison',
    blockKind: 'comparison',
    description:
      'Comparison sections that put your product beside the alternative: us-and-them panels and side-by-side tables with per-row checks.',
  },
  {
    slug: 'testimonials',
    group: 'marketing',
    title: 'Testimonials',
    blockKind: 'testimonial',
    description:
      'Testimonial sections: single-quote spotlights and masonry quote grids with author name, role and avatar.',
  },
  {
    slug: 'cta',
    group: 'marketing',
    title: 'Call to Action',
    blockKind: 'cta',
    description:
      'Call-to-action bands that close a page: framed panels and centered announcements with a headline, a primary button and an inline install command.',
  },
  {
    slug: 'newsletter',
    group: 'marketing',
    title: 'Newsletter',
    blockKind: 'newsletter',
    description:
      'Newsletter sections with an email field, validation and a success state, ready to point at your subscribe endpoint.',
  },
  {
    slug: 'faqs',
    group: 'marketing',
    title: 'FAQs',
    blockKind: 'faq',
    description:
      'FAQ sections built on the Accordion: sticky split layouts and centered grids with numbered questions that stay scannable on mobile.',
  },
  {
    slug: 'auth',
    group: 'site',
    title: 'Auth',
    blockKind: 'login',
    description:
      'Login and sign-up screens: centered cards and split panes with OAuth buttons, a password strength meter and real form fields to wire to your auth provider.',
  },
  {
    slug: 'header',
    group: 'site',
    title: 'Header',
    blockKind: 'header',
    description:
      'Site headers with sticky positioning, backdrop blur, a mobile menu and dual CTAs, collapsing cleanly on small screens.',
  },
  {
    slug: 'footer',
    group: 'site',
    title: 'Footer',
    blockKind: 'footer',
    description:
      'Site footers with multi-column link groups, a brand block, social links and a copyright rule, in light and dark.',
  },
  {
    slug: 'not-found',
    group: 'site',
    title: 'Status Pages',
    blockKind: 'not-found',
    description:
      '404, 500, maintenance and coming-soon pages with paired CTAs, countdowns and status details, so an error page still looks like your product.',
  },
  {
    slug: 'changelog',
    group: 'site',
    title: 'Changelog',
    blockKind: 'changelog',
    description:
      'Release-notes pages with a date rail, version badges and tag filters, for shipping product updates without a CMS.',
  },
  {
    slug: 'blog',
    group: 'marketing',
    title: 'Blog Sections',
    blockKind: 'blog',
    description:
      'Blog sections: article grids, featured-post heroes and editorial cards with cover image, category and author.',
  },
  {
    slug: 'contact',
    group: 'site',
    title: 'Contact',
    blockKind: 'contact',
    description: 'Contact sections with split form-and-info layouts, map embeds and inline support panels.',
  },
  {
    slug: 'careers',
    group: 'site',
    title: 'Careers',
    blockKind: 'careers',
    description: 'Careers sections with an open-roles list, department filters and linked job rows.',
  },
  {
    slug: 'ecommerce',
    group: 'app',
    title: 'E-commerce',
    blockKind: 'ecommerce',
    description:
      'E-commerce sections: product grids, carts and checkout layouts with wishlists, promo codes and live totals.',
  },
  {
    slug: 'image-gallery',
    group: 'marketing',
    title: 'Image Gallery',
    blockKind: 'image-gallery',
    description: 'Image galleries in masonry, grid and carousel layouts that keep their rhythm as images change.',
  },
  {
    slug: 'integrations',
    group: 'app',
    title: 'Integrations',
    blockKind: 'integrations',
    description:
      'Integration sections: hub-and-spoke diagrams, integration cards and connector showcases for listing what your product connects to.',
  },
  {
    slug: 'logo-cloud',
    group: 'marketing',
    title: 'Logo Cloud',
    blockKind: 'logo-cloud',
    description:
      'Logo clouds for social proof: trusted-by wordmark rows, marquee strips and bordered logo grids that hold their spacing as logos change.',
  },
  {
    slug: 'app-shell',
    group: 'app',
    title: 'App Shell',
    blockKind: 'app-shell',
    description:
      'App shells with sidebar and topbar, command palette and breadcrumbs: the frame a dashboard or admin tool starts from.',
  },
  {
    slug: 'dashboard',
    group: 'app',
    title: 'Dashboard',
    blockKind: 'dashboard',
    description:
      'Dashboard screens composed from stat cards, charts and data tables, built with real components rather than static images.',
  },
  {
    slug: 'cloud',
    group: 'app',
    title: 'Cloud',
    blockKind: 'cloud',
    description:
      'Infrastructure and DevOps consoles: server cards, VM and pod tables, status pages, cluster maps, topology views, logs, terminals and deploy feeds.',
  },
  {
    slug: 'saas',
    group: 'app',
    title: 'SaaS',
    blockKind: 'saas',
    description:
      'Account and billing panels for a SaaS product: billing summaries, plan selectors, API key managers, usage meters and audit logs.',
  },
  {
    slug: 'ai',
    group: 'app',
    title: 'AI',
    blockKind: 'ai',
    description:
      'AI chat surfaces: prompt composers with model pickers, streaming message threads with tool calls and complete chat screens.',
  },
  {
    slug: 'widgets',
    group: 'app',
    title: 'Widgets',
    blockKind: 'widgets',
    description:
      'Dashboard widgets that slot into any app shell: KPI grids, quick actions, notifications, activity feeds, inspectors and workspace switchers.',
  },
  {
    slug: 'bento',
    group: 'marketing',
    title: 'Bento Grids',
    blockKind: 'bento',
    description:
      'Bento feature grids where each tile shows the product doing something: a live chart, a toggle that works, a search that filters, laid out in mixed spans that hold together on a phone.',
  },
  {
    slug: 'charts',
    group: 'app',
    title: 'Charts',
    blockKind: 'charts',
    description:
      'Chart cards built on the shadcn chart primitive: bar, area, donut and funnel, each with a range or series control that swaps the data and a summary that reads the numbers for you.',
  },
  {
    slug: 'chat',
    group: 'app',
    title: 'Chat',
    blockKind: 'chat',
    description:
      'Messaging between people: a two-pane messenger, a support widget, a group thread with replies and reactions, and an inbox. Composers send, threads scroll and unread counts clear.',
  },
  {
    slug: 'page-header',
    group: 'app',
    title: 'Page Headers',
    blockKind: 'page-header',
    description:
      'The top of an app page: breadcrumbs, title and status, actions, tabs, a filter toolbar or a metric strip, sitting above the content they control.',
  },
  {
    slug: 'empty-states',
    group: 'app',
    title: 'Empty States',
    blockKind: 'empty-state',
    description:
      'What a page shows when there is nothing to show yet: a first run, a search with no matches, data that failed to load, a team with no members. Each one leads to the next step.',
  },
  {
    slug: 'search',
    group: 'app',
    title: 'Search',
    blockKind: 'search',
    description:
      'Search surfaces that work on real data: faceted results with live counts, autocomplete with recent searches, a results page with type tabs and a help center search.',
  },
  {
    slug: 'survey',
    group: 'app',
    title: 'Surveys',
    blockKind: 'survey',
    description:
      'Feedback surveys: an NPS score with a follow-up, a multi-step form, a cancellation survey and a one-question-per-screen flow with keyboard shortcuts.',
  },
];

export const CATEGORY_BY_SLUG = Object.fromEntries(
  CATEGORY_REGISTRY.map((category) => [category.slug, category]),
) as Record<string, CategoryMeta>;

export const CATEGORIES_BY_GROUP = CATEGORY_GROUP_ORDER.map((group) => ({
  group,
  label: CATEGORY_GROUP_LABELS[group],
  categories: CATEGORY_REGISTRY.filter((category) => category.group === group),
}));
