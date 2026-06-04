import * as React from "react"

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
