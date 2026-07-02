"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import { Label } from "@/registry/hirael/ui/label";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectTrigger,
} from "@/registry/hirael/components/multi-select";

export default function MultiSelectDemo() {
  const t = useT();

  const groups = {
    react: "React",
    vue: "Vue",
    svelte: "Svelte",
    solid: "Solid",
    hybrid: t({ en: "Hybrid", ar: "هجين" }),
    other: t({ en: "Other", ar: "أخرى" }),
  };

  const FRAMEWORKS = [
    { value: "next", label: "Next.js", group: groups.react },
    { value: "remix", label: "Remix", group: groups.react },
    { value: "astro", label: "Astro", group: groups.hybrid },
    { value: "nuxt", label: "Nuxt", group: groups.vue },
    { value: "sveltekit", label: "SvelteKit", group: groups.svelte },
    { value: "solid-start", label: "SolidStart", group: groups.solid },
    { value: "qwik", label: "Qwik City", group: groups.other },
    { value: "tanstack-start", label: "TanStack Start", group: groups.react },
    { value: "rakkas", label: "Rakkas", group: groups.react, disabled: true },
  ];

  const [basic, setBasic] = React.useState<string[]>(["next", "astro"]);
  const [composed, setComposed] = React.useState<string[]>([]);

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-2">
        <Label htmlFor="ms-basic">{t({ en: "Basic", ar: "أساسي" })}</Label>
        <MultiSelect
          options={FRAMEWORKS}
          value={basic}
          onValueChange={setBasic}
          maxCount={5}
        >
          <MultiSelectTrigger
            id="ms-basic"
            placeholder={t({ en: "Pick frameworks", ar: "اختر أطر العمل" })}
          />
          <MultiSelectContent />
        </MultiSelect>
        <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
          {t({
            en: `${basic.length} of ${FRAMEWORKS.length} selected`,
            ar: `${basic.length} من ${FRAMEWORKS.length} محدد`,
          })}
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="ms-composed">
          {t({ en: "Composed", ar: "مركّب" })}
        </Label>
        <MultiSelect
          options={FRAMEWORKS}
          value={composed}
          onValueChange={setComposed}
        >
          <MultiSelectTrigger
            id="ms-composed"
            placeholder={t({ en: "Compose your own", ar: "ركّب اختيارك" })}
          />
          <MultiSelectContent
            searchPlaceholder={t({
              en: "Filter frameworks…",
              ar: "تصفية أطر العمل…",
            })}
            emptyMessage={t({ en: "No matches.", ar: "لا نتائج." })}
          />
        </MultiSelect>
        <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
          value = [{composed.map((v) => `"${v}"`).join(", ")}]
        </p>
      </div>
    </div>
  );
}
