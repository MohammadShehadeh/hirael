export type ComponentCategory =
  | "inputs"
  | "pickers"
  | "files"
  | "data"
  | "display"
  | "navigation"
  | "blocks"

export type BlockKind =
  | "hero"
  | "feature"
  | "pricing"
  | "testimonial"
  | "cta"
  | "faq"
  | "login"
  | "header"
  | "footer"
  | "not-found"
  | "logo-cloud"
  | "contact"
  | "blog"
  | "ecommerce"
  | "dashboard"
  | "integrations"
  | "image-gallery"
  | "app-shell"

export type RegistryEntryMeta = {
  name: string
  title: string
  description: string
  category: ComponentCategory
  sourceFiles?: string[]
  /**
   * Install-target paths, parallel to `sourceFiles`. Shown in the code view
   * as a file hierarchy so users see where each file lands in their project.
   */
  installTargets?: string[]
  installSlug?: string
  registryDependencies?: string[]
  dependencies?: string[]
  blockKind?: BlockKind
  blockTagline?: string
}

export const REGISTRY: RegistryEntryMeta[] = [
  {
    name: "multi-select",
    title: "Multi Select",
    description:
      "Chip-based multi-select with command-palette dropdown, search, select-all and async loader.",
    category: "inputs",
    sourceFiles: ["registry/hirael/ui/multi-select.tsx"],
    registryDependencies: ["button", "popover", "command", "badge"],
    dependencies: ["cmdk", "lucide-react"],
  },
  {
    name: "number-range",
    title: "Number Range",
    description:
      "Two-thumb slider paired with synced number inputs, locale-aware formatting.",
    category: "inputs",
    sourceFiles: ["registry/hirael/ui/number-range.tsx"],
    registryDependencies: ["slider", "input", "label"],
    dependencies: ["@radix-ui/react-slider"],
  },
  {
    name: "year-picker",
    title: "Year Picker",
    description:
      "Decade-grid year picker with keyboard nav, min/max bounds, single or range mode.",
    category: "pickers",
    sourceFiles: ["registry/hirael/ui/year-picker.tsx"],
    registryDependencies: ["button", "popover"],
    dependencies: ["lucide-react"],
  },
  {
    name: "tag-input",
    title: "Tag Input",
    description:
      "Chip input with paste-to-split, dedupe, validation hook, max tags. Compound and single-prop APIs.",
    category: "inputs",
    sourceFiles: ["registry/hirael/ui/tag-input.tsx"],
    registryDependencies: ["badge"],
    dependencies: ["lucide-react"],
  },
  {
    name: "combobox",
    title: "Combobox",
    description:
      "Searchable single-select with debounced async loader, group headings and clearable selection.",
    category: "inputs",
    sourceFiles: ["registry/hirael/ui/combobox.tsx"],
    registryDependencies: ["button", "popover", "command"],
    dependencies: ["cmdk", "lucide-react"],
  },
  {
    name: "lazy-select",
    title: "Lazy Select",
    description:
      "Autocomplete single-select that defers loading until open and pages through results on scroll. Debounced server-side search with a pluggable lazy paginator hook.",
    category: "inputs",
    sourceFiles: ["registry/hirael/ui/lazy-select.tsx"],
    registryDependencies: ["popover", "command"],
    dependencies: ["cmdk", "lucide-react"],
  },
  {
    name: "password-input",
    title: "Password Input",
    description:
      "Show/hide toggle with an optional pluggable strength meter. Compound and single-prop APIs.",
    category: "inputs",
    sourceFiles: ["registry/hirael/ui/password-input.tsx"],
    registryDependencies: ["input"],
    dependencies: ["lucide-react"],
  },
  {
    name: "currency-input",
    title: "Currency Input",
    description:
      "Locale-aware grouping with currency-symbol prefix and configurable decimal precision.",
    category: "inputs",
    sourceFiles: ["registry/hirael/ui/currency-input.tsx"],
    registryDependencies: ["input"],
    dependencies: [],
  },
  {
    name: "phone-input",
    title: "Phone Input",
    description:
      "Country dial-code dropdown with E.164 output. Compound and single-prop APIs.",
    category: "inputs",
    sourceFiles: ["registry/hirael/ui/phone-input.tsx"],
    registryDependencies: ["input", "popover", "command"],
    dependencies: ["lucide-react"],
  },
  {
    name: "file-dropzone",
    title: "File Dropzone",
    description:
      "Drag-drop + click upload zone with previews, accept and max-size validation. Compound and single-prop APIs.",
    category: "files",
    sourceFiles: ["registry/hirael/ui/file-dropzone.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "stat-card",
    title: "Stat Card",
    description:
      "Compact metric card with label, value, and an up/down/flat trend chip.",
    category: "data",
    sourceFiles: ["registry/hirael/ui/stat-card.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "rating",
    title: "Rating",
    description:
      "Star rating with hover preview, half-star precision, read-only mode and sm / md / lg sizes.",
    category: "inputs",
    sourceFiles: ["registry/hirael/ui/rating.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "timeline",
    title: "Timeline",
    description:
      "Vertical event timeline with default or icon dots, tone variants and labelled time / title / description parts.",
    category: "data",
    sourceFiles: ["registry/hirael/ui/timeline.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "kbd",
    title: "Kbd",
    description:
      "3D tactile keycap with hover lift and pressed states. Compound API with KbdGroup for chords and KbdDisplay for inline keys.",
    category: "display",
    sourceFiles: ["registry/hirael/ui/kbd.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "callout",
    title: "Callout",
    description:
      "MDX-style admonition with info / success / warning / error / neutral variants and optional icon override.",
    category: "display",
    sourceFiles: ["registry/hirael/ui/callout.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react", "class-variance-authority"],
  },
  {
    name: "scroll-progress",
    title: "Scroll Progress",
    description:
      "Fixed reading progress bar. Tracks document scroll by default or a scoped container ref.",
    category: "display",
    sourceFiles: ["registry/hirael/ui/scroll-progress.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "hero-01",
    title: "Hero 1",
    description:
      "Split hero with eyebrow tag, display headline, dual CTA, three-stat strip and a mock install-card visual.",
    blockTagline: "Split layout · stat strip · mock install card",
    category: "blocks",
    blockKind: "hero",
    sourceFiles: ["registry/hirael/blocks/hero-01/hero-01.tsx"],
    installTargets: ["components/blocks/hero-01.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "hero-02",
    title: "Hero 2",
    description:
      "Centered hero with animated live-pill, display headline with underlined accent, sub-copy and a trusted-by wordmark strip.",
    blockTagline: "Centered · live pill · wordmark strip",
    category: "blocks",
    blockKind: "hero",
    sourceFiles: ["registry/hirael/blocks/hero-02/hero-02.tsx"],
    installTargets: ["components/blocks/hero-02.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "hero-03",
    title: "Hero 3",
    description:
      "Centered hero with a rating pill, display headline, sub-copy, an inline email-capture form with a success state, a feature checklist and an avatar social-proof row.",
    blockTagline: "Centered · email capture · social proof",
    category: "blocks",
    blockKind: "hero",
    sourceFiles: ["registry/hirael/blocks/hero-03/hero-03.tsx"],
    installTargets: ["components/blocks/hero-03.tsx"],
    registryDependencies: ["button", "input"],
    dependencies: ["lucide-react"],
  },
  {
    name: "feature-01",
    title: "Feature 1",
    description:
      "Three alternating feature rows, each pairing a stylized Tailwind-only mock UI with a copy column (eyebrow, headline, paragraph, 3-item checklist).",
    blockTagline: "Alternating rows · mock UIs · checklist",
    category: "blocks",
    blockKind: "feature",
    sourceFiles: ["registry/hirael/blocks/feature-01/feature-01.tsx"],
    installTargets: ["components/blocks/feature-01.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "feature-02",
    title: "Feature 2",
    description:
      "Section header above a 3-column, 2-row grid of bordered feature cards with lucide icons, headlines and short blurbs.",
    blockTagline: "Icon grid · 6 cards · concise blurbs",
    category: "blocks",
    blockKind: "feature",
    sourceFiles: ["registry/hirael/blocks/feature-02/feature-02.tsx"],
    installTargets: ["components/blocks/feature-02.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "pricing-01",
    title: "Pricing 1",
    description:
      "Three-tier card row with a featured middle plan. Each card lists price, blurb, feature checklist and a primary or outline CTA.",
    blockTagline: "3 tiers · featured plan · checklist",
    category: "blocks",
    blockKind: "pricing",
    sourceFiles: ["registry/hirael/blocks/pricing-01/pricing-01.tsx"],
    installTargets: ["components/blocks/pricing-01.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "pricing-02",
    title: "Pricing 2",
    description:
      "Compare-by-feature pricing table with sticky tier header (tier name, price, CTA) and ~8 feature rows below.",
    blockTagline: "Comparison table · sticky header · per-tier CTA",
    category: "blocks",
    blockKind: "pricing",
    sourceFiles: ["registry/hirael/blocks/pricing-02/pricing-02.tsx"],
    installTargets: ["components/blocks/pricing-02.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "testimonial-01",
    title: "Testimonial 1",
    description:
      "Centered single quote with stylized open-mark, author block (avatar, name, role, company) and a muted wordmark row below.",
    blockTagline: "Single quote · author block · wordmark row",
    category: "blocks",
    blockKind: "testimonial",
    sourceFiles: ["registry/hirael/blocks/testimonial-01/testimonial-01.tsx"],
    installTargets: ["components/blocks/testimonial-01.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "testimonial-02",
    title: "Testimonial 2",
    description:
      "Masonry quote grid (CSS columns) with ~6 bordered quote cards of varying length and author rows.",
    blockTagline: "Masonry grid · 6 quotes · varied length",
    category: "blocks",
    blockKind: "testimonial",
    sourceFiles: ["registry/hirael/blocks/testimonial-02/testimonial-02.tsx"],
    installTargets: ["components/blocks/testimonial-02.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "cta-01",
    title: "CTA 1",
    description:
      "Framed CTA card with corner marks, headline + sub-copy on the left, dual buttons stacked on the right.",
    blockTagline: "Framed · split layout · corner marks",
    category: "blocks",
    blockKind: "cta",
    sourceFiles: ["registry/hirael/blocks/cta-01/cta-01.tsx"],
    installTargets: ["components/blocks/cta-01.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "cta-02",
    title: "CTA 2",
    description:
      "Full-bleed centered CTA with framing top/bottom rules, highlight underlay on the key word, and an inline install command.",
    blockTagline: "Centered · highlight underlay · install command",
    category: "blocks",
    blockKind: "cta",
    sourceFiles: ["registry/hirael/blocks/cta-02/cta-02.tsx"],
    installTargets: ["components/blocks/cta-02.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "faq-01",
    title: "FAQ 1",
    description:
      "Two-column FAQ — sticky heading + contact card on the left, numbered accordion on the right.",
    blockTagline: "Sticky split · numbered · contact card",
    category: "blocks",
    blockKind: "faq",
    sourceFiles: ["registry/hirael/blocks/faq-01/faq-01.tsx"],
    installTargets: ["components/blocks/faq-01.tsx"],
    registryDependencies: ["button", "accordion"],
    dependencies: ["@radix-ui/react-accordion", "lucide-react"],
  },
  {
    name: "faq-02",
    title: "FAQ 2",
    description:
      "Centered heading with two-column accordion grid below. Each row tagged with a Qn index.",
    blockTagline: "Centered · two-column grid · Qn-indexed",
    category: "blocks",
    blockKind: "faq",
    sourceFiles: ["registry/hirael/blocks/faq-02/faq-02.tsx"],
    installTargets: ["components/blocks/faq-02.tsx"],
    registryDependencies: ["accordion"],
    dependencies: ["@radix-ui/react-accordion"],
  },
  {
    name: "faq-03",
    title: "FAQ 3",
    description:
      "Searchable FAQ with category tabs, a live-filtered accordion, an empty state for missed queries and a support CTA strip.",
    blockTagline: "Search · category tabs · empty state",
    category: "blocks",
    blockKind: "faq",
    sourceFiles: ["registry/hirael/blocks/faq-03/faq-03.tsx"],
    installTargets: ["components/blocks/faq-03.tsx"],
    registryDependencies: [
      "accordion",
      "button",
      "empty-state",
      "input-group",
      "tabs",
    ],
    dependencies: ["@radix-ui/react-accordion", "lucide-react"],
  },
  {
    name: "faq-04",
    title: "FAQ 4",
    description:
      "Framed single-column FAQ with side rules, a centered display header, five topic groups each pairing a heading with its own accordion, and a support footer line.",
    blockTagline: "Framed column · topic groups · support line",
    category: "blocks",
    blockKind: "faq",
    sourceFiles: ["registry/hirael/blocks/faq-04/faq-04.tsx"],
    installTargets: ["components/blocks/faq-04.tsx"],
    registryDependencies: ["accordion"],
    dependencies: ["@radix-ui/react-accordion"],
  },
  {
    name: "login-01",
    title: "Login 1",
    description:
      "Centered login card with monogram, email + password (using the password-input component), remember-me, divider and GitHub / Google providers.",
    blockTagline: "Centered card · providers · password-input",
    category: "blocks",
    blockKind: "login",
    sourceFiles: ["registry/hirael/blocks/login-01/login-01.tsx"],
    installTargets: ["components/blocks/login-01.tsx"],
    registryDependencies: ["button", "input", "label", "password-input"],
    dependencies: ["lucide-react"],
  },
  {
    name: "login-02",
    title: "Login 2",
    description:
      "Two-pane login: form on the left, dark testimonial panel with quote and metrics on the right. Uses the strength-meter variant of password-input.",
    blockTagline: "Split · testimonial pane · strength meter",
    category: "blocks",
    blockKind: "login",
    sourceFiles: ["registry/hirael/blocks/login-02/login-02.tsx"],
    installTargets: ["components/blocks/login-02.tsx"],
    registryDependencies: ["button", "input", "label", "password-input"],
    dependencies: ["lucide-react"],
  },
  {
    name: "header-01",
    title: "Header 1",
    description:
      "Sticky top nav with brand monogram, centered anchor links, dual auth CTAs and a slide-down mobile menu.",
    blockTagline: "Sticky · backdrop blur · mobile menu",
    category: "blocks",
    blockKind: "header",
    sourceFiles: ["registry/hirael/blocks/header-01/header-01.tsx"],
    installTargets: ["components/blocks/header-01.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "footer-01",
    title: "Footer 1",
    description:
      "Brand + tagline column alongside Product / Company / Resources link columns, with a copyright row and social icons below a thin rule.",
    blockTagline: "4 columns · social row · copyright",
    category: "blocks",
    blockKind: "footer",
    sourceFiles: ["registry/hirael/blocks/footer-01/footer-01.tsx"],
    installTargets: ["components/blocks/footer-01.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "not-found-01",
    title: "Not Found 1",
    description:
      "Centered 404 with mono eyebrow, display headline, paired CTAs and a 'try one of these' suggested-routes list.",
    blockTagline: "Centered · paired CTAs · route suggestions",
    category: "blocks",
    blockKind: "not-found",
    sourceFiles: ["registry/hirael/blocks/not-found-01/not-found-01.tsx"],
    installTargets: ["components/blocks/not-found-01.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "month-picker",
    title: "Month Picker",
    description:
      "4×3 month grid with year stepper, keyboard nav, min/max bounds, single or range mode.",
    category: "pickers",
    sourceFiles: ["registry/hirael/ui/month-picker.tsx"],
    registryDependencies: ["button", "popover"],
    dependencies: ["lucide-react"],
  },
  {
    name: "time-picker",
    title: "Time Picker",
    description:
      "Hour, minute and optional second scroll columns with 12/24h modes, step intervals and keyboard nav.",
    category: "pickers",
    sourceFiles: ["registry/hirael/ui/time-picker.tsx"],
    registryDependencies: ["popover"],
    dependencies: ["lucide-react"],
  },
  {
    name: "color-picker",
    title: "Color Picker",
    description:
      "SV gradient + hue slider with HEX / RGB / HSL tabs, eyedropper (where supported) and recent swatches.",
    category: "pickers",
    sourceFiles: ["registry/hirael/ui/color-picker.tsx"],
    registryDependencies: ["popover", "input"],
    dependencies: ["lucide-react"],
  },
  {
    name: "avatar-stack",
    title: "Avatar Stack",
    description:
      "Overlapping avatar group with size (sm/md/lg) and spacing (tight/normal/loose) variants, image or fallback support, numeric overflow chip, and asChild on items/overflow so each avatar can render as a link or button.",
    category: "data",
    sourceFiles: ["registry/hirael/ui/avatar-stack.tsx"],
    registryDependencies: [],
    dependencies: ["@radix-ui/react-slot"],
  },
  {
    name: "announcement-bar",
    title: "Announcement Bar",
    description:
      "Top-of-page banner with default / primary / muted tones, optional dismiss button and localStorage persistence.",
    category: "display",
    sourceFiles: ["registry/hirael/ui/announcement-bar.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "empty-state",
    title: "Empty State",
    description:
      "Dashed-bordered empty-state surface with media slot, title, description and an action row.",
    category: "display",
    sourceFiles: ["registry/hirael/ui/empty-state.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "logo-cloud-01",
    title: "Logo Cloud 1",
    description:
      "Centered eyebrow + headline above a 5-column bordered wordmark grid, with stat strip and case-study link below.",
    blockTagline: "Bordered grid · 10 wordmarks · stat strip",
    category: "blocks",
    blockKind: "logo-cloud",
    sourceFiles: ["registry/hirael/blocks/logo-cloud-01/logo-cloud-01.tsx"],
    installTargets: ["components/blocks/logo-cloud-01.tsx"],
    registryDependencies: ["badge", "button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "contact-01",
    title: "Contact 1",
    description:
      "Production contact form with controlled state, inline validation, character counter, topic select, consent checkbox and a pending/sent state machine. Channel list and remote-location card alongside.",
    blockTagline: "Validated form · pending · sent state",
    category: "blocks",
    blockKind: "contact",
    sourceFiles: ["registry/hirael/blocks/contact-01/contact-01.tsx"],
    installTargets: ["components/blocks/contact-01.tsx"],
    registryDependencies: [
      "badge",
      "button",
      "card",
      "checkbox",
      "field",
      "input",
      "select",
      "separator",
      "textarea",
    ],
    dependencies: ["lucide-react"],
  },
  {
    name: "blog-01",
    title: "Blog 1",
    description:
      "Editorial blog index with a featured post on top and a 4-column grid of post cards underneath. Built on Card and Badge.",
    blockTagline: "Featured post · 4-up Card grid",
    category: "blocks",
    blockKind: "blog",
    sourceFiles: ["registry/hirael/blocks/blog-01/blog-01.tsx"],
    installTargets: ["components/blocks/blog-01.tsx"],
    registryDependencies: ["badge", "button", "card", "separator"],
    dependencies: ["lucide-react"],
  },
  {
    name: "ecommerce-01",
    title: "E-commerce 1",
    description:
      "Product grid with category filter pills, sale and new badges, wishlist toggles, star ratings, compare-at pricing and per-card add buttons.",
    blockTagline: "Product grid · filter pills · wishlist",
    category: "blocks",
    blockKind: "ecommerce",
    sourceFiles: ["registry/hirael/blocks/ecommerce-01/ecommerce-01.tsx"],
    installTargets: ["components/blocks/ecommerce-01.tsx"],
    registryDependencies: ["badge", "button", "rating"],
    dependencies: ["lucide-react"],
  },
  {
    name: "ecommerce-02",
    title: "E-commerce 2",
    description:
      "Shopping cart with quantity steppers, removable line items, promo-code validation, a free-shipping threshold, live totals and an empty-cart state.",
    blockTagline: "Cart rows · promo code · live totals",
    category: "blocks",
    blockKind: "ecommerce",
    sourceFiles: ["registry/hirael/blocks/ecommerce-02/ecommerce-02.tsx"],
    installTargets: ["components/blocks/ecommerce-02.tsx"],
    registryDependencies: [
      "button",
      "card",
      "empty-state",
      "input-group",
      "separator",
    ],
    dependencies: ["lucide-react"],
  },
  {
    name: "dashboard-01",
    title: "Dashboard 1",
    description:
      "Operations dashboard with Tabs date-range switcher (1d / 7d / 30d / 90d), 4-up metric strip, weekly bar chart and a recent-activity feed. Data switches live with the range.",
    blockTagline: "Tabs range · 4 metrics · live data",
    category: "blocks",
    blockKind: "dashboard",
    sourceFiles: ["registry/hirael/blocks/dashboard-01/dashboard-01.tsx"],
    installTargets: ["components/blocks/dashboard-01.tsx"],
    registryDependencies: ["badge", "button", "card", "separator", "tabs"],
    dependencies: ["lucide-react"],
  },
  {
    name: "dashboard-02",
    title: "Dashboard 2",
    description:
      "Analytics dashboard with a date-range select, four sparkline KPI tiles, a layered two-series area chart, and top-pages and channel-share side cards.",
    blockTagline: "Area chart · sparkline KPIs · top pages",
    category: "blocks",
    blockKind: "dashboard",
    sourceFiles: ["registry/hirael/blocks/dashboard-02/dashboard-02.tsx"],
    installTargets: ["components/blocks/dashboard-02.tsx"],
    registryDependencies: ["badge", "button", "card", "select", "separator"],
    dependencies: ["lucide-react"],
  },
  {
    name: "dashboard-03",
    title: "Dashboard 3",
    description:
      "Revenue dashboard with a month stepper, plan-mix donut and legend, invoice status list and a transactions table with status dots and a pagination footer.",
    blockTagline: "Donut plan mix · transactions · month stepper",
    category: "blocks",
    blockKind: "dashboard",
    sourceFiles: ["registry/hirael/blocks/dashboard-03/dashboard-03.tsx"],
    installTargets: ["components/blocks/dashboard-03.tsx"],
    registryDependencies: ["badge", "button", "card", "separator"],
    dependencies: ["lucide-react"],
  },
  {
    name: "dashboard-04",
    title: "Dashboard 4",
    description:
      "Commerce operations dashboard in a card-in-card style: four inset stat tiles, a Today band pairing an hourly two-series revenue chart with ad-budget and peak-hours cards, and a week-in-review band with an orders bar chart and three sparkline metric cards driven by a range select.",
    blockTagline: "Inset stat tiles · today band · week band",
    category: "blocks",
    blockKind: "dashboard",
    sourceFiles: ["registry/hirael/blocks/dashboard-04/dashboard-04.tsx"],
    installTargets: ["components/blocks/dashboard-04.tsx"],
    registryDependencies: ["badge", "button", "card", "select"],
    dependencies: ["lucide-react"],
  },
  {
    name: "dashboard-05",
    title: "Dashboard 5",
    description:
      "Observability dashboard composed as one bordered lattice: greeting strip with range select, four sparkline KPI cells, cache and duration chart cells, an AI-insight callout, a P50/P95/P99 latency distribution and an active-deployments list with ping-dot statuses.",
    blockTagline: "Bordered lattice · sparkline KPIs · deployments",
    category: "blocks",
    blockKind: "dashboard",
    sourceFiles: ["registry/hirael/blocks/dashboard-05/dashboard-05.tsx"],
    installTargets: ["components/blocks/dashboard-05.tsx"],
    registryDependencies: ["badge", "button", "select"],
    dependencies: ["lucide-react"],
  },
  {
    name: "integrations-01",
    title: "Integrations 1",
    description:
      "Two-column integrations section with copy and feature list on the left, orbit diagram (central hub + 7 logo spokes connected by dashed rays) on the right.",
    blockTagline: "Hub & spoke · 7 spokes · orbit ring",
    category: "blocks",
    blockKind: "integrations",
    sourceFiles: [
      "registry/hirael/blocks/integrations-01/integrations-01.tsx",
    ],
    installTargets: ["components/blocks/integrations-01.tsx"],
    registryDependencies: ["badge", "button", "card"],
    dependencies: ["lucide-react"],
  },
  {
    name: "image-gallery-01",
    title: "Image Gallery 1",
    description:
      "Studio-style masonry gallery with Tabs-driven category filter, real photo tiles via next/image, varied aspect ratios, hover zoom + arrow chip and an EmptyState fallback for empty filters.",
    blockTagline: "Tabs filter · masonry · empty state",
    category: "blocks",
    blockKind: "image-gallery",
    sourceFiles: [
      "registry/hirael/blocks/image-gallery-01/image-gallery-01.tsx",
    ],
    installTargets: ["components/blocks/image-gallery-01.tsx"],
    registryDependencies: ["badge", "button", "empty-state", "tabs"],
    dependencies: ["lucide-react"],
  },
  {
    name: "app-shell-01",
    title: "App Shell 1",
    description:
      "Drop-in admin shell layout built on the shadcn Sidebar primitive: collapsible icon-rail sidebar with nav badges and a footer profile row, sticky topbar with breadcrumb, command-palette search and notification button, plus a live-filtering accounts table in the main area.",
    blockTagline: "Collapsible Sidebar · sticky topbar · live table",
    category: "blocks",
    blockKind: "app-shell",
    sourceFiles: ["registry/hirael/blocks/app-shell-01/app-shell-01.tsx"],
    installTargets: ["components/blocks/app-shell-01.tsx"],
    registryDependencies: [
      "badge",
      "button",
      "card",
      "input-group",
      "kbd",
      "separator",
      "sidebar",
    ],
    dependencies: ["lucide-react"],
  },
  {
    name: "app-shell-02",
    title: "App Shell 2",
    description:
      "Sidebar-free admin shell with a sticky top navigation bar (logo, primary links, search and avatar) over a settings layout: an in-page vertical nav switches a detail card of definition-list fields with per-field edit actions.",
    blockTagline: "Top nav · in-page settings nav · detail card",
    category: "blocks",
    blockKind: "app-shell",
    sourceFiles: ["registry/hirael/blocks/app-shell-02/app-shell-02.tsx"],
    installTargets: ["components/blocks/app-shell-02.tsx"],
    registryDependencies: [
      "badge",
      "button",
      "card",
      "input-group",
      "separator",
    ],
    dependencies: ["lucide-react"],
  },
  {
    name: "app-shell-03",
    title: "App Shell 3",
    description:
      "Split-pane inbox shell: icon rail with unread indicator, searchable conversation list with an unread filter, and a reading pane with star toggle and a reply composer that appends to the thread.",
    blockTagline: "Icon rail · inbox list · reading pane",
    category: "blocks",
    blockKind: "app-shell",
    sourceFiles: ["registry/hirael/blocks/app-shell-03/app-shell-03.tsx"],
    installTargets: ["components/blocks/app-shell-03.tsx"],
    registryDependencies: [
      "badge",
      "button",
      "input-group",
      "separator",
      "tabs",
      "textarea",
      "tooltip",
    ],
    dependencies: ["lucide-react"],
  },
  {
    name: "app-shell-04",
    title: "App Shell 4",
    description:
      "Starter shell on the shadcn Sidebar primitive (inset variant): workspace switcher and ⌘K search in the rail, icon-collapsible nav with tooltips, an inset header with trigger, notification count and avatar, and a welcome heading over dashed placeholder slots.",
    blockTagline: "Inset Sidebar · ⌘K search · slot grid",
    category: "blocks",
    blockKind: "app-shell",
    sourceFiles: ["registry/hirael/blocks/app-shell-04/app-shell-04.tsx"],
    installTargets: ["components/blocks/app-shell-04.tsx"],
    registryDependencies: [
      "badge",
      "button",
      "input-group",
      "kbd",
      "separator",
      "sidebar",
    ],
    dependencies: ["lucide-react"],
  },
  {
    name: "spinner",
    title: "Spinner",
    description:
      "Loading indicator with circle, dots and bars variants, sm / md / lg sizes. Inherits the current text color and ships an accessible status label.",
    category: "display",
    sourceFiles: ["registry/hirael/ui/spinner.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "copy-button",
    title: "Copy Button",
    description:
      "Click-to-copy button with copied feedback, icon-only or labelled, ghost / outline variants and a non-secure-context clipboard fallback.",
    category: "display",
    sourceFiles: ["registry/hirael/ui/copy-button.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "marquee",
    title: "Marquee",
    description:
      "Infinite scrolling row or column for logos and testimonials, with pause-on-hover, reverse and vertical modes. Keyframes ship inline — zero config.",
    category: "display",
    sourceFiles: ["registry/hirael/ui/marquee.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "tree-view",
    title: "Tree View",
    description:
      "Collapsible nested tree for file explorers and hierarchical data, with auto folder/file icons, depth indentation, selection and keyboard focus.",
    category: "data",
    sourceFiles: ["registry/hirael/ui/tree-view.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "animated-number",
    title: "Animated Number",
    description:
      "Count-up number that tweens to its target with easing, Intl formatting (currency, compact, percent), prefix/suffix and reduced-motion support.",
    category: "data",
    sourceFiles: ["registry/hirael/ui/animated-number.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "stepper",
    title: "Stepper",
    description:
      "Multi-step progress indicator with horizontal and vertical orientation, completed / active / inactive states, clickable steps and a compound API.",
    category: "navigation",
    sourceFiles: ["registry/hirael/ui/stepper.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "sortable",
    title: "Sortable",
    description:
      "Drag-to-reorder list with pointer and keyboard sorting, handle or whole-item dragging, and live-region announcements — no dnd-kit.",
    category: "data",
    sourceFiles: ["registry/hirael/ui/sortable.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "date-range-picker",
    title: "Date Range Picker",
    description:
      "Dual-month range picker with hover preview, presets, min/max bounds and keyboard nav. Includes an inline DateRangeCalendar — no date library.",
    category: "pickers",
    sourceFiles: ["registry/hirael/ui/date-range-picker.tsx"],
    registryDependencies: ["button", "popover", "separator"],
    dependencies: ["lucide-react"],
  },
  {
    name: "mention-input",
    title: "Mention Input",
    description:
      "@-mention textarea with caret-anchored autocomplete, highlighted mention chips, async search and multiple trigger characters.",
    category: "inputs",
    sourceFiles: ["registry/hirael/ui/mention-input.tsx"],
    registryDependencies: ["spinner"],
    dependencies: [],
  },
  {
    name: "inline-edit",
    title: "Inline Edit",
    description:
      "Click-to-edit text with preview, validation, async submit and confirm/cancel controls. Input and textarea modes.",
    category: "inputs",
    sourceFiles: ["registry/hirael/ui/inline-edit.tsx"],
    registryDependencies: ["button", "input", "spinner", "textarea"],
    dependencies: ["lucide-react"],
  },
  {
    name: "signature-pad",
    title: "Signature Pad",
    description:
      "Canvas signature capture with velocity-based ink, per-stroke undo, theme-aware re-inking and PNG/JPEG export via ref.",
    category: "inputs",
    sourceFiles: ["registry/hirael/ui/signature-pad.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "image-cropper",
    title: "Image Cropper",
    description:
      "Pan-and-zoom image cropper with rect or round mask, fixed aspect frame, pinch / wheel / keyboard control and canvas export via ref.",
    category: "files",
    sourceFiles: ["registry/hirael/ui/image-cropper.tsx"],
    registryDependencies: ["slider"],
    dependencies: [],
  },
  {
    name: "image-compare",
    title: "Image Compare",
    description:
      "Before/after comparison slider with a draggable, keyboard-accessible divider, horizontal or vertical orientation and hover-follow mode.",
    category: "display",
    sourceFiles: ["registry/hirael/ui/image-compare.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "lightbox",
    title: "Lightbox",
    description:
      "Fullscreen image lightbox on Radix Dialog with gallery navigation, zoom and pan, swipe gestures, captions and a thumbnail strip.",
    category: "display",
    sourceFiles: ["registry/hirael/ui/lightbox.tsx"],
    registryDependencies: [],
    dependencies: ["@radix-ui/react-dialog", "lucide-react"],
  },
  {
    name: "countdown-timer",
    title: "Countdown Timer",
    description:
      "Count-down-to-date timer with boxed / inline / minimal variants, a useCountdown hook, digit animation and completion content.",
    category: "data",
    sourceFiles: ["registry/hirael/ui/countdown-timer.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "qr-code",
    title: "QR Code",
    description:
      "Dependency-free QR code generator rendering crisp SVG, with L/M/Q/H error correction, quiet-zone control and currentColor theming.",
    category: "display",
    sourceFiles: ["registry/hirael/ui/qr-code.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "calendar-heatmap",
    title: "Calendar Heatmap",
    description:
      "GitHub-style contribution heatmap with month and weekday labels, tooltips, configurable intensity scale and a legend.",
    category: "data",
    sourceFiles: ["registry/hirael/ui/calendar-heatmap.tsx"],
    registryDependencies: ["tooltip"],
    dependencies: [],
  },
  {
    name: "code-block",
    title: "Code Block",
    description:
      "Structured code display with line numbers, line highlights, diff gutters, copy button and collapsible max-height. No tokenizer, no deps.",
    category: "display",
    sourceFiles: ["registry/hirael/ui/code-block.tsx"],
    registryDependencies: ["badge", "button", "copy-button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "masonry",
    title: "Masonry",
    description:
      "True masonry layout that balances children into the shortest column by measured height — order-preserving, responsive, dependency-free.",
    category: "display",
    sourceFiles: ["registry/hirael/ui/masonry.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "audio-player",
    title: "Audio Player",
    description:
      "Composable audio player with play/pause, scrub-safe seek with buffered tint, skip, time readouts, volume and playback rate.",
    category: "display",
    sourceFiles: ["registry/hirael/ui/audio-player.tsx"],
    registryDependencies: ["button", "slider"],
    dependencies: ["@radix-ui/react-slider", "lucide-react"],
  },
  {
    name: "media-input",
    title: "Media Input",
    description:
      "Local media file picker that previews via an object URL — empty-state prompt, replace and clear, size validation. Nothing leaves the browser.",
    category: "files",
    sourceFiles: ["registry/hirael/ui/media-input.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "tour",
    title: "Tour",
    description:
      "Onboarding spotlight that dims the page around a target element and walks users through steps with a positioned coach-mark card.",
    category: "navigation",
    sourceFiles: ["registry/hirael/ui/tour.tsx"],
    registryDependencies: ["button"],
    dependencies: [],
  },
]

export const REGISTRY_BY_NAME = Object.fromEntries(
  REGISTRY.map((r) => [r.name, r])
) as Record<string, RegistryEntryMeta>

export const CATEGORY_LABELS: Record<ComponentCategory, string> = {
  inputs: "Inputs",
  pickers: "Pickers",
  files: "Files",
  data: "Data display",
  display: "Display",
  navigation: "Navigation",
  blocks: "Blocks",
}

export const REGISTRY_BY_CATEGORY = (() => {
  const groups: Record<ComponentCategory, RegistryEntryMeta[]> = {
    inputs: [],
    pickers: [],
    files: [],
    data: [],
    display: [],
    navigation: [],
    blocks: [],
  }
  for (const entry of REGISTRY) groups[entry.category].push(entry)
  return groups
})()

export const BLOCK_KIND_LABELS: Record<BlockKind, string> = {
  hero: "Hero sections",
  feature: "Features",
  pricing: "Pricing",
  testimonial: "Testimonials",
  cta: "Call-to-action",
  faq: "FAQ",
  login: "Auth · login",
  header: "Headers",
  footer: "Footers",
  "not-found": "404",
  "logo-cloud": "Logo cloud",
  contact: "Contact",
  blog: "Blog",
  ecommerce: "E-commerce",
  dashboard: "Dashboard",
  integrations: "Integrations",
  "image-gallery": "Image gallery",
  "app-shell": "App shell",
}

export const BLOCKS_BY_KIND = (() => {
  const groups: Record<BlockKind, RegistryEntryMeta[]> = {
    hero: [],
    feature: [],
    pricing: [],
    testimonial: [],
    cta: [],
    faq: [],
    login: [],
    header: [],
    footer: [],
    "not-found": [],
    "logo-cloud": [],
    contact: [],
    blog: [],
    ecommerce: [],
    dashboard: [],
    integrations: [],
    "image-gallery": [],
    "app-shell": [],
  }
  for (const entry of REGISTRY) {
    if (entry.category === "blocks" && entry.blockKind) {
      groups[entry.blockKind].push(entry)
    }
  }
  return groups
})()

export const BLOCK_KIND_ORDER: BlockKind[] = [
  "hero",
  "feature",
  "pricing",
  "testimonial",
  "cta",
  "faq",
  "login",
  "header",
  "footer",
  "not-found",
  "logo-cloud",
  "contact",
  "blog",
  "ecommerce",
  "dashboard",
  "integrations",
  "image-gallery",
  "app-shell",
]
