"use client"

import * as React from "react"

import { Label } from "@/registry/hirael/ui/label"
import {
  Combobox,
  ComboboxContent,
  ComboboxTrigger,
  useAsyncComboboxOptions,
} from "@/registry/hirael/ui/combobox"

const FRAMEWORKS = [
  { value: "next", label: "Next.js", group: "React" },
  { value: "remix", label: "Remix", group: "React" },
  { value: "astro", label: "Astro", group: "Hybrid" },
  { value: "nuxt", label: "Nuxt", group: "Vue" },
  { value: "sveltekit", label: "SvelteKit", group: "Svelte" },
  { value: "solid-start", label: "SolidStart", group: "Solid" },
  { value: "tanstack-start", label: "TanStack Start", group: "React" },
]

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
        <Label>Static options</Label>
        <Combobox
          options={FRAMEWORKS}
          value={staticValue}
          onValueChange={setStaticValue}
        >
          <ComboboxTrigger placeholder="Pick a framework" />
          <ComboboxContent />
        </Combobox>
      </div>

      <div className="grid gap-2">
        <Label>Async loader (250ms simulated)</Label>
        <Combobox
          value={asyncValue}
          onValueChange={setAsyncValue}
          options={options}
          loading={loading}
          onSearchChange={setQuery}
          externalFilter
        >
          <ComboboxTrigger placeholder="Search npm packages…" />
          <ComboboxContent
            searchPlaceholder="Type to query…"
            emptyMessage="No packages match."
          />
        </Combobox>
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
          value = {asyncValue ? `"${asyncValue}"` : "—"}
        </p>
      </div>
    </div>
  )
}
