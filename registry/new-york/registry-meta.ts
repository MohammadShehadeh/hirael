import * as React from "react"

import AnimatedNumberDemo from "@/registry/new-york/examples/animated-number-demo"
import AnnouncementBarDemo from "@/registry/new-york/examples/announcement-bar-demo"
import AvatarStackDemo from "@/registry/new-york/examples/avatar-stack-demo"
import CalloutDemo from "@/registry/new-york/examples/callout-demo"
import ColorPickerDemo from "@/registry/new-york/examples/color-picker-demo"
import ComboboxDemo from "@/registry/new-york/examples/combobox-demo"
import CopyButtonDemo from "@/registry/new-york/examples/copy-button-demo"
import CurrencyInputDemo from "@/registry/new-york/examples/currency-input-demo"
import EmptyStateDemo from "@/registry/new-york/examples/empty-state-demo"
import FileDropzoneDemo from "@/registry/new-york/examples/file-dropzone-demo"
import KbdDemo from "@/registry/new-york/examples/kbd-demo"
import LazySelectDemo from "@/registry/new-york/examples/lazy-select-demo"
import MarqueeDemo from "@/registry/new-york/examples/marquee-demo"
import MonthPickerDemo from "@/registry/new-york/examples/month-picker-demo"
import MultiSelectDemo from "@/registry/new-york/examples/multi-select-demo"
import NumberRangeDemo from "@/registry/new-york/examples/number-range-demo"
import PasswordInputDemo from "@/registry/new-york/examples/password-input-demo"
import PhoneInputDemo from "@/registry/new-york/examples/phone-input-demo"
import RatingDemo from "@/registry/new-york/examples/rating-demo"
import ScrollProgressDemo from "@/registry/new-york/examples/scroll-progress-demo"
import SpinnerDemo from "@/registry/new-york/examples/spinner-demo"
import StatCardDemo from "@/registry/new-york/examples/stat-card-demo"
import StepperDemo from "@/registry/new-york/examples/stepper-demo"
import TagInputDemo from "@/registry/new-york/examples/tag-input-demo"
import TimelineDemo from "@/registry/new-york/examples/timeline-demo"
import TimePickerDemo from "@/registry/new-york/examples/time-picker-demo"
import TreeViewDemo from "@/registry/new-york/examples/tree-view-demo"
import YearPickerDemo from "@/registry/new-york/examples/year-picker-demo"

import AppShell01 from "@/registry/new-york/blocks/app-shell-01/app-shell-01"
import AppShell02 from "@/registry/new-york/blocks/app-shell-02/app-shell-02"
import Blog01 from "@/registry/new-york/blocks/blog-01/blog-01"
import Contact01 from "@/registry/new-york/blocks/contact-01/contact-01"
import Cta01 from "@/registry/new-york/blocks/cta-01/cta-01"
import Cta02 from "@/registry/new-york/blocks/cta-02/cta-02"
import Dashboard01 from "@/registry/new-york/blocks/dashboard-01/dashboard-01"
import Faq01 from "@/registry/new-york/blocks/faq-01/faq-01"
import Faq02 from "@/registry/new-york/blocks/faq-02/faq-02"
import Feature01 from "@/registry/new-york/blocks/feature-01/feature-01"
import Feature02 from "@/registry/new-york/blocks/feature-02/feature-02"
import Footer01 from "@/registry/new-york/blocks/footer-01/footer-01"
import Header01 from "@/registry/new-york/blocks/header-01/header-01"
import Hero01 from "@/registry/new-york/blocks/hero-01/hero-01"
import Hero02 from "@/registry/new-york/blocks/hero-02/hero-02"
import Hero03 from "@/registry/new-york/blocks/hero-03/hero-03"
import ImageGallery01 from "@/registry/new-york/blocks/image-gallery-01/image-gallery-01"
import Integrations01 from "@/registry/new-york/blocks/integrations-01/integrations-01"
import LogoCloud01 from "@/registry/new-york/blocks/logo-cloud-01/logo-cloud-01"
import Login01 from "@/registry/new-york/blocks/login-01/login-01"
import Login02 from "@/registry/new-york/blocks/login-02/login-02"
import NotFound01 from "@/registry/new-york/blocks/not-found-01/not-found-01"
import Pricing01 from "@/registry/new-york/blocks/pricing-01/pricing-01"
import Pricing02 from "@/registry/new-york/blocks/pricing-02/pricing-02"
import Testimonial01 from "@/registry/new-york/blocks/testimonial-01/testimonial-01"
import Testimonial02 from "@/registry/new-york/blocks/testimonial-02/testimonial-02"

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
  | "dashboard"
  | "integrations"
  | "image-gallery"
  | "app-shell"

export type RegistryEntryMeta = {
  name: string
  title: string
  description: string
  category: ComponentCategory
  status: "stable" | "planned"
  Demo?: React.ComponentType
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
    status: "stable",
    Demo: MultiSelectDemo,
    sourceFiles: ["registry/new-york/ui/multi-select.tsx"],
    registryDependencies: ["button", "popover", "command", "badge"],
    dependencies: ["cmdk", "lucide-react"],
  },
  {
    name: "number-range",
    title: "Number Range",
    description:
      "Two-thumb slider paired with synced number inputs, locale-aware formatting.",
    category: "inputs",
    status: "stable",
    Demo: NumberRangeDemo,
    sourceFiles: ["registry/new-york/ui/number-range.tsx"],
    registryDependencies: ["slider", "input", "label"],
    dependencies: ["@radix-ui/react-slider"],
  },
  {
    name: "year-picker",
    title: "Year Picker",
    description:
      "Decade-grid year picker with keyboard nav, min/max bounds, single or range mode.",
    category: "pickers",
    status: "stable",
    Demo: YearPickerDemo,
    sourceFiles: ["registry/new-york/ui/year-picker.tsx"],
    registryDependencies: ["button", "popover"],
    dependencies: ["lucide-react"],
  },
  {
    name: "tag-input",
    title: "Tag Input",
    description:
      "Chip input with paste-to-split, dedupe, validation hook, max tags. Compound and single-prop APIs.",
    category: "inputs",
    status: "stable",
    Demo: TagInputDemo,
    sourceFiles: ["registry/new-york/ui/tag-input.tsx"],
    registryDependencies: ["badge"],
    dependencies: ["lucide-react"],
  },
  {
    name: "combobox",
    title: "Combobox",
    description:
      "Searchable single-select with debounced async loader, group headings and clearable selection.",
    category: "inputs",
    status: "stable",
    Demo: ComboboxDemo,
    sourceFiles: ["registry/new-york/ui/combobox.tsx"],
    registryDependencies: ["button", "popover", "command"],
    dependencies: ["cmdk", "lucide-react"],
  },
  {
    name: "lazy-select",
    title: "Lazy Select",
    description:
      "Autocomplete single-select that defers loading until open and pages through results on scroll. Debounced server-side search with a pluggable lazy paginator hook.",
    category: "inputs",
    status: "stable",
    Demo: LazySelectDemo,
    sourceFiles: ["registry/new-york/ui/lazy-select.tsx"],
    registryDependencies: ["popover", "command"],
    dependencies: ["cmdk", "lucide-react"],
  },
  {
    name: "password-input",
    title: "Password Input",
    description:
      "Show/hide toggle with an optional pluggable strength meter. Compound and single-prop APIs.",
    category: "inputs",
    status: "stable",
    Demo: PasswordInputDemo,
    sourceFiles: ["registry/new-york/ui/password-input.tsx"],
    registryDependencies: ["input"],
    dependencies: ["lucide-react"],
  },
  {
    name: "currency-input",
    title: "Currency Input",
    description:
      "Locale-aware grouping with currency-symbol prefix and configurable decimal precision.",
    category: "inputs",
    status: "stable",
    Demo: CurrencyInputDemo,
    sourceFiles: ["registry/new-york/ui/currency-input.tsx"],
    registryDependencies: ["input"],
    dependencies: [],
  },
  {
    name: "phone-input",
    title: "Phone Input",
    description:
      "Country dial-code dropdown with E.164 output. Compound and single-prop APIs.",
    category: "inputs",
    status: "stable",
    Demo: PhoneInputDemo,
    sourceFiles: ["registry/new-york/ui/phone-input.tsx"],
    registryDependencies: ["input", "popover", "command"],
    dependencies: ["lucide-react"],
  },
  {
    name: "file-dropzone",
    title: "File Dropzone",
    description:
      "Drag-drop + click upload zone with previews, accept and max-size validation. Compound and single-prop APIs.",
    category: "files",
    status: "stable",
    Demo: FileDropzoneDemo,
    sourceFiles: ["registry/new-york/ui/file-dropzone.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "stat-card",
    title: "Stat Card",
    description:
      "Compact metric card with label, value, and an up/down/flat trend chip.",
    category: "data",
    status: "stable",
    Demo: StatCardDemo,
    sourceFiles: ["registry/new-york/ui/stat-card.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "rating",
    title: "Rating",
    description:
      "Star rating with hover preview, half-star precision, read-only mode and sm / md / lg sizes.",
    category: "inputs",
    status: "stable",
    Demo: RatingDemo,
    sourceFiles: ["registry/new-york/ui/rating.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "timeline",
    title: "Timeline",
    description:
      "Vertical event timeline with default or icon dots, tone variants and labelled time / title / description parts.",
    category: "data",
    status: "stable",
    Demo: TimelineDemo,
    sourceFiles: ["registry/new-york/ui/timeline.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "kbd",
    title: "Kbd",
    description:
      "3D tactile keycap with hover lift and pressed states. Compound API with KbdGroup for chords and KbdDisplay for inline keys.",
    category: "display",
    status: "stable",
    Demo: KbdDemo,
    sourceFiles: ["registry/new-york/ui/kbd.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "callout",
    title: "Callout",
    description:
      "MDX-style admonition with info / success / warning / error / neutral variants and optional icon override.",
    category: "display",
    status: "stable",
    Demo: CalloutDemo,
    sourceFiles: ["registry/new-york/ui/callout.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react", "class-variance-authority"],
  },
  {
    name: "scroll-progress",
    title: "Scroll Progress",
    description:
      "Fixed reading progress bar. Tracks document scroll by default or a scoped container ref.",
    category: "display",
    status: "stable",
    Demo: ScrollProgressDemo,
    sourceFiles: ["registry/new-york/ui/scroll-progress.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "hero-01",
    title: "Hero · Split with install card",
    description:
      "Split hero with eyebrow tag, display headline, dual CTA, three-stat strip and a mock install-card visual.",
    blockTagline: "Split layout · stat strip · mock install card",
    category: "blocks",
    blockKind: "hero",
    status: "stable",
    Demo: Hero01,
    sourceFiles: ["registry/new-york/blocks/hero-01/hero-01.tsx"],
    installTargets: ["components/blocks/hero-01.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "hero-02",
    title: "Hero · Centered editorial",
    description:
      "Centered hero with animated live-pill, display headline with underlined accent, sub-copy and a trusted-by wordmark strip.",
    blockTagline: "Centered · live pill · wordmark strip",
    category: "blocks",
    blockKind: "hero",
    status: "stable",
    Demo: Hero02,
    sourceFiles: ["registry/new-york/blocks/hero-02/hero-02.tsx"],
    installTargets: ["components/blocks/hero-02.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "hero-03",
    title: "Hero · Email capture",
    description:
      "Centered hero with a rating pill, display headline, sub-copy, an inline email-capture form with a success state, a feature checklist and an avatar social-proof row.",
    blockTagline: "Centered · email capture · social proof",
    category: "blocks",
    blockKind: "hero",
    status: "stable",
    Demo: Hero03,
    sourceFiles: ["registry/new-york/blocks/hero-03/hero-03.tsx"],
    installTargets: ["components/blocks/hero-03.tsx"],
    registryDependencies: ["button", "input"],
    dependencies: ["lucide-react"],
  },
  {
    name: "feature-01",
    title: "Feature · Alternating rows",
    description:
      "Three alternating feature rows, each pairing a stylized Tailwind-only mock UI with a copy column (eyebrow, headline, paragraph, 3-item checklist).",
    blockTagline: "Alternating rows · mock UIs · checklist",
    category: "blocks",
    blockKind: "feature",
    status: "stable",
    Demo: Feature01,
    sourceFiles: ["registry/new-york/blocks/feature-01/feature-01.tsx"],
    installTargets: ["components/blocks/feature-01.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "feature-02",
    title: "Feature · Icon grid",
    description:
      "Section header above a 3-column, 2-row grid of bordered feature cards with lucide icons, headlines and short blurbs.",
    blockTagline: "Icon grid · 6 cards · concise blurbs",
    category: "blocks",
    blockKind: "feature",
    status: "stable",
    Demo: Feature02,
    sourceFiles: ["registry/new-york/blocks/feature-02/feature-02.tsx"],
    installTargets: ["components/blocks/feature-02.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "pricing-01",
    title: "Pricing · Three tiers",
    description:
      "Three-tier card row with a featured middle plan. Each card lists price, blurb, feature checklist and a primary or outline CTA.",
    blockTagline: "3 tiers · featured plan · checklist",
    category: "blocks",
    blockKind: "pricing",
    status: "stable",
    Demo: Pricing01,
    sourceFiles: ["registry/new-york/blocks/pricing-01/pricing-01.tsx"],
    installTargets: ["components/blocks/pricing-01.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "pricing-02",
    title: "Pricing · Comparison table",
    description:
      "Compare-by-feature pricing table with sticky tier header (tier name, price, CTA) and ~8 feature rows below.",
    blockTagline: "Comparison table · sticky header · per-tier CTA",
    category: "blocks",
    blockKind: "pricing",
    status: "stable",
    Demo: Pricing02,
    sourceFiles: ["registry/new-york/blocks/pricing-02/pricing-02.tsx"],
    installTargets: ["components/blocks/pricing-02.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "testimonial-01",
    title: "Testimonial · Single quote",
    description:
      "Centered single quote with stylized open-mark, author block (avatar, name, role, company) and a muted wordmark row below.",
    blockTagline: "Single quote · author block · wordmark row",
    category: "blocks",
    blockKind: "testimonial",
    status: "stable",
    Demo: Testimonial01,
    sourceFiles: ["registry/new-york/blocks/testimonial-01/testimonial-01.tsx"],
    installTargets: ["components/blocks/testimonial-01.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "testimonial-02",
    title: "Testimonial · Masonry grid",
    description:
      "Masonry quote grid (CSS columns) with ~6 bordered quote cards of varying length and author rows.",
    blockTagline: "Masonry grid · 6 quotes · varied length",
    category: "blocks",
    blockKind: "testimonial",
    status: "stable",
    Demo: Testimonial02,
    sourceFiles: ["registry/new-york/blocks/testimonial-02/testimonial-02.tsx"],
    installTargets: ["components/blocks/testimonial-02.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "cta-01",
    title: "CTA · Framed band",
    description:
      "Framed CTA card with corner marks, headline + sub-copy on the left, dual buttons stacked on the right.",
    blockTagline: "Framed · split layout · corner marks",
    category: "blocks",
    blockKind: "cta",
    status: "stable",
    Demo: Cta01,
    sourceFiles: ["registry/new-york/blocks/cta-01/cta-01.tsx"],
    installTargets: ["components/blocks/cta-01.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "cta-02",
    title: "CTA · Centered announcement",
    description:
      "Full-bleed centered CTA with framing top/bottom rules, highlight underlay on the key word, and an inline install command.",
    blockTagline: "Centered · highlight underlay · install command",
    category: "blocks",
    blockKind: "cta",
    status: "stable",
    Demo: Cta02,
    sourceFiles: ["registry/new-york/blocks/cta-02/cta-02.tsx"],
    installTargets: ["components/blocks/cta-02.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "faq-01",
    title: "FAQ · Sticky split",
    description:
      "Two-column FAQ — sticky heading + contact card on the left, numbered accordion on the right.",
    blockTagline: "Sticky split · numbered · contact card",
    category: "blocks",
    blockKind: "faq",
    status: "stable",
    Demo: Faq01,
    sourceFiles: ["registry/new-york/blocks/faq-01/faq-01.tsx"],
    installTargets: ["components/blocks/faq-01.tsx"],
    registryDependencies: ["button", "accordion"],
    dependencies: ["@radix-ui/react-accordion", "lucide-react"],
  },
  {
    name: "faq-02",
    title: "FAQ · Centered grid",
    description:
      "Centered heading with two-column accordion grid below. Each row tagged with a Qn index.",
    blockTagline: "Centered · two-column grid · Qn-indexed",
    category: "blocks",
    blockKind: "faq",
    status: "stable",
    Demo: Faq02,
    sourceFiles: ["registry/new-york/blocks/faq-02/faq-02.tsx"],
    installTargets: ["components/blocks/faq-02.tsx"],
    registryDependencies: ["accordion"],
    dependencies: ["@radix-ui/react-accordion"],
  },
  {
    name: "login-01",
    title: "Login · Centered card",
    description:
      "Centered login card with monogram, email + password (using the password-input component), remember-me, divider and GitHub / Google providers.",
    blockTagline: "Centered card · providers · password-input",
    category: "blocks",
    blockKind: "login",
    status: "stable",
    Demo: Login01,
    sourceFiles: ["registry/new-york/blocks/login-01/login-01.tsx"],
    installTargets: ["components/blocks/login-01.tsx"],
    registryDependencies: ["button", "input", "label", "password-input"],
    dependencies: ["lucide-react"],
  },
  {
    name: "login-02",
    title: "Login · Split with testimonial",
    description:
      "Two-pane login: form on the left, dark testimonial panel with quote and metrics on the right. Uses the strength-meter variant of password-input.",
    blockTagline: "Split · testimonial pane · strength meter",
    category: "blocks",
    blockKind: "login",
    status: "stable",
    Demo: Login02,
    sourceFiles: ["registry/new-york/blocks/login-02/login-02.tsx"],
    installTargets: ["components/blocks/login-02.tsx"],
    registryDependencies: ["button", "input", "label", "password-input"],
    dependencies: ["lucide-react"],
  },
  {
    name: "header-01",
    title: "Header · Sticky nav",
    description:
      "Sticky top nav with brand monogram, centered anchor links, dual auth CTAs and a slide-down mobile menu.",
    blockTagline: "Sticky · backdrop blur · mobile menu",
    category: "blocks",
    blockKind: "header",
    status: "stable",
    Demo: Header01,
    sourceFiles: ["registry/new-york/blocks/header-01/header-01.tsx"],
    installTargets: ["components/blocks/header-01.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "footer-01",
    title: "Footer · Four columns",
    description:
      "Brand + tagline column alongside Product / Company / Resources link columns, with a copyright row and social icons below a thin rule.",
    blockTagline: "4 columns · social row · copyright",
    category: "blocks",
    blockKind: "footer",
    status: "stable",
    Demo: Footer01,
    sourceFiles: ["registry/new-york/blocks/footer-01/footer-01.tsx"],
    installTargets: ["components/blocks/footer-01.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "not-found-01",
    title: "Not Found · centered 404",
    description:
      "Centered 404 with mono eyebrow, display headline, paired CTAs and a 'try one of these' suggested-routes list.",
    blockTagline: "Centered · paired CTAs · route suggestions",
    category: "blocks",
    blockKind: "not-found",
    status: "stable",
    Demo: NotFound01,
    sourceFiles: ["registry/new-york/blocks/not-found-01/not-found-01.tsx"],
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
    status: "stable",
    Demo: MonthPickerDemo,
    sourceFiles: ["registry/new-york/ui/month-picker.tsx"],
    registryDependencies: ["button", "popover"],
    dependencies: ["lucide-react"],
  },
  {
    name: "time-picker",
    title: "Time Picker",
    description:
      "Hour, minute and optional second scroll columns with 12/24h modes, step intervals and keyboard nav.",
    category: "pickers",
    status: "stable",
    Demo: TimePickerDemo,
    sourceFiles: ["registry/new-york/ui/time-picker.tsx"],
    registryDependencies: ["popover"],
    dependencies: ["lucide-react"],
  },
  {
    name: "color-picker",
    title: "Color Picker",
    description:
      "SV gradient + hue slider with HEX / RGB / HSL tabs, eyedropper (where supported) and recent swatches.",
    category: "pickers",
    status: "stable",
    Demo: ColorPickerDemo,
    sourceFiles: ["registry/new-york/ui/color-picker.tsx"],
    registryDependencies: ["popover", "input"],
    dependencies: ["lucide-react"],
  },
  {
    name: "avatar-stack",
    title: "Avatar Stack",
    description:
      "Overlapping avatar group with size (sm/md/lg) and spacing (tight/normal/loose) variants, image or fallback support, numeric overflow chip, and asChild on items/overflow so each avatar can render as a link or button.",
    category: "data",
    status: "stable",
    Demo: AvatarStackDemo,
    sourceFiles: ["registry/new-york/ui/avatar-stack.tsx"],
    registryDependencies: [],
    dependencies: ["@radix-ui/react-slot"],
  },
  {
    name: "announcement-bar",
    title: "Announcement Bar",
    description:
      "Top-of-page banner with default / primary / muted tones, optional dismiss button and localStorage persistence.",
    category: "display",
    status: "stable",
    Demo: AnnouncementBarDemo,
    sourceFiles: ["registry/new-york/ui/announcement-bar.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "empty-state",
    title: "Empty State",
    description:
      "Dashed-bordered empty-state surface with media slot, title, description and an action row.",
    category: "display",
    status: "stable",
    Demo: EmptyStateDemo,
    sourceFiles: ["registry/new-york/ui/empty-state.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "logo-cloud-01",
    title: "Logo Cloud · Bordered grid",
    description:
      "Centered eyebrow + headline above a 5-column bordered wordmark grid, with stat strip and case-study link below.",
    blockTagline: "Bordered grid · 10 wordmarks · stat strip",
    category: "blocks",
    blockKind: "logo-cloud",
    status: "stable",
    Demo: LogoCloud01,
    sourceFiles: ["registry/new-york/blocks/logo-cloud-01/logo-cloud-01.tsx"],
    installTargets: ["components/blocks/logo-cloud-01.tsx"],
    registryDependencies: ["badge", "button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "contact-01",
    title: "Contact · Split form",
    description:
      "Production contact form with controlled state, inline validation, character counter, topic select, consent checkbox and a pending/sent state machine. Channel list and remote-location card alongside.",
    blockTagline: "Validated form · pending · sent state",
    category: "blocks",
    blockKind: "contact",
    status: "stable",
    Demo: Contact01,
    sourceFiles: ["registry/new-york/blocks/contact-01/contact-01.tsx"],
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
    title: "Blog · Featured post and grid",
    description:
      "Editorial blog index with a featured post on top and a 4-column grid of post cards underneath. Built on Card and Badge.",
    blockTagline: "Featured post · 4-up Card grid",
    category: "blocks",
    blockKind: "blog",
    status: "stable",
    Demo: Blog01,
    sourceFiles: ["registry/new-york/blocks/blog-01/blog-01.tsx"],
    installTargets: ["components/blocks/blog-01.tsx"],
    registryDependencies: ["badge", "button", "card", "separator"],
    dependencies: ["lucide-react"],
  },
  {
    name: "dashboard-01",
    title: "Dashboard · Metrics and chart",
    description:
      "Operations dashboard with Tabs date-range switcher (1d / 7d / 30d / 90d), 4-up metric strip, weekly bar chart and a recent-activity feed. Data switches live with the range.",
    blockTagline: "Tabs range · 4 metrics · live data",
    category: "blocks",
    blockKind: "dashboard",
    status: "stable",
    Demo: Dashboard01,
    sourceFiles: ["registry/new-york/blocks/dashboard-01/dashboard-01.tsx"],
    installTargets: ["components/blocks/dashboard-01.tsx"],
    registryDependencies: ["badge", "button", "card", "separator", "tabs"],
    dependencies: ["lucide-react"],
  },
  {
    name: "integrations-01",
    title: "Integrations · Hub and spoke",
    description:
      "Two-column integrations section with copy and feature list on the left, orbit diagram (central hub + 7 logo spokes connected by dashed rays) on the right.",
    blockTagline: "Hub & spoke · 7 spokes · orbit ring",
    category: "blocks",
    blockKind: "integrations",
    status: "stable",
    Demo: Integrations01,
    sourceFiles: [
      "registry/new-york/blocks/integrations-01/integrations-01.tsx",
    ],
    installTargets: ["components/blocks/integrations-01.tsx"],
    registryDependencies: ["badge", "button", "card"],
    dependencies: ["lucide-react"],
  },
  {
    name: "image-gallery-01",
    title: "Image Gallery · Filterable masonry",
    description:
      "Studio-style masonry gallery with Tabs-driven category filter, real photo tiles via next/image, varied aspect ratios, hover zoom + arrow chip and an EmptyState fallback for empty filters.",
    blockTagline: "Tabs filter · masonry · empty state",
    category: "blocks",
    blockKind: "image-gallery",
    status: "stable",
    Demo: ImageGallery01,
    sourceFiles: [
      "registry/new-york/blocks/image-gallery-01/image-gallery-01.tsx",
    ],
    installTargets: ["components/blocks/image-gallery-01.tsx"],
    registryDependencies: ["badge", "button", "empty-state", "tabs"],
    dependencies: ["lucide-react"],
  },
  {
    name: "app-shell-01",
    title: "App Shell · Sidebar and topbar",
    description:
      "Drop-in admin shell layout built on the shadcn Sidebar primitive: collapsible icon-rail sidebar with nav badges and a footer profile row, sticky topbar with breadcrumb, command-palette search and notification button, plus a live-filtering accounts table in the main area.",
    blockTagline: "Collapsible Sidebar · sticky topbar · live table",
    category: "blocks",
    blockKind: "app-shell",
    status: "stable",
    Demo: AppShell01,
    sourceFiles: ["registry/new-york/blocks/app-shell-01/app-shell-01.tsx"],
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
    title: "App Shell · Top nav and settings",
    description:
      "Sidebar-free admin shell with a sticky top navigation bar (logo, primary links, search and avatar) over a settings layout: an in-page vertical nav switches a detail card of definition-list fields with per-field edit actions.",
    blockTagline: "Top nav · in-page settings nav · detail card",
    category: "blocks",
    blockKind: "app-shell",
    status: "stable",
    Demo: AppShell02,
    sourceFiles: ["registry/new-york/blocks/app-shell-02/app-shell-02.tsx"],
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
    name: "spinner",
    title: "Spinner",
    description:
      "Loading indicator with circle, dots and bars variants, sm / md / lg sizes. Inherits the current text color and ships an accessible status label.",
    category: "display",
    status: "stable",
    Demo: SpinnerDemo,
    sourceFiles: ["registry/new-york/ui/spinner.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "copy-button",
    title: "Copy Button",
    description:
      "Click-to-copy button with copied feedback, icon-only or labelled, ghost / outline variants and a non-secure-context clipboard fallback.",
    category: "display",
    status: "stable",
    Demo: CopyButtonDemo,
    sourceFiles: ["registry/new-york/ui/copy-button.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "marquee",
    title: "Marquee",
    description:
      "Infinite scrolling row or column for logos and testimonials, with pause-on-hover, reverse and vertical modes. Keyframes ship inline — zero config.",
    category: "display",
    status: "stable",
    Demo: MarqueeDemo,
    sourceFiles: ["registry/new-york/ui/marquee.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "tree-view",
    title: "Tree View",
    description:
      "Collapsible nested tree for file explorers and hierarchical data, with auto folder/file icons, depth indentation, selection and keyboard focus.",
    category: "data",
    status: "stable",
    Demo: TreeViewDemo,
    sourceFiles: ["registry/new-york/ui/tree-view.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "animated-number",
    title: "Animated Number",
    description:
      "Count-up number that tweens to its target with easing, Intl formatting (currency, compact, percent), prefix/suffix and reduced-motion support.",
    category: "data",
    status: "stable",
    Demo: AnimatedNumberDemo,
    sourceFiles: ["registry/new-york/ui/animated-number.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "stepper",
    title: "Stepper",
    description:
      "Multi-step progress indicator with horizontal and vertical orientation, completed / active / inactive states, clickable steps and a compound API.",
    category: "navigation",
    status: "stable",
    Demo: StepperDemo,
    sourceFiles: ["registry/new-york/ui/stepper.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
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
  "dashboard",
  "integrations",
  "image-gallery",
  "app-shell",
]
