import * as fs from "node:fs/promises"
import * as path from "node:path"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { ComponentPage } from "@/components/showcase/component-page"
import { REGISTRY, REGISTRY_BY_NAME } from "@/registry/sabk/registry-meta"

export const dynamicParams = false

export function generateStaticParams() {
  return REGISTRY.map((entry) => ({ component: entry.name }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ component: string }>
}): Promise<Metadata> {
  const { component } = await params
  const entry = REGISTRY_BY_NAME[component]
  if (!entry) return {}
  return {
    title: `${entry.title} — Sabk`,
    description: entry.description,
  }
}

async function loadSource(files: string[] | undefined) {
  const out: Record<string, string> = {}
  if (!files) return out
  await Promise.all(
    files.map(async (f) => {
      try {
        out[f] = await fs.readFile(path.join(process.cwd(), f), "utf8")
      } catch {
        out[f] = "// (unable to read source)"
      }
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
  if (!entry) notFound()
  const source = await loadSource(entry.sourceFiles)
  return <ComponentPage entry={entry} source={source} />
}
