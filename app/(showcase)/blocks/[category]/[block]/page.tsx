import * as fs from "node:fs/promises"
import * as path from "node:path"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { CATEGORY_BY_SLUG } from "@/components/showcase/block-categories"
import { ComponentPage } from "@/components/showcase/component-page"
import type { SourceFile } from "@/components/showcase/component-page"
import { highlightCode, langFromPath } from "@/lib/highlight"
import { SITE } from "@/lib/site"
import {
  REGISTRY,
  REGISTRY_BY_NAME,
  entryCategorySlug,
  entryHref,
} from "@/registry/hirael/registry-meta"

export const dynamicParams = false

export function generateStaticParams() {
  return REGISTRY.filter((entry) => entry.category === "blocks").map(
    (entry) => ({ category: entryCategorySlug(entry), block: entry.name })
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; block: string }>
}): Promise<Metadata> {
  const { category, block } = await params
  const entry = REGISTRY_BY_NAME[block]
  if (!entry || entry.category !== "blocks" || entryCategorySlug(entry) !== category)
    return {}
  const href = entryHref(entry)
  const url = `${SITE.url}${href}`
  const title = `${entry.title} block | ${SITE.name}`
  return {
    title: `${entry.title} block`,
    description: entry.description,
    alternates: {
      canonical: href,
    },
    openGraph: {
      type: "article",
      url,
      siteName: SITE.name,
      title,
      description: entry.description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: entry.description,
      images: ["/opengraph-image"],
    },
  }
}

async function loadSource(
  files: string[] | undefined
): Promise<Record<string, SourceFile>> {
  const out: Record<string, SourceFile> = {}
  if (!files) return out
  await Promise.all(
    files.map(async (f) => {
      const abs = path.join(process.cwd(), f)
      let code: string
      try {
        code = await fs.readFile(abs, "utf8")
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error(`[loadSource] could not read ${abs}: ${msg}`)
        code = `// (unable to read source: ${msg})`
      }
      const lang = langFromPath(f)
      const html = await highlightCode(code, lang)
      out[f] = { code, html, lang }
    })
  )
  return out
}

export default async function BlockRoute({
  params,
}: {
  params: Promise<{ category: string; block: string }>
}) {
  const { category, block } = await params
  const entry = REGISTRY_BY_NAME[block]
  if (!entry || entry.category !== "blocks" || entryCategorySlug(entry) !== category)
    notFound()
  const source = await loadSource(entry.sourceFiles)
  const meta = CATEGORY_BY_SLUG[category]
  return (
    <ComponentPage
      entry={entry}
      source={source}
      breadcrumb={[
        { label: "Blocks", href: "/blocks" },
        { label: meta?.title ?? category, href: `/blocks/${category}` },
        { label: entry.title },
      ]}
    />
  )
}
