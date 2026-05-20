"use client"

import * as React from "react"

import { Label } from "@/registry/sabk/ui/label"
import { MultiSelect } from "@/registry/sabk/multi-select/multi-select"

const FRAMEWORKS = [
  { value: "next", label: "Next.js", group: "React" },
  { value: "remix", label: "Remix", group: "React" },
  { value: "astro", label: "Astro", group: "Hybrid" },
  { value: "nuxt", label: "Nuxt", group: "Vue" },
  { value: "sveltekit", label: "SvelteKit", group: "Svelte" },
  { value: "solid-start", label: "SolidStart", group: "Solid" },
  { value: "qwik", label: "Qwik City", group: "Other" },
  { value: "tanstack-start", label: "TanStack Start", group: "React" },
  { value: "rakkas", label: "Rakkas", group: "React", disabled: true },
]

export default function MultiSelectDemo() {
  const [single, setSingle] = React.useState<string[]>(["next", "astro"])
  const [compound, setCompound] = React.useState<string[]>([])

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-2">
        <Label htmlFor="ms-single">Single-prop API</Label>
        <MultiSelect
          options={FRAMEWORKS}
          value={single}
          onChange={setSingle}
          placeholder="Pick frameworks"
          maxCount={5}
        />
        <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
          {single.length} of {FRAMEWORKS.length} selected
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="ms-compound">Compound API</Label>
        <MultiSelect.Root
          options={FRAMEWORKS}
          value={compound}
          onValueChange={setCompound}
        >
          <MultiSelect.Trigger placeholder="Compose your own" />
          <MultiSelect.Content
            searchPlaceholder="Filter frameworks…"
            emptyMessage="No matches."
          />
        </MultiSelect.Root>
        <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
          value = [{compound.map((v) => `"${v}"`).join(", ")}]
        </p>
      </div>
    </div>
  )
}
