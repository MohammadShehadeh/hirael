/**
 * Site-wide brand constants. One source of truth for name, URLs, social links.
 */

import type { Metadata } from "next";

import type { RegistryEntryMeta } from "@/registry/hirael/registry-meta";
import { entryHref } from "@/registry/hirael/registry-meta";

export const SITE = {
  name: "Hirael",
  description: "The components shadcn/ui doesn't ship.",
  longDescription:
    "A shadcn-compatible registry of React components, section blocks, and full-page templates most products end up building anyway. The shadcn CLI copies the source into your repo, so there's no package to depend on.",
  url: "https://hirael.com",
  version: "0.1",
  author: "Mohammad Shehadeh",
  authorUrl: "https://mohammadshehadeh.com",
  githubUrl: "https://github.com/mohammadshehadeh/",
  githubRepoUrl: "https://github.com/MohammadShehadeh/hirael",
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
    { href: "/changelog", label: "Changelog" },
  ];

/**
 * Shared `generateMetadata` body for the component/block/template detail
 * routes — same shape, differing only in title suffix (matching each route's
 * existing format, so the extraction changes no output).
 *
 * `ownOgImage` drops the site-wide `images` entry so Next's file-convention
 * resolver uses the route's own `opengraph-image.tsx` instead. That URL can't
 * be set by hand: Next appends a content-hash suffix unknown at
 * `generateMetadata` time, so an explicit `images` wouldn't match the file.
 */
export const detailMetadata = (
  entry: RegistryEntryMeta,
  opts: { titleSuffix?: string; ownOgImage?: boolean } = {},
): Metadata => {
  const { titleSuffix, ownOgImage } = opts;
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
      ...(ownOgImage
        ? {}
        : {
            images: [
              {
                url: "/opengraph-image",
                width: 1200,
                height: 630,
                alt: ogTitle,
              },
            ],
          }),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: entry.description,
      ...(ownOgImage ? {} : { images: ["/opengraph-image"] }),
    },
  };
};
