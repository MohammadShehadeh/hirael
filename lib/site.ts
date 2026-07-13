/**
 * Site-wide brand constants. One source of truth for name, URLs, social links.
 */

import type { Metadata } from "next";

import type { RegistryEntryMeta } from "@/registry/hirael/registry-meta";
import { entryHref } from "@/registry/hirael/registry-meta";

export const SITE = {
  name: "Hirael",
  fullName: "Hirael",
  description: "The components shadcn/ui doesn't ship.",
  longDescription:
    "A shadcn-compatible registry of the inputs and section blocks most products end up needing. The CLI copies the source into your repo, so there's no package to depend on.",
  url: "https://hirael.com",
  version: "0.1",
  author: "Mohammad Shehadeh",
  authorUrl: "https://mohammadshehadeh.com",
  githubHandle: "mohammadshehadeh",
  githubUrl: "https://github.com/mohammadshehadeh/",
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
} as const;

export const NAV_LINKS: { href: string; label: string; external?: boolean }[] =
  [
    { href: "/components", label: "Components" },
    { href: "/blocks", label: "Blocks" },
    { href: "/templates", label: "Templates" },
    { href: "/theme", label: "Theme" },
  ];

/**
 * Shared `generateMetadata` body for the component/block/template detail
 * routes — same title, OpenGraph article, and Twitter card shape, differing
 * only in the title suffix. Reproduces each route's pre-existing title
 * format exactly (bare title dash-joined with the site name for components;
 * "<suffix> | Hirael" for blocks/templates) so this extraction changes no
 * rendered output.
 */
export function detailMetadata(
  entry: RegistryEntryMeta,
  opts: { titleSuffix?: string } = {},
): Metadata {
  const { titleSuffix } = opts;
  const href = entryHref(entry);
  const url = `${SITE.url}${href}`;
  const pageTitle = titleSuffix ? `${entry.title} ${titleSuffix}` : entry.title;
  const ogTitle = titleSuffix
    ? `${pageTitle} | ${SITE.name}`
    : `${pageTitle} - ${SITE.name}`;
  return {
    title: pageTitle,
    description: entry.description,
    alternates: {
      canonical: href,
    },
    openGraph: {
      type: "article",
      url,
      siteName: SITE.name,
      title: ogTitle,
      description: entry.description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: entry.description,
      images: ["/opengraph-image"],
    },
  };
}
