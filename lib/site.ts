/**
 * Site-wide brand constants. One source of truth for name, URLs, social links.
 */

export const SITE = {
  name: "MSH UI",
  fullName: "MSH UI — shadcn's missing pieces",
  description: "shadcn's missing pieces",
  longDescription:
    "A peer registry for the components every real product needs but shadcn doesn't ship — multi-select, combobox, tag input, currency input, file dropzone, and more.",
  url: "https://msh-ui.dev",
  version: "0.1",
  author: "Mohammad Shehadeh",
  authorUrl: "https://mohammadshehadeh.com",
  twitterHandle: "@mohammadshhadeh",
  twitterUrl: "https://x.com/mohammadshhadeh",
  githubUrl: "https://github.com/mohammadshehadeh/forgecn",
  keywords: [
    "shadcn",
    "shadcn ui",
    "shadcn registry",
    "react components",
    "ui library",
    "tailwind css",
    "multi-select",
    "combobox",
    "tag input",
    "currency input",
    "file dropzone",
    "next.js components",
    "msh ui",
    "msh-ui",
    "react 19",
  ],
  registry: {
    name: "msh-ui",
    /** Public origin used when generating install URLs server-side. */
    origin: "https://msh-ui.dev",
  },
} as const

export const NAV_LINKS: { href: string; label: string; external?: boolean }[] =
  [
    { href: "/components", label: "Components" },
    { href: "/blocks", label: "Blocks" },
    { href: "/theme", label: "Theme" },
  ]
