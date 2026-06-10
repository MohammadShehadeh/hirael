/**
 * Site-wide brand constants. One source of truth for name, URLs, social links.
 */

export const SITE = {
  name: "Hirael",
  fullName: "Hirael",
  description: "Tools for builders who think in systems.",
  longDescription:
    "A component registry for the pieces every real product needs. Minimal. Thoughtful. Built to last.",
  url: "https://hirael.com",
  version: "0.1",
  author: "Mohammad Shehadeh",
  authorUrl: "https://mohammadshehadeh.com",
  twitterHandle: "@mohammadshhadeh",
  twitterUrl: "https://x.com/mohammadshhadeh",
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
    "hirael",
    "react 19",
  ],
  registry: {
    name: "hirael",
    /** Public origin used when generating install URLs server-side. */
    origin: "https://hirael.com",
  },
} as const

export const NAV_LINKS: { href: string; label: string; external?: boolean }[] =
  [
    { href: "/components", label: "Components" },
    { href: "/blocks", label: "Blocks" },
    { href: "/theme", label: "Theme" },
  ]
