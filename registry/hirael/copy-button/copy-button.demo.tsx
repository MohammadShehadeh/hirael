"use client"

import { CopyButton } from "@/registry/hirael/ui/copy-button"

export default function CopyButtonDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Icon only · ghost &amp; outline
        </p>
        <div className="flex items-center gap-3">
          <CopyButton value="npm install hirael" />
          <CopyButton value="npm install hirael" variant="outline" />
          <CopyButton value="npm install hirael" size="sm" variant="outline" />
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          With label
        </p>
        <CopyButton value="hirael@latest" variant="outline" className="w-fit">
          Copy version
        </CopyButton>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          In a code snippet
        </p>
        <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-card px-3 py-2">
          <code className="truncate font-mono text-xs text-foreground">
            npx shadcn@latest add https://hirael.com/r/copy-button.json
          </code>
          <CopyButton value="npx shadcn@latest add https://hirael.com/r/copy-button.json" />
        </div>
      </div>
    </div>
  )
}
