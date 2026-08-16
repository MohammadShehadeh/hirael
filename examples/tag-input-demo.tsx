"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import { Label } from "@/registry/hirael/ui/label";
import {
  TagInput,
  TagInputContainer,
  TagInputError,
  TagInputField,
  TagInputTag,
} from "@/registry/hirael/components/tag-input";

export default function TagInputDemo() {
  const t = useT();

  const [tags, setTags] = React.useState<string[]>(["typescript", "react"]);

  return (
    <div className="grid w-full max-w-md gap-2">
      <Label>{t({ en: "Tags · max 6", ar: "الوسوم · 6 كحد أقصى" })}</Label>
      <TagInput value={tags} onValueChange={setTags} maxTags={6}>
        <TagInputContainer>
          {tags.map((_, i) => (
            <TagInputTag key={i} index={i} />
          ))}
          <TagInputField
            placeholder={t({
              en: "Enter, comma, or paste to split",
              ar: "اضغط Enter أو فاصلة أو ألصق للتقسيم",
            })}
          />
        </TagInputContainer>
        <TagInputError className="mt-1" />
      </TagInput>
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
        {t({
          en: <>{tags.length} / 6 · paste &ldquo;a, b, c&rdquo; to split</>,
          ar: <>{tags.length} / 6 · ألصق &ldquo;a, b, c&rdquo; للتقسيم</>,
        })}
      </p>
    </div>
  );
}
