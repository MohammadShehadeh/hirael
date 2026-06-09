import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { RegistryDemo } from "@/registry/hirael/registry-demos"
import { REGISTRY, REGISTRY_BY_NAME } from "@/registry/hirael/registry-meta"

export const dynamicParams = false

export function generateStaticParams() {
  return REGISTRY.filter((entry) => entry.category === "blocks").map(
    (entry) => ({ block: entry.name })
  )
}

export const metadata: Metadata = { robots: { index: false } }

export default async function BlockEmbedRoute({
  params,
}: {
  params: Promise<{ block: string }>
}) {
  const { block } = await params
  const entry = REGISTRY_BY_NAME[block]
  if (!entry || entry.category !== "blocks" || entry.status !== "stable")
    notFound()
  return (
    <div className="min-h-svh bg-background">
      <RegistryDemo name={entry.name} />
    </div>
  )
}
