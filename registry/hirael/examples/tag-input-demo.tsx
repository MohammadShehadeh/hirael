"use client";

import * as React from "react";

import { Label } from "@/registry/hirael/ui/label";
import {
  TagInput,
  TagInputContainer,
  TagInputError,
  TagInputField,
  TagInputTag,
} from "@/registry/hirael/ui/tag-input";

export default function TagInputDemo() {
  const [tags, setTags] = React.useState<string[]>(["typescript", "react"]);

  return (
    <div className="grid w-full max-w-md gap-2">
      <Label>Tags · max 6</Label>
      <TagInput value={tags} onValueChange={setTags} maxTags={6}>
        <TagInputContainer>
          {tags.map((_, i) => (
            <TagInputTag key={i} index={i} />
          ))}
          <TagInputField placeholder="Enter, comma, or paste to split" />
        </TagInputContainer>
        <TagInputError className="mt-1" />
      </TagInput>
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
        {tags.length} / 6 · paste &ldquo;a, b, c&rdquo; to split
      </p>
    </div>
  );
}
