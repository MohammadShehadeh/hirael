import * as React from "react"

import AnnouncementBarDemo from "@/registry/msh-ui/announcement-bar/announcement-bar.demo"
import AvatarStackDemo from "@/registry/msh-ui/avatar-stack/avatar-stack.demo"
import CalloutDemo from "@/registry/msh-ui/callout/callout.demo"
import ColorPickerDemo from "@/registry/msh-ui/color-picker/color-picker.demo"
import ComboboxDemo from "@/registry/msh-ui/combobox/combobox.demo"
import CurrencyInputDemo from "@/registry/msh-ui/currency-input/currency-input.demo"
import EmptyStateDemo from "@/registry/msh-ui/empty-state/empty-state.demo"
import FileDropzoneDemo from "@/registry/msh-ui/file-dropzone/file-dropzone.demo"
import KbdDemo from "@/registry/msh-ui/kbd/kbd.demo"
import MonthPickerDemo from "@/registry/msh-ui/month-picker/month-picker.demo"
import MultiSelectDemo from "@/registry/msh-ui/multi-select/multi-select.demo"
import NumberRangeDemo from "@/registry/msh-ui/number-range/number-range.demo"
import PasswordInputDemo from "@/registry/msh-ui/password-input/password-input.demo"
import PhoneInputDemo from "@/registry/msh-ui/phone-input/phone-input.demo"
import RatingDemo from "@/registry/msh-ui/rating/rating.demo"
import ScrollProgressDemo from "@/registry/msh-ui/scroll-progress/scroll-progress.demo"
import StatCardDemo from "@/registry/msh-ui/stat-card/stat-card.demo"
import TagInputDemo from "@/registry/msh-ui/tag-input/tag-input.demo"
import TimelineDemo from "@/registry/msh-ui/timeline/timeline.demo"
import TimePickerDemo from "@/registry/msh-ui/time-picker/time-picker.demo"
import YearPickerDemo from "@/registry/msh-ui/year-picker/year-picker.demo"

import AppShell01 from "@/registry/msh-ui/blocks/app-shell-01/app-shell-01"
import Blog01 from "@/registry/msh-ui/blocks/blog-01/blog-01"
import Contact01 from "@/registry/msh-ui/blocks/contact-01/contact-01"
import Cta01 from "@/registry/msh-ui/blocks/cta-01/cta-01"
import Cta02 from "@/registry/msh-ui/blocks/cta-02/cta-02"
import Dashboard01 from "@/registry/msh-ui/blocks/dashboard-01/dashboard-01"
import Faq01 from "@/registry/msh-ui/blocks/faq-01/faq-01"
import Faq02 from "@/registry/msh-ui/blocks/faq-02/faq-02"
import Feature01 from "@/registry/msh-ui/blocks/feature-01/feature-01"
import Feature02 from "@/registry/msh-ui/blocks/feature-02/feature-02"
import Footer01 from "@/registry/msh-ui/blocks/footer-01/footer-01"
import Header01 from "@/registry/msh-ui/blocks/header-01/header-01"
import Hero01 from "@/registry/msh-ui/blocks/hero-01/hero-01"
import Hero02 from "@/registry/msh-ui/blocks/hero-02/hero-02"
import ImageGallery01 from "@/registry/msh-ui/blocks/image-gallery-01/image-gallery-01"
import Integrations01 from "@/registry/msh-ui/blocks/integrations-01/integrations-01"
import LogoCloud01 from "@/registry/msh-ui/blocks/logo-cloud-01/logo-cloud-01"
import Login01 from "@/registry/msh-ui/blocks/login-01/login-01"
import Login02 from "@/registry/msh-ui/blocks/login-02/login-02"
import NotFound01 from "@/registry/msh-ui/blocks/not-found-01/not-found-01"
import Pricing01 from "@/registry/msh-ui/blocks/pricing-01/pricing-01"
import Pricing02 from "@/registry/msh-ui/blocks/pricing-02/pricing-02"
import Testimonial01 from "@/registry/msh-ui/blocks/testimonial-01/testimonial-01"
import Testimonial02 from "@/registry/msh-ui/blocks/testimonial-02/testimonial-02"

export type ComponentCategory =
  | "inputs"
  | "pickers"
  | "files"
  | "data"
  | "display"
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
    sourceFiles: ["registry/msh-ui/ui/multi-select.tsx"],
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
    sourceFiles: ["registry/msh-ui/ui/number-range.tsx"],
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
    sourceFiles: ["registry/msh-ui/ui/year-picker.tsx"],
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
    sourceFiles: ["registry/msh-ui/ui/tag-input.tsx"],
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
    sourceFiles: ["registry/msh-ui/ui/combobox.tsx"],
    registryDependencies: ["button", "popover", "command"],
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
    sourceFiles: ["registry/msh-ui/ui/password-input.tsx"],
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
    sourceFiles: ["registry/msh-ui/ui/currency-input.tsx"],
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
    sourceFiles: ["registry/msh-ui/ui/phone-input.tsx"],
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
    sourceFiles: ["registry/msh-ui/ui/file-dropzone.tsx"],
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
    sourceFiles: ["registry/msh-ui/ui/stat-card.tsx"],
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
    sourceFiles: ["registry/msh-ui/ui/rating.tsx"],
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
    sourceFiles: ["registry/msh-ui/ui/timeline.tsx"],
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
    sourceFiles: ["registry/msh-ui/ui/kbd.tsx"],
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
    sourceFiles: ["registry/msh-ui/ui/callout.tsx"],
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
    sourceFiles: ["registry/msh-ui/ui/scroll-progress.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "hero-01",
    title: "Hero · stat strip + install card",
    description:
      "Split hero with eyebrow tag, display headline, dual CTA, three-stat strip and a mock install-card visual.",
    blockTagline: "Split layout · stat strip · mock install card",
    category: "blocks",
    blockKind: "hero",
    status: "stable",
    Demo: Hero01,
    sourceFiles: ["registry/msh-ui/blocks/hero-01/hero-01.tsx"],
    installTargets: ["components/blocks/hero-01.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "hero-02",
    title: "Hero · centered editorial",
    description:
      "Centered hero with animated live-pill, display headline with underlined accent, sub-copy and a trusted-by wordmark strip.",
    blockTagline: "Centered · live pill · wordmark strip",
    category: "blocks",
    blockKind: "hero",
    status: "stable",
    Demo: Hero02,
    sourceFiles: ["registry/msh-ui/blocks/hero-02/hero-02.tsx"],
    installTargets: ["components/blocks/hero-02.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "feature-01",
    title: "Feature · alternating rows",
    description:
      "Three alternating feature rows, each pairing a stylized Tailwind-only mock UI with a copy column (eyebrow, headline, paragraph, 3-item checklist).",
    blockTagline: "Alternating rows · mock UIs · checklist",
    category: "blocks",
    blockKind: "feature",
    status: "stable",
    Demo: Feature01,
    sourceFiles: ["registry/msh-ui/blocks/feature-01/feature-01.tsx"],
    installTargets: ["components/blocks/feature-01.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "feature-02",
    title: "Feature · 3-up icon grid",
    description:
      "Section header above a 3-column, 2-row grid of bordered feature cards with lucide icons, headlines and short blurbs.",
    blockTagline: "Icon grid · 6 cards · concise blurbs",
    category: "blocks",
    blockKind: "feature",
    status: "stable",
    Demo: Feature02,
    sourceFiles: ["registry/msh-ui/blocks/feature-02/feature-02.tsx"],
    installTargets: ["components/blocks/feature-02.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "pricing-01",
    title: "Pricing · three-tier cards",
    description:
      "Three-tier card row with a featured middle plan. Each card lists price, blurb, feature checklist and a primary or outline CTA.",
    blockTagline: "3 tiers · featured plan · checklist",
    category: "blocks",
    blockKind: "pricing",
    status: "stable",
    Demo: Pricing01,
    sourceFiles: ["registry/msh-ui/blocks/pricing-01/pricing-01.tsx"],
    installTargets: ["components/blocks/pricing-01.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "pricing-02",
    title: "Pricing · feature comparison table",
    description:
      "Compare-by-feature pricing table with sticky tier header (tier name, price, CTA) and ~8 feature rows below.",
    blockTagline: "Comparison table · sticky header · per-tier CTA",
    category: "blocks",
    blockKind: "pricing",
    status: "stable",
    Demo: Pricing02,
    sourceFiles: ["registry/msh-ui/blocks/pricing-02/pricing-02.tsx"],
    installTargets: ["components/blocks/pricing-02.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "testimonial-01",
    title: "Testimonial · single big quote",
    description:
      "Centered single quote with stylized open-mark, author block (avatar, name, role, company) and a muted wordmark row below.",
    blockTagline: "Single quote · author block · wordmark row",
    category: "blocks",
    blockKind: "testimonial",
    status: "stable",
    Demo: Testimonial01,
    sourceFiles: ["registry/msh-ui/blocks/testimonial-01/testimonial-01.tsx"],
    installTargets: ["components/blocks/testimonial-01.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "testimonial-02",
    title: "Testimonial · masonry grid",
    description:
      "Masonry quote grid (CSS columns) with ~6 bordered quote cards of varying length and author rows.",
    blockTagline: "Masonry grid · 6 quotes · varied length",
    category: "blocks",
    blockKind: "testimonial",
    status: "stable",
    Demo: Testimonial02,
    sourceFiles: ["registry/msh-ui/blocks/testimonial-02/testimonial-02.tsx"],
    installTargets: ["components/blocks/testimonial-02.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "cta-01",
    title: "CTA · framed band",
    description:
      "Framed CTA card with corner marks, headline + sub-copy on the left, dual buttons stacked on the right.",
    blockTagline: "Framed · split layout · corner marks",
    category: "blocks",
    blockKind: "cta",
    status: "stable",
    Demo: Cta01,
    sourceFiles: ["registry/msh-ui/blocks/cta-01/cta-01.tsx"],
    installTargets: ["components/blocks/cta-01.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "cta-02",
    title: "CTA · centered announce",
    description:
      "Full-bleed centered CTA with framing top/bottom rules, highlight underlay on the key word, and an inline install command.",
    blockTagline: "Centered · highlight underlay · install command",
    category: "blocks",
    blockKind: "cta",
    status: "stable",
    Demo: Cta02,
    sourceFiles: ["registry/msh-ui/blocks/cta-02/cta-02.tsx"],
    installTargets: ["components/blocks/cta-02.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "faq-01",
    title: "FAQ · sticky split",
    description:
      "Two-column FAQ — sticky heading + contact card on the left, numbered accordion on the right.",
    blockTagline: "Sticky split · numbered · contact card",
    category: "blocks",
    blockKind: "faq",
    status: "stable",
    Demo: Faq01,
    sourceFiles: ["registry/msh-ui/blocks/faq-01/faq-01.tsx"],
    installTargets: ["components/blocks/faq-01.tsx"],
    registryDependencies: ["button", "accordion"],
    dependencies: ["@radix-ui/react-accordion", "lucide-react"],
  },
  {
    name: "faq-02",
    title: "FAQ · centered grid",
    description:
      "Centered heading with two-column accordion grid below. Each row tagged with a Qn index.",
    blockTagline: "Centered · two-column grid · Qn-indexed",
    category: "blocks",
    blockKind: "faq",
    status: "stable",
    Demo: Faq02,
    sourceFiles: ["registry/msh-ui/blocks/faq-02/faq-02.tsx"],
    installTargets: ["components/blocks/faq-02.tsx"],
    registryDependencies: ["accordion"],
    dependencies: ["@radix-ui/react-accordion"],
  },
  {
    name: "login-01",
    title: "Login · centered card",
    description:
      "Centered login card with monogram, email + password (using the password-input component), remember-me, divider and GitHub / Google providers.",
    blockTagline: "Centered card · providers · password-input",
    category: "blocks",
    blockKind: "login",
    status: "stable",
    Demo: Login01,
    sourceFiles: ["registry/msh-ui/blocks/login-01/login-01.tsx"],
    installTargets: ["components/blocks/login-01.tsx"],
    registryDependencies: ["button", "input", "label", "password-input"],
    dependencies: ["lucide-react"],
  },
  {
    name: "login-02",
    title: "Login · split testimonial",
    description:
      "Two-pane login: form on the left, dark testimonial panel with quote and metrics on the right. Uses the strength-meter variant of password-input.",
    blockTagline: "Split · testimonial pane · strength meter",
    category: "blocks",
    blockKind: "login",
    status: "stable",
    Demo: Login02,
    sourceFiles: ["registry/msh-ui/blocks/login-02/login-02.tsx"],
    installTargets: ["components/blocks/login-02.tsx"],
    registryDependencies: ["button", "input", "label", "password-input"],
    dependencies: ["lucide-react"],
  },
  {
    name: "header-01",
    title: "Header · sticky nav",
    description:
      "Sticky top nav with brand monogram, centered anchor links, dual auth CTAs and a slide-down mobile menu.",
    blockTagline: "Sticky · backdrop blur · mobile menu",
    category: "blocks",
    blockKind: "header",
    status: "stable",
    Demo: Header01,
    sourceFiles: ["registry/msh-ui/blocks/header-01/header-01.tsx"],
    installTargets: ["components/blocks/header-01.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "footer-01",
    title: "Footer · four columns",
    description:
      "Brand + tagline column alongside Product / Company / Resources link columns, with a copyright row and social icons below a thin rule.",
    blockTagline: "4 columns · social row · copyright",
    category: "blocks",
    blockKind: "footer",
    status: "stable",
    Demo: Footer01,
    sourceFiles: ["registry/msh-ui/blocks/footer-01/footer-01.tsx"],
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
    sourceFiles: ["registry/msh-ui/blocks/not-found-01/not-found-01.tsx"],
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
    sourceFiles: ["registry/msh-ui/ui/month-picker.tsx"],
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
    sourceFiles: ["registry/msh-ui/ui/time-picker.tsx"],
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
    sourceFiles: ["registry/msh-ui/ui/color-picker.tsx"],
    registryDependencies: ["popover", "input"],
    dependencies: ["lucide-react"],
  },
  {
    name: "avatar-stack",
    title: "Avatar Stack",
    description:
      "Overlapping avatar group with size and spacing variants, plus a numeric overflow chip for hidden members.",
    category: "data",
    status: "stable",
    Demo: AvatarStackDemo,
    sourceFiles: ["registry/msh-ui/ui/avatar-stack.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "announcement-bar",
    title: "Announcement Bar",
    description:
      "Top-of-page banner with default / primary / muted tones, optional dismiss button and localStorage persistence.",
    category: "display",
    status: "stable",
    Demo: AnnouncementBarDemo,
    sourceFiles: ["registry/msh-ui/ui/announcement-bar.tsx"],
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
    sourceFiles: ["registry/msh-ui/ui/empty-state.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "logo-cloud-01",
    title: "Logo Cloud · bordered grid",
    description:
      "Centered eyebrow + headline above a 5-column bordered wordmark grid, with stat strip and case-study link below.",
    blockTagline: "Bordered grid · 10 wordmarks · stat strip",
    category: "blocks",
    blockKind: "logo-cloud",
    status: "stable",
    Demo: LogoCloud01,
    sourceFiles: ["registry/msh-ui/blocks/logo-cloud-01/logo-cloud-01.tsx"],
    installTargets: ["components/blocks/logo-cloud-01.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "contact-01",
    title: "Contact · split form",
    description:
      "Two-column contact: name / email / company / message form on the left, channel list + remote-location card on the right.",
    blockTagline: "Split form · 4 fields · channel list",
    category: "blocks",
    blockKind: "contact",
    status: "stable",
    Demo: Contact01,
    sourceFiles: ["registry/msh-ui/blocks/contact-01/contact-01.tsx"],
    installTargets: ["components/blocks/contact-01.tsx"],
    registryDependencies: ["button", "input", "label", "textarea"],
    dependencies: ["lucide-react"],
  },
  {
    name: "blog-01",
    title: "Blog · featured + grid",
    description:
      "Editorial blog index with a featured post on top and a 4-column grid of bordered post cards underneath.",
    blockTagline: "Featured post · 4-up grid · editorial",
    category: "blocks",
    blockKind: "blog",
    status: "stable",
    Demo: Blog01,
    sourceFiles: ["registry/msh-ui/blocks/blog-01/blog-01.tsx"],
    installTargets: ["components/blocks/blog-01.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "dashboard-01",
    title: "Dashboard · metrics + chart",
    description:
      "Operations dashboard with a 4-up metric strip, weekly bar chart and a recent-activity feed in a side card.",
    blockTagline: "4 metrics · bar chart · activity feed",
    category: "blocks",
    blockKind: "dashboard",
    status: "stable",
    Demo: Dashboard01,
    sourceFiles: ["registry/msh-ui/blocks/dashboard-01/dashboard-01.tsx"],
    installTargets: ["components/blocks/dashboard-01.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "integrations-01",
    title: "Integrations · hub & spoke",
    description:
      "Two-column integrations section with copy and feature list on the left, animated orbit diagram (central hub + 7 logo spokes) on the right.",
    blockTagline: "Hub & spoke · 7 spokes · orbit ring",
    category: "blocks",
    blockKind: "integrations",
    status: "stable",
    Demo: Integrations01,
    sourceFiles: [
      "registry/msh-ui/blocks/integrations-01/integrations-01.tsx",
    ],
    installTargets: ["components/blocks/integrations-01.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "image-gallery-01",
    title: "Image Gallery · masonry + filter",
    description:
      "Studio-style masonry gallery with chip filters, gradient placeholder tiles, varied aspect ratios and a hover arrow.",
    blockTagline: "Masonry · chip filter · gradient tiles",
    category: "blocks",
    blockKind: "image-gallery",
    status: "stable",
    Demo: ImageGallery01,
    sourceFiles: [
      "registry/msh-ui/blocks/image-gallery-01/image-gallery-01.tsx",
    ],
    installTargets: ["components/blocks/image-gallery-01.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "app-shell-01",
    title: "App Shell · sidebar + topbar",
    description:
      "Framed app-shell preview with browser chrome, sidebar nav, breadcrumb topbar, 4-up metric strip and an accounts table.",
    blockTagline: "Sidebar · topbar · table · chrome frame",
    category: "blocks",
    blockKind: "app-shell",
    status: "stable",
    Demo: AppShell01,
    sourceFiles: ["registry/msh-ui/blocks/app-shell-01/app-shell-01.tsx"],
    installTargets: ["components/blocks/app-shell-01.tsx"],
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
  blocks: "Blocks",
}

export const REGISTRY_BY_CATEGORY = (() => {
  const groups: Record<ComponentCategory, RegistryEntryMeta[]> = {
    inputs: [],
    pickers: [],
    files: [],
    data: [],
    display: [],
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
