import * as React from "react"

import ComboboxDemo from "@/registry/sabk/combobox/combobox.demo"
import MultiSelectDemo from "@/registry/sabk/multi-select/multi-select.demo"
import NumberRangeDemo from "@/registry/sabk/number-range/number-range.demo"
import PasswordInputDemo from "@/registry/sabk/password-input/password-input.demo"
import TagInputDemo from "@/registry/sabk/tag-input/tag-input.demo"
import YearPickerDemo from "@/registry/sabk/year-picker/year-picker.demo"

import Cta01 from "@/registry/sabk/blocks/cta-01/cta-01"
import Cta02 from "@/registry/sabk/blocks/cta-02/cta-02"
import Faq01 from "@/registry/sabk/blocks/faq-01/faq-01"
import Faq02 from "@/registry/sabk/blocks/faq-02/faq-02"
import Hero01 from "@/registry/sabk/blocks/hero-01/hero-01"
import Hero02 from "@/registry/sabk/blocks/hero-02/hero-02"
import Login01 from "@/registry/sabk/blocks/login-01/login-01"
import Login02 from "@/registry/sabk/blocks/login-02/login-02"

export type ComponentCategory = "inputs" | "pickers" | "files" | "blocks"

export type BlockKind = "hero" | "cta" | "faq" | "login"

export type RegistryEntryMeta = {
  name: string
  title: string
  description: string
  category: ComponentCategory
  status: "stable" | "planned"
  /** Demo component, when status === "stable". */
  Demo?: React.ComponentType
  /** Repo-relative paths of source files to surface in the Code tab. */
  sourceFiles?: string[]
  /** Public install URL slug (defaults to `${name}`). */
  installSlug?: string
  registryDependencies?: string[]
  dependencies?: string[]
  /** Block-only: the kind of section this block is, used for /blocks grouping. */
  blockKind?: BlockKind
  /** Block-only: short tagline shown on the /blocks index cards. */
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
    sourceFiles: ["registry/sabk/multi-select/multi-select.tsx"],
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
    sourceFiles: ["registry/sabk/number-range/number-range.tsx"],
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
    sourceFiles: ["registry/sabk/year-picker/year-picker.tsx"],
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
    sourceFiles: ["registry/sabk/tag-input/tag-input.tsx"],
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
    sourceFiles: ["registry/sabk/combobox/combobox.tsx"],
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
    sourceFiles: ["registry/sabk/password-input/password-input.tsx"],
    registryDependencies: ["input"],
    dependencies: ["lucide-react"],
  },
  // ===== Blocks =====
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
    sourceFiles: ["registry/sabk/blocks/hero-01/hero-01.tsx"],
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
    sourceFiles: ["registry/sabk/blocks/hero-02/hero-02.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
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
    sourceFiles: ["registry/sabk/blocks/cta-01/cta-01.tsx"],
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
    sourceFiles: ["registry/sabk/blocks/cta-02/cta-02.tsx"],
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
    sourceFiles: ["registry/sabk/blocks/faq-01/faq-01.tsx"],
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
    sourceFiles: ["registry/sabk/blocks/faq-02/faq-02.tsx"],
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
    sourceFiles: ["registry/sabk/blocks/login-01/login-01.tsx"],
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
    sourceFiles: ["registry/sabk/blocks/login-02/login-02.tsx"],
    registryDependencies: ["button", "input", "label", "password-input"],
    dependencies: ["lucide-react"],
  },
  // ===== Phase 1 stubs — declared in registry.json, implementation pending =====
  {
    name: "month-picker",
    title: "Month Picker",
    description: "12-cell month grid with year stepper, single or range.",
    category: "pickers",
    status: "planned",
  },
  {
    name: "time-picker",
    title: "Time Picker",
    description: "Hour / minute / second wheels, 12 or 24h, step intervals.",
    category: "pickers",
    status: "planned",
  },
  {
    name: "phone-input",
    title: "Phone Input",
    description: "Country dial-code dropdown, E.164 formatting.",
    category: "inputs",
    status: "planned",
  },
  {
    name: "currency-input",
    title: "Currency Input",
    description: "Locale-aware grouping, currency-symbol prefix.",
    category: "inputs",
    status: "planned",
  },
  {
    name: "file-dropzone",
    title: "File Dropzone",
    description: "Drag-drop + click, previews, progress, accept / maxSize.",
    category: "files",
    status: "planned",
  },
  {
    name: "color-picker",
    title: "Color Picker",
    description: "HSL / HEX / RGB tabs, eyedropper, recent swatches.",
    category: "pickers",
    status: "planned",
  },
]

export const REGISTRY_BY_NAME = Object.fromEntries(
  REGISTRY.map((r) => [r.name, r])
) as Record<string, RegistryEntryMeta>

export const CATEGORY_LABELS: Record<ComponentCategory, string> = {
  inputs: "Inputs",
  pickers: "Pickers",
  files: "Files",
  blocks: "Blocks",
}

export const REGISTRY_BY_CATEGORY = (() => {
  const groups: Record<ComponentCategory, RegistryEntryMeta[]> = {
    inputs: [],
    pickers: [],
    files: [],
    blocks: [],
  }
  for (const entry of REGISTRY) groups[entry.category].push(entry)
  return groups
})()

export const BLOCK_KIND_LABELS: Record<BlockKind, string> = {
  hero: "Hero sections",
  cta: "Call-to-action",
  faq: "FAQ",
  login: "Auth · login",
}

export const BLOCKS_BY_KIND = (() => {
  const groups: Record<BlockKind, RegistryEntryMeta[]> = {
    hero: [],
    cta: [],
    faq: [],
    login: [],
  }
  for (const entry of REGISTRY) {
    if (entry.category === "blocks" && entry.blockKind) {
      groups[entry.blockKind].push(entry)
    }
  }
  return groups
})()

export const BLOCK_KIND_ORDER: BlockKind[] = ["hero", "cta", "faq", "login"]
