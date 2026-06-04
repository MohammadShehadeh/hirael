import { BLOCK_REGISTRY } from "@/registry/new-york/registry-blocks"
import type {
  BlockKind,
  ComponentCategory,
  RegistryEntryMeta,
} from "@/registry/new-york/registry-types"
import { UI_REGISTRY } from "@/registry/new-york/registry-ui"

export type {
  BlockKind,
  ComponentCategory,
  RegistryEntryMeta,
} from "@/registry/new-york/registry-types"

/** Every registry item: UI components first, then marketing blocks. */
export const REGISTRY: RegistryEntryMeta[] = [...UI_REGISTRY, ...BLOCK_REGISTRY]

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
