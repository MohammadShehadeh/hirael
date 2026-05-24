import * as fs from "node:fs/promises"
import * as path from "node:path"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { ComponentPage } from "@/components/showcase/component-page"
import type { SourceFile } from "@/components/showcase/component-page"
import { highlightCode, langFromPath } from "@/lib/highlight"
import { REGISTRY, REGISTRY_BY_NAME } from "@/registry/hirael/registry-meta"

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
      const abs = path.join(process.cwd(), f)
      let code: string
      try {
        code = await fs.readFile(abs, "utf8")
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        // Surface the real reason — silently rendering the stub made it
        // very hard to tell whether the path was wrong, the file was
        // missing, or the deploy bundle didn't include it.
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

/**
 * Convention: each component ships its install source at
 * `registry/hirael/ui/<name>.tsx` (what shadcn distributes) and a
 * sibling demo at `registry/hirael/<name>/<name>.demo.tsx` that powers
 * the Usage tab. Returns null when the demo file isn't present.
 */
async function loadDemoSource(
  entry: { name: string; sourceFiles?: string[] }
): Promise<SourceFile | null> {
  if (!entry.sourceFiles?.length) return null
  const relPath = `registry/hirael/${entry.name}/${entry.name}.demo.tsx`
  const abs = path.join(process.cwd(), relPath)
  let code: string
  try {
    code = await fs.readFile(abs, "utf8")
  } catch {
    return null
  }
  const lang = langFromPath(relPath)
  const html = await highlightCode(code, lang)
  return { code, html, lang }
}

export default async function ComponentRoute({
  params,
}: {
  params: Promise<{ component: string }>
}) {
  const { component } = await params
  const entry = REGISTRY_BY_NAME[component]
  if (!entry || entry.category === "blocks") notFound()
  const [source, demoSource] = await Promise.all([
    loadSource(entry.sourceFiles),
    loadDemoSource(entry),
  ])
  return (
    <ComponentPage entry={entry} source={source} demoSource={demoSource} />
  )
}
