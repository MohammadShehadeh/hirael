"use client"

import * as React from "react"

import { Label } from "@/registry/sabk/ui/label"
import {
  Combobox,
  useAsyncComboboxOptions,
} from "@/registry/sabk/combobox/combobox"

const FRAMEWORKS = [
  { value: "next", label: "Next.js", group: "React" },
  { value: "remix", label: "Remix", group: "React" },
  { value: "astro", label: "Astro", group: "Hybrid" },
  { value: "nuxt", label: "Nuxt", group: "Vue" },
  { value: "sveltekit", label: "SvelteKit", group: "Svelte" },
  { value: "solid-start", label: "SolidStart", group: "Solid" },
  { value: "tanstack-start", label: "TanStack Start", group: "React" },
]

/** Simulates an async API: filters the static list with a small delay. */
type Pkg = { name: string; description: string }
async function fakeSearchPackages(q: string): Promise<Pkg[]> {
  await new Promise((r) => setTimeout(r, 250))
  const all: Pkg[] = [
    { name: "react", description: "A JS library for UIs" },
    { name: "react-dom", description: "Renderer for the DOM" },
    { name: "react-router", description: "Declarative routing" },
    { name: "zod", description: "TypeScript-first schemas" },
    { name: "next", description: "The React framework" },
    { name: "tailwindcss", description: "Utility-first CSS" },
    { name: "shadcn", description: "Build your own component library" },
    { name: "lucide-react", description: "Icon set" },
  ]
  if (!q) return all.slice(0, 5)
  return all.filter((p) =>
    `${p.name} ${p.description}`.toLowerCase().includes(q.toLowerCase())
  )
}

export default function ComboboxDemo() {
  const [staticValue, setStaticValue] = React.useState<string | undefined>(
    "next"
  )
  const [asyncValue, setAsyncValue] = React.useState<string | undefined>()

  const mapPkg = React.useCallback(
    (p: Pkg) => ({ value: p.name, label: p.name, group: "npm" }),
    []
  )
  const { setQuery, options, loading } = useAsyncComboboxOptions(
    fakeSearchPackages,
    mapPkg
  )

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-2">
        <Label>Single-prop API · static options</Label>
        <Combobox
          options={FRAMEWORKS}
          value={staticValue}
          onChange={setStaticValue}
          placeholder="Pick a framework"
        />
      </div>

      <div className="grid gap-2">
        <Label>Compound API · async loader (250ms simulated)</Label>
        <Combobox.Root
          value={asyncValue}
          onValueChange={setAsyncValue}
          options={options}
          loading={loading}
          onSearchChange={setQuery}
          externalFilter
        >
          <Combobox.Trigger placeholder="Search npm packages…" />
          <Combobox.Content
            searchPlaceholder="Type to query…"
            emptyMessage="No packages match."
          />
        </Combobox.Root>
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
          value = {asyncValue ? `"${asyncValue}"` : "—"}
        </p>
      </div>
    </div>
  )
}
