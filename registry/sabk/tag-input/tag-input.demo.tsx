"use client"

import * as React from "react"

import { Label } from "@/registry/sabk/ui/label"
import { TagInput } from "@/registry/sabk/tag-input/tag-input"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function TagInputDemo() {
  const [single, setSingle] = React.useState<string[]>(["typescript", "react"])
  const [emails, setEmails] = React.useState<string[]>(["jane@sabk.dev"])

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-2">
        <Label>Single-prop API · max 6 tags</Label>
        <TagInput
          value={single}
          onChange={setSingle}
          maxTags={6}
          placeholder="Enter, comma, or paste to split"
        />
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
          {single.length} / 6 · paste &ldquo;a, b, c&rdquo; to split
        </p>
      </div>

      <div className="grid gap-2">
        <Label>Compound API · validates emails</Label>
        <TagInput.Root
          value={emails}
          onValueChange={setEmails}
          validate={(tag) =>
            EMAIL_RE.test(tag) ? true : `Not a valid email: ${tag}`
          }
          maxTags={5}
        >
          <TagInput.Container>
            {emails.map((_, i) => (
              <TagInput.Tag key={i} index={i} />
            ))}
            <TagInput.Field placeholder="you@example.com" />
          </TagInput.Container>
          <TagInput.Error className="mt-1" />
        </TagInput.Root>
      </div>
    </div>
  )
}
