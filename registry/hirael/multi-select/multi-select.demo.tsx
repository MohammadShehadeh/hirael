"use client";

import * as React from "react";

import { Label } from "@/registry/hirael/ui/label";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectTrigger,
} from "@/registry/hirael/ui/multi-select";

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
];

export default function MultiSelectDemo() {
  const [basic, setBasic] = React.useState<string[]>(["next", "astro"]);
  const [composed, setComposed] = React.useState<string[]>([]);

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-2">
        <Label htmlFor="ms-basic">Basic</Label>
        <MultiSelect
          options={FRAMEWORKS}
          value={basic}
          onValueChange={setBasic}
          maxCount={5}
        >
          <MultiSelectTrigger placeholder="Pick frameworks" />
          <MultiSelectContent />
        </MultiSelect>
        <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
          {basic.length} of {FRAMEWORKS.length} selected
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="ms-composed">Composed</Label>
        <MultiSelect
          options={FRAMEWORKS}
          value={composed}
          onValueChange={setComposed}
        >
          <MultiSelectTrigger placeholder="Compose your own" />
          <MultiSelectContent
            searchPlaceholder="Filter frameworks…"
            emptyMessage="No matches."
          />
        </MultiSelect>
        <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
          value = [{composed.map((v) => `"${v}"`).join(", ")}]
        </p>
      </div>
    </div>
  );
}
