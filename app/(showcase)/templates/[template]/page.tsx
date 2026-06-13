import * as fs from "node:fs/promises"
import * as path from "node:path"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { ComponentPage } from "@/components/showcase/component-page"
import type { SourceFile } from "@/components/showcase/component-page"
import { highlightCode, langFromPath } from "@/lib/highlight"
import { SITE } from "@/lib/site"
import { REGISTRY, REGISTRY_BY_NAME } from "@/registry/hirael/registry-meta"

export const dynamicParams = false

export function generateStaticParams() {
  return REGISTRY.filter((entry) => entry.category === "templates").map(
    (entry) => ({ template: entry.name })
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ template: string }>
}): Promise<Metadata> {
  const { template } = await params
  const entry = REGISTRY_BY_NAME[template]
  if (!entry || entry.category !== "templates") return {}
  const url = `${SITE.url}/templates/${entry.name}`
  const title = `${entry.title} template | ${SITE.name}`
  return {
    title: `${entry.title} template`,
    description: entry.description,
    alternates: {
      canonical: `/templates/${entry.name}`,
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

export default async function TemplateRoute({
  params,
}: {
  params: Promise<{ template: string }>
}) {
  const { template } = await params
  const entry = REGISTRY_BY_NAME[template]
  if (!entry || entry.category !== "templates") notFound()
  const source = await loadSource(entry.sourceFiles)
  return (
    <ComponentPage
      entry={entry}
      source={source}
      breadcrumb={[
        { label: "Templates", href: "/templates" },
        { label: entry.title },
      ]}
    />
  )
}
