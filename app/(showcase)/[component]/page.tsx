import * as fs from "node:fs/promises"
import * as path from "node:path"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { ComponentPage } from "@/components/showcase/component-page"
import type { SourceFile } from "@/components/showcase/component-page"
import { highlightCode, langFromPath } from "@/lib/highlight"
import { REGISTRY, REGISTRY_BY_NAME } from "@/registry/sabk/registry-meta"

export const dynamicParams = false

export function generateStaticParams() {
  return REGISTRY.filter((entry) => entry.category !== "blocks").map(
    (entry) => ({ component: entry.name })
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ component: string }>
}): Promise<Metadata> {
  const { component } = await params
  const entry = REGISTRY_BY_NAME[component]
  if (!entry || entry.category === "blocks") return {}
  return {
    title: entry.title,
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
      let code: string
      try {
        code = await fs.readFile(path.join(process.cwd(), f), "utf8")
      } catch {
        code = "// (unable to read source)"
      }
      const lang = langFromPath(f)
      const html = await highlightCode(code, lang)
      out[f] = { code, html, lang }
    })
  )
  return out
}

export default async function ComponentRoute({
  params,
}: {
  params: Promise<{ component: string }>
}) {
  const { component } = await params
  const entry = REGISTRY_BY_NAME[component]
  if (!entry || entry.category === "blocks") notFound()
  const source = await loadSource(entry.sourceFiles)
  return <ComponentPage entry={entry} source={source} />
}
