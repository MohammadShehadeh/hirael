import * as fs from "node:fs/promises"
import * as path from "node:path"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { CategoryPage } from "@/components/showcase/category-page"
import {
  CATEGORY_BY_SLUG,
  CATEGORY_REGISTRY,
} from "@/components/showcase/block-categories"
import { ComponentPage } from "@/components/showcase/component-page"
import type { SourceFile } from "@/components/showcase/component-page"
import { highlightCode, langFromPath } from "@/lib/highlight"
import { SITE } from "@/lib/site"
import { REGISTRY, REGISTRY_BY_NAME } from "@/registry/hirael/registry-meta"

export const dynamicParams = false

export function generateStaticParams() {
  const blockParams = REGISTRY.filter(
    (entry) => entry.category === "blocks"
  ).map((entry) => ({ block: entry.name }))
  const categoryParams = CATEGORY_REGISTRY.map((c) => ({ block: c.slug }))
  return [...categoryParams, ...blockParams]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ block: string }>
}): Promise<Metadata> {
  const { block } = await params
  const category = CATEGORY_BY_SLUG[block]
  if (category) {
    const title = `${category.title} blocks | ${SITE.name}`
    const url = `${SITE.url}/blocks/${category.slug}`
    return {
      title: `${category.title} blocks`,
      description: category.description,
      alternates: {
        canonical: `/blocks/${category.slug}`,
      },
      openGraph: {
        type: "website",
        url,
        siteName: SITE.name,
        title,
        description: category.description,
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
        description: category.description,
        images: ["/opengraph-image"],
      },
    }
  }
  const entry = REGISTRY_BY_NAME[block]
  if (!entry || entry.category !== "blocks") return {}
  const url = `${SITE.url}/blocks/${entry.name}`
  const title = `${entry.title} block | ${SITE.name}`
  return {
    title: `${entry.title} block`,
    description: entry.description,
    alternates: {
      canonical: `/blocks/${entry.name}`,
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
  params: Promise<{ block: string }>
}) {
  const { block } = await params

  const category = CATEGORY_BY_SLUG[block]
  if (category) {
    return <CategoryPage category={category} />
  }

  const entry = REGISTRY_BY_NAME[block]
  if (!entry || entry.category !== "blocks") notFound()
  const source = await loadSource(entry.sourceFiles)
  return <ComponentPage entry={entry} source={source} />
}
