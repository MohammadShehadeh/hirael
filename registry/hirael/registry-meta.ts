export type ComponentCategory =
  'inputs' | 'pickers' | 'files' | 'data' | 'display' | 'animation' | 'navigation' | 'blocks' | 'templates';

export type BlockKind =
  | 'hero'
  | 'feature'
  | 'process'
  | 'pricing'
  | 'comparison'
  | 'team'
  | 'stats'
  | 'testimonial'
  | 'cta'
  | 'newsletter'
  | 'faq'
  | 'login'
  | 'header'
  | 'footer'
  | 'not-found'
  | 'logo-cloud'
  | 'contact'
  | 'careers'
  | 'blog'
  | 'ecommerce'
  | 'dashboard'
  | 'integrations'
  | 'image-gallery'
  | 'app-shell'
  | 'cloud'
  | 'saas'
  | 'ai'
  | 'widgets'
  | 'changelog';

export type RegistryFileType =
  | 'registry:ui'
  | 'registry:block'
  | 'registry:component'
  | 'registry:lib'
  | 'registry:hook'
  | 'registry:page'
  | 'registry:file';

/**
 * One source file shipped by a registry item, mirroring the shadcn
 * registry-item `files[]` shape. Co-locating the install target with its
 * source path removes the parallel-array coupling the old
 * `sourceFiles` + `installTargets` pair required.
 */
export interface RegistryFileMeta {
  /** Repo-relative source path, e.g. `registry/hirael/components/multi-select.tsx`. */
  path: string;
  /**
   * Where the file lands in a consumer project. Optional for UI components
   * (auto-derived as `components/ui/<basename>`); required for blocks and
   * templates, whose files install to bespoke paths.
   */
  target?: string;
  /** Registry file type. Defaults to the item's type when omitted. */
  type?: RegistryFileType;
}

/**
 * CSS variables an item ships with (registry-item schema `cssVars`).
 * `light` lands in `:root`, `dark` in `.dark`; the shadcn CLI also maps
 * them into `@theme inline` for Tailwind v4 consumers.
 */
export interface RegistryCssVars {
  theme?: Record<string, string>;
  light?: Record<string, string>;
  dark?: Record<string, string>;
}

export interface RegistryEntryMeta {
  name: string;
  title: string;
  description: string;
  category: ComponentCategory;
  /**
   * Source files the item ships. Shown in the code view as a file hierarchy
   * so users see where each file lands in their project.
   */
  files?: RegistryFileMeta[];
  installSlug?: string;
  registryDependencies?: string[];
  dependencies?: string[];
  blockKind?: BlockKind;
  blockTagline?: string;
  cssVars?: RegistryCssVars;
  /**
   * Short post-install note (registry-item schema `docs`) the shadcn CLI
   * prints after adding the item. Reserve it for items with real setup
   * beyond the auto-installed `dependencies` — most items need none.
   */
  docs?: string;
}

/**
 * The status palette the cloud components rely on (`--success` / `--warning`
 * / `--info`) — the same values Callout ships. Attached via `cssVars` so an
 * item stays self-contained: a consumer installing only a cloud component
 * still gets the status tokens its source references, without needing Callout.
 */
const STATUS_CSS_VARS: RegistryCssVars = {
  light: {
    success: 'oklch(0.527 0.154 150.069)',
    warning: 'oklch(0.555 0.163 48.998)',
    info: 'oklch(0.55 0.2 260)',
  },
  dark: {
    success: 'oklch(0.696 0.17 162.48)',
    warning: 'oklch(0.769 0.188 70.08)',
    info: 'oklch(0.62 0.19 260)',
  },
};

export const REGISTRY: RegistryEntryMeta[] = [
  {
    name: 'multi-select',
    title: 'Multi Select',
    description:
      'Chip-based multi-select with command-palette dropdown, search, select-all and async loader. Compound and single-prop APIs.',
    category: 'inputs',
    files: [{ path: 'components/multi-select.tsx' }],
    registryDependencies: ['popover', 'command', 'badge'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'number-range',
    title: 'Number Range',
    description:
      'Two-thumb slider paired with synced number inputs. Min/max/step, currency or unit formatting, keyboard-first.',
    category: 'inputs',
    files: [{ path: 'components/number-range.tsx' }],
    registryDependencies: ['slider', 'input'],
    dependencies: [],
  },
  {
    name: 'year-picker',
    title: 'Year Picker',
    description: 'Decade-grid year picker with keyboard nav, min/max bounds, single or range mode.',
    category: 'pickers',
    files: [{ path: 'components/year-picker.tsx' }],
    registryDependencies: ['button', 'popover'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'tag-input',
    title: 'Tag Input',
    description: 'Chip input with paste-to-split, dedupe, validation hook, max tags. Compound and single-prop APIs.',
    category: 'inputs',
    files: [{ path: 'components/tag-input.tsx' }],
    registryDependencies: ['badge'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'combobox',
    title: 'Combobox',
    description:
      'Searchable select on Base UI: single or multiple selection, chips, grouped options, an input addon slot and a clear button.',
    category: 'inputs',
    files: [{ path: 'components/combobox.tsx' }],
    registryDependencies: ['input-group'],
    dependencies: ['@base-ui/react', 'lucide-react'],
  },
  {
    name: 'lazy-select',
    title: 'Lazy Select',
    description:
      'Autocomplete single-select that defers loading until open and pages through results on scroll. Debounced server-side search with a pluggable lazy paginator hook.',
    category: 'inputs',
    files: [{ path: 'components/lazy-select.tsx' }],
    registryDependencies: ['popover', 'command'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'password-input',
    title: 'Password Input',
    description: 'Show/hide toggle with an optional pluggable strength meter. Compound and single-prop APIs.',
    category: 'inputs',
    files: [{ path: 'components/password-input.tsx' }],
    registryDependencies: ['input-group'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'currency-input',
    title: 'Currency Input',
    description: 'Locale-aware grouping with currency-symbol prefix and configurable decimal precision.',
    category: 'inputs',
    files: [{ path: 'components/currency-input.tsx' }],
    registryDependencies: ['input-group'],
    dependencies: [],
  },
  {
    name: 'phone-input',
    title: 'Phone Input',
    description: 'Country dial-code dropdown with E.164 output. Compound and single-prop APIs.',
    category: 'inputs',
    files: [{ path: 'components/phone-input.tsx' }],
    registryDependencies: ['input-group', 'popover', 'command'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'file-dropzone',
    title: 'File Dropzone',
    description:
      'Drag-drop + click upload zone with previews, accept and max-size validation. Compound and single-prop APIs.',
    category: 'files',
    files: [{ path: 'components/file-dropzone.tsx' }],
    registryDependencies: ['button'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'stat-card',
    title: 'Stat Card',
    description:
      'Compact metric card with label, value, and an up/down/flat trend chip. Compound and single-prop APIs.',
    category: 'data',
    files: [{ path: 'components/stat-card.tsx' }],
    registryDependencies: [],
    dependencies: ['lucide-react'],
  },
  {
    name: 'rating',
    title: 'Rating',
    description: 'Star rating with hover preview, half-star precision, read-only mode and sm / md / lg sizes.',
    category: 'inputs',
    files: [{ path: 'components/rating.tsx' }],
    registryDependencies: [],
    dependencies: ['lucide-react'],
  },
  {
    name: 'timeline',
    title: 'Timeline',
    description:
      'Vertical event timeline with default or icon dots, tone variants and labelled time / title / description parts.',
    category: 'data',
    files: [{ path: 'components/timeline.tsx' }],
    registryDependencies: [],
    dependencies: ['class-variance-authority'],
  },
  {
    name: 'kbd',
    title: 'Kbd',
    description:
      '3D tactile keycap with hover lift and pressed states. Compound API with KbdGroup for chords and KbdDisplay for inline keys.',
    category: 'display',
    files: [{ path: 'components/kbd.tsx' }],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: 'callout',
    title: 'Callout',
    description:
      'MDX-style admonition with info / success / warning / error / neutral variants and optional icon override. Ships --info / --success / --warning theme tokens.',
    category: 'display',
    files: [{ path: 'components/callout.tsx' }],
    registryDependencies: [],
    dependencies: ['lucide-react', 'class-variance-authority'],
    cssVars: {
      light: {
        success: 'oklch(0.527 0.154 150.069)',
        warning: 'oklch(0.555 0.163 48.998)',
        info: 'oklch(0.55 0.2 260)',
      },
      dark: {
        success: 'oklch(0.696 0.17 162.48)',
        warning: 'oklch(0.769 0.188 70.08)',
        info: 'oklch(0.62 0.19 260)',
      },
    },
  },
  {
    name: 'scroll-progress',
    title: 'Scroll Progress',
    description: 'Fixed reading progress bar. Tracks document scroll by default or a scoped container ref.',
    category: 'display',
    files: [{ path: 'components/scroll-progress.tsx' }],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: 'hero-01',
    title: 'Hero 1',
    description:
      'Full-bleed hero card over an animated light-beam shader, with a glass pill nav, a trust badge, a serif headline, dual CTA and a three-stat footer.',
    blockTagline: 'Beam shader · glass nav · stat footer',
    category: 'blocks',
    blockKind: 'hero',
    files: [
      {
        path: 'blocks/hero-01/hero-01.tsx',
        target: 'components/blocks/hero-01.tsx',
      },
      {
        path: 'blocks/hero-01/hero-01-backdrop.tsx',
        target: 'components/blocks/hero-01-backdrop.tsx',
      },
    ],
    registryDependencies: ['button'],
    dependencies: ['shaders', 'lucide-react'],
  },
  {
    name: 'hero-02',
    title: 'Hero 2',
    description:
      'Centered hero over animated grayscale gradient bars, with a live pill, a serif headline with an underlined accent, dual CTA and a wordmark strip.',
    blockTagline: 'Stripe shader · live pill · wordmark strip',
    category: 'blocks',
    blockKind: 'hero',
    files: [
      {
        path: 'blocks/hero-02/hero-02.tsx',
        target: 'components/blocks/hero-02.tsx',
      },
      {
        path: 'blocks/hero-02/hero-02-backdrop.tsx',
        target: 'components/blocks/hero-02-backdrop.tsx',
      },
    ],
    registryDependencies: ['button'],
    dependencies: ['shaders', 'lucide-react'],
  },
  {
    name: 'hero-03',
    title: 'Hero 3',
    description:
      'Editorial centered hero on a faded grid, with a serif headline, sub-copy, dual CTA and a logo cloud of customer wordmarks.',
    blockTagline: 'Editorial · grid backdrop · logo cloud',
    category: 'blocks',
    blockKind: 'hero',
    files: [
      {
        path: 'blocks/hero-03/hero-03.tsx',
        target: 'components/blocks/hero-03.tsx',
      },
    ],
    registryDependencies: ['button'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'hero-04',
    title: 'Hero 4',
    description:
      'Full-bleed image-banner hero with a dark scrim, a slim nav, a serif headline and dual CTA aligned to the bottom.',
    blockTagline: 'Image banner · scrim · bottom-aligned',
    category: 'blocks',
    blockKind: 'hero',
    files: [
      {
        path: 'blocks/hero-04/hero-04.tsx',
        target: 'components/blocks/hero-04.tsx',
      },
    ],
    registryDependencies: ['button'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'hero-05',
    title: 'Hero 5',
    description:
      'Full-bleed hero card over an animated aurora shader, with a glass pill nav, a glass content panel, a serif headline, dual CTA and an avatar social-proof row.',
    blockTagline: 'Aurora shader · glass panel · social proof',
    category: 'blocks',
    blockKind: 'hero',
    files: [
      {
        path: 'blocks/hero-05/hero-05.tsx',
        target: 'components/blocks/hero-05.tsx',
      },
      {
        path: 'blocks/hero-05/hero-05-backdrop.tsx',
        target: 'components/blocks/hero-05-backdrop.tsx',
      },
    ],
    registryDependencies: ['button'],
    dependencies: ['shaders', 'lucide-react'],
  },
  {
    name: 'feature-01',
    title: 'Feature 1',
    description:
      'Three alternating feature rows, each pairing a stylized Tailwind-only mock UI with a copy column (eyebrow, headline, paragraph, 3-item checklist).',
    blockTagline: 'Alternating rows · mock UIs · checklist',
    category: 'blocks',
    blockKind: 'feature',
    files: [
      {
        path: 'blocks/feature-01/feature-01.tsx',
        target: 'components/blocks/feature-01.tsx',
      },
    ],
    registryDependencies: [],
    dependencies: ['lucide-react'],
  },
  {
    name: 'feature-02',
    title: 'Feature 2',
    description:
      'Section header above a 3-column, 2-row grid of bordered feature cards with lucide icons, headlines and short blurbs.',
    blockTagline: 'Icon grid · 6 cards · concise blurbs',
    category: 'blocks',
    blockKind: 'feature',
    files: [
      {
        path: 'blocks/feature-02/feature-02.tsx',
        target: 'components/blocks/feature-02.tsx',
      },
    ],
    registryDependencies: [],
    dependencies: ['lucide-react'],
  },
  {
    name: 'pricing-01',
    title: 'Pricing 1',
    description:
      'Three-tier card row with a featured middle plan. Each card lists price, blurb, feature checklist and a primary or outline CTA.',
    blockTagline: '3 tiers · featured plan · checklist',
    category: 'blocks',
    blockKind: 'pricing',
    files: [
      {
        path: 'blocks/pricing-01/pricing-01.tsx',
        target: 'components/blocks/pricing-01.tsx',
      },
    ],
    registryDependencies: ['button', 'card', 'separator'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'pricing-02',
    title: 'Pricing 2',
    description:
      'Compare-by-feature pricing table with sticky tier header (tier name, price, CTA) and ~8 feature rows below.',
    blockTagline: 'Comparison table · sticky header · per-tier CTA',
    category: 'blocks',
    blockKind: 'pricing',
    files: [
      {
        path: 'blocks/pricing-02/pricing-02.tsx',
        target: 'components/blocks/pricing-02.tsx',
      },
    ],
    registryDependencies: ['button', 'table'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'pricing-03',
    title: 'Pricing 3',
    description:
      'Three-tier card row with a monthly/yearly billing toggle that tweens the price, a featured plan, per-plan icon, feature checklist and CTA.',
    blockTagline: 'Billing toggle · animated price · featured plan',
    category: 'blocks',
    blockKind: 'pricing',
    files: [
      {
        path: 'blocks/pricing-03/pricing-03.tsx',
        target: 'components/blocks/pricing-03.tsx',
      },
    ],
    registryDependencies: ['animated-number', 'badge', 'button', 'card'],
    dependencies: ['motion', 'lucide-react'],
  },
  {
    name: 'testimonial-01',
    title: 'Testimonial 1',
    description:
      'Centered single quote with stylized open-mark, author block (avatar, name, role, company) and a muted wordmark row below.',
    blockTagline: 'Single quote · author block · wordmark row',
    category: 'blocks',
    blockKind: 'testimonial',
    files: [
      {
        path: 'blocks/testimonial-01/testimonial-01.tsx',
        target: 'components/blocks/testimonial-01.tsx',
      },
    ],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: 'testimonial-02',
    title: 'Testimonial 2',
    description: 'Masonry quote grid (CSS columns) with ~6 bordered quote cards of varying length and author rows.',
    blockTagline: 'Masonry grid · 6 quotes · varied length',
    category: 'blocks',
    blockKind: 'testimonial',
    files: [
      {
        path: 'blocks/testimonial-02/testimonial-02.tsx',
        target: 'components/blocks/testimonial-02.tsx',
      },
    ],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: 'cta-01',
    title: 'CTA 1',
    description:
      'Framed CTA card with corner marks, headline + sub-copy on the left, dual buttons stacked on the right.',
    blockTagline: 'Framed · split layout · corner marks',
    category: 'blocks',
    blockKind: 'cta',
    files: [
      {
        path: 'blocks/cta-01/cta-01.tsx',
        target: 'components/blocks/cta-01.tsx',
      },
    ],
    registryDependencies: ['button'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'cta-02',
    title: 'CTA 2',
    description:
      'Full-bleed centered CTA with framing top/bottom rules, highlight underlay on the key word, and an inline install command.',
    blockTagline: 'Centered · highlight underlay · install command',
    category: 'blocks',
    blockKind: 'cta',
    files: [
      {
        path: 'blocks/cta-02/cta-02.tsx',
        target: 'components/blocks/cta-02.tsx',
      },
    ],
    registryDependencies: ['button'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'cta-03',
    title: 'CTA 3',
    description:
      'Full-bleed CTA card with an animated dithered shader backdrop, a live status pill, a serif headline and a pill action button.',
    blockTagline: 'Centered · dithered backdrop · serif headline',
    category: 'blocks',
    blockKind: 'cta',
    files: [
      {
        path: 'blocks/cta-03/cta-03.tsx',
        target: 'components/blocks/cta-03.tsx',
      },
      {
        path: 'blocks/cta-03/cta-03-backdrop.tsx',
        target: 'components/blocks/cta-03-backdrop.tsx',
      },
    ],
    registryDependencies: ['button'],
    dependencies: ['shaders', 'lucide-react'],
  },
  {
    name: 'faq-01',
    title: 'FAQ 1',
    description: 'Two-column FAQ: sticky heading + contact card on the left, numbered accordion on the right.',
    blockTagline: 'Sticky split · numbered · contact card',
    category: 'blocks',
    blockKind: 'faq',
    files: [
      {
        path: 'blocks/faq-01/faq-01.tsx',
        target: 'components/blocks/faq-01.tsx',
      },
    ],
    registryDependencies: ['button', 'accordion', 'card'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'faq-02',
    title: 'FAQ 2',
    description: 'Centered heading with two-column accordion grid below. Each row tagged with a Qn index.',
    blockTagline: 'Centered · two-column grid · Qn-indexed',
    category: 'blocks',
    blockKind: 'faq',
    files: [
      {
        path: 'blocks/faq-02/faq-02.tsx',
        target: 'components/blocks/faq-02.tsx',
      },
    ],
    registryDependencies: ['accordion'],
    dependencies: [],
  },
  {
    name: 'faq-03',
    title: 'FAQ 3',
    description:
      'Searchable FAQ with category tabs, a live-filtered accordion, an empty state for missed queries and a support CTA strip.',
    blockTagline: 'Search · category tabs · empty state',
    category: 'blocks',
    blockKind: 'faq',
    files: [
      {
        path: 'blocks/faq-03/faq-03.tsx',
        target: 'components/blocks/faq-03.tsx',
      },
    ],
    registryDependencies: ['accordion', 'button', 'empty', 'input-group', 'tabs'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'faq-04',
    title: 'FAQ 4',
    description:
      'Framed single-column FAQ with side rules, a centered display header, five topic groups each pairing a heading with its own accordion, and a support footer line.',
    blockTagline: 'Framed column · topic groups · support line',
    category: 'blocks',
    blockKind: 'faq',
    files: [
      {
        path: 'blocks/faq-04/faq-04.tsx',
        target: 'components/blocks/faq-04.tsx',
      },
    ],
    registryDependencies: ['accordion'],
    dependencies: [],
  },
  {
    name: 'login-01',
    title: 'Login 1',
    description:
      'Centered login card with monogram, email + password (using the password-input component), remember-me, divider and GitHub / Google providers.',
    blockTagline: 'Centered card · providers · password-input',
    category: 'blocks',
    blockKind: 'login',
    files: [
      {
        path: 'blocks/login-01/login-01.tsx',
        target: 'components/blocks/login-01.tsx',
      },
    ],
    registryDependencies: ['button', 'checkbox', 'field', 'input', 'password-input'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'login-02',
    title: 'Login 2',
    description:
      'Two-pane login: form on the left, dark testimonial panel with quote and metrics on the right. Uses the strength-meter variant of password-input.',
    blockTagline: 'Split · testimonial pane · strength meter',
    category: 'blocks',
    blockKind: 'login',
    files: [
      {
        path: 'blocks/login-02/login-02.tsx',
        target: 'components/blocks/login-02.tsx',
      },
    ],
    registryDependencies: ['button', 'field', 'input', 'password-input'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'signup-01',
    title: 'Signup 1',
    description:
      'Centered signup card with monogram, name + email, strength-meter password-input, terms checkbox, divider and GitHub / Google providers. Validates inline on submit.',
    blockTagline: 'Centered card · strength meter · providers',
    category: 'blocks',
    blockKind: 'login',
    files: [
      {
        path: 'blocks/signup-01/signup-01.tsx',
        target: 'components/blocks/signup-01.tsx',
      },
    ],
    registryDependencies: ['button', 'checkbox', 'field', 'input', 'password-input'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'forgot-password-01',
    title: 'Forgot Password 1',
    description:
      'Centered reset-request card: email with inline validation and a pending submit, swapping to a check-your-inbox state that echoes the address with resend and back-to-sign-in links.',
    blockTagline: 'Centered card · inbox state · resend link',
    category: 'blocks',
    blockKind: 'login',
    files: [
      {
        path: 'blocks/forgot-password-01/forgot-password-01.tsx',
        target: 'components/blocks/forgot-password-01.tsx',
      },
    ],
    registryDependencies: ['button', 'field', 'input'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'otp-verify-01',
    title: 'OTP Verify 1',
    description:
      'Centered verification card with a six-box code input built in the block: auto-advance, backspace, paste distribution and arrow-key focus, plus a 30s resend countdown and a pending → success verify flow.',
    blockTagline: 'Six-box code · 30s resend · success state',
    category: 'blocks',
    blockKind: 'login',
    files: [
      {
        path: 'blocks/otp-verify-01/otp-verify-01.tsx',
        target: 'components/blocks/otp-verify-01.tsx',
      },
    ],
    registryDependencies: ['button', 'field', 'input'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'header-01',
    title: 'Header 1',
    description:
      'Sticky top nav with brand monogram, centered anchor links, dual auth CTAs and a slide-down mobile menu.',
    blockTagline: 'Sticky · backdrop blur · mobile menu',
    category: 'blocks',
    blockKind: 'header',
    files: [
      {
        path: 'blocks/header-01/header-01.tsx',
        target: 'components/blocks/header-01.tsx',
      },
    ],
    registryDependencies: ['button', 'dropdown-menu', 'drawer'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'header-02',
    title: 'Header 2',
    description:
      'Floating nav that runs full width at the top of the page and shrinks into a blurred pill once you scroll past 100px, with a spring-animated width change. Links share a sliding hover highlight; on mobile a toggle opens an animated dropdown menu. Ships composable parts and a scroll-container prop for embedded layouts.',
    blockTagline: 'Shrinks on scroll · sliding hover pill · mobile dropdown',
    category: 'blocks',
    blockKind: 'header',
    files: [
      {
        path: 'blocks/header-02/header-02.tsx',
        target: 'components/blocks/header-02.tsx',
      },
    ],
    registryDependencies: ['button'],
    dependencies: ['lucide-react', 'motion'],
  },
  {
    name: 'footer-01',
    title: 'Footer 1',
    description:
      'Brand + tagline column alongside Product / Company / Resources link columns, with a copyright row and social icons below a thin rule.',
    blockTagline: '4 columns · social row · copyright',
    category: 'blocks',
    blockKind: 'footer',
    files: [
      {
        path: 'blocks/footer-01/footer-01.tsx',
        target: 'components/blocks/footer-01.tsx',
      },
    ],
    registryDependencies: [],
    dependencies: ['lucide-react'],
  },
  {
    name: 'not-found-01',
    title: 'Not Found 1',
    description:
      "Centered 404 with mono eyebrow, display headline, paired CTAs and a 'try one of these' suggested-routes list.",
    blockTagline: 'Centered · paired CTAs · route suggestions',
    category: 'blocks',
    blockKind: 'not-found',
    files: [
      {
        path: 'blocks/not-found-01/not-found-01.tsx',
        target: 'components/blocks/not-found-01.tsx',
      },
    ],
    registryDependencies: ['button'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'month-picker',
    title: 'Month Picker',
    description: '4×3 month grid with year stepper, keyboard nav, min/max bounds, single or range mode.',
    category: 'pickers',
    files: [{ path: 'components/month-picker.tsx' }],
    registryDependencies: ['button', 'popover'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'time-picker',
    title: 'Time Picker',
    description: 'Hour, minute and optional second scroll columns with 12/24h modes, step intervals and keyboard nav.',
    category: 'pickers',
    files: [{ path: 'components/time-picker.tsx' }],
    registryDependencies: ['button', 'popover', 'tabs'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'color-picker',
    title: 'Color Picker',
    description:
      'SV gradient + hue slider with HEX / RGB / HSL tabs, eyedropper (where supported) and recent swatches.',
    category: 'pickers',
    files: [{ path: 'components/color-picker.tsx' }],
    registryDependencies: ['button', 'input', 'popover', 'tabs'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'avatar-stack',
    title: 'Avatar Stack',
    description:
      'Overlapping avatar group with size (sm/md/lg) and spacing (tight/normal/loose) variants, image or fallback support, numeric overflow chip, and asChild on items/overflow so each avatar can render as a link or button.',
    category: 'data',
    files: [{ path: 'components/avatar-stack.tsx' }],
    registryDependencies: [],
    dependencies: ['@radix-ui/react-slot', 'class-variance-authority'],
  },
  {
    name: 'announcement-bar',
    title: 'Announcement Bar',
    description:
      'Top-of-page banner with default / primary / muted tones, optional dismiss button and localStorage persistence.',
    category: 'display',
    files: [{ path: 'components/announcement-bar.tsx' }],
    registryDependencies: ['button'],
    dependencies: ['lucide-react', 'class-variance-authority'],
  },
  {
    name: 'logo-cloud-01',
    title: 'Logo Cloud 1',
    description:
      'Centered eyebrow + headline above a 5-column bordered wordmark grid, with stat strip and case-study link below.',
    blockTagline: 'Bordered grid · 10 wordmarks · stat strip',
    category: 'blocks',
    blockKind: 'logo-cloud',
    files: [
      {
        path: 'blocks/logo-cloud-01/logo-cloud-01.tsx',
        target: 'components/blocks/logo-cloud-01.tsx',
      },
    ],
    registryDependencies: ['badge', 'button'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'contact-01',
    title: 'Contact 1',
    description:
      'Production contact form with controlled state, inline validation, character counter, topic select, consent checkbox and a pending/sent state machine. Channel list and remote-location card alongside.',
    blockTagline: 'Validated form · pending · sent state',
    category: 'blocks',
    blockKind: 'contact',
    files: [
      {
        path: 'blocks/contact-01/contact-01.tsx',
        target: 'components/blocks/contact-01.tsx',
      },
    ],
    registryDependencies: ['badge', 'button', 'card', 'checkbox', 'field', 'input', 'select', 'separator', 'textarea'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'blog-01',
    title: 'Blog 1',
    description:
      'Editorial blog index with a featured post on top and a 4-column grid of post cards underneath. Built on Card and Badge.',
    blockTagline: 'Featured post · 4-up Card grid',
    category: 'blocks',
    blockKind: 'blog',
    files: [
      {
        path: 'blocks/blog-01/blog-01.tsx',
        target: 'components/blocks/blog-01.tsx',
      },
    ],
    registryDependencies: ['badge', 'button', 'card', 'separator'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'ecommerce-01',
    title: 'E-commerce 1',
    description:
      'Product grid with category filter pills, sale and new badges, wishlist toggles, star ratings, compare-at pricing and per-card add buttons.',
    blockTagline: 'Product grid · filter pills · wishlist',
    category: 'blocks',
    blockKind: 'ecommerce',
    files: [
      {
        path: 'blocks/ecommerce-01/ecommerce-01.tsx',
        target: 'components/blocks/ecommerce-01.tsx',
      },
    ],
    registryDependencies: ['badge', 'button', 'rating'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'ecommerce-02',
    title: 'E-commerce 2',
    description:
      'Shopping cart with quantity steppers, removable line items, promo-code validation, a free-shipping threshold, live totals and an empty-cart state.',
    blockTagline: 'Cart rows · promo code · live totals',
    category: 'blocks',
    blockKind: 'ecommerce',
    files: [
      {
        path: 'blocks/ecommerce-02/ecommerce-02.tsx',
        target: 'components/blocks/ecommerce-02.tsx',
      },
    ],
    registryDependencies: ['button', 'card', 'empty', 'input-group', 'separator'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'dashboard-01',
    title: 'Dashboard 1',
    description:
      'Operations dashboard with a Tabs date-range switcher (1d / 7d / 30d / 90d), a 4-up metric strip, a weekly bar chart and a recent-activity feed. Every metric declares which direction is good news, so falling churn reads green; each chart bucket is a focusable control, so the numbers reach the keyboard as well as the mouse.',
    blockTagline: 'Tabs range · intent-aware deltas · keyboard chart',
    category: 'blocks',
    blockKind: 'dashboard',
    files: [
      {
        path: 'blocks/dashboard-01/dashboard-01.tsx',
        target: 'components/blocks/dashboard-01.tsx',
      },
    ],
    registryDependencies: ['avatar', 'badge', 'button', 'card', 'separator', 'tabs', 'tooltip'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'dashboard-02',
    title: 'Dashboard 2',
    description:
      'Analytics dashboard with a date-range select, four sparkline KPI tiles, a layered two-series area chart and top-pages and channel-share side cards. Deltas carry their own unit (percent vs percentage points) and the direction that counts as good, and the area chart ships a screen-reader data table of the same numbers.',
    blockTagline: 'Area chart · sparkline KPIs · sr data table',
    category: 'blocks',
    blockKind: 'dashboard',
    files: [
      {
        path: 'blocks/dashboard-02/dashboard-02.tsx',
        target: 'components/blocks/dashboard-02.tsx',
      },
    ],
    registryDependencies: ['badge', 'button', 'card', 'select', 'separator'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'dashboard-03',
    title: 'Dashboard 3',
    description:
      'Revenue dashboard with a month stepper, a plan-mix donut and legend, an invoice status list and a paginated transactions list. Amounts are numbers formatted through Intl, and every colour comes from a lookup keyed by plan or status, so no Tailwind class is stored in the data.',
    blockTagline: 'Donut plan mix · real pagination · month stepper',
    category: 'blocks',
    blockKind: 'dashboard',
    files: [
      {
        path: 'blocks/dashboard-03/dashboard-03.tsx',
        target: 'components/blocks/dashboard-03.tsx',
      },
    ],
    registryDependencies: ['badge', 'button', 'card', 'separator'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'dashboard-04',
    title: 'Dashboard 4',
    description:
      'Commerce operations dashboard in a card-in-card style: four inset stat tiles, a Today band pairing an hourly two-series revenue chart with ad-budget and peak-hours cards, and a week-in-review band driven by a range select. The budget bar is a real progressbar, both charts ship a screen-reader data table, and each panel only shows an action when it has one.',
    blockTagline: 'Inset stat tiles · progressbar budget · sr tables',
    category: 'blocks',
    blockKind: 'dashboard',
    files: [
      {
        path: 'blocks/dashboard-04/dashboard-04.tsx',
        target: 'components/blocks/dashboard-04.tsx',
      },
    ],
    registryDependencies: ['badge', 'button', 'card', 'select'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'dashboard-05',
    title: 'Dashboard 5',
    description:
      'Observability dashboard composed as one bordered lattice: greeting strip with range select, four sparkline KPI cells, cache and duration chart cells, an AI-insight callout, a P50/P95/P99 latency distribution measured against a stated target, and an active-deployments list. The deployment taking traffic gets --accent-cool, the reserved live tone, and its pulse respects prefers-reduced-motion.',
    blockTagline: 'Bordered lattice · live accent · latency targets',
    category: 'blocks',
    blockKind: 'dashboard',
    files: [
      {
        path: 'blocks/dashboard-05/dashboard-05.tsx',
        target: 'components/blocks/dashboard-05.tsx',
      },
    ],
    registryDependencies: ['badge', 'button', 'select'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'integrations-01',
    title: 'Integrations 1',
    description:
      'Two-column integrations section with copy and feature list on the left, orbit diagram (central hub + 7 logo spokes connected by dashed rays) on the right.',
    blockTagline: 'Hub & spoke · 7 spokes · orbit ring',
    category: 'blocks',
    blockKind: 'integrations',
    files: [
      {
        path: 'blocks/integrations-01/integrations-01.tsx',
        target: 'components/blocks/integrations-01.tsx',
      },
    ],
    registryDependencies: ['badge', 'button', 'card'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'image-gallery-01',
    title: 'Image Gallery 1',
    description:
      'Studio-style masonry gallery with Tabs-driven category filter, real photo tiles via next/image, varied aspect ratios, hover zoom + arrow chip and an Empty fallback for empty filters.',
    blockTagline: 'Tabs filter · masonry · empty state',
    category: 'blocks',
    blockKind: 'image-gallery',
    files: [
      {
        path: 'blocks/image-gallery-01/image-gallery-01.tsx',
        target: 'components/blocks/image-gallery-01.tsx',
      },
    ],
    registryDependencies: ['badge', 'button', 'empty', 'tabs'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'app-shell-01',
    title: 'App Shell 1',
    description:
      'Drop-in admin shell built on the shadcn Sidebar primitive: collapsible icon rail with nav badges and an account menu in the footer, sticky topbar with breadcrumb and a ⌘K search that really focuses, plus an accounts table that filters live and sorts by any column with aria-sort.',
    blockTagline: 'Collapsible Sidebar · ⌘K search · sortable table',
    category: 'blocks',
    blockKind: 'app-shell',
    files: [
      {
        path: 'blocks/app-shell-01/app-shell-01.tsx',
        target: 'components/blocks/app-shell-01.tsx',
      },
    ],
    registryDependencies: [
      'badge',
      'button',
      'card',
      'dropdown-menu',
      'empty',
      'input-group',
      'kbd',
      'separator',
      'sidebar',
      'table',
    ],
    dependencies: ['lucide-react'],
  },
  {
    name: 'app-shell-02',
    title: 'App Shell 2',
    description:
      'Sidebar-free admin shell with a sticky top bar over a working settings screen: vertical tabs with roving keyboard focus, a header search that filters every section and counts matches per tab, and rows that actually do their thing — inline edit, copy to clipboard, or a switch — with a live save status.',
    blockTagline: 'Top nav · vertical tabs · settings that save',
    category: 'blocks',
    blockKind: 'app-shell',
    files: [
      {
        path: 'blocks/app-shell-02/app-shell-02.tsx',
        target: 'components/blocks/app-shell-02.tsx',
      },
    ],
    registryDependencies: [
      'badge',
      'button',
      'card',
      'copy-button',
      'dropdown-menu',
      'empty',
      'inline-edit',
      'input-group',
      'separator',
      'switch',
      'tabs',
    ],
    dependencies: ['lucide-react'],
  },
  {
    name: 'app-shell-03',
    title: 'App Shell 3',
    description:
      'Split-pane inbox shell: icon rail with unread indicator, a searchable conversation listbox you can walk with the arrow keys, and a reading pane where star, archive and delete all work, with undo. Collapses to one pane on phones with a back button, and the composer sends on ⌘+Enter so Enter still makes a new line.',
    blockTagline: 'Icon rail · arrow-key inbox · reading pane',
    category: 'blocks',
    blockKind: 'app-shell',
    files: [
      {
        path: 'blocks/app-shell-03/app-shell-03.tsx',
        target: 'components/blocks/app-shell-03.tsx',
      },
    ],
    registryDependencies: ['badge', 'button', 'empty', 'input-group', 'separator', 'tabs', 'textarea', 'tooltip'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'app-shell-04',
    title: 'App Shell 4',
    description:
      'Starter shell on the shadcn Sidebar primitive (inset variant): a workspace switcher that switches, a ⌘K field that filters the nav, icon-collapsible items with tooltips, an inset header with an account menu and notification count, and a welcome heading over dashed placeholder slots.',
    blockTagline: 'Inset Sidebar · ⌘K nav filter · slot grid',
    category: 'blocks',
    blockKind: 'app-shell',
    files: [
      {
        path: 'blocks/app-shell-04/app-shell-04.tsx',
        target: 'components/blocks/app-shell-04.tsx',
      },
    ],
    registryDependencies: ['badge', 'button', 'dropdown-menu', 'input-group', 'kbd', 'separator', 'sidebar'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'spinner',
    title: 'Spinner',
    description:
      'Loading indicator with circle, dots and bars variants, sm / md / lg sizes. Inherits the current text color and ships an accessible status label.',
    category: 'display',
    files: [{ path: 'components/spinner.tsx' }],
    registryDependencies: [],
    dependencies: ['class-variance-authority'],
  },
  {
    name: 'copy-button',
    title: 'Copy Button',
    description:
      'Click-to-copy button with copied feedback, icon-only or labelled, ghost / outline variants and a non-secure-context clipboard fallback.',
    category: 'display',
    files: [{ path: 'components/copy-button.tsx' }],
    registryDependencies: ['button'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'icon-stack',
    title: 'Icon Stack',
    description:
      'Isometric stack of plates with an icon skewed onto the front face, for feature headers and empty states. Layer count is a prop, and the plates take their color from the surrounding text.',
    category: 'display',
    files: [{ path: 'components/icon-stack.tsx' }],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: 'marquee',
    title: 'Marquee',
    description:
      'Infinite scrolling row or column for logos and testimonials, with pause-on-hover, reverse and vertical modes. Keyframes ship inline, zero config.',
    category: 'display',
    files: [{ path: 'components/marquee.tsx' }],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: 'tree-view',
    title: 'Tree View',
    description:
      'Collapsible nested tree for file explorers and hierarchical data, with auto folder/file icons, depth indentation, selection and keyboard focus.',
    category: 'data',
    files: [{ path: 'components/tree-view.tsx' }],
    registryDependencies: ['collapsible'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'animated-number',
    title: 'Animated Number',
    description:
      'Count-up number that tweens to its target with easing, Intl formatting (currency, compact, percent), prefix/suffix and reduced-motion support.',
    category: 'data',
    files: [{ path: 'components/animated-number.tsx' }],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: 'stepper',
    title: 'Stepper',
    description:
      'Multi-step progress indicator with horizontal and vertical orientation, completed / active / inactive states, clickable steps and a compound API.',
    category: 'navigation',
    files: [{ path: 'components/stepper.tsx' }],
    registryDependencies: [],
    dependencies: ['lucide-react'],
  },
  {
    name: 'sortable',
    title: 'Sortable',
    description:
      'Drag-to-reorder list with pointer and keyboard sorting, handle or whole-item dragging, and live-region announcements. No dnd-kit.',
    category: 'data',
    files: [{ path: 'components/sortable.tsx' }],
    registryDependencies: [],
    dependencies: ['lucide-react'],
  },
  {
    name: 'date-picker',
    title: 'Date Picker',
    description:
      'Single-date picker with month grid, keyboard nav, min/max bounds and disabled dates. Includes an inline DateCalendar, no date library.',
    category: 'pickers',
    files: [{ path: 'components/date-picker.tsx' }],
    registryDependencies: ['button', 'popover', 'calendar-utils'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'date-range-picker',
    title: 'Date Range Picker',
    description:
      'Dual-month range picker with hover preview, presets, min/max bounds and keyboard nav. Includes an inline DateRangeCalendar, no date library.',
    category: 'pickers',
    files: [{ path: 'components/date-range-picker.tsx' }],
    registryDependencies: ['button', 'popover', 'separator', 'calendar-utils'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'mention-input',
    title: 'Mention Input',
    description:
      '@-mention textarea with caret-anchored autocomplete, highlighted mention chips, async search and multiple trigger characters.',
    category: 'inputs',
    files: [{ path: 'components/mention-input.tsx' }],
    registryDependencies: ['spinner'],
    dependencies: [],
  },
  {
    name: 'rich-text-editor',
    title: 'Rich Text Editor',
    description:
      'Tiptap editor with a formatting toolbar (headings, lists, links, highlight, alignment) and a hover bubble to edit or unlink links inline. Outputs HTML, controlled or uncontrolled, with composable parts.',
    category: 'inputs',
    files: [{ path: 'components/rich-text-editor.tsx' }],
    registryDependencies: ['button', 'input', 'popover', 'separator', 'skeleton', 'toggle', 'tooltip'],
    dependencies: [
      '@tiptap/react',
      '@tiptap/pm',
      '@tiptap/core',
      '@tiptap/starter-kit',
      '@tiptap/extension-text-align',
      '@tiptap/extension-highlight',
      '@tiptap/extension-placeholder',
      'lucide-react',
    ],
    docs: "Pulls in Tiptap's editor engine (seven @tiptap/* packages), so expect a heavier bundle than the other input components.",
  },
  {
    name: 'inline-edit',
    title: 'Inline Edit',
    description:
      'Click-to-edit text with preview, validation, async submit and confirm/cancel controls. Input and textarea modes.',
    category: 'inputs',
    files: [{ path: 'components/inline-edit.tsx' }],
    registryDependencies: ['button', 'input', 'spinner', 'textarea'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'signature-pad',
    title: 'Signature Pad',
    description:
      'Canvas signature capture with velocity-based ink, per-stroke undo, theme-aware re-inking and PNG/JPEG export via ref.',
    category: 'inputs',
    files: [{ path: 'components/signature-pad.tsx' }],
    registryDependencies: ['button'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'image-cropper',
    title: 'Image Cropper',
    description:
      'Pan-and-zoom image cropper with rect or round mask, fixed aspect frame, pinch / wheel / keyboard control and canvas export via ref.',
    category: 'files',
    files: [{ path: 'components/image-cropper.tsx' }],
    registryDependencies: ['slider'],
    dependencies: [],
  },
  {
    name: 'image-compare',
    title: 'Image Compare',
    description:
      'Before/after comparison slider with a draggable, keyboard-accessible divider, horizontal or vertical orientation and hover-follow mode.',
    category: 'display',
    files: [{ path: 'components/image-compare.tsx' }],
    registryDependencies: [],
    dependencies: ['lucide-react'],
  },
  {
    name: 'lightbox',
    title: 'Lightbox',
    description:
      'Fullscreen image lightbox on Radix Dialog with gallery navigation, zoom and pan, swipe gestures, captions and a thumbnail strip.',
    category: 'display',
    files: [{ path: 'components/lightbox.tsx' }],
    registryDependencies: [],
    dependencies: ['@radix-ui/react-dialog', 'lucide-react'],
  },
  {
    name: 'countdown-timer',
    title: 'Countdown Timer',
    description:
      'Count-down-to-date timer with boxed / inline / minimal variants, a useCountdown hook, digit animation and completion content.',
    category: 'data',
    files: [{ path: 'components/countdown-timer.tsx' }],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: 'qr-code',
    title: 'QR Code',
    description:
      'Dependency-free QR code generator rendering crisp SVG, with L/M/Q/H error correction, quiet-zone control and currentColor theming.',
    category: 'display',
    files: [{ path: 'components/qr-code.tsx' }],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: 'calendar-heatmap',
    title: 'Calendar Heatmap',
    description:
      'GitHub-style contribution heatmap with month and weekday labels, tooltips, configurable intensity scale and a legend.',
    category: 'data',
    files: [{ path: 'components/calendar-heatmap.tsx' }],
    registryDependencies: ['tooltip'],
    dependencies: [],
  },
  {
    name: 'code-block',
    title: 'Code Block',
    description:
      'Code display with built-in dependency-free syntax highlighting via theme tokens, line numbers, line highlights, diff gutters, copy button and collapsible max-height.',
    category: 'display',
    files: [{ path: 'components/code-block.tsx' }],
    registryDependencies: ['badge', 'button', 'copy-button'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'masonry',
    title: 'Masonry',
    description:
      'True masonry layout that balances children into the shortest column by measured height, order-preserving, responsive, dependency-free.',
    category: 'display',
    files: [{ path: 'components/masonry.tsx' }],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: 'audio-player',
    title: 'Audio Player',
    description:
      'Composable audio player with play/pause, scrub-safe seek with buffered tint, skip, time readouts, volume and playback rate.',
    category: 'display',
    files: [{ path: 'components/audio-player.tsx' }],
    registryDependencies: ['button', 'slider'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'media-input',
    title: 'Media Input',
    description:
      'Local media file picker that previews via an object URL; empty-state prompt, replace and clear, size validation. Nothing leaves the browser.',
    category: 'files',
    files: [{ path: 'components/media-input.tsx' }],
    registryDependencies: ['button'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'tour',
    title: 'Tour',
    description:
      'Onboarding spotlight that dims the page around a target element and walks users through steps with a positioned coach-mark card.',
    category: 'navigation',
    files: [{ path: 'components/tour.tsx' }],
    registryDependencies: ['button'],
    dependencies: [],
  },
  {
    name: 'activity-feed',
    title: 'Activity Feed',
    description:
      'Avatar-led event feed with a connecting rail, actor and action lines, timestamps, quoted bodies and date dividers. Ships composable parts.',
    blockTagline: 'Event feed · rail · timestamps',
    category: 'blocks',
    blockKind: 'widgets',
    files: [
      {
        path: 'blocks/activity-feed/activity-feed.tsx',
        target: 'components/blocks/activity-feed.tsx',
      },
    ],
    registryDependencies: [],
    dependencies: ['lucide-react'],
  },
  {
    name: 'audit-log',
    title: 'Audit Log',
    description:
      'Compliance-style event log with expandable rows that reveal actor, action, status and request metadata. Composable disclosure parts.',
    blockTagline: 'Event log · expandable rows',
    category: 'blocks',
    blockKind: 'saas',
    files: [
      {
        path: 'blocks/audit-log/audit-log.tsx',
        target: 'components/blocks/audit-log.tsx',
      },
    ],
    registryDependencies: ['collapsible'],
    dependencies: ['lucide-react', 'class-variance-authority'],
  },
  {
    name: 'blur-reveal',
    title: 'Blur Reveal',
    description:
      'Reveals content with a blur, fade and lift as it scrolls into view. Configurable delay, duration and threshold; respects reduced-motion.',
    category: 'animation',
    files: [{ path: 'components/blur-reveal.tsx' }],
    registryDependencies: [],
    dependencies: ['motion'],
  },
  {
    name: 'text-reveal',
    title: 'Text Reveal',
    description:
      'Staggered text entrance that masks and slides each word, character or line into place on scroll. Respects reduced-motion.',
    category: 'animation',
    files: [{ path: 'components/text-reveal.tsx' }],
    registryDependencies: [],
    dependencies: ['motion'],
  },
  {
    name: 'scroll-reveal',
    title: 'Scroll Reveal',
    description:
      'Fades and slides content in from any direction as it enters the viewport. Configurable distance, delay and replay; respects reduced-motion.',
    category: 'animation',
    files: [{ path: 'components/scroll-reveal.tsx' }],
    registryDependencies: [],
    dependencies: ['motion'],
  },
  {
    name: 'spotlight-card',
    title: 'Spotlight Card',
    description:
      'Card surface with a soft spotlight that tracks the cursor and fades in on hover. Built on design tokens, no hard-coded colors.',
    category: 'animation',
    files: [{ path: 'components/spotlight-card.tsx' }],
    registryDependencies: [],
    dependencies: ['motion'],
  },
  {
    name: 'magnetic-button',
    title: 'Magnetic Button',
    description:
      'Button that pulls toward the cursor and springs back on leave. Adjustable strength, asChild to wrap a link, respects reduced-motion.',
    category: 'animation',
    files: [{ path: 'components/magnetic-button.tsx' }],
    registryDependencies: [],
    dependencies: ['@radix-ui/react-slot', 'motion'],
  },
  {
    name: 'cursor-glow',
    title: 'Cursor Glow',
    description:
      'Ambient glow layer that follows the pointer across its container and fades when it leaves. Drop it behind heroes, grids or feature panels.',
    category: 'animation',
    files: [{ path: 'components/cursor-glow.tsx' }],
    registryDependencies: [],
    dependencies: ['motion'],
  },
  {
    name: 'sparkles',
    title: 'Sparkles',
    description:
      'Canvas particle field that drifts and twinkles behind any container. Density scales with size, colors resolve from tokens, and it pauses offscreen and under reduced-motion. No dependencies.',
    category: 'animation',
    files: [{ path: 'components/sparkles.tsx' }],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: 'tilt-card',
    title: 'Tilt Card',
    description:
      '3D pointer tilt with optional cursor-following glare and configurable max angle, scale and perspective. Respects reduced-motion.',
    category: 'animation',
    files: [{ path: 'components/tilt-card.tsx' }],
    registryDependencies: [],
    dependencies: ['motion'],
  },
  {
    name: 'morphing-dialog',
    title: 'Morphing Dialog',
    description:
      'A trigger card that morphs into a centered dialog via shared-layout animation, with focus trapping, scroll lock, Esc to close and reduced-motion support.',
    category: 'animation',
    files: [{ path: 'components/morphing-dialog.tsx' }],
    registryDependencies: ['button'],
    dependencies: ['lucide-react', 'motion'],
  },
  {
    name: 'dock',
    title: 'Dock',
    description:
      'macOS-style dock with cursor magnification: icons scale and spring as the pointer passes, with hover and focus labels. Built on motion.',
    category: 'navigation',
    files: [{ path: 'components/dock.tsx' }],
    registryDependencies: [],
    dependencies: ['motion'],
  },
  {
    name: 'floating-action-button',
    title: 'Floating Action Button',
    description:
      'Expanding speed-dial FAB: a primary trigger that rotates open to stagger a stack of secondary actions on any side. Compound API.',
    category: 'navigation',
    files: [{ path: 'components/floating-action-button.tsx' }],
    registryDependencies: [],
    dependencies: ['motion'],
  },
  {
    name: 'floating-toolbar',
    title: 'Floating Toolbar',
    description:
      'Floating pill toolbar for text selection and canvas actions, with toggle buttons, separators and labels. Position it anywhere.',
    category: 'navigation',
    files: [{ path: 'components/floating-toolbar.tsx' }],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: 'split-view',
    title: 'Split View',
    description:
      'Two-pane master/detail layout with a draggable divider, keyboard resize, min/max bounds and horizontal or vertical orientation. RTL-aware.',
    category: 'navigation',
    files: [{ path: 'components/split-view.tsx' }],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: 'resizable-panels',
    title: 'Resizable Panels',
    description:
      'Composable resizable panel groups with draggable, keyboard-accessible handles, per-panel minimums and nestable horizontal or vertical groups. RTL-aware.',
    category: 'navigation',
    files: [{ path: 'components/resizable-panels.tsx' }],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: 'inspector-panel',
    title: 'Inspector Panel',
    description:
      'Design-tool inspector with a header, collapsible sections and label/control rows. Composable parts for property panels and sidebars.',
    blockTagline: 'Property panel · sections · rows',
    category: 'blocks',
    blockKind: 'widgets',
    files: [
      {
        path: 'blocks/inspector-panel/inspector-panel.tsx',
        target: 'components/blocks/inspector-panel.tsx',
      },
    ],
    registryDependencies: ['collapsible'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'tenant-switcher',
    title: 'Tenant Switcher',
    description:
      'Workspace, organization or project switcher for multi-tenant apps. Logo or initials, plan or role caption, grouped and searchable list, and a create action. Ships composable parts.',
    blockTagline: 'Workspace switcher · grouped · search',
    category: 'blocks',
    blockKind: 'widgets',
    files: [
      {
        path: 'blocks/tenant-switcher/tenant-switcher.tsx',
        target: 'components/blocks/tenant-switcher.tsx',
      },
    ],
    registryDependencies: ['button', 'command', 'popover'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'kpi-grid',
    title: 'KPI Grid',
    description:
      'Hairline-joined grid of KPI tiles with label, value, an up/down/flat delta chip and a dependency-free sparkline. Ships composable parts.',
    blockTagline: 'KPI tiles · delta · sparkline',
    category: 'blocks',
    blockKind: 'widgets',
    files: [
      {
        path: 'blocks/kpi-grid/kpi-grid.tsx',
        target: 'components/blocks/kpi-grid.tsx',
      },
    ],
    registryDependencies: [],
    dependencies: ['lucide-react'],
  },
  {
    name: 'quick-actions',
    title: 'Quick Actions',
    description:
      'Grid of dashboard shortcut tiles with icon, label and description. Each tile is a button or, via asChild, a link. Ships composable parts.',
    blockTagline: 'Shortcut tiles · icon · label',
    category: 'blocks',
    blockKind: 'widgets',
    files: [
      {
        path: 'blocks/quick-actions/quick-actions.tsx',
        target: 'components/blocks/quick-actions.tsx',
      },
    ],
    registryDependencies: [],
    dependencies: ['@radix-ui/react-slot', 'lucide-react'],
  },
  {
    name: 'notifications',
    title: 'Notifications',
    description:
      'Notification panel with header, list, per-item media, title, description, time and an accent-cool unread marker. Ships composable parts.',
    blockTagline: 'Notification panel · unread marker',
    category: 'blocks',
    blockKind: 'widgets',
    files: [
      {
        path: 'blocks/notifications/notifications.tsx',
        target: 'components/blocks/notifications.tsx',
      },
    ],
    registryDependencies: ['button'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'billing-card',
    title: 'Billing Card',
    description:
      'Current-plan summary with price, a usage meter, billing detail rows and footer actions. Composable parts for billing settings.',
    blockTagline: 'Plan summary · meter · actions',
    category: 'blocks',
    blockKind: 'saas',
    files: [
      {
        path: 'blocks/billing-card/billing-card.tsx',
        target: 'components/blocks/billing-card.tsx',
      },
    ],
    registryDependencies: ['button'],
    dependencies: [],
  },
  {
    name: 'subscription-plans',
    title: 'Subscription Plans',
    description:
      'In-app plan selector with featured and current states, a badge, feature checklist and per-plan action. Ships composable parts.',
    blockTagline: 'Plan selector · featured · current',
    category: 'blocks',
    blockKind: 'saas',
    files: [
      {
        path: 'blocks/subscription-plans/subscription-plans.tsx',
        target: 'components/blocks/subscription-plans.tsx',
      },
    ],
    registryDependencies: ['badge', 'button'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'api-keys',
    title: 'API Keys',
    description:
      'API key manager with reveal/hide, copy-to-clipboard, key metadata and a create action. Ships composable parts.',
    blockTagline: 'Key manager · reveal · copy',
    category: 'blocks',
    blockKind: 'saas',
    files: [
      {
        path: 'blocks/api-keys/api-keys.tsx',
        target: 'components/blocks/api-keys.tsx',
      },
    ],
    registryDependencies: ['button'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'usage-dashboard',
    title: 'Usage Dashboard',
    description:
      'Metered usage panel with per-resource progress bars that tint amber near the limit and red over it. Ships composable parts.',
    blockTagline: 'Metered usage · limit tints',
    category: 'blocks',
    blockKind: 'saas',
    files: [
      {
        path: 'blocks/usage-dashboard/usage-dashboard.tsx',
        target: 'components/blocks/usage-dashboard.tsx',
      },
    ],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: 'creative-studio',
    title: 'Creative Studio',
    description:
      'Dark, cinematic creative-studio landing page: a full-viewport hero with an animated backdrop and pull-up wordmark, a scroll-revealed about section, and a staggered feature-card grid. Framer Motion throughout, with a self-contained warm-cream palette.',
    category: 'templates',
    files: [
      {
        path: 'templates/creative-studio/creative-studio.tsx',
        target: 'components/templates/creative-studio/creative-studio.tsx',
      },
      {
        path: 'templates/creative-studio/hero.tsx',
        target: 'components/templates/creative-studio/hero.tsx',
      },
      {
        path: 'templates/creative-studio/about.tsx',
        target: 'components/templates/creative-studio/about.tsx',
      },
      {
        path: 'templates/creative-studio/features.tsx',
        target: 'components/templates/creative-studio/features.tsx',
      },
      {
        path: 'templates/creative-studio/footer.tsx',
        target: 'components/templates/creative-studio/footer.tsx',
      },
      {
        path: 'templates/creative-studio/primitives.tsx',
        target: 'components/templates/creative-studio/primitives.tsx',
      },
      {
        path: 'templates/creative-studio/fonts.ts',
        target: 'components/templates/creative-studio/fonts.ts',
      },
    ],
    registryDependencies: [],
    dependencies: ['motion', 'lucide-react'],
  },
  {
    name: 'agency-landing',
    title: 'Agency Landing',
    description:
      'Bright, shader-lit agency landing page: a full-viewport hero with an animated WebGL backdrop and pill navigation, an editorial about section, a featured-work grid of autoplaying video cards, and a dark closing footer with a call to action. Built on the shaders package, with a self-contained light palette.',
    category: 'templates',
    files: [
      {
        path: 'templates/agency-landing/agency-landing.tsx',
        target: 'components/templates/agency-landing/agency-landing.tsx',
      },
      {
        path: 'templates/agency-landing/hero.tsx',
        target: 'components/templates/agency-landing/hero.tsx',
      },
      {
        path: 'templates/agency-landing/about.tsx',
        target: 'components/templates/agency-landing/about.tsx',
      },
      {
        path: 'templates/agency-landing/case-studies.tsx',
        target: 'components/templates/agency-landing/case-studies.tsx',
      },
      {
        path: 'templates/agency-landing/footer.tsx',
        target: 'components/templates/agency-landing/footer.tsx',
      },
      {
        path: 'templates/agency-landing/primitives.tsx',
        target: 'components/templates/agency-landing/primitives.tsx',
      },
      {
        path: 'templates/agency-landing/shader-background.tsx',
        target: 'components/templates/agency-landing/shader-background.tsx',
      },
    ],
    registryDependencies: ['badge', 'button'],
    dependencies: ['shaders', 'lucide-react'],
  },
  {
    name: 'mindloop',
    title: 'Mindloop',
    description:
      'Dark, monochrome newsletter landing page: a full-screen video hero with an inline subscribe form, an answer-engine section, scroll-revealed mission copy, a four-up feature grid and a streaming-video call to action. Framer Motion throughout, with a self-contained pure-black palette and liquid-glass accents.',
    category: 'templates',
    files: [
      {
        path: 'templates/mindloop/mindloop.tsx',
        target: 'components/templates/mindloop/mindloop.tsx',
      },
      {
        path: 'templates/mindloop/navbar.tsx',
        target: 'components/templates/mindloop/navbar.tsx',
      },
      {
        path: 'templates/mindloop/hero.tsx',
        target: 'components/templates/mindloop/hero.tsx',
      },
      {
        path: 'templates/mindloop/search.tsx',
        target: 'components/templates/mindloop/search.tsx',
      },
      {
        path: 'templates/mindloop/mission.tsx',
        target: 'components/templates/mindloop/mission.tsx',
      },
      {
        path: 'templates/mindloop/solution.tsx',
        target: 'components/templates/mindloop/solution.tsx',
      },
      {
        path: 'templates/mindloop/cta.tsx',
        target: 'components/templates/mindloop/cta.tsx',
      },
      {
        path: 'templates/mindloop/footer.tsx',
        target: 'components/templates/mindloop/footer.tsx',
      },
      {
        path: 'templates/mindloop/primitives.tsx',
        target: 'components/templates/mindloop/primitives.tsx',
      },
      {
        path: 'templates/mindloop/styles.tsx',
        target: 'components/templates/mindloop/styles.tsx',
      },
      {
        path: 'templates/mindloop/fonts.ts',
        target: 'components/templates/mindloop/fonts.ts',
      },
    ],
    registryDependencies: ['button', 'field'],
    dependencies: ['motion'],
  },
  {
    name: 'portfolio',
    title: 'Portfolio',
    description:
      'Dark, single-page personal portfolio: a counter loading screen, an HLS video hero with a floating nav and a cycling role line, a bento work grid, a journal list, a scroll-pinned parallax gallery with lightbox, count-up stats and a video contact footer. Self-contained dark palette, driven by GSAP and Framer Motion.',
    category: 'templates',
    files: [
      {
        path: 'templates/portfolio/portfolio.tsx',
        target: 'components/templates/portfolio/portfolio.tsx',
      },
      {
        path: 'templates/portfolio/loading-screen.tsx',
        target: 'components/templates/portfolio/loading-screen.tsx',
      },
      {
        path: 'templates/portfolio/hero.tsx',
        target: 'components/templates/portfolio/hero.tsx',
      },
      {
        path: 'templates/portfolio/selected-works.tsx',
        target: 'components/templates/portfolio/selected-works.tsx',
      },
      {
        path: 'templates/portfolio/journal.tsx',
        target: 'components/templates/portfolio/journal.tsx',
      },
      {
        path: 'templates/portfolio/explorations.tsx',
        target: 'components/templates/portfolio/explorations.tsx',
      },
      {
        path: 'templates/portfolio/stats.tsx',
        target: 'components/templates/portfolio/stats.tsx',
      },
      {
        path: 'templates/portfolio/contact.tsx',
        target: 'components/templates/portfolio/contact.tsx',
      },
      {
        path: 'templates/portfolio/background-video.tsx',
        target: 'components/templates/portfolio/background-video.tsx',
      },
      {
        path: 'templates/portfolio/primitives.tsx',
        target: 'components/templates/portfolio/primitives.tsx',
      },
      {
        path: 'templates/portfolio/fonts.ts',
        target: 'components/templates/portfolio/fonts.ts',
      },
      {
        path: 'templates/portfolio/styles.ts',
        target: 'components/templates/portfolio/styles.ts',
      },
    ],
    registryDependencies: ['button'],
    dependencies: ['gsap', 'motion'],
  },
  {
    name: 'usd-halo',
    title: 'USD Halo',
    description:
      'Premium fintech landing page for a stablecoin: a full-bleed video hero with a custom halo wordmark and an infinite brand marquee, a meet-the-product card grid, a backers marquee, and a use-modes split with an autoplaying video panel, closing on a dark anchor footer. Self-contained light palette.',
    category: 'templates',
    files: [
      {
        path: 'templates/usd-halo/usd-halo.tsx',
        target: 'components/templates/usd-halo/usd-halo.tsx',
      },
      {
        path: 'templates/usd-halo/navbar.tsx',
        target: 'components/templates/usd-halo/navbar.tsx',
      },
      {
        path: 'templates/usd-halo/hero.tsx',
        target: 'components/templates/usd-halo/hero.tsx',
      },
      {
        path: 'templates/usd-halo/info.tsx',
        target: 'components/templates/usd-halo/info.tsx',
      },
      {
        path: 'templates/usd-halo/backed-by.tsx',
        target: 'components/templates/usd-halo/backed-by.tsx',
      },
      {
        path: 'templates/usd-halo/use-cases.tsx',
        target: 'components/templates/usd-halo/use-cases.tsx',
      },
      {
        path: 'templates/usd-halo/footer.tsx',
        target: 'components/templates/usd-halo/footer.tsx',
      },
      {
        path: 'templates/usd-halo/primitives.tsx',
        target: 'components/templates/usd-halo/primitives.tsx',
      },
      {
        path: 'templates/usd-halo/fonts.ts',
        target: 'components/templates/usd-halo/fonts.ts',
      },
    ],
    registryDependencies: ['button'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'rivr',
    title: 'Rivr',
    description:
      'DeFi staking landing page for a fluid-asset protocol: a video hero on a rounded card with glass stat cards and a carved documentation corner, a metrics band, a bento feature grid, a video call to action and a light footer. Self-contained light palette, Helvetica system type, Framer Motion throughout.',
    category: 'templates',
    files: [
      {
        path: 'templates/rivr/rivr.tsx',
        target: 'components/templates/rivr/rivr.tsx',
      },
      {
        path: 'templates/rivr/navbar.tsx',
        target: 'components/templates/rivr/navbar.tsx',
      },
      {
        path: 'templates/rivr/hero.tsx',
        target: 'components/templates/rivr/hero.tsx',
      },
      {
        path: 'templates/rivr/metrics.tsx',
        target: 'components/templates/rivr/metrics.tsx',
      },
      {
        path: 'templates/rivr/features.tsx',
        target: 'components/templates/rivr/features.tsx',
      },
      {
        path: 'templates/rivr/cta.tsx',
        target: 'components/templates/rivr/cta.tsx',
      },
      {
        path: 'templates/rivr/footer.tsx',
        target: 'components/templates/rivr/footer.tsx',
      },
      {
        path: 'templates/rivr/primitives.tsx',
        target: 'components/templates/rivr/primitives.tsx',
      },
      {
        path: 'templates/rivr/styles.tsx',
        target: 'components/templates/rivr/styles.tsx',
      },
    ],
    registryDependencies: ['button'],
    dependencies: ['motion', 'lucide-react'],
  },
  {
    name: 'velorah',
    title: 'Velorah',
    description:
      'Dark, premium landing page for an electric RV brand: a full-screen video hero with liquid-glass navigation, a centered tagline, a split feature card with switchable tabs, an HLS streaming statement with a stats row, a video preorder call to action and a multi-column footer. Self-contained pure-black palette, Inter + Instrument Serif type.',
    category: 'templates',
    files: [
      {
        path: 'templates/velorah/velorah.tsx',
        target: 'components/templates/velorah/velorah.tsx',
      },
      {
        path: 'templates/velorah/navbar.tsx',
        target: 'components/templates/velorah/navbar.tsx',
      },
      {
        path: 'templates/velorah/hero.tsx',
        target: 'components/templates/velorah/hero.tsx',
      },
      {
        path: 'templates/velorah/tagline.tsx',
        target: 'components/templates/velorah/tagline.tsx',
      },
      {
        path: 'templates/velorah/feature.tsx',
        target: 'components/templates/velorah/feature.tsx',
      },
      {
        path: 'templates/velorah/statement.tsx',
        target: 'components/templates/velorah/statement.tsx',
      },
      {
        path: 'templates/velorah/cta.tsx',
        target: 'components/templates/velorah/cta.tsx',
      },
      {
        path: 'templates/velorah/footer.tsx',
        target: 'components/templates/velorah/footer.tsx',
      },
      {
        path: 'templates/velorah/primitives.tsx',
        target: 'components/templates/velorah/primitives.tsx',
      },
      {
        path: 'templates/velorah/styles.tsx',
        target: 'components/templates/velorah/styles.tsx',
      },
      {
        path: 'templates/velorah/fonts.ts',
        target: 'components/templates/velorah/fonts.ts',
      },
    ],
    registryDependencies: ['button', 'toggle-group'],
  },
  {
    name: 'asme',
    title: 'Asme',
    description:
      'Dark, liquid-glass marketing landing page: a full-viewport hero with a cross-fading background video, a frosted glass pill nav and an inline email form, then scroll-revealed about, featured-video, philosophy and services sections, closing on a multi-column footer. Framer Motion throughout, with a self-contained pure-black palette and Instrument Serif accents.',
    category: 'templates',
    files: [
      {
        path: 'templates/asme/asme.tsx',
        target: 'components/templates/asme/asme.tsx',
      },
      {
        path: 'templates/asme/hero.tsx',
        target: 'components/templates/asme/hero.tsx',
      },
      {
        path: 'templates/asme/navbar.tsx',
        target: 'components/templates/asme/navbar.tsx',
      },
      {
        path: 'templates/asme/about.tsx',
        target: 'components/templates/asme/about.tsx',
      },
      {
        path: 'templates/asme/featured-video.tsx',
        target: 'components/templates/asme/featured-video.tsx',
      },
      {
        path: 'templates/asme/philosophy.tsx',
        target: 'components/templates/asme/philosophy.tsx',
      },
      {
        path: 'templates/asme/services.tsx',
        target: 'components/templates/asme/services.tsx',
      },
      {
        path: 'templates/asme/footer.tsx',
        target: 'components/templates/asme/footer.tsx',
      },
      {
        path: 'templates/asme/primitives.tsx',
        target: 'components/templates/asme/primitives.tsx',
      },
      {
        path: 'templates/asme/styles.tsx',
        target: 'components/templates/asme/styles.tsx',
      },
      {
        path: 'templates/asme/fonts.ts',
        target: 'components/templates/asme/fonts.ts',
      },
    ],
    registryDependencies: ['button', 'field'],
    dependencies: ['motion', 'lucide-react'],
  },
  {
    name: 'nexacore',
    title: 'NexaCore',
    description:
      'Light enterprise-infrastructure landing page: a floating pill navbar that shrinks on scroll, a full-screen video hero, a dark service-card grid that unfolds on hover, a chaos-versus-control split around a circular streaming video, and a four-pillar delivery staircase. Self-contained navy-and-lavender palette with multi-stop brand gradients, driven by lucide-react.',
    category: 'templates',
    files: [
      {
        path: 'templates/nexacore/nexacore.tsx',
        target: 'components/templates/nexacore/nexacore.tsx',
      },
      {
        path: 'templates/nexacore/navbar.tsx',
        target: 'components/templates/nexacore/navbar.tsx',
      },
      {
        path: 'templates/nexacore/hero.tsx',
        target: 'components/templates/nexacore/hero.tsx',
      },
      {
        path: 'templates/nexacore/trusted.tsx',
        target: 'components/templates/nexacore/trusted.tsx',
      },
      {
        path: 'templates/nexacore/service-card.tsx',
        target: 'components/templates/nexacore/service-card.tsx',
      },
      {
        path: 'templates/nexacore/freedom.tsx',
        target: 'components/templates/nexacore/freedom.tsx',
      },
      {
        path: 'templates/nexacore/precision.tsx',
        target: 'components/templates/nexacore/precision.tsx',
      },
      {
        path: 'templates/nexacore/primitives.tsx',
        target: 'components/templates/nexacore/primitives.tsx',
      },
      {
        path: 'templates/nexacore/styles.tsx',
        target: 'components/templates/nexacore/styles.tsx',
      },
      {
        path: 'templates/nexacore/fonts.ts',
        target: 'components/templates/nexacore/fonts.ts',
      },
    ],
    registryDependencies: ['badge', 'button'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'aurael',
    title: 'Aurael',
    description:
      'Bilingual (EN/AR) landing page for a home-solar brand, built around a day/night control that re-themes the whole page: a full-height photographic hero that cross-fades between morning and night, then hairline-ruled bands with a sticky meta rail for how it works, cases, about, careers, resources and customers. Self-contained morning/night palettes, Inter + Manrope with Cairo for Arabic, and RTL that follows the surrounding document.',
    category: 'templates',
    files: [
      {
        path: 'templates/aurael/aurael.tsx',
        target: 'components/templates/aurael/aurael.tsx',
      },
      {
        path: 'templates/aurael/hero.tsx',
        target: 'components/templates/aurael/hero.tsx',
      },
      {
        path: 'templates/aurael/how-it-works.tsx',
        target: 'components/templates/aurael/how-it-works.tsx',
      },
      {
        path: 'templates/aurael/cases.tsx',
        target: 'components/templates/aurael/cases.tsx',
      },
      {
        path: 'templates/aurael/about.tsx',
        target: 'components/templates/aurael/about.tsx',
      },
      {
        path: 'templates/aurael/careers.tsx',
        target: 'components/templates/aurael/careers.tsx',
      },
      {
        path: 'templates/aurael/resources.tsx',
        target: 'components/templates/aurael/resources.tsx',
      },
      {
        path: 'templates/aurael/customers.tsx',
        target: 'components/templates/aurael/customers.tsx',
      },
      {
        path: 'templates/aurael/footer.tsx',
        target: 'components/templates/aurael/footer.tsx',
      },
      {
        path: 'templates/aurael/primitives.tsx',
        target: 'components/templates/aurael/primitives.tsx',
      },
      {
        path: 'templates/aurael/styles.tsx',
        target: 'components/templates/aurael/styles.tsx',
      },
      {
        path: 'templates/aurael/fonts.ts',
        target: 'components/templates/aurael/fonts.ts',
      },
    ],
    registryDependencies: ['button'],
    dependencies: ['motion', 'lucide-react'],
  },
  {
    name: 'novael',
    title: 'Novael',
    description:
      'Bilingual (EN/AR) landing page for a technology services firm: a fixed scroll-spy navbar over a headline that sits on a photographic band, an overlapping intro card and count-up stats, a marquee of past employers, a teal service slab, a project grid whose captions expand on hover, and a contact section that doubles as the footer. Self-contained dark palette, Inter + Manrope with Cairo for Arabic, and RTL that follows the surrounding document.',
    category: 'templates',
    files: [
      {
        path: 'templates/novael/novael.tsx',
        target: 'components/templates/novael/novael.tsx',
      },
      {
        path: 'templates/novael/navbar.tsx',
        target: 'components/templates/novael/navbar.tsx',
      },
      {
        path: 'templates/novael/hero.tsx',
        target: 'components/templates/novael/hero.tsx',
      },
      {
        path: 'templates/novael/team.tsx',
        target: 'components/templates/novael/team.tsx',
      },
      {
        path: 'templates/novael/services.tsx',
        target: 'components/templates/novael/services.tsx',
      },
      {
        path: 'templates/novael/works.tsx',
        target: 'components/templates/novael/works.tsx',
      },
      {
        path: 'templates/novael/contact.tsx',
        target: 'components/templates/novael/contact.tsx',
      },
      {
        path: 'templates/novael/primitives.tsx',
        target: 'components/templates/novael/primitives.tsx',
      },
      {
        path: 'templates/novael/styles.tsx',
        target: 'components/templates/novael/styles.tsx',
      },
      {
        path: 'templates/novael/fonts.ts',
        target: 'components/templates/novael/fonts.ts',
      },
    ],
    registryDependencies: ['button', 'marquee'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'hero-06',
    title: 'Hero 6',
    description:
      'Centered personal hero: a live "available for work" badge, a serif headline with a primary-tinted emphasis span, a sub-line, a three-stat row with hairline dividers, dual rounded CTAs, and a tooltip-backed core-stack icon row framed by gradient rules. Rotated geometric border accents fade in behind it (and stay still under reduced motion).',
    blockTagline: 'Centered · stat row · geometric accents',
    category: 'blocks',
    blockKind: 'hero',
    files: [
      {
        path: 'blocks/hero-06/hero-06.tsx',
        target: 'components/blocks/hero-06.tsx',
      },
    ],
    registryDependencies: ['badge', 'button', 'tooltip'],
    dependencies: ['motion', 'lucide-react'],
  },
  {
    name: 'hero-07',
    title: 'Hero 7',
    description:
      'Centered hero with a word-by-word blur-in serif headline, a glass beta badge with a live dot, dual rounded CTAs, and animated beam line-art SVGs that trace the top, bottom, and both sides of the section. Respects reduced-motion.',
    blockTagline: 'Beam line-art · word-by-word reveal · dual CTA',
    category: 'blocks',
    blockKind: 'hero',
    files: [
      {
        path: 'blocks/hero-07/hero-07.tsx',
        target: 'components/blocks/hero-07.tsx',
      },
    ],
    registryDependencies: ['button'],
    dependencies: ['motion', 'lucide-react'],
  },
  {
    name: 'hero-08',
    title: 'Hero 8',
    description:
      'Centered hero on a framed, token-lit panel: a pill badge eyebrow, a serif headline with an italic emphasis span, sub-copy, dual CTA buttons, and a faux app-window preview below. Headline, sub-copy, and CTAs fade and rise in with staggered motion that respects reduced-motion.',
    blockTagline: 'Centered · framed panel · window preview',
    category: 'blocks',
    blockKind: 'hero',
    files: [
      {
        path: 'blocks/hero-08/hero-08.tsx',
        target: 'components/blocks/hero-08.tsx',
      },
    ],
    registryDependencies: ['badge', 'button'],
    dependencies: ['lucide-react', 'motion'],
  },
  {
    name: 'testimonial-03',
    title: 'Testimonial 3',
    description:
      'Centered statement quote with a serif display heading, an inline quote glyph in the corner, gradient hairline dividers, and a highlighted phrase, closed by a small mono attribution line.',
    blockTagline: 'Statement quote · serif display · highlight',
    category: 'blocks',
    blockKind: 'testimonial',
    files: [
      {
        path: 'blocks/testimonial-03/testimonial-03.tsx',
        target: 'components/blocks/testimonial-03.tsx',
      },
    ],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: 'testimonial-04',
    title: 'Testimonial 4',
    description:
      'Three-column quote grid under a centered pill badge and word-by-word headline. Each card opens with a quote icon inside a ring lit by an orbiting glow, then the quote in serif marks and an author line. Cards rise in with staggered motion.',
    blockTagline: 'Quote grid · orbiting glow ring · staggered rise',
    category: 'blocks',
    blockKind: 'testimonial',
    files: [
      {
        path: 'blocks/testimonial-04/testimonial-04.tsx',
        target: 'components/blocks/testimonial-04.tsx',
      },
    ],
    registryDependencies: ['badge'],
    dependencies: ['lucide-react', 'motion'],
  },
  {
    name: 'cta-04',
    title: 'CTA 4',
    description:
      'Centered "get in touch" CTA with a mono eyebrow, serif headline, mail button, a direct-contact line, and a row of outline social icon buttons, capped by a soft radial glow dome with a starfield speckle.',
    blockTagline: 'Centered · glow dome · social icons',
    category: 'blocks',
    blockKind: 'cta',
    files: [
      {
        path: 'blocks/cta-04/cta-04.tsx',
        target: 'components/blocks/cta-04.tsx',
      },
    ],
    registryDependencies: ['button'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'cta-05',
    title: 'CTA 5',
    description:
      'Contact CTA panel with a scroll-reactive radial glow, an eyebrow badge, a word-by-word reveal headline, and two contact actions (email and call) each pairing a button with its detail line.',
    blockTagline: 'Scroll-lit glow · contact actions · word reveal',
    category: 'blocks',
    blockKind: 'cta',
    files: [
      {
        path: 'blocks/cta-05/cta-05.tsx',
        target: 'components/blocks/cta-05.tsx',
      },
    ],
    registryDependencies: ['button'],
    dependencies: ['motion', 'lucide-react'],
  },
  {
    name: 'cta-06',
    title: 'CTA 6',
    description:
      'Framed CTA banner over a tokenized gradient surface: an eyebrow label, a serif headline with an italic emphasis, short sub-copy, and a primary action button with a motion reveal.',
    blockTagline: 'Framed panel · gradient surface · motion reveal',
    category: 'blocks',
    blockKind: 'cta',
    files: [
      {
        path: 'blocks/cta-06/cta-06.tsx',
        target: 'components/blocks/cta-06.tsx',
      },
    ],
    registryDependencies: ['button'],
    dependencies: ['lucide-react', 'motion'],
  },
  {
    name: 'footer-02',
    title: 'Footer 2',
    description:
      'Rounded-top footer with a brand block beside a multi-column link grid. Each column caps at five links and shows a "View all" arrow when there are more. A soft radial tint sits behind the top edge, and a bottom meta row carries the copyright and secondary links.',
    blockTagline: 'Rounded top · brand + columns · radial tint',
    category: 'blocks',
    blockKind: 'footer',
    files: [
      {
        path: 'blocks/footer-02/footer-02.tsx',
        target: 'components/blocks/footer-02.tsx',
      },
    ],
    registryDependencies: [],
    dependencies: ['lucide-react'],
  },
  {
    name: 'footer-03',
    title: 'Footer 3',
    description:
      'Boxed link-column footer: a two-column brand block with wordmark, blurb, and ghost social buttons, two link columns, and a divided copyright row. Sits in a soft outlined panel.',
    blockTagline: 'Boxed panel · brand + link columns · social row',
    category: 'blocks',
    blockKind: 'footer',
    files: [
      {
        path: 'blocks/footer-03/footer-03.tsx',
        target: 'components/blocks/footer-03.tsx',
      },
    ],
    registryDependencies: ['button'],
    dependencies: [],
  },
  {
    name: 'footer-04',
    title: 'Footer 4',
    description:
      'Four-column footer lit by slow light rays falling from the top edge: brand mark and blurb, a contact column with WhatsApp and email links, a location column, and a subscribe form whose placeholder cycles through prompts. Columns and links rise in with staggered motion; a divided copyright row closes it. Rays hold still under reduced-motion.',
    blockTagline: 'Light rays · contact columns · rotating placeholder',
    category: 'blocks',
    blockKind: 'footer',
    files: [
      {
        path: 'blocks/footer-04/footer-04.tsx',
        target: 'components/blocks/footer-04.tsx',
      },
      {
        path: 'blocks/footer-04/footer-04-beams.tsx',
        target: 'components/blocks/footer-04-beams.tsx',
      },
    ],
    registryDependencies: ['button', 'input', 'separator'],
    dependencies: ['lucide-react', 'motion'],
  },
  {
    name: 'faq-05',
    title: 'FAQ 5',
    description:
      'Two-column FAQ block: a mono eyebrow, serif headline and short intro sit on the start side; a single-open accordion of five questions sits on the end side, split by a vertical divider that collapses to a stacked layout on mobile.',
    blockTagline: 'Split layout · divider · single accordion',
    category: 'blocks',
    blockKind: 'faq',
    files: [
      {
        path: 'blocks/faq-05/faq-05.tsx',
        target: 'components/blocks/faq-05.tsx',
      },
    ],
    registryDependencies: ['accordion'],
    dependencies: [],
  },
  {
    name: 'faq-06',
    title: 'FAQ 6',
    description:
      'Centered FAQ with a pill badge, a word-by-word headline reveal and a short intro above a multi-open accordion where each question is its own bordered card that rises in with a staggered delay and tints slightly when open. Ships composable parts.',
    blockTagline: 'Card accordion · staggered rise · multi-open',
    category: 'blocks',
    blockKind: 'faq',
    files: [
      {
        path: 'blocks/faq-06/faq-06.tsx',
        target: 'components/blocks/faq-06.tsx',
      },
    ],
    registryDependencies: ['accordion', 'badge'],
    dependencies: ['motion'],
  },
  {
    name: 'contact-02',
    title: 'Contact 2',
    description:
      'Bordered contact section with a serif header, a three-column info grid (email, location, social) using muted-fill labels and divider rules, and a "Find us online" footer of pill-shaped social links.',
    blockTagline: 'Info grid · bordered cells · social pills',
    category: 'blocks',
    blockKind: 'contact',
    files: [
      {
        path: 'blocks/contact-02/contact-02.tsx',
        target: 'components/blocks/contact-02.tsx',
      },
    ],
    registryDependencies: ['separator'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'contact-03',
    title: 'Contact 3',
    description:
      'Centered contact panel whose bottom glow widens as the section scrolls into view, with a pill badge, a word-by-word headline reveal, two short paragraphs, and a two-column CTA grid: an email button with the address beneath it and an outline call button that opens a WhatsApp chat. Ships composable parts.',
    blockTagline: 'Scroll-driven glow · word reveal · email + chat CTAs',
    category: 'blocks',
    blockKind: 'contact',
    files: [
      {
        path: 'blocks/contact-03/contact-03.tsx',
        target: 'components/blocks/contact-03.tsx',
      },
    ],
    registryDependencies: ['badge', 'button'],
    dependencies: ['lucide-react', 'motion'],
  },
  {
    name: 'login-03',
    title: 'Login 3',
    description:
      'Split-screen sign-in: a decorative animated-paths aside with a brand mark and a short quote, paired with a clean GitHub-only sign-in pane. A back-to-home link, mobile-collapsing layout, and token-based radial glows behind the form.',
    blockTagline: 'Split layout · animated paths · GitHub sign-in',
    category: 'blocks',
    blockKind: 'login',
    files: [
      {
        path: 'blocks/login-03/login-03.tsx',
        target: 'components/blocks/login-03.tsx',
      },
    ],
    registryDependencies: ['button'],
    dependencies: ['lucide-react', 'motion'],
  },
  {
    name: 'toc',
    title: 'Table of Contents',
    description:
      'On-this-page navigation that tracks the active heading as you scroll and highlights it with a moving border marker. Takes a flat or nested items list, or composes from parts. Smooth scroll respects reduced-motion.',
    category: 'navigation',
    files: [{ path: 'components/toc.tsx' }],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: 'app-shell-05',
    title: 'App Shell 5',
    description:
      'Inset sidebar app shell: a collapsible icon sidebar with a brand header, grouped Workspace and Tools nav (with a Beta badge), and an account menu in the footer, paired with a sticky header carrying the sidebar toggle and a breadcrumb. The inset holds a stat row and a placeholder for page content.',
    blockTagline: 'Inset sidebar · grouped nav · account menu',
    category: 'blocks',
    blockKind: 'app-shell',
    files: [
      {
        path: 'blocks/app-shell-05/app-shell-05.tsx',
        target: 'components/blocks/app-shell-05.tsx',
      },
    ],
    registryDependencies: ['avatar', 'badge', 'breadcrumb', 'dropdown-menu', 'separator', 'sidebar'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'dashboard-06',
    title: 'Dashboard 6',
    description:
      'Pipeline overview dashboard: four stat cards for success, failure, skipped, and live activity, a clickable latest-runs bar chart with a run breakdown panel, and a recent-runs list. The active-now stat uses --accent-cool for live state; every other color is a design token, so it works in light and dark.',
    blockTagline: 'Stat cards · runs chart · breakdown panel',
    category: 'blocks',
    blockKind: 'dashboard',
    files: [
      {
        path: 'blocks/dashboard-06/dashboard-06.tsx',
        target: 'components/blocks/dashboard-06.tsx',
      },
    ],
    registryDependencies: ['badge', 'button', 'card', 'chart', 'empty'],
    dependencies: ['recharts', 'lucide-react'],
    docs: "Charts run on recharts via the shadcn chart primitive. Give ChartContainer's parent an explicit height, and update chartConfig's keys when you swap in real data.",
  },
  {
    name: 'confirm',
    title: 'Confirm',
    description:
      'Imperative confirmation dialog: a root provider plus a useConfirm hook that resolves a promise on confirm or cancel. Default or destructive tone, an optional icon, and an async confirm action with a pending spinner.',
    category: 'display',
    files: [{ path: 'components/confirm.tsx' }],
    registryDependencies: ['alert-dialog', 'button'],
    dependencies: [],
  },
  {
    name: 'unsaved-guard',
    title: 'Unsaved Guard',
    description:
      'Unsaved-changes guard: a root provider plus a useUnsavedGuard hook. Warns before reload, tab close and in-app link navigation, and returns a guard(proceed) to wrap programmatic navigation in a confirm dialog.',
    category: 'display',
    files: [{ path: 'components/unsaved-guard.tsx' }],
    registryDependencies: ['confirm'],
    dependencies: [],
  },
  {
    name: 'data-table',
    title: 'Data Table',
    description:
      'TanStack-powered data table: faceted, text, range and date filters, sortable columns, column visibility, row selection and pagination, with page, sort and filters kept in the URL. One useDataTable hook drives it: pass pageCount to query server-side, or omit it to sort, filter and page a local array in memory. Ships as a folder of composable parts.',
    category: 'data',
    files: [
      {
        path: 'components/data-table/data-table.tsx',
        target: 'components/data-table/data-table.tsx',
        type: 'registry:component',
      },
      {
        path: 'components/data-table/data-table-toolbar.tsx',
        target: 'components/data-table/data-table-toolbar.tsx',
        type: 'registry:component',
      },
      {
        path: 'components/data-table/data-table-column-header.tsx',
        target: 'components/data-table/data-table-column-header.tsx',
        type: 'registry:component',
      },
      {
        path: 'components/data-table/data-table-pagination.tsx',
        target: 'components/data-table/data-table-pagination.tsx',
        type: 'registry:component',
      },
      {
        path: 'components/data-table/data-table-view-options.tsx',
        target: 'components/data-table/data-table-view-options.tsx',
        type: 'registry:component',
      },
      {
        path: 'components/data-table/data-table-faceted-filter.tsx',
        target: 'components/data-table/data-table-faceted-filter.tsx',
        type: 'registry:component',
      },
      {
        path: 'components/data-table/data-table-slider-filter.tsx',
        target: 'components/data-table/data-table-slider-filter.tsx',
        type: 'registry:component',
      },
      {
        path: 'components/data-table/data-table-date-filter.tsx',
        target: 'components/data-table/data-table-date-filter.tsx',
        type: 'registry:component',
      },
      {
        path: 'components/data-table/data-table-skeleton.tsx',
        target: 'components/data-table/data-table-skeleton.tsx',
        type: 'registry:component',
      },
      {
        path: 'components/data-table/use-data-table.ts',
        target: 'components/data-table/use-data-table.ts',
        type: 'registry:hook',
      },
      {
        path: 'components/data-table/data-table-features.ts',
        target: 'components/data-table/data-table-features.ts',
        type: 'registry:lib',
      },
      {
        path: 'components/data-table/data-table-parsers.ts',
        target: 'components/data-table/data-table-parsers.ts',
        type: 'registry:lib',
      },
      {
        path: 'components/data-table/data-table-utils.ts',
        target: 'components/data-table/data-table-utils.ts',
        type: 'registry:lib',
      },
    ],
    registryDependencies: [
      'badge',
      'button',
      'calendar',
      'command',
      'dropdown-menu',
      'field',
      'input',
      'popover',
      'select',
      'separator',
      'skeleton',
      'slider',
      'table',
    ],
    dependencies: ['@tanstack/react-table', 'lucide-react', 'nuqs', 'react-day-picker', 'zod'],
    docs: "Needs a NuqsAdapter wrapping your app (nuqs) or the URL-synced page/sort/filter state won't work. Built for @tanstack/react-table v9; the table's features, row models and column meta typing live in data-table-features.ts. Component files keep a \"use no memo\" pragma, required under the React Compiler because column/row getter reads would otherwise be memoized stale, so don't remove it.",
  },
  {
    name: 'process-01',
    title: 'Process 1',
    description:
      'How-it-works section with a three-step row: each step pairs an icon badge, a Step NN label, a title and a short body, joined by a hairline connector on desktop.',
    blockTagline: 'How it works · 3 steps · connector line',
    category: 'blocks',
    blockKind: 'process',
    files: [
      {
        path: 'blocks/process-01/process-01.tsx',
        target: 'components/blocks/process-01.tsx',
      },
    ],
    registryDependencies: [],
    dependencies: ['lucide-react'],
  },
  {
    name: 'feature-03',
    title: 'Feature 3',
    description:
      'Bento feature grid: a large lead tile with a faux file-tree preview beside five smaller token-lit tiles, each with an icon, title and short blurb.',
    blockTagline: 'Bento grid · lead tile · icon tiles',
    category: 'blocks',
    blockKind: 'feature',
    files: [
      {
        path: 'blocks/feature-03/feature-03.tsx',
        target: 'components/blocks/feature-03.tsx',
      },
    ],
    registryDependencies: [],
    dependencies: ['lucide-react'],
  },
  {
    name: 'feature-04',
    title: 'Feature 4',
    description:
      'Services grid: a pill badge, word-by-word animated title and intro over a three-column set of cards, each with a large thin icon, title, blurb and a three-point bullet list, lit by two pulsing warm radial glows. Cards rise in with staggered motion that respects reduced-motion.',
    blockTagline: 'Icon cards · warm glow · bullet list',
    category: 'blocks',
    blockKind: 'feature',
    files: [
      {
        path: 'blocks/feature-04/feature-04.tsx',
        target: 'components/blocks/feature-04.tsx',
      },
    ],
    registryDependencies: ['badge'],
    dependencies: ['lucide-react', 'motion'],
  },
  {
    name: 'feature-05',
    title: 'Feature 5',
    description:
      'Values section: a centered animated header over a two-column, offset grid of six glass cards, each backed by a canvas dot grid that shimmers dot by dot in the brand warm tone. Pauses off-screen and renders a single static frame under reduced-motion.',
    blockTagline: 'Offset columns · dotted glow canvas · glass cards',
    category: 'blocks',
    blockKind: 'feature',
    files: [
      {
        path: 'blocks/feature-05/feature-05.tsx',
        target: 'components/blocks/feature-05.tsx',
      },
    ],
    registryDependencies: ['badge'],
    dependencies: ['motion'],
  },
  {
    name: 'feature-06',
    title: 'Feature 6',
    description:
      'About section: a centered animated header over two equal story cards, each decorated with a fading SVG grid pattern and a token-lit gradient, with a heading and two paragraphs that rise in after the card. Reduced-motion renders everything in place.',
    blockTagline: 'Two story cards · grid pattern · staggered copy',
    category: 'blocks',
    blockKind: 'feature',
    files: [
      {
        path: 'blocks/feature-06/feature-06.tsx',
        target: 'components/blocks/feature-06.tsx',
      },
    ],
    registryDependencies: ['badge'],
    dependencies: ['motion'],
  },
  {
    name: 'comparison-01',
    title: 'Comparison 1',
    description:
      'Two-column us-and-them panel: a featured column of checked points beside a muted column of the usual trade-offs, split by a divider that stacks on mobile.',
    blockTagline: 'Us vs them · two columns · check and minus rows',
    category: 'blocks',
    blockKind: 'comparison',
    files: [
      {
        path: 'blocks/comparison-01/comparison-01.tsx',
        target: 'components/blocks/comparison-01.tsx',
      },
    ],
    registryDependencies: ['button'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'newsletter-01',
    title: 'Newsletter 1',
    description:
      'Centered subscribe panel with an inline email form, inline validation and a success state that swaps in a confirmation once a valid address is entered.',
    blockTagline: 'Inline subscribe · validation · success state',
    category: 'blocks',
    blockKind: 'newsletter',
    files: [
      {
        path: 'blocks/newsletter-01/newsletter-01.tsx',
        target: 'components/blocks/newsletter-01.tsx',
      },
    ],
    registryDependencies: ['button', 'field', 'input'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'careers-01',
    title: 'Careers 1',
    description:
      'Open-roles list with department filter pills and rows that show title, department, location and type, each linking out with a hover arrow.',
    blockTagline: 'Open roles · department filter · linked rows',
    category: 'blocks',
    blockKind: 'careers',
    files: [
      {
        path: 'blocks/careers-01/careers-01.tsx',
        target: 'components/blocks/careers-01.tsx',
      },
    ],
    registryDependencies: ['badge', 'toggle-group'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'hero-09',
    title: 'Hero 9',
    description:
      'Full-viewport product hero on a rounded card that zooms out as the page scrolls: an inline nav with brand and actions, a serif headline, sub-copy, dual CTAs, a step-type strip, a drifting WebGL gradient mixed from the theme tokens, a bouncing scroll cue and a carved stat corner. Reduced-motion aware.',
    blockTagline: 'Zoom-out card · fluid gradient · carved stats',
    category: 'blocks',
    blockKind: 'hero',
    files: [
      {
        path: 'blocks/hero-09/hero-09.tsx',
        target: 'components/blocks/hero-09.tsx',
      },
      {
        path: 'blocks/hero-09/hero-09-backdrop.tsx',
        target: 'components/blocks/hero-09-backdrop.tsx',
      },
    ],
    registryDependencies: ['button'],
    dependencies: ['motion', 'lucide-react'],
  },
  {
    name: 'feature-07',
    title: 'Feature 7',
    description:
      'Problem-framing trio: a badge and serif headline with a muted second half above three cards, each an orb icon in concentric rings with a soft radial glow, a title and a short description. Cards fade up in sequence, stilled under reduced motion.',
    blockTagline: 'Orb icons · concentric rings · staggered reveal',
    category: 'blocks',
    blockKind: 'feature',
    files: [
      {
        path: 'blocks/feature-07/feature-07.tsx',
        target: 'components/blocks/feature-07.tsx',
      },
    ],
    registryDependencies: ['badge'],
    dependencies: ['motion', 'lucide-react'],
  },
  {
    name: 'feature-08',
    title: 'Feature 8',
    description:
      'Six-card feature grid on hairline rails: each card carries an icon tile, a title and a description, corner crosshair marks, and a radial spotlight that follows the pointer on hover. Warm-tinted top glow per card.',
    blockTagline: 'Pointer spotlight · hairline rails · crosshair corners',
    category: 'blocks',
    blockKind: 'feature',
    files: [
      {
        path: 'blocks/feature-08/feature-08.tsx',
        target: 'components/blocks/feature-08.tsx',
      },
    ],
    registryDependencies: ['badge'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'feature-09',
    title: 'Feature 9',
    description:
      'Catalog bento on a hairline grid: a wide opening cell, four single cells and a full-width closing cell, each with a large faded icon that warms on hover, a title, a clamped description and a crosshair frame that clips at the cell edge.',
    blockTagline: 'Bento grid · crosshair frames · hover-warm icons',
    category: 'blocks',
    blockKind: 'feature',
    files: [
      {
        path: 'blocks/feature-09/feature-09.tsx',
        target: 'components/blocks/feature-09.tsx',
      },
    ],
    registryDependencies: ['badge'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'pricing-04',
    title: 'Pricing 4',
    description:
      'Three-tier pricing row with an uppercase plan label, a large price, a tagline, a full-width CTA and a check-marked quota list per tier; the featured tier gets a warm border, a top radial glow and a most-popular badge.',
    blockTagline: 'Three tiers · featured glow · quota checklist',
    category: 'blocks',
    blockKind: 'pricing',
    files: [
      {
        path: 'blocks/pricing-04/pricing-04.tsx',
        target: 'components/blocks/pricing-04.tsx',
      },
    ],
    registryDependencies: ['badge', 'button'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'faq-07',
    title: 'FAQ 7',
    description:
      'Split FAQ: a serif heading and lead on the start side, a single-open accordion of five questions on the end side, divided by a hairline rule and framed by section borders.',
    blockTagline: 'Split layout · hairline divide · single-open accordion',
    category: 'blocks',
    blockKind: 'faq',
    files: [
      {
        path: 'blocks/faq-07/faq-07.tsx',
        target: 'components/blocks/faq-07.tsx',
      },
    ],
    registryDependencies: ['accordion'],
    dependencies: [],
  },
  {
    name: 'cta-07',
    title: 'CTA 7',
    description:
      'Closing CTA panel wrapped in a scroll-reactive warm rim glow that widens as the section moves through the viewport, with an eyebrow badge, a two-tone serif headline, sub-copy and dual CTAs. Static glow under reduced motion.',
    blockTagline: 'Scroll-lit rim · two-tone headline · dual CTA',
    category: 'blocks',
    blockKind: 'cta',
    files: [
      {
        path: 'blocks/cta-07/cta-07.tsx',
        target: 'components/blocks/cta-07.tsx',
      },
    ],
    registryDependencies: ['badge', 'button'],
    dependencies: ['motion', 'lucide-react'],
  },
  {
    name: 'hero-10',
    title: 'Hero 10',
    description:
      'Bordered hero card over a blurred full-bleed image: a rocket badge, a large centered headline, sub-copy and dual CTAs that rise into place on load. Reduced-motion aware.',
    blockTagline: 'Blurred image card · centered stack · rise-in',
    category: 'blocks',
    blockKind: 'hero',
    files: [
      {
        path: 'blocks/hero-10/hero-10.tsx',
        target: 'components/blocks/hero-10.tsx',
      },
    ],
    registryDependencies: ['badge', 'button'],
    dependencies: ['motion', 'lucide-react'],
  },
  {
    name: 'footer-06',
    title: 'Footer 6',
    description:
      'Two-part footer: a bordered CTA panel over a rotated, blurred image with a headline, sub-copy and a wide sign-up button, above a brand block with social icons, two link columns and a hairline copyright row.',
    blockTagline: 'Image CTA panel · brand block · link columns',
    category: 'blocks',
    blockKind: 'footer',
    files: [
      {
        path: 'blocks/footer-06/footer-06.tsx',
        target: 'components/blocks/footer-06.tsx',
      },
    ],
    registryDependencies: ['button'],
    dependencies: ['motion'],
  },
  {
    name: 'footer-05',
    title: 'Footer 5',
    description:
      'Floating card footer inset from the page edge: a brand block with mark and tagline, three link columns, and a hairline-divided legal row with copyright and a sign-off line.',
    blockTagline: 'Inset card · three columns · legal row',
    category: 'blocks',
    blockKind: 'footer',
    files: [
      {
        path: 'blocks/footer-05/footer-05.tsx',
        target: 'components/blocks/footer-05.tsx',
      },
    ],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: 'status-01',
    title: 'Status 1',
    description:
      'Service status page: an operational banner with a green check, a 90-day uptime grid of tooltip-backed day bars per service with a status legend, and a dated incident history where each update carries a tone-colored badge, a timestamp and a note.',
    blockTagline: 'Uptime bars · day tooltips · incident timeline',
    category: 'blocks',
    blockKind: 'not-found',
    files: [
      {
        path: 'blocks/status-01/status-01.tsx',
        target: 'components/blocks/status-01.tsx',
      },
    ],
    registryDependencies: ['badge', 'tooltip'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'metric-card',
    title: 'Metric Card',
    description:
      'Compact metric card with a value and unit, a tone-aware sparkline and an up / down trend line. Compound API.',
    category: 'data',
    files: [{ path: 'components/metric-card.tsx' }],
    registryDependencies: [],
    dependencies: ['lucide-react'],
    cssVars: STATUS_CSS_VARS,
  },
  {
    name: 'yaml-editor',
    title: 'YAML Editor',
    description:
      'Editable code field with dependency-free YAML syntax highlighting, a line-number gutter and tab-to-indent. Controlled or uncontrolled.',
    category: 'inputs',
    files: [{ path: 'components/yaml-editor.tsx' }],
    registryDependencies: [],
    dependencies: [],
    cssVars: STATUS_CSS_VARS,
  },
  {
    name: 'server-card',
    title: 'Server Card',
    description:
      'Fleet of host cards, each with a status pill, region, CPU / memory / disk specs and threshold-tinted usage meters. Ships composable parts.',
    blockTagline: 'Host cards · status · usage meters',
    category: 'blocks',
    blockKind: 'cloud',
    files: [
      {
        path: 'blocks/server-card/server-card.tsx',
        target: 'components/blocks/server-card.tsx',
      },
    ],
    registryDependencies: [],
    dependencies: ['lucide-react'],
    cssVars: STATUS_CSS_VARS,
  },
  {
    name: 'vm-table',
    title: 'VM Table',
    description:
      'Virtual-machine instance table with live status dots, size, region, IP and uptime. Self-contained parts, no table primitive required.',
    blockTagline: 'Instance table · live status · uptime',
    category: 'blocks',
    blockKind: 'cloud',
    files: [
      {
        path: 'blocks/vm-table/vm-table.tsx',
        target: 'components/blocks/vm-table.tsx',
      },
    ],
    registryDependencies: [],
    dependencies: [],
    cssVars: STATUS_CSS_VARS,
  },
  {
    name: 'k8s-pod-table',
    title: 'K8s Pod Table',
    description:
      'Kubernetes pod table with phase pills (Running, Pending, CrashLoopBackOff), ready and restart counts that flag unhealthy pods.',
    blockTagline: 'Pod phases · ready · restarts',
    category: 'blocks',
    blockKind: 'cloud',
    files: [
      {
        path: 'blocks/k8s-pod-table/k8s-pod-table.tsx',
        target: 'components/blocks/k8s-pod-table.tsx',
      },
    ],
    registryDependencies: [],
    dependencies: [],
    cssVars: STATUS_CSS_VARS,
  },
  {
    name: 'resource-status',
    title: 'Resource Status',
    description:
      'Statuspage-style panel: an overall banner over a list of resources, each with an operational / degraded / outage / maintenance state and uptime.',
    blockTagline: 'Statuspage · banner · uptime',
    category: 'blocks',
    blockKind: 'cloud',
    files: [
      {
        path: 'blocks/resource-status/resource-status.tsx',
        target: 'components/blocks/resource-status.tsx',
      },
    ],
    registryDependencies: [],
    dependencies: [],
    cssVars: STATUS_CSS_VARS,
  },
  {
    name: 'cluster-map',
    title: 'Cluster Map',
    description:
      'Grid heatmap of cluster nodes, each cell tinted by health and load with a hover label, plus a legend. Ships composable parts.',
    blockTagline: 'Node heatmap · health · legend',
    category: 'blocks',
    blockKind: 'cloud',
    files: [
      {
        path: 'blocks/cluster-map/cluster-map.tsx',
        target: 'components/blocks/cluster-map.tsx',
      },
    ],
    registryDependencies: [],
    dependencies: [],
    cssVars: STATUS_CSS_VARS,
  },
  {
    name: 'network-topology',
    title: 'Network Topology',
    description:
      'Coordinate-placed topology diagram: nodes with status and icons over an SVG edge layer, with animated active links. Ships composable parts.',
    blockTagline: 'Nodes · edges · animated links',
    category: 'blocks',
    blockKind: 'cloud',
    files: [
      {
        path: 'blocks/network-topology/network-topology.tsx',
        target: 'components/blocks/network-topology.tsx',
      },
    ],
    registryDependencies: [],
    dependencies: ['lucide-react'],
    cssVars: STATUS_CSS_VARS,
  },
  {
    name: 'storage-browser',
    title: 'Storage Browser',
    description:
      'Object-storage file browser with a clickable path breadcrumb, folder and file rows, sizes and modified dates. Ships composable parts.',
    blockTagline: 'Object store · breadcrumb · rows',
    category: 'blocks',
    blockKind: 'cloud',
    files: [
      {
        path: 'blocks/storage-browser/storage-browser.tsx',
        target: 'components/blocks/storage-browser.tsx',
      },
    ],
    registryDependencies: [],
    dependencies: ['lucide-react'],
  },
  {
    name: 'log-viewer',
    title: 'Log Viewer',
    description:
      'Streaming log panel with severity-colored lines, timestamps, sources and tail-follow that unpins when you scroll up. Ships composable parts.',
    blockTagline: 'Log stream · levels · tail-follow',
    category: 'blocks',
    blockKind: 'cloud',
    files: [
      {
        path: 'blocks/log-viewer/log-viewer.tsx',
        target: 'components/blocks/log-viewer.tsx',
      },
    ],
    registryDependencies: [],
    dependencies: [],
    cssVars: STATUS_CSS_VARS,
  },
  {
    name: 'terminal',
    title: 'Terminal',
    description:
      'Terminal surface with a title bar, output lines and an interactive prompt input with command-history recall. Ships composable parts.',
    blockTagline: 'Prompt · output · history recall',
    category: 'blocks',
    blockKind: 'cloud',
    files: [
      {
        path: 'blocks/terminal/terminal.tsx',
        target: 'components/blocks/terminal.tsx',
      },
    ],
    registryDependencies: [],
    dependencies: [],
    cssVars: STATUS_CSS_VARS,
  },
  {
    name: 'deployment-history',
    title: 'Deployment History',
    description:
      'Deployment feed on a connecting rail: version, environment and status (deployed, failed, building, rolled back) with commit and author meta.',
    blockTagline: 'Deploy feed · status · commits',
    category: 'blocks',
    blockKind: 'cloud',
    files: [
      {
        path: 'blocks/deployment-history/deployment-history.tsx',
        target: 'components/blocks/deployment-history.tsx',
      },
    ],
    registryDependencies: [],
    dependencies: ['lucide-react'],
    cssVars: STATUS_CSS_VARS,
  },
  {
    name: 'kanban',
    title: 'Kanban',
    description:
      'Board of columns and cards with pointer and keyboard drag-and-drop across columns, drop placeholder, empty-column hint and live-region announcements. No dnd-kit.',
    category: 'data',
    files: [{ path: 'components/kanban.tsx' }],
    registryDependencies: [],
    dependencies: ['lucide-react'],
  },
  {
    name: 'sparkline',
    title: 'Sparkline',
    description:
      'Tiny inline SVG chart in line, area or bar form with optional curve, last-point dot, reference line and hover tooltip. Tints with currentColor, no chart library.',
    category: 'data',
    files: [{ path: 'components/sparkline.tsx' }],
    registryDependencies: [],
    dependencies: [],
    cssVars: STATUS_CSS_VARS,
  },
  {
    name: 'json-viewer',
    title: 'JSON Viewer',
    description:
      'Collapsible JSON tree with typed value colors, item counts on closed nodes, long-string truncation, expand or collapse all, copy, and arrow-key navigation.',
    category: 'display',
    files: [{ path: 'components/json-viewer.tsx' }],
    registryDependencies: ['button', 'copy-button'],
    dependencies: ['lucide-react'],
    cssVars: STATUS_CSS_VARS,
  },
  {
    name: 'diff-viewer',
    title: 'Diff Viewer',
    description:
      'Line diff of two texts computed in-component with an LCS algorithm. Unified or split layout, +N / -N stats, context lines with expandable gaps. No deps.',
    category: 'display',
    files: [{ path: 'components/diff-viewer.tsx' }],
    registryDependencies: ['toggle-group'],
    dependencies: ['lucide-react'],
    cssVars: STATUS_CSS_VARS,
  },
  {
    name: 'cron-editor',
    title: 'Cron Editor',
    description:
      'Visual cron builder kept in sync with the raw expression. Presets, per-field modes, validation, a plain-English preview, and the next run times.',
    category: 'inputs',
    files: [{ path: 'components/cron-editor.tsx' }],
    registryDependencies: ['button', 'field', 'input', 'native-select'],
    dependencies: [],
  },
  {
    name: 'country-select',
    title: 'Country Select',
    description:
      'Searchable country picker with flag emoji, pinned countries, optional dial codes, and single or multiple selection. Search by name or ISO code.',
    category: 'inputs',
    files: [{ path: 'components/country-select.tsx' }],
    registryDependencies: ['button', 'command', 'popover'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'credit-card-input',
    title: 'Credit Card Input',
    description:
      'Card number, expiry, and CVC in one row with brand detection, per-brand grouping, Luhn and expiry validation, and auto-advance between fields.',
    category: 'inputs',
    files: [{ path: 'components/credit-card-input.tsx' }],
    registryDependencies: ['input'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'emoji-picker',
    title: 'Emoji Picker',
    description:
      'Self-contained emoji grid with 560+ emoji in 8 categories, keyword search, recents, skin tones, and arrow-key navigation. No dependencies.',
    category: 'pickers',
    files: [{ path: 'components/emoji-picker.tsx' }],
    registryDependencies: ['input'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'avatar-upload',
    title: 'Avatar Upload',
    description:
      'Click or drop an image, crop it to a circle or square with zoom, and preview the result. Initials fallback, size and type limits, remove control.',
    category: 'files',
    files: [{ path: 'components/avatar-upload.tsx' }],
    registryDependencies: ['button', 'dialog', 'image-cropper'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'settings-01',
    title: 'Settings 1',
    description:
      'Account settings page with a sticky section nav, card sections with label/control rows that stack on mobile, dirty-aware Save/Cancel footers, and a Danger zone with an alert-dialog confirm. Ships composable parts.',
    blockTagline: 'Section nav · label/control rows · danger zone confirm',
    category: 'blocks',
    blockKind: 'saas',
    files: [
      {
        path: 'blocks/settings-01/settings-01.tsx',
        target: 'components/blocks/settings-01.tsx',
      },
    ],
    registryDependencies: [
      'alert-dialog',
      'avatar',
      'badge',
      'button',
      'field',
      'input',
      'input-group',
      'select',
      'textarea',
    ],
    dependencies: ['lucide-react'],
    cssVars: STATUS_CSS_VARS,
  },
  {
    name: 'settings-02',
    title: 'Settings 2',
    description:
      'Security and notifications settings in tabs: change password with strength meter, two-factor toggle, revocable session list, and grouped notification switches under a Pause all master. Ships composable parts.',
    blockTagline: 'Password + 2FA · active sessions · pause all switches',
    category: 'blocks',
    blockKind: 'saas',
    files: [
      {
        path: 'blocks/settings-02/settings-02.tsx',
        target: 'components/blocks/settings-02.tsx',
      },
    ],
    registryDependencies: ['badge', 'button', 'field', 'password-input', 'switch', 'tabs'],
    dependencies: ['lucide-react'],
    cssVars: STATUS_CSS_VARS,
  },
  {
    name: 'members-01',
    title: 'Members 1',
    description:
      'Team members management: live search, inline role select, status badges, row actions menu, a pending-invites list with resend/revoke, and an invite dialog that validates emails as tags. Ships composable parts.',
    blockTagline: 'Live search · inline roles · invite dialog',
    category: 'blocks',
    blockKind: 'saas',
    files: [
      {
        path: 'blocks/members-01/members-01.tsx',
        target: 'components/blocks/members-01.tsx',
      },
    ],
    registryDependencies: [
      'avatar',
      'badge',
      'button',
      'dialog',
      'dropdown-menu',
      'field',
      'input-group',
      'select',
      'table',
      'tag-input',
    ],
    dependencies: ['lucide-react'],
    cssVars: STATUS_CSS_VARS,
  },
  {
    name: 'onboarding-01',
    title: 'Onboarding 1',
    description:
      'Four-step setup wizard on the Stepper: controlled or uncontrolled step, per-step validation gating Continue, Skip, Back, a Finish that fires onComplete, and a fade between steps. Ships composable parts.',
    blockTagline: 'Stepper header · gated Continue · done state',
    category: 'blocks',
    blockKind: 'saas',
    files: [
      {
        path: 'blocks/onboarding-01/onboarding-01.tsx',
        target: 'components/blocks/onboarding-01.tsx',
      },
    ],
    registryDependencies: [
      'button',
      'card',
      'field',
      'input',
      'input-group',
      'progress',
      'radio-group',
      'select',
      'stepper',
      'switch',
    ],
    dependencies: ['lucide-react'],
    cssVars: STATUS_CSS_VARS,
  },
  {
    name: 'two-factor-setup-01',
    title: 'Two-Factor Setup 1',
    description:
      'Three-step 2FA enrollment card: scan a real otpauth QR or copy the key, confirm a six-digit code, then save recovery codes with copy, download and a checkbox-gated finish. Ships composable parts.',
    blockTagline: 'QR + secret · six-digit verify · recovery codes',
    category: 'blocks',
    blockKind: 'login',
    files: [
      {
        path: 'blocks/two-factor-setup-01/two-factor-setup-01.tsx',
        target: 'components/blocks/two-factor-setup-01.tsx',
      },
    ],
    registryDependencies: ['button', 'checkbox', 'copy-button', 'field', 'input-otp', 'qr-code'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'coming-soon-01',
    title: 'Coming Soon 1',
    description:
      'Full-viewport launch page with a live countdown, an email notify form that shows an inline success state, and a GitHub link in the footer. Ships composable parts.',
    blockTagline: 'Countdown · notify form · inline success',
    category: 'blocks',
    blockKind: 'not-found',
    files: [
      {
        path: 'blocks/coming-soon-01/coming-soon-01.tsx',
        target: 'components/blocks/coming-soon-01.tsx',
      },
    ],
    registryDependencies: ['button', 'countdown-timer', 'field', 'input'],
    dependencies: ['lucide-react'],
    cssVars: STATUS_CSS_VARS,
  },
  {
    name: 'coming-soon-02',
    title: 'Coming Soon 2',
    description:
      'Full-viewport launch teaser: a pill badge, a word-by-word serif headline, sub-copy and a disabled pill CTA above a glowing horizon of sparkles with a rounded planet edge. Motion respects reduced-motion.',
    blockTagline: 'Word reveal · sparkle horizon · disabled CTA',
    category: 'blocks',
    blockKind: 'not-found',
    files: [
      {
        path: 'blocks/coming-soon-02/coming-soon-02.tsx',
        target: 'components/blocks/coming-soon-02.tsx',
      },
    ],
    registryDependencies: ['badge', 'sparkles'],
    dependencies: ['motion'],
  },
  {
    name: 'maintenance-01',
    title: 'Maintenance 1',
    description:
      'Scheduled maintenance page with a pulsing status dot, window card showing start, expected return and elapsed progress, paired CTAs and a timestamped updates list. Ships composable parts.',
    blockTagline: 'Pulsing status · window progress · update log',
    category: 'blocks',
    blockKind: 'not-found',
    files: [
      {
        path: 'blocks/maintenance-01/maintenance-01.tsx',
        target: 'components/blocks/maintenance-01.tsx',
      },
    ],
    registryDependencies: ['button'],
    dependencies: ['lucide-react'],
    cssVars: STATUS_CSS_VARS,
  },
  {
    name: 'maintenance-02',
    title: 'Maintenance 2',
    description:
      'Full-viewport offline page with a blurred primary glow and a sparkle field behind a pill badge, a word-by-word serif headline, a short status message and a spinner line. Message area is a live region.',
    blockTagline: 'Sparkle backdrop · word reveal · spinner status',
    category: 'blocks',
    blockKind: 'not-found',
    files: [
      {
        path: 'blocks/maintenance-02/maintenance-02.tsx',
        target: 'components/blocks/maintenance-02.tsx',
      },
    ],
    registryDependencies: ['badge', 'sparkles'],
    dependencies: ['lucide-react', 'motion'],
  },
  {
    name: 'error-01',
    title: 'Error 1',
    description:
      '500 page with a retry action, home link, collapsible technical details (request id, timestamp, copy button) and a system status line. Ships composable parts.',
    blockTagline: 'Retry + home · collapsible details · status line',
    category: 'blocks',
    blockKind: 'not-found',
    files: [
      {
        path: 'blocks/error-01/error-01.tsx',
        target: 'components/blocks/error-01.tsx',
      },
    ],
    registryDependencies: ['button', 'collapsible', 'copy-button'],
    dependencies: ['lucide-react'],
    cssVars: STATUS_CSS_VARS,
  },
  {
    name: 'team-01',
    title: 'Team 1',
    description:
      'Team section with serif headline, a bordered grid of members with initials placeholders, roles, bios, GitHub links, and a hiring footer. Ships composable parts.',
    blockTagline: 'Bordered grid · initials placeholders · hiring footer',
    category: 'blocks',
    blockKind: 'team',
    files: [
      {
        path: 'blocks/team-01/team-01.tsx',
        target: 'components/blocks/team-01.tsx',
      },
    ],
    registryDependencies: [],
    dependencies: ['lucide-react'],
  },
  {
    name: 'team-02',
    title: 'Team 2',
    description:
      'Single-profile experience section: a four-up metric strip, a bio card with a grid-pattern backdrop, and a competencies card that ends in three pause-on-hover marquee rows of skill chips with edge fades. Every element rises in on scroll and respects reduced-motion.',
    blockTagline: 'Metric strip · profile card · skills marquee',
    category: 'blocks',
    blockKind: 'team',
    files: [
      {
        path: 'blocks/team-02/team-02.tsx',
        target: 'components/blocks/team-02.tsx',
      },
    ],
    registryDependencies: ['badge', 'marquee'],
    dependencies: ['motion'],
  },
  {
    name: 'stats-01',
    title: 'Stats 1',
    description:
      'Metrics band with four large numbers that count up on scroll, labels, optional deltas, and a two-column header on large screens. Ships composable parts.',
    blockTagline: 'Counts up in view · bordered row · two-column on lg',
    category: 'blocks',
    blockKind: 'stats',
    files: [
      {
        path: 'blocks/stats-01/stats-01.tsx',
        target: 'components/blocks/stats-01.tsx',
      },
    ],
    registryDependencies: ['animated-number'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'cookie-consent',
    title: 'Cookie Consent',
    description:
      'Floating consent banner with per-category switches, accept, reject, and save actions, and a choice persisted in localStorage. Ships composable parts.',
    blockTagline: 'Per-category switches · persists choice · fixed or absolute',
    category: 'blocks',
    blockKind: 'widgets',
    files: [
      {
        path: 'blocks/cookie-consent/cookie-consent.tsx',
        target: 'components/blocks/cookie-consent.tsx',
      },
    ],
    registryDependencies: ['button', 'field', 'switch'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'changelog-01',
    title: 'Changelog 1',
    description:
      'Release notes with a sticky date rail, version badges, New / Improved / Fixed tags, a subscribe button, and a filter that narrows entries. Ships composable parts.',
    blockTagline: 'Sticky date rail · tag filter · version badges',
    category: 'blocks',
    blockKind: 'changelog',
    files: [
      {
        path: 'blocks/changelog-01/changelog-01.tsx',
        target: 'components/blocks/changelog-01.tsx',
      },
    ],
    registryDependencies: ['badge', 'button', 'toggle-group'],
    dependencies: ['lucide-react'],
    cssVars: STATUS_CSS_VARS,
  },
  {
    name: 'env-editor',
    title: 'Env Editor',
    description:
      'Environment variables editor with masked secrets, copy, per-environment chips, .env import, key validation, and unsaved-change tracking. Ships composable parts.',
    blockTagline: 'Masked secrets · .env import · key validation',
    category: 'blocks',
    blockKind: 'cloud',
    files: [
      {
        path: 'blocks/env-editor/env-editor.tsx',
        target: 'components/blocks/env-editor.tsx',
      },
    ],
    registryDependencies: ['badge', 'button', 'copy-button', 'dialog', 'field', 'input', 'input-group', 'textarea'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'prompt-input',
    title: 'Prompt Input',
    description:
      'Chat composer with an auto-growing textarea, Enter to send, attachments, a model picker, and a Stop button while streaming. Ships composable parts.',
    blockTagline: 'Auto-grow textarea · attachments · model picker',
    category: 'blocks',
    blockKind: 'ai',
    files: [
      {
        path: 'blocks/prompt-input/prompt-input.tsx',
        target: 'components/blocks/prompt-input.tsx',
      },
    ],
    registryDependencies: ['button', 'dropdown-menu', 'textarea'],
    dependencies: ['lucide-react'],
  },
  {
    name: 'message-thread',
    title: 'Message Thread',
    description:
      'Message list that follows streaming output, with tool calls, reasoning, sources, hover actions, typing dots, and a streaming cursor. Ships composable parts.',
    blockTagline: 'Sticks to bottom · tool calls · streaming cursor',
    category: 'blocks',
    blockKind: 'ai',
    files: [
      {
        path: 'blocks/message-thread/message-thread.tsx',
        target: 'components/blocks/message-thread.tsx',
      },
    ],
    registryDependencies: ['button', 'collapsible', 'copy-button'],
    dependencies: ['lucide-react'],
    cssVars: STATUS_CSS_VARS,
  },
  {
    name: 'ai-chat-01',
    title: 'AI Chat 1',
    description:
      'Full chat screen: grouped history sidebar that collapses to a sheet, top bar with model badge, streaming thread, and pinned composer. Ships composable parts.',
    blockTagline: 'History sidebar · streaming replies · Stop cancels',
    category: 'blocks',
    blockKind: 'ai',
    files: [
      {
        path: 'blocks/ai-chat-01/ai-chat-01.tsx',
        target: 'components/blocks/ai-chat-01.tsx',
      },
    ],
    registryDependencies: ['badge', 'button', 'dropdown-menu', 'input-group', 'sheet', 'textarea'],
    dependencies: ['lucide-react'],
  },
];

/**
 * Items that install through the registry but aren't showcased on the site
 * (no demo page, no sidebar entry). registry.json is generated from
 * REGISTRY + DISTRIBUTION_ONLY by scripts/build-registry.mjs.
 */
export interface DistributionOnlyEntry {
  name: string;
  title: string;
  description: string;
  type: 'registry:ui' | 'registry:component' | 'registry:block' | 'registry:theme';
  /** Raw registry.json categories. */
  categories: string[];
  /**
   * Optional because a `registry:theme` item ships only `cssVars` — no
   * source files to install.
   */
  files?: RegistryFileMeta[];
  registryDependencies?: string[];
  dependencies?: string[];
  cssVars?: RegistryCssVars;
}

export const DISTRIBUTION_ONLY: DistributionOnlyEntry[] = [
  {
    name: 'accordion',
    title: 'Accordion',
    description: 'Radix-powered accordion primitive used by the FAQ blocks. Plus icon rotates to an X on open.',
    type: 'registry:ui',
    categories: ['primitives'],
    files: [{ path: 'ui/accordion.tsx' }],
    registryDependencies: [],
    dependencies: ['radix-ui', 'lucide-react'],
  },
  {
    name: 'calendar-utils',
    title: 'Calendar Utils',
    description:
      'Dependency-free date helpers (month grids, day math, keyboard-grid navigation) shared by date-picker and date-range-picker.',
    type: 'registry:component',
    categories: ['primitives'],
    files: [{ path: 'components/calendar-utils.ts' }],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: 'theme-emerald',
    title: 'Emerald theme',
    description:
      'Emerald accent preset for the hirael palette. Sets --primary, --primary-foreground and --ring for light and dark.',
    type: 'registry:theme',
    categories: ['themes'],
    registryDependencies: [],
    dependencies: [],
    cssVars: {
      light: {
        primary: 'oklch(0.52 0.14 155)',
        'primary-foreground': 'oklch(0.98 0.01 155)',
        ring: 'oklch(0.58 0.14 155)',
      },
      dark: {
        primary: 'oklch(0.72 0.16 155)',
        'primary-foreground': 'oklch(0.14 0.02 155)',
        ring: 'oklch(0.68 0.16 155)',
      },
    },
  },
];

export const REGISTRY_BY_NAME = Object.fromEntries(REGISTRY.map((r) => [r.name, r])) as Record<
  string,
  RegistryEntryMeta
>;

export const CATEGORY_LABELS: Record<ComponentCategory, string> = {
  inputs: 'Inputs',
  pickers: 'Pickers',
  files: 'Files',
  data: 'Data display',
  display: 'Display',
  animation: 'Animation',
  navigation: 'Navigation',
  blocks: 'Blocks',
  templates: 'Templates',
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
    blocks: [],
    templates: [],
  };
  for (const entry of REGISTRY) groups[entry.category].push(entry);
  return groups;
})();

export const TEMPLATES = REGISTRY_BY_CATEGORY.templates;

export const COMPONENTS = REGISTRY.filter((entry) => entry.category !== 'blocks' && entry.category !== 'templates');

/**
 * Component bases, shadcn's `registry/bases` analog: one full tree per
 * primitive library under `registry/hirael/bases/<base>/`. Every item exists
 * in both; file paths in this file are base-relative (`ui/button.tsx`) and
 * resolve through `registryFilePath`. Radix keeps the original `/r/<name>.json`
 * install URLs; Base UI items live at `/r/base/<name>.json`.
 */
export const REGISTRY_BASES = ['radix', 'base'] as const;
export type RegistryBase = (typeof REGISTRY_BASES)[number];
export const DEFAULT_BASE: RegistryBase = 'radix';
export const BASE_LABELS: Record<RegistryBase, string> = {
  radix: 'Radix UI',
  base: 'Base UI',
};
export const isRegistryBase = (value: unknown): value is RegistryBase =>
  typeof value === 'string' && (REGISTRY_BASES as readonly string[]).includes(value);
export const registryBaseDir = (base: RegistryBase) => `registry/hirael/bases/${base}`;
export const registryFilePath = (base: RegistryBase, file: string) => `${registryBaseDir(base)}/${file}`;
export const registryItemPath = (base: RegistryBase, name: string) =>
  base === DEFAULT_BASE ? `/r/${name}.json` : `/r/${base}/${name}.json`;

/**
 * The item's detail page as Markdown, generated by `pnpm registry:md` beside
 * its install payload. It is what "Copy page" copies and what an agent handed
 * the URL reads, so both stay one document.
 */
export const registryMarkdownPath = (base: RegistryBase, name: string) =>
  base === DEFAULT_BASE ? `/r/${name}.md` : `/r/${base}/${name}.md`;

/**
 * Items declare npm dependencies once, for the Radix tree; the Base UI tree
 * swaps every Radix-backed package (`radix-ui`, `@radix-ui/*`, `vaul`) for
 * `@base-ui/react`, and adds it when a file that had no Radix dependency
 * reaches for Base UI's `useRender` (`importsBaseUi`). Everything else is
 * shared.
 */
export const BASE_UI_PACKAGE = '@base-ui/react';
const RADIX_BACKED = (pkg: string) => pkg === 'radix-ui' || pkg.startsWith('@radix-ui/') || pkg === 'vaul';

export const basePackages = (base: RegistryBase, packages: readonly string[], importsBaseUi = false): string[] => {
  if (base === 'radix') return [...packages];
  const mapped = packages.map((pkg) => (RADIX_BACKED(pkg) ? BASE_UI_PACKAGE : pkg));
  if (importsBaseUi) mapped.push(BASE_UI_PACKAGE);
  return [...new Set(mapped)];
};

/**
 * One demo a component showcases on its page. `slug` is the example file
 * basename under `<base>/examples/<slug>.tsx` and the loader key in
 * registry-demos.tsx; `title` labels the block when a component has more than
 * one. Most components have a single `<name>-demo`; list extra variants here
 * (the first entry is the representative preview used in grids and embeds).
 */
export interface ExampleRef {
  slug: string;
  title: string;
}

const EXAMPLE_OVERRIDES: Record<string, ExampleRef[]> = {
  'tag-input': [
    { slug: 'tag-input-demo', title: 'Tags' },
    { slug: 'tag-input-emails', title: 'Validated emails' },
  ],
  'date-range-picker': [
    { slug: 'date-range-picker-demo', title: 'Presets' },
    { slug: 'date-range-picker-inline', title: 'Inline calendar' },
    { slug: 'date-range-picker-bounded', title: 'Bounded, weekends disabled' },
  ],
};

/** Ordered examples for a component, defaulting to a single `<name>-demo`. */
export const getExamples = (name: string): ExampleRef[] => {
  return EXAMPLE_OVERRIDES[name] ?? [{ slug: `${name}-demo`, title: 'Example' }];
};

export const BLOCK_KIND_LABELS: Record<BlockKind, string> = {
  hero: 'Hero sections',
  feature: 'Features',
  process: 'How it works',
  pricing: 'Pricing',
  comparison: 'Comparison',
  team: 'Team',
  stats: 'Stats',
  testimonial: 'Testimonials',
  cta: 'Call-to-action',
  newsletter: 'Newsletter',
  faq: 'FAQ',
  login: 'Auth',
  header: 'Headers',
  footer: 'Footers',
  'not-found': 'Status pages',
  'logo-cloud': 'Logo cloud',
  contact: 'Contact',
  careers: 'Careers',
  blog: 'Blog',
  ecommerce: 'E-commerce',
  dashboard: 'Dashboard',
  integrations: 'Integrations',
  'image-gallery': 'Image gallery',
  'app-shell': 'App shell',
  cloud: 'Cloud',
  saas: 'SaaS',
  ai: 'AI',
  widgets: 'Widgets',
  changelog: 'Changelog',
};

export const BLOCKS_BY_KIND = (() => {
  const groups: Record<BlockKind, RegistryEntryMeta[]> = {
    hero: [],
    feature: [],
    process: [],
    pricing: [],
    comparison: [],
    team: [],
    stats: [],
    testimonial: [],
    cta: [],
    newsletter: [],
    faq: [],
    login: [],
    header: [],
    footer: [],
    'not-found': [],
    'logo-cloud': [],
    contact: [],
    careers: [],
    blog: [],
    ecommerce: [],
    dashboard: [],
    integrations: [],
    'image-gallery': [],
    'app-shell': [],
    cloud: [],
    saas: [],
    ai: [],
    widgets: [],
    changelog: [],
  };
  for (const entry of REGISTRY) {
    if (entry.category === 'blocks' && entry.blockKind) {
      groups[entry.blockKind].push(entry);
    }
  }
  return groups;
})();

export const BLOCK_KIND_ORDER: BlockKind[] = [
  'hero',
  'feature',
  'process',
  'pricing',
  'comparison',
  'team',
  'stats',
  'testimonial',
  'cta',
  'newsletter',
  'faq',
  'login',
  'header',
  'footer',
  'not-found',
  'logo-cloud',
  'contact',
  'careers',
  'blog',
  'ecommerce',
  'dashboard',
  'integrations',
  'image-gallery',
  'app-shell',
  'cloud',
  'saas',
  'ai',
  'widgets',
  'changelog',
];

/* -------------------------------------------------------------------------- */
/* Routing — every browsable item lives under its category segment            */
/* -------------------------------------------------------------------------- */

/** Component categories in display order. Drives the index, sidebar, sitemap. */
export const COMPONENT_CATEGORY_ORDER: Exclude<ComponentCategory, 'blocks' | 'templates'>[] = [
  'inputs',
  'pickers',
  'files',
  'data',
  'display',
  'animation',
  'navigation',
];

/** One-line, human blurb for each component category landing page. */
export const COMPONENT_CATEGORY_DESCRIPTIONS: Record<(typeof COMPONENT_CATEGORY_ORDER)[number], string> = {
  inputs: 'Text fields, selects, chip and tag inputs, and the form controls shadcn/ui leaves out.',
  pickers: 'Date, time, month, year and color pickers with keyboard navigation and no date library.',
  files: 'Upload zones, image croppers and local media pickers.',
  data: 'Feeds, timelines, trees, heatmaps and other ways to show structured data.',
  display: 'Callouts, code blocks, marquees, lightboxes and other visual helpers.',
  animation: 'Scroll reveals, tilts, spotlights and pointer-driven motion. Reduced-motion aware.',
  navigation: 'Docks, steppers, toolbars, split views and resizable panels.',
};

/**
 * URL slug per block kind. The slug differs from the kind key wherever the
 * plural or label reads better in a path (feature → features, login → auth).
 * This is the source of truth the block category pages derive their slug from.
 */
export const BLOCK_KIND_SLUGS: Record<BlockKind, string> = {
  hero: 'hero',
  feature: 'features',
  process: 'process',
  pricing: 'pricing',
  comparison: 'comparison',
  team: 'team',
  stats: 'stats',
  testimonial: 'testimonials',
  cta: 'cta',
  newsletter: 'newsletter',
  faq: 'faqs',
  login: 'auth',
  header: 'header',
  footer: 'footer',
  'not-found': 'not-found',
  'logo-cloud': 'logo-cloud',
  contact: 'contact',
  careers: 'careers',
  blog: 'blog',
  ecommerce: 'ecommerce',
  dashboard: 'dashboard',
  integrations: 'integrations',
  'image-gallery': 'image-gallery',
  'app-shell': 'app-shell',
  cloud: 'cloud',
  saas: 'saas',
  ai: 'ai',
  widgets: 'widgets',
  changelog: 'changelog',
};

/** The category segment an entry's detail page sits under. */
export const entryCategorySlug = (entry: RegistryEntryMeta): string => {
  if (entry.category === 'blocks' && entry.blockKind) return BLOCK_KIND_SLUGS[entry.blockKind];
  return entry.category;
};

/** Canonical site path for an entry's detail page (category in the URL). */
export const entryHref = (entry: RegistryEntryMeta): string => {
  if (entry.category === 'templates') return `/templates/${entry.name}`;
  if (entry.category === 'blocks') return `/blocks/${entryCategorySlug(entry)}/${entry.name}`;
  return `/components/${entry.category}/${entry.name}`;
};

/** Path of an entry's framed `/embed/*` preview (category in the URL). */
/** Framed preview path; non-default bases nest under `/embed/<base>/`. */
export const entryEmbedHref = (entry: RegistryEntryMeta, base: RegistryBase = DEFAULT_BASE): string => {
  const prefix = base === DEFAULT_BASE ? '/embed' : `/embed/${base}`;
  if (entry.category === 'templates') return `${prefix}/templates/${entry.name}`;
  return `${prefix}/blocks/${entryCategorySlug(entry)}/${entry.name}`;
};

export const entryFileLabel = (entry: RegistryEntryMeta): string => {
  const count = entry.files?.length ?? 0;
  return `${count} file${count === 1 ? '' : 's'}`;
};

/* -------------------------------------------------------------------------- */
/* Sibling navigation — a linear walk through each collection                 */
/* -------------------------------------------------------------------------- */

/**
 * Every component flattened into display order: category by category (the
 * sidebar / index order), and within a category the registry order. This is
 * the path the detail-page pager walks, so Next steps from the last item of
 * one category straight into the first of the next.
 */
export const COMPONENTS_ORDERED: RegistryEntryMeta[] = COMPONENT_CATEGORY_ORDER.flatMap(
  (cat) => REGISTRY_BY_CATEGORY[cat],
);

/** Every block flattened into display order: kind by kind, then registry order. */
export const BLOCKS_ORDERED: RegistryEntryMeta[] = BLOCK_KIND_ORDER.flatMap((kind) => BLOCKS_BY_KIND[kind]);

/**
 * The previous and next entry within an item's own collection
 * (components | blocks | templates). Used for the detail-page pager; either
 * side is `null` at a collection boundary.
 */
export const entrySiblings = (
  entry: RegistryEntryMeta,
): {
  prev: RegistryEntryMeta | null;
  next: RegistryEntryMeta | null;
} => {
  const list =
    entry.category === 'templates' ? TEMPLATES : entry.category === 'blocks' ? BLOCKS_ORDERED : COMPONENTS_ORDERED;
  const i = list.findIndex((e) => e.name === entry.name);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? list[i - 1] : null,
    next: i < list.length - 1 ? list[i + 1] : null,
  };
};
