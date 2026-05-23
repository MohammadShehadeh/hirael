"use client"

import * as React from "react"

import { Label } from "@/registry/msh-ui/ui/label"
import {
  TagInput,
  TagInputContainer,
  TagInputError,
  TagInputField,
  TagInputTag,
} from "@/registry/msh-ui/tag-input/tag-input"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function TagInputDemo() {
  const [basic, setBasic] = React.useState<string[]>(["typescript", "react"])
  const [emails, setEmails] = React.useState<string[]>(["jane@msh-ui.dev"])

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-2">
        <Label>Tags · max 6</Label>
        <TagInput value={basic} onValueChange={setBasic} maxTags={6}>
          <TagInputContainer>
            {basic.map((_, i) => (
              <TagInputTag key={i} index={i} />
            ))}
            <TagInputField placeholder="Enter, comma, or paste to split" />
          </TagInputContainer>
          <TagInputError className="mt-1" />
        </TagInput>
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
          {basic.length} / 6 · paste &ldquo;a, b, c&rdquo; to split
        </p>
      </div>

      <div className="grid gap-2">
        <Label>Email tags · validated</Label>
        <TagInput
          value={emails}
          onValueChange={setEmails}
          validate={(tag) =>
            EMAIL_RE.test(tag) ? true : `Not a valid email: ${tag}`
          }
          maxTags={5}
        >
          <TagInputContainer>
            {emails.map((_, i) => (
              <TagInputTag key={i} index={i} />
            ))}
            <TagInputField placeholder="you@example.com" />
          </TagInputContainer>
          <TagInputError className="mt-1" />
        </TagInput>
      </div>
    </div>
  )
}
