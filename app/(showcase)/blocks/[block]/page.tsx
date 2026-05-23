import * as fs from "node:fs/promises"
import * as path from "node:path"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { ComponentPage } from "@/components/showcase/component-page"
import type { SourceFile } from "@/components/showcase/component-page"
import { highlightCode, langFromPath } from "@/lib/highlight"
import { REGISTRY, REGISTRY_BY_NAME } from "@/registry/msh-ui/registry-meta"

export const dynamicParams = false

export function generateStaticParams() {
  return REGISTRY.filter((entry) => entry.category === "blocks").map(
    (entry) => ({ block: entry.name })
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ block: string }>
}): Promise<Metadata> {
  const { block } = await params
  const entry = REGISTRY_BY_NAME[block]
  if (!entry || entry.category !== "blocks") return {}
  return {
    title: `${entry.title} block`,
    description: entry.description,
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
  const entry = REGISTRY_BY_NAME[block]
  if (!entry || entry.category !== "blocks") notFound()
  const source = await loadSource(entry.sourceFiles)
  return <ComponentPage entry={entry} source={source} />
}
