export type ComponentCategory =
  | "inputs"
  | "pickers"
  | "files"
  | "data"
  | "display"
  | "animation"
  | "navigation"
  | "widgets"
  | "saas"
  | "blocks"
  | "templates";

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
  | "app-shell";

export type RegistryEntryMeta = {
  name: string;
  title: string;
  description: string;
  category: ComponentCategory;
  sourceFiles?: string[];
  /**
   * Install-target paths, parallel to `sourceFiles`. Shown in the code view
   * as a file hierarchy so users see where each file lands in their project.
   */
  installTargets?: string[];
  installSlug?: string;
  registryDependencies?: string[];
  dependencies?: string[];
  blockKind?: BlockKind;
  blockTagline?: string;
  /**
   * CSS variables the item ships with (registry-item schema `cssVars`).
   * `light` lands in `:root`, `dark` in `.dark`; the shadcn CLI also maps
   * them into `@theme inline` for Tailwind v4 consumers.
   */
  cssVars?: {
    theme?: Record<string, string>;
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
};

export const REGISTRY: RegistryEntryMeta[] = [
  {
    name: "multi-select",
    title: "Multi Select",
    description:
      "Chip-based multi-select with command-palette dropdown, search, select-all and async loader. Compound and single-prop APIs.",
    category: "inputs",
    sourceFiles: ["registry/hirael/ui/multi-select.tsx"],
    registryDependencies: ["popover", "command", "badge"],
    dependencies: ["cmdk", "lucide-react"],
  },
  {
    name: "number-range",
    title: "Number Range",
    description:
      "Two-thumb slider paired with synced number inputs. Min/max/step, currency or unit formatting, keyboard-first.",
    category: "inputs",
    sourceFiles: ["registry/hirael/ui/number-range.tsx"],
    registryDependencies: ["slider", "input"],
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
    registryDependencies: ["popover", "command"],
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
    registryDependencies: ["input-group"],
    dependencies: ["lucide-react"],
  },
  {
    name: "currency-input",
    title: "Currency Input",
    description:
      "Locale-aware grouping with currency-symbol prefix and configurable decimal precision.",
    category: "inputs",
    sourceFiles: ["registry/hirael/ui/currency-input.tsx"],
    registryDependencies: ["input-group"],
    dependencies: [],
  },
  {
    name: "phone-input",
    title: "Phone Input",
    description:
      "Country dial-code dropdown with E.164 output. Compound and single-prop APIs.",
    category: "inputs",
    sourceFiles: ["registry/hirael/ui/phone-input.tsx"],
    registryDependencies: ["input-group", "popover", "command"],
    dependencies: ["lucide-react"],
  },
  {
    name: "file-dropzone",
    title: "File Dropzone",
    description:
      "Drag-drop + click upload zone with previews, accept and max-size validation. Compound and single-prop APIs.",
    category: "files",
    sourceFiles: ["registry/hirael/ui/file-dropzone.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "stat-card",
    title: "Stat Card",
    description:
      "Compact metric card with label, value, and an up/down/flat trend chip. Compound and single-prop APIs.",
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
    dependencies: ["class-variance-authority"],
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
      "MDX-style admonition with info / success / warning / error / neutral variants and optional icon override. Ships --info / --success / --warning theme tokens.",
    category: "display",
    sourceFiles: ["registry/hirael/ui/callout.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react", "class-variance-authority"],
    cssVars: {
      light: {
        success: "oklch(0.527 0.154 150.069)",
        warning: "oklch(0.555 0.163 48.998)",
        info: "oklch(0.55 0.2 260)",
      },
      dark: {
        success: "oklch(0.696 0.17 162.48)",
        warning: "oklch(0.769 0.188 70.08)",
        info: "oklch(0.62 0.19 260)",
      },
    },
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
      "Full-bleed hero card over an animated light-beam shader, with a glass pill nav, a trust badge, a serif headline, dual CTA and a three-stat footer.",
    blockTagline: "Beam shader · glass nav · stat footer",
    category: "blocks",
    blockKind: "hero",
    sourceFiles: [
      "registry/hirael/blocks/hero-01/hero-01.tsx",
      "registry/hirael/blocks/hero-01/hero-01-backdrop.tsx",
    ],
    installTargets: [
      "components/blocks/hero-01.tsx",
      "components/blocks/hero-01-backdrop.tsx",
    ],
    registryDependencies: ["button"],
    dependencies: ["shaders", "lucide-react"],
  },
  {
    name: "hero-02",
    title: "Hero 2",
    description:
      "Centered hero over animated grayscale gradient bars, with a live pill, a serif headline with an underlined accent, dual CTA and a wordmark strip.",
    blockTagline: "Stripe shader · live pill · wordmark strip",
    category: "blocks",
    blockKind: "hero",
    sourceFiles: [
      "registry/hirael/blocks/hero-02/hero-02.tsx",
      "registry/hirael/blocks/hero-02/hero-02-backdrop.tsx",
    ],
    installTargets: [
      "components/blocks/hero-02.tsx",
      "components/blocks/hero-02-backdrop.tsx",
    ],
    registryDependencies: ["button"],
    dependencies: ["shaders", "lucide-react"],
  },
  {
    name: "hero-03",
    title: "Hero 3",
    description:
      "Editorial centered hero on a faded grid, with a serif headline, sub-copy, dual CTA and a logo cloud of customer wordmarks.",
    blockTagline: "Editorial · grid backdrop · logo cloud",
    category: "blocks",
    blockKind: "hero",
    sourceFiles: ["registry/hirael/blocks/hero-03/hero-03.tsx"],
    installTargets: ["components/blocks/hero-03.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "hero-04",
    title: "Hero 4",
    description:
      "Full-bleed image-banner hero with a dark scrim, a slim nav, a serif headline and dual CTA aligned to the bottom.",
    blockTagline: "Image banner · scrim · bottom-aligned",
    category: "blocks",
    blockKind: "hero",
    sourceFiles: ["registry/hirael/blocks/hero-04/hero-04.tsx"],
    installTargets: ["components/blocks/hero-04.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "hero-05",
    title: "Hero 5",
    description:
      "Full-bleed hero card over an animated aurora shader, with a glass pill nav, a glass content panel, a serif headline, dual CTA and an avatar social-proof row.",
    blockTagline: "Aurora shader · glass panel · social proof",
    category: "blocks",
    blockKind: "hero",
    sourceFiles: [
      "registry/hirael/blocks/hero-05/hero-05.tsx",
      "registry/hirael/blocks/hero-05/hero-05-backdrop.tsx",
    ],
    installTargets: [
      "components/blocks/hero-05.tsx",
      "components/blocks/hero-05-backdrop.tsx",
    ],
    registryDependencies: ["button"],
    dependencies: ["shaders", "lucide-react"],
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
    registryDependencies: [],
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
    registryDependencies: ["button", "card", "separator"],
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
    name: "cta-03",
    title: "CTA 3",
    description:
      "Full-bleed CTA card with an animated dithered shader backdrop, a live status pill, a serif headline and a pill action button.",
    blockTagline: "Centered · dithered backdrop · serif headline",
    category: "blocks",
    blockKind: "cta",
    sourceFiles: [
      "registry/hirael/blocks/cta-03/cta-03.tsx",
      "registry/hirael/blocks/cta-03/cta-03-backdrop.tsx",
    ],
    installTargets: [
      "components/blocks/cta-03.tsx",
      "components/blocks/cta-03-backdrop.tsx",
    ],
    registryDependencies: ["button"],
    dependencies: ["shaders", "lucide-react"],
  },
  {
    name: "faq-01",
    title: "FAQ 1",
    description:
      "Two-column FAQ: sticky heading + contact card on the left, numbered accordion on the right.",
    blockTagline: "Sticky split · numbered · contact card",
    category: "blocks",
    blockKind: "faq",
    sourceFiles: ["registry/hirael/blocks/faq-01/faq-01.tsx"],
    installTargets: ["components/blocks/faq-01.tsx"],
    registryDependencies: ["button", "accordion", "card"],
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
      "empty",
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
    registryDependencies: [
      "button",
      "checkbox",
      "field",
      "input",
      "label",
      "password-input",
    ],
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
    name: "signup-01",
    title: "Signup 1",
    description:
      "Centered signup card with monogram, name + email, strength-meter password-input, terms checkbox, divider and GitHub / Google providers. Validates inline on submit.",
    blockTagline: "Centered card · strength meter · providers",
    category: "blocks",
    blockKind: "login",
    sourceFiles: ["registry/hirael/blocks/signup-01/signup-01.tsx"],
    installTargets: ["components/blocks/signup-01.tsx"],
    registryDependencies: [
      "button",
      "checkbox",
      "field",
      "input",
      "label",
      "password-input",
    ],
    dependencies: ["lucide-react"],
  },
  {
    name: "forgot-password-01",
    title: "Forgot Password 1",
    description:
      "Centered reset-request card: email with inline validation and a pending submit, swapping to a check-your-inbox state that echoes the address with resend and back-to-sign-in links.",
    blockTagline: "Centered card · inbox state · resend link",
    category: "blocks",
    blockKind: "login",
    sourceFiles: [
      "registry/hirael/blocks/forgot-password-01/forgot-password-01.tsx",
    ],
    installTargets: ["components/blocks/forgot-password-01.tsx"],
    registryDependencies: ["button", "input", "label"],
    dependencies: ["lucide-react"],
  },
  {
    name: "otp-verify-01",
    title: "OTP Verify 1",
    description:
      "Centered verification card with a six-box code input built in the block: auto-advance, backspace, paste distribution and arrow-key focus, plus a 30s resend countdown and a pending → success verify flow.",
    blockTagline: "Six-box code · 30s resend · success state",
    category: "blocks",
    blockKind: "login",
    sourceFiles: ["registry/hirael/blocks/otp-verify-01/otp-verify-01.tsx"],
    installTargets: ["components/blocks/otp-verify-01.tsx"],
    registryDependencies: ["button", "input"],
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
    registryDependencies: ["popover", "tabs"],
    dependencies: ["lucide-react"],
  },
  {
    name: "color-picker",
    title: "Color Picker",
    description:
      "SV gradient + hue slider with HEX / RGB / HSL tabs, eyedropper (where supported) and recent swatches.",
    category: "pickers",
    sourceFiles: ["registry/hirael/ui/color-picker.tsx"],
    registryDependencies: ["popover", "input", "tabs"],
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
    dependencies: ["@radix-ui/react-slot", "class-variance-authority"],
  },
  {
    name: "announcement-bar",
    title: "Announcement Bar",
    description:
      "Top-of-page banner with default / primary / muted tones, optional dismiss button and localStorage persistence.",
    category: "display",
    sourceFiles: ["registry/hirael/ui/announcement-bar.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react", "class-variance-authority"],
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
      "empty",
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
    sourceFiles: ["registry/hirael/blocks/integrations-01/integrations-01.tsx"],
    installTargets: ["components/blocks/integrations-01.tsx"],
    registryDependencies: ["badge", "button", "card"],
    dependencies: ["lucide-react"],
  },
  {
    name: "image-gallery-01",
    title: "Image Gallery 1",
    description:
      "Studio-style masonry gallery with Tabs-driven category filter, real photo tiles via next/image, varied aspect ratios, hover zoom + arrow chip and an Empty fallback for empty filters.",
    blockTagline: "Tabs filter · masonry · empty state",
    category: "blocks",
    blockKind: "image-gallery",
    sourceFiles: [
      "registry/hirael/blocks/image-gallery-01/image-gallery-01.tsx",
    ],
    installTargets: ["components/blocks/image-gallery-01.tsx"],
    registryDependencies: ["badge", "button", "empty", "tabs"],
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
    dependencies: ["class-variance-authority"],
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
      "Infinite scrolling row or column for logos and testimonials, with pause-on-hover, reverse and vertical modes. Keyframes ship inline, zero config.",
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
    registryDependencies: ["collapsible"],
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
      "Drag-to-reorder list with pointer and keyboard sorting, handle or whole-item dragging, and live-region announcements. No dnd-kit.",
    category: "data",
    sourceFiles: ["registry/hirael/ui/sortable.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "date-picker",
    title: "Date Picker",
    description:
      "Single-date picker with month grid, keyboard nav, min/max bounds and disabled dates. Includes an inline DateCalendar, no date library.",
    category: "pickers",
    sourceFiles: ["registry/hirael/ui/date-picker.tsx"],
    registryDependencies: ["button", "popover"],
    dependencies: ["lucide-react"],
  },
  {
    name: "date-range-picker",
    title: "Date Range Picker",
    description:
      "Dual-month range picker with hover preview, presets, min/max bounds and keyboard nav. Includes an inline DateRangeCalendar, no date library.",
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
      "Code display with built-in dependency-free syntax highlighting via theme tokens, line numbers, line highlights, diff gutters, copy button and collapsible max-height.",
    category: "display",
    sourceFiles: ["registry/hirael/ui/code-block.tsx"],
    registryDependencies: ["badge", "button", "copy-button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "masonry",
    title: "Masonry",
    description:
      "True masonry layout that balances children into the shortest column by measured height, order-preserving, responsive, dependency-free.",
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
      "Local media file picker that previews via an object URL; empty-state prompt, replace and clear, size validation. Nothing leaves the browser.",
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
  {
    name: "activity-feed",
    title: "Activity Feed",
    description:
      "Avatar-led event feed with a connecting rail, actor and action lines, timestamps, quoted bodies and date dividers. Compound API.",
    category: "data",
    sourceFiles: ["registry/hirael/ui/activity-feed.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "audit-log",
    title: "Audit Log",
    description:
      "Compliance-style event log with expandable rows that reveal actor, action, status and request metadata. Compound disclosure API.",
    category: "data",
    sourceFiles: ["registry/hirael/ui/audit-log.tsx"],
    registryDependencies: ["collapsible"],
    dependencies: ["lucide-react", "class-variance-authority"],
  },
  {
    name: "blur-reveal",
    title: "Blur Reveal",
    description:
      "Reveals content with a blur, fade and lift as it scrolls into view. Configurable delay, duration and threshold; respects reduced-motion.",
    category: "animation",
    sourceFiles: ["registry/hirael/ui/blur-reveal.tsx"],
    registryDependencies: [],
    dependencies: ["motion"],
  },
  {
    name: "text-reveal",
    title: "Text Reveal",
    description:
      "Staggered text entrance that masks and slides each word, character or line into place on scroll. Respects reduced-motion.",
    category: "animation",
    sourceFiles: ["registry/hirael/ui/text-reveal.tsx"],
    registryDependencies: [],
    dependencies: ["motion"],
  },
  {
    name: "scroll-reveal",
    title: "Scroll Reveal",
    description:
      "Fades and slides content in from any direction as it enters the viewport. Configurable distance, delay and replay; respects reduced-motion.",
    category: "animation",
    sourceFiles: ["registry/hirael/ui/scroll-reveal.tsx"],
    registryDependencies: [],
    dependencies: ["motion"],
  },
  {
    name: "spotlight-card",
    title: "Spotlight Card",
    description:
      "Card surface with a soft spotlight that tracks the cursor and fades in on hover. Built on design tokens, no hard-coded colors.",
    category: "animation",
    sourceFiles: ["registry/hirael/ui/spotlight-card.tsx"],
    registryDependencies: [],
    dependencies: ["motion"],
  },
  {
    name: "magnetic-button",
    title: "Magnetic Button",
    description:
      "Button that pulls toward the cursor and springs back on leave. Adjustable strength, asChild to wrap a link, respects reduced-motion.",
    category: "animation",
    sourceFiles: ["registry/hirael/ui/magnetic-button.tsx"],
    registryDependencies: [],
    dependencies: ["@radix-ui/react-slot", "motion"],
  },
  {
    name: "cursor-glow",
    title: "Cursor Glow",
    description:
      "Ambient glow layer that follows the pointer across its container and fades when it leaves. Drop it behind heroes, grids or feature panels.",
    category: "animation",
    sourceFiles: ["registry/hirael/ui/cursor-glow.tsx"],
    registryDependencies: [],
    dependencies: ["motion"],
  },
  {
    name: "tilt-card",
    title: "Tilt Card",
    description:
      "3D pointer tilt with optional cursor-following glare and configurable max angle, scale and perspective. Respects reduced-motion.",
    category: "animation",
    sourceFiles: ["registry/hirael/ui/tilt-card.tsx"],
    registryDependencies: [],
    dependencies: ["motion"],
  },
  {
    name: "morphing-dialog",
    title: "Morphing Dialog",
    description:
      "A trigger card that morphs into a centered dialog via shared-layout animation, with focus trapping, scroll lock, Esc to close and reduced-motion support.",
    category: "animation",
    sourceFiles: ["registry/hirael/ui/morphing-dialog.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react", "motion"],
  },
  {
    name: "dock",
    title: "Dock",
    description:
      "macOS-style dock with cursor magnification: icons scale and spring as the pointer passes, with hover and focus labels. Built on framer-motion.",
    category: "navigation",
    sourceFiles: ["registry/hirael/ui/dock.tsx"],
    registryDependencies: [],
    dependencies: ["motion"],
  },
  {
    name: "floating-action-button",
    title: "Floating Action Button",
    description:
      "Expanding speed-dial FAB: a primary trigger that rotates open to stagger a stack of secondary actions on any side. Compound API.",
    category: "navigation",
    sourceFiles: ["registry/hirael/ui/floating-action-button.tsx"],
    registryDependencies: [],
    dependencies: ["motion"],
  },
  {
    name: "floating-toolbar",
    title: "Floating Toolbar",
    description:
      "Floating pill toolbar for text selection and canvas actions, with toggle buttons, separators and labels. Position it anywhere.",
    category: "navigation",
    sourceFiles: ["registry/hirael/ui/floating-toolbar.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "split-view",
    title: "Split View",
    description:
      "Two-pane master/detail layout with a draggable divider, keyboard resize, min/max bounds and horizontal or vertical orientation. RTL-aware.",
    category: "navigation",
    sourceFiles: ["registry/hirael/ui/split-view.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "resizable-panels",
    title: "Resizable Panels",
    description:
      "Composable resizable panel groups with draggable, keyboard-accessible handles, per-panel minimums and nestable horizontal or vertical groups. RTL-aware.",
    category: "navigation",
    sourceFiles: ["registry/hirael/ui/resizable-panels.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "inspector-panel",
    title: "Inspector Panel",
    description:
      "Design-tool inspector with a header, collapsible sections and label/control rows. Compound API for property panels and sidebars.",
    category: "navigation",
    sourceFiles: ["registry/hirael/ui/inspector-panel.tsx"],
    registryDependencies: ["collapsible"],
    dependencies: ["lucide-react"],
  },
  {
    name: "tenant-switcher",
    title: "Tenant Switcher",
    description:
      "Workspace, organization or project switcher for multi-tenant apps. Logo or initials, plan or role caption, grouped and searchable list, and a create action. Compound API.",
    category: "navigation",
    sourceFiles: ["registry/hirael/ui/tenant-switcher.tsx"],
    registryDependencies: ["popover", "command"],
    dependencies: ["cmdk", "lucide-react"],
  },
  {
    name: "language-switcher",
    title: "Language Switcher",
    description:
      "Locale switcher with a code chip, native and translated names, search and a current-language check. Full or icon-only trigger. Compound API.",
    category: "navigation",
    sourceFiles: ["registry/hirael/ui/language-switcher.tsx"],
    registryDependencies: ["popover", "command"],
    dependencies: ["cmdk", "lucide-react"],
  },
  {
    name: "kpi-grid",
    title: "KPI Grid",
    description:
      "Hairline-joined grid of KPI tiles with label, value, an up/down/flat delta chip and a dependency-free sparkline. Compound API.",
    category: "widgets",
    sourceFiles: ["registry/hirael/ui/kpi-grid.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "quick-actions",
    title: "Quick Actions",
    description:
      "Grid of dashboard shortcut tiles with icon, label and description. Each tile is a button or, via asChild, a link. Compound API.",
    category: "widgets",
    sourceFiles: ["registry/hirael/ui/quick-actions.tsx"],
    registryDependencies: [],
    dependencies: ["@radix-ui/react-slot"],
  },
  {
    name: "notifications",
    title: "Notifications",
    description:
      "Notification panel with header, list, per-item media, title, description, time and an accent-cool unread marker. Compound API.",
    category: "widgets",
    sourceFiles: ["registry/hirael/ui/notifications.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "billing-card",
    title: "Billing Card",
    description:
      "Current-plan summary with price, a usage meter, billing detail rows and footer actions. Compound API for billing settings.",
    category: "saas",
    sourceFiles: ["registry/hirael/ui/billing-card.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "subscription-plans",
    title: "Subscription Plans",
    description:
      "In-app plan selector with featured and current states, a badge, feature checklist and per-plan action. Compound API.",
    category: "saas",
    sourceFiles: ["registry/hirael/ui/subscription-plans.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "api-keys",
    title: "API Keys",
    description:
      "API key manager with reveal/hide, copy-to-clipboard, key metadata and a create action. Compound API.",
    category: "saas",
    sourceFiles: ["registry/hirael/ui/api-keys.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "usage-dashboard",
    title: "Usage Dashboard",
    description:
      "Metered usage panel with per-resource progress bars that tint amber near the limit and red over it. Compound API.",
    category: "saas",
    sourceFiles: ["registry/hirael/ui/usage-dashboard.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "creative-studio",
    title: "Creative Studio",
    description:
      "Dark, cinematic creative-studio landing page: a full-viewport hero with an animated backdrop and pull-up wordmark, a scroll-revealed about section, and a staggered feature-card grid. Framer Motion throughout, with a self-contained warm-cream palette.",
    category: "templates",
    sourceFiles: [
      "registry/hirael/templates/creative-studio/creative-studio.tsx",
      "registry/hirael/templates/creative-studio/hero.tsx",
      "registry/hirael/templates/creative-studio/about.tsx",
      "registry/hirael/templates/creative-studio/features.tsx",
      "registry/hirael/templates/creative-studio/footer.tsx",
      "registry/hirael/templates/creative-studio/primitives.tsx",
      "registry/hirael/templates/creative-studio/fonts.ts",
    ],
    installTargets: [
      "components/templates/creative-studio/creative-studio.tsx",
      "components/templates/creative-studio/hero.tsx",
      "components/templates/creative-studio/about.tsx",
      "components/templates/creative-studio/features.tsx",
      "components/templates/creative-studio/footer.tsx",
      "components/templates/creative-studio/primitives.tsx",
      "components/templates/creative-studio/fonts.ts",
    ],
    registryDependencies: [],
    dependencies: ["framer-motion", "lucide-react"],
  },
  {
    name: "agency-landing",
    title: "Agency Landing",
    description:
      "Bright, shader-lit agency landing page: a full-viewport hero with an animated WebGL backdrop and pill navigation, an editorial about section, a featured-work grid of autoplaying video cards, and a dark closing footer with a call to action. Built on the shaders package, with a self-contained light palette.",
    category: "templates",
    sourceFiles: [
      "registry/hirael/templates/agency-landing/agency-landing.tsx",
      "registry/hirael/templates/agency-landing/hero.tsx",
      "registry/hirael/templates/agency-landing/about.tsx",
      "registry/hirael/templates/agency-landing/case-studies.tsx",
      "registry/hirael/templates/agency-landing/footer.tsx",
      "registry/hirael/templates/agency-landing/primitives.tsx",
      "registry/hirael/templates/agency-landing/shader-background.tsx",
    ],
    installTargets: [
      "components/templates/agency-landing/agency-landing.tsx",
      "components/templates/agency-landing/hero.tsx",
      "components/templates/agency-landing/about.tsx",
      "components/templates/agency-landing/case-studies.tsx",
      "components/templates/agency-landing/footer.tsx",
      "components/templates/agency-landing/primitives.tsx",
      "components/templates/agency-landing/shader-background.tsx",
    ],
    registryDependencies: [],
    dependencies: ["shaders", "lucide-react"],
  },
  {
    name: "mindloop",
    title: "Mindloop",
    description:
      "Dark, monochrome newsletter landing page: a full-screen video hero with an inline subscribe form, an answer-engine section, scroll-revealed mission copy, a four-up feature grid and a streaming-video call to action. Framer Motion throughout, with a self-contained pure-black palette and liquid-glass accents.",
    category: "templates",
    sourceFiles: [
      "registry/hirael/templates/mindloop/mindloop.tsx",
      "registry/hirael/templates/mindloop/navbar.tsx",
      "registry/hirael/templates/mindloop/hero.tsx",
      "registry/hirael/templates/mindloop/search.tsx",
      "registry/hirael/templates/mindloop/mission.tsx",
      "registry/hirael/templates/mindloop/solution.tsx",
      "registry/hirael/templates/mindloop/cta.tsx",
      "registry/hirael/templates/mindloop/footer.tsx",
      "registry/hirael/templates/mindloop/primitives.tsx",
      "registry/hirael/templates/mindloop/styles.tsx",
      "registry/hirael/templates/mindloop/fonts.ts",
    ],
    installTargets: [
      "components/templates/mindloop/mindloop.tsx",
      "components/templates/mindloop/navbar.tsx",
      "components/templates/mindloop/hero.tsx",
      "components/templates/mindloop/search.tsx",
      "components/templates/mindloop/mission.tsx",
      "components/templates/mindloop/solution.tsx",
      "components/templates/mindloop/cta.tsx",
      "components/templates/mindloop/footer.tsx",
      "components/templates/mindloop/primitives.tsx",
      "components/templates/mindloop/styles.tsx",
      "components/templates/mindloop/fonts.ts",
    ],
    registryDependencies: [],
    dependencies: ["framer-motion", "hls.js"],
  },
  {
    name: "portfolio",
    title: "Portfolio",
    description:
      "Dark, single-page personal portfolio: a counter loading screen, an HLS video hero with a floating nav and a cycling role line, a bento work grid, a journal list, a scroll-pinned parallax gallery with lightbox, count-up stats and a video contact footer. Self-contained dark palette, driven by GSAP and Framer Motion.",
    category: "templates",
    sourceFiles: [
      "registry/hirael/templates/portfolio/portfolio.tsx",
      "registry/hirael/templates/portfolio/loading-screen.tsx",
      "registry/hirael/templates/portfolio/hero.tsx",
      "registry/hirael/templates/portfolio/selected-works.tsx",
      "registry/hirael/templates/portfolio/journal.tsx",
      "registry/hirael/templates/portfolio/explorations.tsx",
      "registry/hirael/templates/portfolio/stats.tsx",
      "registry/hirael/templates/portfolio/contact.tsx",
      "registry/hirael/templates/portfolio/hls-video.tsx",
      "registry/hirael/templates/portfolio/primitives.tsx",
      "registry/hirael/templates/portfolio/fonts.ts",
      "registry/hirael/templates/portfolio/styles.ts",
    ],
    installTargets: [
      "components/templates/portfolio/portfolio.tsx",
      "components/templates/portfolio/loading-screen.tsx",
      "components/templates/portfolio/hero.tsx",
      "components/templates/portfolio/selected-works.tsx",
      "components/templates/portfolio/journal.tsx",
      "components/templates/portfolio/explorations.tsx",
      "components/templates/portfolio/stats.tsx",
      "components/templates/portfolio/contact.tsx",
      "components/templates/portfolio/hls-video.tsx",
      "components/templates/portfolio/primitives.tsx",
      "components/templates/portfolio/fonts.ts",
      "components/templates/portfolio/styles.ts",
    ],
    registryDependencies: [],
    dependencies: ["gsap", "framer-motion", "hls.js"],
  },
  {
    name: "usd-halo",
    title: "USD Halo",
    description:
      "Premium fintech landing page for a stablecoin: a full-bleed video hero with a custom halo wordmark and an infinite brand marquee, a meet-the-product card grid, a backers marquee, and a use-modes split with an autoplaying video panel, closing on a dark anchor footer. Self-contained light palette.",
    category: "templates",
    sourceFiles: [
      "registry/hirael/templates/usd-halo/usd-halo.tsx",
      "registry/hirael/templates/usd-halo/navbar.tsx",
      "registry/hirael/templates/usd-halo/hero.tsx",
      "registry/hirael/templates/usd-halo/info.tsx",
      "registry/hirael/templates/usd-halo/backed-by.tsx",
      "registry/hirael/templates/usd-halo/use-cases.tsx",
      "registry/hirael/templates/usd-halo/footer.tsx",
      "registry/hirael/templates/usd-halo/primitives.tsx",
      "registry/hirael/templates/usd-halo/fonts.ts",
    ],
    installTargets: [
      "components/templates/usd-halo/usd-halo.tsx",
      "components/templates/usd-halo/navbar.tsx",
      "components/templates/usd-halo/hero.tsx",
      "components/templates/usd-halo/info.tsx",
      "components/templates/usd-halo/backed-by.tsx",
      "components/templates/usd-halo/use-cases.tsx",
      "components/templates/usd-halo/footer.tsx",
      "components/templates/usd-halo/primitives.tsx",
      "components/templates/usd-halo/fonts.ts",
    ],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "rivr",
    title: "Rivr",
    description:
      "DeFi staking landing page for a fluid-asset protocol: a video hero on a rounded card with glass stat cards and a carved documentation corner, a metrics band, a bento feature grid, a video call to action and a light footer. Self-contained light palette, Helvetica system type, Framer Motion throughout.",
    category: "templates",
    sourceFiles: [
      "registry/hirael/templates/rivr/rivr.tsx",
      "registry/hirael/templates/rivr/navbar.tsx",
      "registry/hirael/templates/rivr/hero.tsx",
      "registry/hirael/templates/rivr/metrics.tsx",
      "registry/hirael/templates/rivr/features.tsx",
      "registry/hirael/templates/rivr/cta.tsx",
      "registry/hirael/templates/rivr/footer.tsx",
      "registry/hirael/templates/rivr/primitives.tsx",
      "registry/hirael/templates/rivr/styles.tsx",
    ],
    installTargets: [
      "components/templates/rivr/rivr.tsx",
      "components/templates/rivr/navbar.tsx",
      "components/templates/rivr/hero.tsx",
      "components/templates/rivr/metrics.tsx",
      "components/templates/rivr/features.tsx",
      "components/templates/rivr/cta.tsx",
      "components/templates/rivr/footer.tsx",
      "components/templates/rivr/primitives.tsx",
      "components/templates/rivr/styles.tsx",
    ],
    registryDependencies: [],
    dependencies: ["framer-motion", "lucide-react"],
  },
  {
    name: "velorah",
    title: "Velorah",
    description:
      "Dark, premium landing page for an electric RV brand: a full-screen video hero with liquid-glass navigation, a centered tagline, a split feature card with switchable tabs, an HLS streaming statement with a stats row, a video preorder call to action and a multi-column footer. Self-contained pure-black palette, Inter + Instrument Serif type.",
    category: "templates",
    sourceFiles: [
      "registry/hirael/templates/velorah/velorah.tsx",
      "registry/hirael/templates/velorah/navbar.tsx",
      "registry/hirael/templates/velorah/hero.tsx",
      "registry/hirael/templates/velorah/tagline.tsx",
      "registry/hirael/templates/velorah/feature.tsx",
      "registry/hirael/templates/velorah/statement.tsx",
      "registry/hirael/templates/velorah/cta.tsx",
      "registry/hirael/templates/velorah/footer.tsx",
      "registry/hirael/templates/velorah/hls-video.tsx",
      "registry/hirael/templates/velorah/primitives.tsx",
      "registry/hirael/templates/velorah/styles.tsx",
      "registry/hirael/templates/velorah/fonts.ts",
    ],
    installTargets: [
      "components/templates/velorah/velorah.tsx",
      "components/templates/velorah/navbar.tsx",
      "components/templates/velorah/hero.tsx",
      "components/templates/velorah/tagline.tsx",
      "components/templates/velorah/feature.tsx",
      "components/templates/velorah/statement.tsx",
      "components/templates/velorah/cta.tsx",
      "components/templates/velorah/footer.tsx",
      "components/templates/velorah/hls-video.tsx",
      "components/templates/velorah/primitives.tsx",
      "components/templates/velorah/styles.tsx",
      "components/templates/velorah/fonts.ts",
    ],
    registryDependencies: [],
    dependencies: ["hls.js"],
  },
  {
    name: "nexacore",
    title: "NexaCore",
    description:
      "Light enterprise-infrastructure landing page: a floating pill navbar that shrinks on scroll, a full-screen video hero, a dark service-card grid that unfolds on hover, a chaos-versus-control split around a circular streaming video, and a four-pillar delivery staircase. Self-contained navy-and-lavender palette with multi-stop brand gradients, driven by hls.js and lucide-react.",
    category: "templates",
    sourceFiles: [
      "registry/hirael/templates/nexacore/nexacore.tsx",
      "registry/hirael/templates/nexacore/navbar.tsx",
      "registry/hirael/templates/nexacore/hero.tsx",
      "registry/hirael/templates/nexacore/trusted.tsx",
      "registry/hirael/templates/nexacore/service-card.tsx",
      "registry/hirael/templates/nexacore/freedom.tsx",
      "registry/hirael/templates/nexacore/hls-video.tsx",
      "registry/hirael/templates/nexacore/precision.tsx",
      "registry/hirael/templates/nexacore/primitives.tsx",
      "registry/hirael/templates/nexacore/styles.tsx",
      "registry/hirael/templates/nexacore/fonts.ts",
    ],
    installTargets: [
      "components/templates/nexacore/nexacore.tsx",
      "components/templates/nexacore/navbar.tsx",
      "components/templates/nexacore/hero.tsx",
      "components/templates/nexacore/trusted.tsx",
      "components/templates/nexacore/service-card.tsx",
      "components/templates/nexacore/freedom.tsx",
      "components/templates/nexacore/hls-video.tsx",
      "components/templates/nexacore/precision.tsx",
      "components/templates/nexacore/primitives.tsx",
      "components/templates/nexacore/styles.tsx",
      "components/templates/nexacore/fonts.ts",
    ],
    registryDependencies: [],
    dependencies: ["hls.js", "lucide-react"],
  },
];

/**
 * Items that install through the registry but aren't showcased on the site
 * (no demo page, no sidebar entry). registry.json is generated from
 * REGISTRY + DISTRIBUTION_ONLY by scripts/build-registry.mjs.
 */
export type DistributionOnlyEntry = {
  name: string;
  title: string;
  description: string;
  type: "registry:ui" | "registry:block";
  /** Raw registry.json categories. */
  categories: string[];
  sourceFiles: string[];
  installTargets?: string[];
  registryDependencies?: string[];
  dependencies?: string[];
};

export const DISTRIBUTION_ONLY: DistributionOnlyEntry[] = [
  {
    name: "accordion",
    title: "Accordion",
    description:
      "Radix-powered accordion primitive used by the FAQ blocks. Plus icon rotates to an X on open.",
    type: "registry:ui",
    categories: ["primitives"],
    sourceFiles: ["registry/hirael/ui/accordion.tsx"],
    registryDependencies: [],
    dependencies: ["@radix-ui/react-accordion", "lucide-react"],
  },
];

export const REGISTRY_BY_NAME = Object.fromEntries(
  REGISTRY.map((r) => [r.name, r]),
) as Record<string, RegistryEntryMeta>;

export const CATEGORY_LABELS: Record<ComponentCategory, string> = {
  inputs: "Inputs",
  pickers: "Pickers",
  files: "Files",
  data: "Data display",
  display: "Display",
  animation: "Animation",
  navigation: "Navigation",
  widgets: "Widgets",
  saas: "SaaS",
  blocks: "Blocks",
  templates: "Templates",
};

export const REGISTRY_BY_CATEGORY = (() => {
  const groups: Record<ComponentCategory, RegistryEntryMeta[]> = {
    inputs: [],
    pickers: [],
    files: [],
    data: [],
    display: [],
    animation: [],
    navigation: [],
    widgets: [],
    saas: [],
    blocks: [],
    templates: [],
  };
  for (const entry of REGISTRY) groups[entry.category].push(entry);
  return groups;
})();

export const TEMPLATES = REGISTRY_BY_CATEGORY.templates;

export const COMPONENTS = REGISTRY.filter(
  (entry) => entry.category !== "blocks" && entry.category !== "templates",
);

export const BLOCK_KIND_LABELS: Record<BlockKind, string> = {
  hero: "Hero sections",
  feature: "Features",
  pricing: "Pricing",
  testimonial: "Testimonials",
  cta: "Call-to-action",
  faq: "FAQ",
  login: "Auth",
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
};

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
  };
  for (const entry of REGISTRY) {
    if (entry.category === "blocks" && entry.blockKind) {
      groups[entry.blockKind].push(entry);
    }
  }
  return groups;
})();

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
];

/* -------------------------------------------------------------------------- */
/* Routing — every browsable item lives under its category segment            */
/* -------------------------------------------------------------------------- */

/** Component categories in display order. Drives the index, sidebar, sitemap. */
export const COMPONENT_CATEGORY_ORDER: Exclude<
  ComponentCategory,
  "blocks" | "templates"
>[] = [
  "inputs",
  "pickers",
  "files",
  "data",
  "display",
  "animation",
  "navigation",
  "widgets",
  "saas",
];

/** One-line, human blurb for each component category landing page. */
export const COMPONENT_CATEGORY_DESCRIPTIONS: Record<
  (typeof COMPONENT_CATEGORY_ORDER)[number],
  string
> = {
  inputs:
    "Text fields, selects, chip and tag inputs, and the form controls shadcn/ui leaves out.",
  pickers:
    "Date, time, month, year and color pickers with keyboard navigation and no date library.",
  files: "Upload zones, image croppers and local media pickers.",
  data: "Feeds, timelines, trees, heatmaps and other ways to show structured data.",
  display:
    "Callouts, code blocks, marquees, lightboxes and other visual helpers.",
  animation:
    "Scroll reveals, tilts, spotlights and pointer-driven motion. Reduced-motion aware.",
  navigation: "Docks, steppers, toolbars, split views and resizable panels.",
  widgets:
    "Composite dashboard panels: KPI grids, notifications, quick actions.",
  saas: "Billing, plans, API keys and usage panels for product settings.",
};

/**
 * URL slug per block kind. The slug differs from the kind key wherever the
 * plural or label reads better in a path (feature → features, login → auth).
 * This is the source of truth the block category pages derive their slug from.
 */
export const BLOCK_KIND_SLUGS: Record<BlockKind, string> = {
  hero: "hero",
  feature: "features",
  pricing: "pricing",
  testimonial: "testimonials",
  cta: "cta",
  faq: "faqs",
  login: "auth",
  header: "header",
  footer: "footer",
  "not-found": "not-found",
  "logo-cloud": "logo-cloud",
  contact: "contact",
  blog: "blog",
  ecommerce: "ecommerce",
  dashboard: "dashboard",
  integrations: "integrations",
  "image-gallery": "image-gallery",
  "app-shell": "app-shell",
};

export const BLOCK_KIND_BY_SLUG: Record<string, BlockKind> = Object.fromEntries(
  Object.entries(BLOCK_KIND_SLUGS).map(([kind, slug]) => [slug, kind]),
) as Record<string, BlockKind>;

/** The category segment an entry's detail page sits under. */
export function entryCategorySlug(entry: RegistryEntryMeta): string {
  if (entry.category === "blocks" && entry.blockKind)
    return BLOCK_KIND_SLUGS[entry.blockKind];
  return entry.category;
}

/** Canonical site path for an entry's detail page (category in the URL). */
export function entryHref(entry: RegistryEntryMeta): string {
  if (entry.category === "templates") return `/templates/${entry.name}`;
  if (entry.category === "blocks")
    return `/blocks/${entryCategorySlug(entry)}/${entry.name}`;
  return `/components/${entry.category}/${entry.name}`;
}

/** Path of an entry's framed `/embed/*` preview (category in the URL). */
export function entryEmbedHref(entry: RegistryEntryMeta): string {
  if (entry.category === "templates") return `/embed/templates/${entry.name}`;
  return `/embed/blocks/${entryCategorySlug(entry)}/${entry.name}`;
}
