import * as React from "react"

import ComboboxDemo from "@/registry/sabk/combobox/combobox.demo"
import MultiSelectDemo from "@/registry/sabk/multi-select/multi-select.demo"
import NumberRangeDemo from "@/registry/sabk/number-range/number-range.demo"
import PasswordInputDemo from "@/registry/sabk/password-input/password-input.demo"
import TagInputDemo from "@/registry/sabk/tag-input/tag-input.demo"
import YearPickerDemo from "@/registry/sabk/year-picker/year-picker.demo"

export type ComponentCategory = "inputs" | "pickers" | "files"

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
  // Phase 1 stubs — declared in registry.json, implementation pending.
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
}

export const REGISTRY_BY_CATEGORY = (() => {
  const groups: Record<ComponentCategory, RegistryEntryMeta[]> = {
    inputs: [],
    pickers: [],
    files: [],
  }
  for (const entry of REGISTRY) groups[entry.category].push(entry)
  return groups
})()
